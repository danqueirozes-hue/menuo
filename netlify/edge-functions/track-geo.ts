import type { Context } from "@netlify/edge-functions";

// Sits in front of /api/track: this is the only place `context.geo`
// (Netlify's built-in, IP-based geolocation) is available, since Edge
// Functions run on Deno at the CDN edge rather than in the Node.js
// serverless function that serves the Next.js app — so no raw IP is ever
// read or stored, only the coarse country Netlify already resolved. This
// function forwards the enriched event to /api/track-ingest, which is the
// only place that actually writes to the database.
export default async (req: Request, context: Context) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const country = context.geo?.country;
  const enriched = {
    ...body,
    countryCode: country?.code,
    countryName: country?.name,
  };

  const ingestUrl = new URL("/api/track-ingest", req.url);
  const res = await fetch(ingestUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enriched),
  });

  return new Response(null, { status: res.status });
};
