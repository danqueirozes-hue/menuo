import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";
import { SITE_LOCALES, isSiteLocale } from "@/lib/landing-content";
import { landingMetadata } from "@/lib/landing-seo";

// Prerender every localized landing page at build time so it's served from
// the CDN like "/" instead of being rendered on each visit (slow TTFB and
// cold starts hurt LCP for ad traffic landing on /it, /pt…). "en" lives at
// "/" and is still redirected on demand.
export function generateStaticParams() {
  return SITE_LOCALES.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isSiteLocale(locale) ? landingMetadata(locale) : {};
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale === "en") redirect("/");
  if (!isSiteLocale(locale)) notFound();
  return <LandingPage locale={locale} />;
}
