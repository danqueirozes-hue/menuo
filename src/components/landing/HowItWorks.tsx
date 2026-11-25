import { LandingDict, SiteLocale } from "@/lib/landing-content";

export function HowItWorks({ dict, locale }: { dict: LandingDict["how"]; locale: SiteLocale }) {
  return (
    <section id="how-it-works" className="defer-render scroll-mt-20 bg-navy py-20 text-paper sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display mx-auto max-w-2xl text-center text-3xl sm:text-4xl">{dict.title}</h2>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {dict.steps.map((s, i) => (
            <div key={s.title} className="border-t border-amber/30 pt-6">
              <span className="font-display text-4xl text-amber-soft">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display mt-4 text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/65">{s.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-amber-soft">{dict.note}</p>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="overflow-hidden rounded-[1.75rem] border border-paper/10 shadow-2xl shadow-black/40">
            {/* 45 s product demo with captions in the page's language
                (~1.8 MB each, 720p). preload="none" + poster keeps it out of
                the initial page load; it only downloads on play. */}
            <video
              className="h-auto w-full"
              controls
              playsInline
              preload="none"
              width={1280}
              height={720}
              poster="/videos/how-it-works-poster.jpg"
              src={`/videos/how-it-works-${locale}.mp4`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
