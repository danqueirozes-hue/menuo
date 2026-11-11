import { createHmac, timingSafeEqual } from "node:crypto";

/** Key shared by the Netlify scheduled functions and the /api/cron routes:
 * CRON_SECRET when set, otherwise derived from AUTH_SECRET (mirrored in
 * netlify/functions/*.mts). Null when neither is configured. */
function cronKey(): string | null {
  if (process.env.CRON_SECRET) return process.env.CRON_SECRET;
  if (!process.env.AUTH_SECRET) return null;
  return createHmac("sha256", process.env.AUTH_SECRET).update("menuo-cron").digest("hex");
}

export function isCronRequest(req: Request): boolean {
  const key = cronKey();
  const given = req.headers.get("x-cron-secret");
  if (!key || !given) return false;
  const a = Buffer.from(key);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}
