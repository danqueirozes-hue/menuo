import { RootDocument } from "@/components/RootDocument";

/** Root layout for the localized landing pages (/it, /pt…): same shell as the
 * main site, but with <html lang> set to the page's language. */
export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  return <RootDocument lang={locale}>{children}</RootDocument>;
}
