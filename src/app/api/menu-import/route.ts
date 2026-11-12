import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { isNetlifyRuntime } from "@/lib/runtime";
import { cronKey } from "@/lib/cron-auth";
import {
  MENU_IMPORT_LIMIT,
  MENU_IMPORT_MAX_BYTES,
  MENU_IMPORT_MAX_FILES,
  MENU_IMPORT_STORE,
  MENU_IMPORT_TYPES,
  MenuImportJob,
} from "@/lib/menu-import";

/** Starts an AI menu import: stores the uploaded PDF/photos in Netlify
 * Blobs and hands the job to netlify/functions/menu-import-background,
 * so this request returns in well under a second. */
export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.ANTHROPIC_API_KEY || !isNetlifyRuntime()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const form = await req.formData();
  const menuId = String(form.get("menuId") ?? "");
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  const [user, menu] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { isAdmin: true, menuImportCount: true } }),
    prisma.menu.findUnique({ where: { id: menuId }, select: { restaurant: { select: { ownerId: true } } } }),
  ]);
  if (!user || !menu || menu.restaurant.ownerId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!user.isAdmin && user.menuImportCount >= MENU_IMPORT_LIMIT) {
    return NextResponse.json({ error: "limit" }, { status: 429 });
  }

  const totalBytes = files.reduce((n, f) => n + f.size, 0);
  const types = files.map((f) => f.type);
  const pdfs = types.filter((t) => t === "application/pdf").length;
  const valid =
    files.length > 0 &&
    files.length <= MENU_IMPORT_MAX_FILES &&
    types.every((t) => (MENU_IMPORT_TYPES as readonly string[]).includes(t)) &&
    (pdfs === 0 || files.length === 1);
  if (!valid) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (totalBytes > MENU_IMPORT_MAX_BYTES) return NextResponse.json({ error: "too_large" }, { status: 413 });

  const { getStore } = await import("@netlify/blobs");
  const store = getStore({ name: MENU_IMPORT_STORE, consistency: "strong" });
  const jobId = randomUUID();
  await Promise.all(
    files.map(async (f, i) =>
      store.set(`${jobId}/file-${i}`, await f.arrayBuffer(), { metadata: { contentType: f.type } })
    )
  );
  const job: MenuImportJob = {
    status: "pending",
    userId,
    menuId,
    fileCount: files.length,
    createdAt: new Date().toISOString(),
  };
  await store.setJSON(`${jobId}/job`, job);
  await prisma.user.update({ where: { id: userId }, data: { menuImportCount: { increment: 1 } } });

  // Background functions answer 202 immediately and keep running.
  const base = process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  const res = await fetch(`${base}/.netlify/functions/menu-import-background`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-cron-secret": cronKey() ?? "" },
    body: JSON.stringify({ jobId }),
  });
  if (!res.ok) {
    await store.setJSON(`${jobId}/job`, { ...job, status: "error", error: "failed" });
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }

  return NextResponse.json({ jobId });
}
