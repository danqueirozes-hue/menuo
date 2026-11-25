import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Demo } from "@/components/landing/Demo";
import { Benefits } from "@/components/landing/Benefits";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DishNames } from "@/components/landing/DishNames";
import { LanguagesShowcase } from "@/components/landing/LanguagesShowcase";
import { TableGallery } from "@/components/landing/TableGallery";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { LANDING_CONTENT, SiteLocale } from "@/lib/landing-content";
import { LANDING_CONFIG } from "@/lib/landing/config";
import { LANDING_IMAGE_ALTS } from "@/lib/landing-seo";

/** The one landing structure shared by every locale (sections 0–11, same
 * order everywhere); only the copy changes. */
export function LandingPage({ locale }: { locale: SiteLocale }) {
  const dict = LANDING_CONTENT[locale];
  return (
    <>
      <Navbar dict={dict.nav} cta={dict.cta} locale={locale} />
      <main>
        <Hero dict={dict.hero} cta={dict.cta} />
        <Demo dict={dict.demo} />
        <Benefits dict={dict.benefits} />
        <HowItWorks dict={dict.how} locale={locale} />
        <DishNames dict={dict.names} />
        <LanguagesShowcase dict={dict.languagesSection} />
        {LANDING_CONFIG.showSocialProof && (
          <TableGallery dict={dict.social} alts={LANDING_IMAGE_ALTS[locale].tables} />
        )}
        <Pricing dict={dict.pricing} cta={dict.cta} />
        <Faq dict={dict.faq} />
        <FinalCta dict={dict.final} cta={dict.cta} />
      </main>
      <Footer tagline={dict.footer.tagline} cookies={dict.footer.cookies} locale={locale} />
    </>
  );
}
