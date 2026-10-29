import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Montserrat, Playfair_Display } from "next/font/google";
import { SiteAnalyticsTracker } from "@/components/SiteAnalyticsTracker";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "MENUO — One menu. Every language.",
  description:
    "MENUO turns your restaurant menu into an elegant, QR-based digital menu translated into 20 languages, boosting average ticket and guest confidence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
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
            Assistant preview connect. */}
        <Script id="google-tag-manager" strategy="afterInteractive">
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
