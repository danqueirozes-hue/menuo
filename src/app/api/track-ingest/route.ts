import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Internal-only endpoint: the public-facing /api/track path is intercepted
// by the "track-geo" Netlify Edge Function (see netlify/edge-functions/),
// which reads the visitor's country from context.geo and forwards the
// enriched payload here. This route is the only piece that touches Prisma,
// since the query engine doesn't run in Netlify's Deno-based Edge runtime.
const schema = z.object({
  type: z.enum(["pageview", "click", "vitals"]),
  path: z.string().max(300),
  href: z.string().max(500).optional(),
  linkLabel: z.string().max(200).optional(),
  metricName: z.string().max(40).optional(),
  metricValue: z.number().optional(),
  referrerHost: z.string().max(200).optional(),
  countryCode: z.string().max(10).optional(),
  countryName: z.string().max(100).optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid event" }, { status: 400 });

  await prisma.siteEvent.create({ data: parsed.data });
  return NextResponse.json({ ok: true });
}
