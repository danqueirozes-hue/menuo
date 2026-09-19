import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Benefits } from "@/components/landing/Benefits";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LanguagesShowcase } from "@/components/landing/LanguagesShowcase";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { LANDING_CONTENT } from "@/lib/landing-content";

export default function Home() {
  const dict = LANDING_CONTENT.en;

  return (
    <>
      <Navbar dict={dict.nav} locale="en" />
      <main>
        <Hero dict={dict.hero} />
        <Benefits dict={dict.benefits} />
        <HowItWorks dict={dict.how} />
        <LanguagesShowcase dict={dict.languagesSection} />
        <Pricing dict={dict.pricing} />
        <CTA dict={dict.cta} />
      </main>
      <Footer />
    </>
  );
}
