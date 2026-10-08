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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18333271816"
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18333271816');
          `}
        </Script>
      </body>
    </html>
  );
}
