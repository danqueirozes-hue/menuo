import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
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

  // A failed read shouldn't use up one of the account's imports: give it
  // back once (the background function can't reach the database).
  if ((job.status === "error" || stale) && !job.refunded) {
    await store.setJSON(`${jobId}/job`, { ...job, status: "error", error: job.error ?? "failed", refunded: true });
    await prisma.user.updateMany({
      where: { id: userId, menuImportCount: { gt: 0 } },
      data: { menuImportCount: { decrement: 1 } },
    });
  }

  return NextResponse.json({
    status: stale ? "error" : job.status,
    error: stale ? "failed" : job.error,
    result: job.result,
  });
}
