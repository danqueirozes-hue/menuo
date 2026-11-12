import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { MENU_IMPORT_STORE, MenuImportJob } from "@/lib/menu-import";

/** Polled by the import screen until the background function finishes. */
export async function GET(_req: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await params;
  const { getStore } = await import("@netlify/blobs");
  const store = getStore({ name: MENU_IMPORT_STORE, consistency: "strong" });
  const job = (await store.get(`${jobId}/job`, { type: "json" })) as MenuImportJob | null;
  if (!job || job.userId !== userId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // A job stuck in "pending" for 10 minutes means the background run died.
  const stale = job.status === "pending" && Date.now() - Date.parse(job.createdAt) > 10 * 60 * 1000;
  return NextResponse.json({
    status: stale ? "error" : job.status,
    error: stale ? "failed" : job.error,
    result: job.result,
  });
}
