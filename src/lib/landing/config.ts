import { DEMO_MENU_SLUG } from "../demo";

/** Landing switches that are configuration, not layout: a section whose
 * switch is off is hidden in every language at once (the structure never
 * differs between locales). */
export const LANDING_CONFIG = {
  /** Public path of the sample trattoria menu for the live demo (section 2).
   * null hides the demo section and its navbar link. */
  demoMenuPath: `/m/${DEMO_MENU_SLUG}` as string | null,
  /** Dish names stay in the original language and only descriptions are
   * translated. Turns on section 5 and the demo's "names" bullet; flip it
   * only once the product really does this. */
  dishNamesKept: true,
  /** Section 7 — stays off until there are real testimonials. */
  showSocialProof: false,
  /** International format, digits only (e.g. "393331234567"). null hides the
   * WhatsApp button; the contact email is shown instead. */
  whatsappNumber: null as string | null,
  contactEmail: "contato@menuoglobal.com",
  /** Crisp website ID (Crisp → Settings → Website settings → Setup
   * instructions). Not a secret. null hides the floating chat button. */
  crispWebsiteId: "08c5c911-1d33-4111-8e0c-474acbe75921" as string | null,
};
