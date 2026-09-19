import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // playwright-core needs its own package assets (e.g. browsers.json) at
  // runtime, but Next's file tracing doesn't always pick them up
  // automatically for a serverless bundle — spell it out for the PDF route.
  outputFileTracingIncludes: {
    "/api/menu-pdf": ["./node_modules/playwright-core/**", "./node_modules/@sparticuz/chromium/**"],
  },
};

export default nextConfig;
