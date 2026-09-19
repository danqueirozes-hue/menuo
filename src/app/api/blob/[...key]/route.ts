import { NextResponse } from "next/server";

// Serves files stored via Netlify Blobs (see src/lib/uploads.ts). Only
// reachable in production — locally, uploads are plain static files under
// /uploads and never hit this route.
export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;

  if (!process.env.NETLIFY) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { getStore } = await import("@netlify/blobs");
  const store = getStore("uploads");
  const result = await store.getWithMetadata(key.join("/"), { type: "arrayBuffer" });

  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contentType = (result.metadata?.contentType as string) || "application/octet-stream";

  return new NextResponse(new Uint8Array(result.data), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
