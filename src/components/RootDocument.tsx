
import { Manrope, Montserrat, Playfair_Display } from "next/font/google";
import { SiteAnalyticsTracker } from "@/components/SiteAnalyticsTracker";
import { CookieConsent } from "@/components/CookieConsent";
import "@/app/globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Used only for the restaurant name on the printable table-card QR design —
// an elegant serif reads as more "restaurant menu" than MENUO's own
// geometric sans, matching the table-card mockup in public/images.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
});

/** The <html> shell shared by the two root layouts: "(main)" (English site,
 * app, admin) and "[locale]" (localized landing pages, which need their own
 * <html lang>). */
export function RootDocument({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <html
      lang={lang}
      className={`${manrope.variable} ${montserrat.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
        <SiteAnalyticsTracker />
        {/* Google Tag Manager (all Google Ads / analytics tags and conversions,
            e.g. URL contains /billing/confirmado) loads only after cookie
            consent — see CookieConsent. */}
        <CookieConsent />
      </body>
    </html>
  );
}
