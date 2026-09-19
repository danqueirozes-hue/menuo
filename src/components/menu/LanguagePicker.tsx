"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { LANGUAGES } from "@/lib/languages";
import { Logo } from "@/components/ui/Logo";

export function LanguagePicker({
  slug,
  restaurantName,
  logoUrl,
}: {
  slug: string;
  restaurantName: string;
  logoUrl: string | null;
}) {
  const router = useRouter();

  function choose(code: string) {
    router.push(`/m/${slug}?lang=${code}`);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-navy px-6 py-16 text-paper">
      <div className="flex flex-col items-center text-center">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={restaurantName}
            width={72}
            height={72}
            className="h-18 w-18 rounded-full object-cover"
          />
        ) : (
          <Logo variant="negative" className="h-9" />
        )}
        <h1 className="font-display mt-6 text-2xl sm:text-3xl">{restaurantName}</h1>
        <p className="mt-2 text-sm uppercase tracking-[0.2em] text-paper/50">
          Choose your language
        </p>
      </div>

      <div className="mt-12 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => choose(lang.code)}
            className="flex flex-col items-center gap-2 rounded-lg border border-paper/15 bg-paper/5 py-4 transition-colors hover:border-amber hover:bg-amber/10"
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className="text-xs text-paper/80">{lang.nativeName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
