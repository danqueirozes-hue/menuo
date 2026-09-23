import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Benefits } from "@/components/landing/Benefits";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LanguagesShowcase } from "@/components/landing/LanguagesShowcase";
import { TableGallery } from "@/components/landing/TableGallery";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { LANDING_CONTENT, isSiteLocale } from "@/lib/landing-content";

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale === "en") redirect("/");
  if (!isSiteLocale(locale)) notFound();

  const dict = LANDING_CONTENT[locale];

  return (
    <>
      <Navbar dict={dict.nav} locale={locale} />
      <main>
        <Hero dict={dict.hero} />
        <Benefits dict={dict.benefits} />
        <HowItWorks dict={dict.how} />
        <LanguagesShowcase dict={dict.languagesSection} />
        <TableGallery dict={dict.tableGallery} />
        <Pricing dict={dict.pricing} />
        <CTA dict={dict.cta} />
      </main>
      <Footer />
    </>
  );
}
