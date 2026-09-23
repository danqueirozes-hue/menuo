import Image from "next/image";
import { LandingDict } from "@/lib/landing-content";

const TABLES = [
  {
    src: "/images/landing/table-paris.jpg",
    alt: "MENUO table stand with QR code at a rooftop restaurant overlooking the Eiffel Tower",
  },
  {
    src: "/images/landing/table-puerto-niza.jpg",
    alt: "MENUO table stand with QR code at Puerto Niza restaurant",
  },
];

export function TableGallery({ dict }: { dict: LandingDict["tableGallery"] }) {
  return (
    <section className="bg-navy py-24 text-paper">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-amber">{dict.eyebrow}</span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl">{dict.title}</h2>
          <p className="mt-4 text-paper/65">{dict.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {TABLES.map((t) => (
            <div key={t.src} className="group relative overflow-hidden rounded-2xl border border-paper/10">
              <Image
                src={t.src}
                alt={t.alt}
                width={1200}
                height={800}
                sizes="(min-width: 640px) 45vw, 90vw"
                className="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 sm:h-96"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
