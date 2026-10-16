"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, TriangleAlert } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { getLanguage } from "@/lib/languages";
import { Logo } from "@/components/ui/Logo";
import { DIETARY_TAGS, DietaryKey, dietaryLabel } from "@/lib/dietary-tags";
import { AllergenKey, allergenLabels, normalizeAllergens } from "@/lib/allergens";
import { menuString } from "@/lib/menu-strings";
import { FilterSheet, FilterTrigger } from "@/components/menu/DietaryFilter";
import { SectionNav } from "@/components/menu/SectionNav";

type ItemTranslation = { language: string; name: string; description: string | null };
type SectionTranslation = { language: string; name: string };
type VariantTranslation = { language: string; label: string };

type ItemVariant = {
  id: string;
  label: string;
  priceCents: number;
  translations: VariantTranslation[];
};

type Item = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  hasVariants: boolean;
  variants: ItemVariant[];
  photoUrl: string | null;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  hasSeafood: boolean;
  isSpecialty: boolean;
  isNew: boolean;
  allergens: string[];
  allergensConfirmed: boolean;
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

function variantLabel(variant: ItemVariant, lang: string, defaultLang: string) {
  if (lang === defaultLang) return variant.label;
  return variant.translations.find((t) => t.language === lang)?.label ?? variant.label;
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

  const allergenNames = allergenLabels(lang);
  const [avoid, setAvoid] = useState<Set<AllergenKey>>(new Set());
  const [only, setOnly] = useState<Set<DietaryKey>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const closeFilter = useCallback(() => setFilterOpen(false), []);
  const activeFilterCount = avoid.size + only.size;

  function clearFilters() {
    setAvoid(new Set());
    setOnly(new Set());
  }

  function toggleIn<T>(set: (fn: (prev: Set<T>) => Set<T>) => void, key: T) {
    set((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const visibleSections = useMemo(() => {
    if (avoid.size === 0 && only.size === 0) return restaurant.sections;
    return restaurant.sections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            !item.allergens.some((a) => avoid.has(a as AllergenKey)) &&
            [...only].every((key) => item[key])
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [restaurant.sections, avoid, only]);

  const visibleCount = visibleSections.reduce((n, s) => n + s.items.length, 0);

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    if (print) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSectionId(entry.target.id);
        }
      },
      // Treat a section as "active" once it's crossed into the top ~30% of
      // the viewport, just below the sticky nav — matches how apps like
      // iFood highlight the category you're actually looking at.
      { rootMargin: "-96px 0px -70% 0px" }
    );
    for (const el of sectionRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [visibleSections, print]);

  function scrollToSection(id: string) {
    sectionRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const [lightbox, setLightbox] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightbox]);

  return (
    <div dir={language.rtl ? "rtl" : "ltr"} className="min-h-screen bg-paper pb-24">
      <header className="relative flex flex-col items-center bg-navy px-6 py-14 text-center text-paper">
        {print && (
          <span
            aria-hidden
            className="absolute top-4 end-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-paper/25 bg-navy/20 text-[11px] font-semibold uppercase tracking-wide text-paper/85"
          >
            {lang}
          </span>
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
        {print ? (
          <p className="mt-5 flex items-center gap-1.5 text-xs text-paper/50">
            Powered by <Logo variant="negative" className="h-3.5" />
          </p>
        ) : (
          <Link
            href={`/m/${restaurant.slug}`}
            className="mt-5 text-xs uppercase tracking-wide text-amber-soft hover:text-amber"
          >
            {language.flag} {language.nativeName} · change
          </Link>
        )}
      </header>

      {!print && (
        <SectionNav
          sections={visibleSections.map((s) => ({
            id: s.id,
            label: sectionName(s, lang, restaurant.defaultLanguage),
          }))}
          activeId={activeSectionId}
          onSelect={scrollToSection}
          leading={
            <FilterTrigger
              lang={lang}
              activeCount={activeFilterCount}
              onOpen={() => setFilterOpen(true)}
            />
          }
        />
      )}

      {!print && activeFilterCount > 0 && (
        <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-x-2 gap-y-1 px-6 pt-5 text-xs text-ink-soft">
          <span>{menuString("avoidingLabel", lang)}</span>
          {[
            ...normalizeAllergens([...avoid]).map((k) => allergenNames[k]),
            ...[...only].map((k) => dietaryLabel(k, lang)),
          ].join(", ")}
          <button
            type="button"
            onClick={clearFilters}
            className="text-amber underline-offset-2 hover:underline"
          >
            {menuString("clearFilters", lang)}
          </button>
        </div>
      )}

      <main className="mx-auto max-w-2xl px-6 py-14">
        {visibleSections.length === 0 && (
          <p className="text-center text-sm text-ink-soft">{menuString("noMatches", lang)}</p>
        )}

        {visibleSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => {
              if (el) sectionRefs.current.set(section.id, el);
              else sectionRefs.current.delete(section.id);
            }}
            className="mb-14 scroll-mt-24"
          >
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
                      print ? (
                        <Image
                          src={item.photoUrl}
                          alt={text.name}
                          width={72}
                          height={72}
                          className="h-18 w-18 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setLightbox({ url: item.photoUrl!, alt: text.name })}
                          aria-label={`View larger photo of ${text.name}`}
                          className="shrink-0"
                        >
                          <Image
                            src={item.photoUrl}
                            alt={text.name}
                            width={72}
                            height={72}
                            className="h-18 w-18 rounded-md object-cover transition-opacity hover:opacity-80"
                          />
                        </button>
                      )
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
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
                        {item.hasVariants && item.variants.length > 0 ? (
                          <div className="flex shrink-0 gap-4">
                            {item.variants.map((variant) => (
                              <div key={variant.id} className="text-right">
                                <p className="whitespace-nowrap text-xs text-ink-soft">
                                  {variantLabel(variant, lang, restaurant.defaultLanguage)}
                                </p>
                                <p className="whitespace-nowrap font-display text-sm text-amber">
                                  {formatPrice(variant.priceCents, restaurant.currency, lang)}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="whitespace-nowrap font-display text-sm text-amber">
                            {formatPrice(item.priceCents, restaurant.currency, lang)}
                          </span>
                        )}
                      </div>
                      {text.description && (
                        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                          {text.description}
                        </p>
                      )}
                      {(item.allergens.length > 0 || item.allergensConfirmed) && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.allergens.length > 0 ? (
                            normalizeAllergens(item.allergens).map((key) => (
                              <span
                                key={key}
                                className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[11px] text-ink-soft"
                              >
                                {allergenNames[key]}
                              </span>
                            ))
                          ) : (
                            <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[11px] text-ink-soft">
                              {menuString("noAllergens", lang)}
                            </span>
                          )}
                        </div>
                      )}
                      {avoid.size > 0 && !item.allergensConfirmed && (
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-amber">
                          <TriangleAlert size={12} className="shrink-0" />
                          {menuString("allergensUnconfirmed", lang)}
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

      {!print && (
        <FilterSheet
          lang={lang}
          open={filterOpen}
          avoid={avoid}
          only={only}
          visibleCount={visibleCount}
          onToggleAllergen={(key) => toggleIn(setAvoid, key)}
          onToggleDiet={(key) => toggleIn(setOnly, key)}
          onClear={clearFilters}
          onClose={closeFilter}
        />
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close photo"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 text-paper hover:bg-paper/20"
          >
            <X size={22} />
          </button>
          <div className="relative max-h-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.url}
              alt={lightbox.alt}
              width={800}
              height={800}
              className="max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
