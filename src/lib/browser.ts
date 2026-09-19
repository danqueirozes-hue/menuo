import { chromium, type Browser } from "playwright-core";
import { isNetlifyRuntime } from "@/lib/runtime";

/**
 * Launches Chromium for server-side rendering (used by the PDF export
 * route). Locally, playwright-core finds the full browser that the
 * `playwright` package downloaded to the shared cache. On Netlify, the
 * filesystem has no such cache, so we point it at @sparticuz/chromium's
 * Lambda/Netlify-compatible build instead.
 */
export async function launchBrowser(): Promise<Browser> {
  if (isNetlifyRuntime()) {
    const sparticuzChromium = (await import("@sparticuz/chromium")).default;
    return chromium.launch({
      args: sparticuzChromium.args,
      executablePath: await sparticuzChromium.executablePath(),
      headless: true,
    });
  }

  return chromium.launch();
}
