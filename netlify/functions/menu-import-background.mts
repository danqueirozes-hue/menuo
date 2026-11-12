import { createHmac, timingSafeEqual } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { getStore } from "@netlify/blobs";
import {
  IMPORTED_MENU_JSON_SCHEMA,
  MENU_IMPORT_STORE,
  MENU_IMPORT_SYSTEM_PROMPT,
  MenuImportJob,
  importedMenuSchema,
} from "../../src/lib/menu-import";

// Netlify Background Function (the "-background" suffix gives it up to
// 15 minutes and an immediate 202 to the caller): reads the uploaded menu
// files from Netlify Blobs, asks Claude for a structured draft, and writes
// the result back onto the job. Started by POST /api/menu-import; the
// dashboard polls GET /api/menu-import/[jobId]. Nothing touches the
// database here — the owner reviews the draft and applies it.

// Same rule as src/lib/cron-auth.ts.
function internalKey(): string {
  if (process.env.CRON_SECRET) return process.env.CRON_SECRET;
  return createHmac("sha256", process.env.AUTH_SECRET ?? "").update("menuo-cron").digest("hex");
}

function authorized(req: Request): boolean {
  const given = Buffer.from(req.headers.get("x-cron-secret") ?? "");
  const key = Buffer.from(internalKey());
  return given.length === key.length && timingSafeEqual(given, key);
}

// Overridable so another model can be compared without a code change.
const MODEL = process.env.MENU_IMPORT_MODEL || "claude-opus-5-5";

export default async (req: Request) => {
  if (req.method !== "POST" || !authorized(req)) return new Response(null, { status: 401 });
  const { jobId } = (await req.json()) as { jobId: string };

  const store = getStore({ name: MENU_IMPORT_STORE, consistency: "strong" });
  const job = (await store.get(`${jobId}/job`, { type: "json" })) as MenuImportJob | null;
  if (!job || job.status !== "pending") return new Response(null, { status: 404 });

  const finish = (patch: Partial<MenuImportJob>) => store.setJSON(`${jobId}/job`, { ...job, ...patch });

  try {
    const content: Anthropic.Beta.BetaContentBlockParam[] = [];
    for (let i = 0; i < job.fileCount; i++) {
      const file = await store.getWithMetadata(`${jobId}/file-${i}`, { type: "arrayBuffer" });
      if (!file) continue;
      const data = Buffer.from(file.data).toString("base64");
      const mediaType = String(file.metadata.contentType);
      content.push(
        mediaType === "application/pdf"
          ? { type: "document", source: { type: "base64", media_type: "application/pdf", data } }
          : {
              type: "image",
              source: { type: "base64", media_type: mediaType as "image/jpeg" | "image/png" | "image/webp", data },
            }
      );
    }
    content.push({ type: "text", text: "Extract this restaurant menu." });

    const client = new Anthropic();
    const isHaiku = MODEL.startsWith("claude-haiku");
    const response = await client.beta.messages
      .stream({
        model: MODEL,
        max_tokens: 32000,
        system: MENU_IMPORT_SYSTEM_PROMPT,
        messages: [{ role: "user", content }],
        output_config: { effort: "medium", format: { type: "json_schema", schema: IMPORTED_MENU_JSON_SCHEMA } },
        // Server-side retry on another model if a safety classifier
        // declines (not available for Haiku).
        ...(isHaiku ? {} : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }),
      })
      .finalMessage();

    if (response.stop_reason === "refusal") {
      await finish({ status: "error", error: "unreadable" });
      return new Response(null, { status: 200 });
    }
    if (response.stop_reason === "max_tokens") {
      await finish({ status: "error", error: "too_long" });
      return new Response(null, { status: 200 });
    }

    const text = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
    const parsed = importedMenuSchema.safeParse(JSON.parse(text));
    if (!parsed.success) throw new Error(`invalid draft: ${parsed.error.message}`);

    console.log(
      `[menu-import] ${jobId}: ${parsed.data.sections.length} sections, model ${response.model}, ` +
        `tokens in ${response.usage.input_tokens} / out ${response.usage.output_tokens}`
    );
    await finish({ status: "done", result: parsed.data });
  } catch (err) {
    console.error(`[menu-import] ${jobId} failed:`, err);
    await finish({ status: "error", error: "failed" });
  } finally {
    // The source files are no longer needed once the draft exists (or failed).
    for (let i = 0; i < job.fileCount; i++) await store.delete(`${jobId}/file-${i}`).catch(() => {});
  }
  return new Response(null, { status: 200 });
};
