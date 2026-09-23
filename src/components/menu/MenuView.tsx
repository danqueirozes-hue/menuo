"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import { getLanguage } from "@/lib/languages";
import { Logo } from "@/components/ui/Logo";
import { DIETARY_TAGS, DietaryKey, dietaryLabel } from "@/lib/dietary-tags";
import { menuString } from "@/lib/menu-strings";
import { DietaryFilter } from "@/components/menu/DietaryFilter";

type ItemTranslation = { language: string; name: string; description: string | null };
type SectionTranslation = { language: string; name: string };

type Item = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  photoUrl: string | null;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  hasSeafood: boolean;
  isSpecialty: boolean;
  isNew: boolean;
  translations: ItemTranslation[];
};

type Section = {
  id: string;
  name: string;
  translations: SectionTranslation[];
  items: Item[];
};

type Restaurant = {
  name: string;
  logoUrl: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  currency: string;
  defaultLanguage: string;
  slug: string;
  sections: Section[];
};

function sectionName(section: Section, lang: string, defaultLang: string) {
  if (lang === defaultLang) return section.name;
  return section.translations.find((t) => t.language === lang)?.name ?? section.name;
}

function itemText(item: Item, lang: string, defaultLang: string) {
  if (lang === defaultLang) return { name: item.name, description: item.description };
  const t = item.translations.find((t) => t.language === lang);
  return { name: t?.name ?? item.name, description: t?.description ?? item.description };
}

export function MenuView({
  restaurant,
  lang,
  print = false,
}: {
  restaurant: Restaurant;
  lang: string;
  print?: boolean;
}) {
  const language = getLanguage(lang);
  const location = [restaurant.city, restaurant.country].filter(Boolean).join(", ");

  const [activeFilters, setActiveFilters] = useState<Set<DietaryKey>>(new Set());

  function toggleFilter(key: DietaryKey) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const visibleSections = useMemo(() => {
    if (activeFilters.size === 0) return restaurant.sections;
    return restaurant.sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          [...activeFilters].every((key) => item[key])
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [restaurant.sections, activeFilters]);

  return (
    <div dir={language.rtl ? "rtl" : "ltr"} className="min-h-screen bg-paper pb-24">
      <header className="relative flex flex-col items-center bg-navy px-6 py-14 text-center text-paper">
        {!print && (
          <DietaryFilter
            lang={lang}
            active={activeFilters}
            onToggle={toggleFilter}
            onClear={() => setActiveFilters(new Set())}
          />
        )}
        {restaurant.logoUrl ? (
          <Image
            src={restaurant.logoUrl}
            alt={restaurant.name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <Logo variant="negative" className="h-7" />
        )}
        <h1 className="font-display mt-5 text-3xl">{restaurant.name}</h1>
        {location && <p className="mt-2 text-sm text-paper/60">{location}</p>}
        {!print && (
          <Link
            href={`/m/${restaurant.slug}`}
            className="mt-5 text-xs uppercase tracking-wide text-amber-soft hover:text-amber"
          >
            {language.flag} {language.nativeName} · change
          </Link>
        )}
      </header>

      <main className="mx-auto max-w-2xl px-6 py-14">
        {visibleSections.length === 0 && (
          <p className="text-center text-sm text-ink-soft">{menuString("noMatches", lang)}</p>
        )}

        {visibleSections.map((section) => (
          <section key={section.id} className="mb-14">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="font-display whitespace-nowrap text-xl text-ink">
                {sectionName(section, lang, restaurant.defaultLanguage)}
              </h2>
              <div className="amber-rule flex-1" />
            </div>

            <div className="space-y-8">
              {section.items.map((item) => {
                const text = itemText(item, lang, restaurant.defaultLanguage);
                return (
                  <div key={item.id} className="flex gap-4">
                    {item.photoUrl && (
                      <Image
                        src={item.photoUrl}
                        alt={text.name}
                        width={72}
                        height={72}
                        className="h-18 w-18 shrink-0 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-display text-base text-ink">{text.name}</h3>
                          {DIETARY_TAGS.filter((t) => item[t.key]).map(({ key, icon: Icon }) => (
                            <Icon
                              key={key}
                              size={14}
                              strokeWidth={2}
                              className="shrink-0 text-green"
                            >
                              <title>{dietaryLabel(key, lang)}</title>
                            </Icon>
                          ))}
                        </div>
                        <span className="whitespace-nowrap font-display text-sm text-amber">
                          {formatPrice(item.priceCents, restaurant.currency, lang)}
                        </span>
                      </div>
                      {text.description && (
                        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                          {text.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      <footer className="pb-6 text-center text-xs text-ink-soft/60">
        Powered by MENUO
      </footer>
    </div>
  );
}
