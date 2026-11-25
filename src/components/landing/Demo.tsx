import QRCode from "qrcode";
import { Check, ExternalLink } from "lucide-react";
import { LandingDict } from "@/lib/landing-content";
import { LANDING_CONFIG } from "@/lib/landing/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://menuoglobal.com";

/** Section 2: a QR (desktop) / button (mobile) opening a light sample menu
 * page — no iframe, so nothing heavy loads on the landing itself. */
export async function Demo({ dict }: { dict: LandingDict["demo"] }) {
  const path = LANDING_CONFIG.demoMenuPath;
  if (!path) return null;
  const qrSvg = await QRCode.toString(`${SITE_URL}${path}`, {
    type: "svg",
    margin: 1,
    color: { dark: "#0b2d5b", light: "#ffffff" },
  });
  const bullets = LANDING_CONFIG.dishNamesKept ? [...dict.bullets, dict.namesBullet] : dict.bullets;

  return (
    <section id="demo" className="scroll-mt-20 bg-paper py-20 sm:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">{dict.title}</h2>
          <p className="mt-4 text-ink-soft">{dict.text}</p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-ink">
                <Check size={18} className="mt-0.5 shrink-0 text-green" /> {b}
              </li>
            ))}
          </ul>
          <a
            href={path}
            target="_blank"
            rel="noopener"
            data-event="demo_open"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-navy-soft"
          >
            {dict.button} <ExternalLink size={15} />
          </a>
        </div>
        <div className="hidden flex-col items-center md:flex">
          <div
            className="w-56 rounded-2xl border border-border bg-white p-4 shadow-lg [&_svg]:h-auto [&_svg]:w-full"
            role="img"
            aria-label={dict.button}
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <p className="mt-3 text-sm text-ink-soft">{dict.scan}</p>
        </div>
      </div>
    </section>
  );
}
