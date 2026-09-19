import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isNetlifyRuntime } from "@/lib/runtime";

/**
 * Uploaded photos (dish photos, logos) need somewhere durable to live.
 * Locally that's the filesystem under public/uploads, served by Next's
 * static file handling. On Netlify the filesystem is ephemeral, so the
 * same call stores the file in Netlify Blobs instead and serves it back
 * through /api/blob/[...key].
 */
export async function saveUpload(
  key: string,
  data: ArrayBuffer,
  contentType: string
): Promise<string> {
  if (isNetlifyRuntime()) {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("uploads");
    await store.set(key, data, { metadata: { contentType } });
    return `/api/blob/${key}`;
  }

  const dir = path.join(process.cwd(), "public", "uploads", path.dirname(key));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(process.cwd(), "public", "uploads", key), Buffer.from(data));
  return `/uploads/${key}`;
}
