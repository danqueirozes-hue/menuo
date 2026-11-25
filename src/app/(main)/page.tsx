import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Benefits } from "@/components/landing/Benefits";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LanguagesShowcase } from "@/components/landing/LanguagesShowcase";
import { TableGallery } from "@/components/landing/TableGallery";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { LANDING_CONTENT } from "@/lib/landing-content";
import { LANDING_IMAGE_ALTS, landingMetadata } from "@/lib/landing-seo";

export const metadata = landingMetadata("en");

export default function Home() {
  const dict = LANDING_CONTENT.en;

  return (
    <>
      <Navbar dict={dict.nav} locale="en" />
      <main>
        <Hero dict={dict.hero} imageAlt={LANDING_IMAGE_ALTS["en"].hero} />
        <Benefits dict={dict.benefits} />
        <HowItWorks dict={dict.how} locale="en" />
        <LanguagesShowcase dict={dict.languagesSection} />
        <TableGallery dict={dict.tableGallery} alts={LANDING_IMAGE_ALTS["en"].tables} />
        <Pricing dict={dict.pricing} />
        <CTA dict={dict.cta} />
      </main>
      <Footer />
    </>
  );
}
