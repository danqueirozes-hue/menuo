import { Mail, MessageCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { LandingDict } from "@/lib/landing-content";
import { LANDING_CONFIG } from "@/lib/landing/config";

/** Section 10: closing headline + CTA, and a human contact for whoever still
 * hesitates (WhatsApp once a number is configured, email meanwhile). */
export function FinalCta({ dict, cta }: { dict: LandingDict["final"]; cta: string }) {
  const { whatsappNumber, contactEmail } = LANDING_CONFIG;
  return (
    <section className="defer-render bg-navy py-20 text-paper">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl">{dict.title}</h2>
        <LinkButton href="/signup" variant="amber">
          {cta}
        </LinkButton>
        <div className="mt-4 flex flex-col items-center gap-3 text-sm text-paper/75">
          {whatsappNumber ? (
            <>
              <p>{dict.human}</p>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                data-event="whatsapp_click"
                className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-5 py-2.5 text-paper transition-colors hover:border-amber hover:text-amber"
              >
                <MessageCircle size={16} /> {dict.whatsapp}
              </a>
            </>
          ) : (
            <p>{dict.humanEmail}</p>
          )}
          <a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 hover:text-amber">
            <Mail size={15} /> {contactEmail}
          </a>
        </div>
      </div>
    </section>
  );
}
