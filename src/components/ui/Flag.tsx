import { flagSrc } from "@/lib/languages";

/** Flag for a language, as an SVG image (flag emoji show up as letters on
 * Windows). Decorative: the language name always sits next to it. */
export function Flag({ code, className = "h-4 w-[1.33rem]" }: { code: string; className?: string }) {
  return (
    // Tiny static SVG — next/image would add nothing here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagSrc(code)}
      alt=""
      aria-hidden
      width={20}
      height={15}
      loading="lazy"
      className={`inline-block shrink-0 rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.08)] ${className}`}
    />
  );
}
