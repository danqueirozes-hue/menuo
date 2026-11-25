import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AVIF first (smaller), WebP fallback; and no 2048/3840 px variants —
  // the largest landing image is never shown wider than ~1200 CSS px.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  // playwright-core needs its own package assets (e.g. browsers.json) at
  // runtime, but Next's file tracing doesn't always pick them up
  // automatically for a serverless bundle — spell it out for the PDF route.
  outputFileTracingIncludes: {
    "/api/menu-pdf": ["./node_modules/playwright-core/**", "./node_modules/@sparticuz/chromium/**"],
  },
};

export default nextConfig;
