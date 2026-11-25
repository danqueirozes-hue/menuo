
import Script from "next/script";
import { Manrope, Montserrat, Playfair_Display } from "next/font/google";
import { SiteAnalyticsTracker } from "@/components/SiteAnalyticsTracker";
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
        {/* Google Tag Manager container — all Google Ads / analytics tags and
            conversions (e.g. URL contains /billing/confirmado) are managed
            there, not in code. */}
        {/* Official GTM snippet: the gtm.start / "gtm.js" push is what fires
            the container's Page View ("All Pages") triggers and lets Tag
            Assistant preview connect. lazyOnload waits for the page's load
            event so GTM's ~450 KB script doesn't block the first render. */}
        <Script id="google-tag-manager" strategy="lazyOnload">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-53BW6Q23');
          `}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-53BW6Q23"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      </body>
    </html>
  );
}
