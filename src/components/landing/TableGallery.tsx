import Image from "next/image";
import { LandingDict } from "@/lib/landing-content";

const TABLES = ["/images/landing/table-paris.jpg", "/images/landing/table-puerto-niza.jpg"];

export function TableGallery({ dict, alts }: { dict: LandingDict["social"]; alts: readonly string[] }) {
  return (
    <section className="defer-render bg-navy py-24 text-paper">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl sm:text-4xl">{dict.title}</h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {TABLES.map((src, i) => (
            <div key={src} className="group relative overflow-hidden rounded-2xl border border-paper/10">
              <Image
                src={src}
                alt={alts[i]}
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
