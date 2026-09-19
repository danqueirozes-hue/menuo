const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
const SKIP_THRESHOLD_BYTES = 300 * 1024;

/**
 * Phone camera photos routinely come in at 3-6MB / 4000px+ wide. Uploading
 * that straight to the server (and then to Netlify Blobs) is what makes
 * adding a dish photo feel slow — the bytes over the wire, not the backend.
 * Downscaling + re-encoding client-side before the fetch() cuts a typical
 * photo down to a few hundred KB.
 */
export async function resizeImageForUpload(file: File): Promise<File> {
  if (file.size <= SKIP_THRESHOLD_BYTES) return file;

  try {
    const bitmap = await loadBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // fall through to <img>-based decoding below
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}
