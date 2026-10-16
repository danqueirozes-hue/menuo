import { cookies, headers } from "next/headers";
import { SITE_LOCALE_COOKIE, SiteLocale, isSiteLocale } from "@/lib/landing-content";

/** The language the visitor picked on the public site (remembered in a
 * cookie by the LanguageSwitcher), falling back to the browser's
 * Accept-Language and finally English. */
export async function getRequestLocale(): Promise<SiteLocale> {
  const saved = (await cookies()).get(SITE_LOCALE_COOKIE)?.value;
  if (saved && isSiteLocale(saved)) return saved;

  const accept = (await headers()).get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const lang = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isSiteLocale(lang)) return lang;
  }
  return "en";
}
