import type { Metadata } from "next";
import { RootDocument } from "@/components/RootDocument";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://menuoglobal.com"),
  title: "MENUO — One menu. Every language.",
  description:
    "MENUO turns your restaurant menu into an elegant, QR-based digital menu translated into 20 languages, boosting average ticket and guest confidence.",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
