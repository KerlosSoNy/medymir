// Contact Form (contact-form) variants: quote form (default) and contact-card.
import { tr } from "@/lib/format";
import { Icon } from "../../SmartLink";
import { QuoteForm } from "../QuoteForm";
import { eyebrow, sideCard, sideTitle } from "../classes";
import { type P } from "./shared";

/* ---------- contact-form variants: quote form, contact card ---------- */
const CONTACT_ICON: Record<string, string> = { email: "email", mail: "email", hours: "hours", clock: "hours", reply: "reply" };

export function ContactForm({ w, ctx }: P) {
  if (w.variant === "footer-contact") return null; // rendered by the footer
  if (w.variant === "contact-card")
    return (
      <div className={sideCard}>
        {w.title && <h3 className={sideTitle}>{tr(w.title)}</h3>}
        <dl className="grid grid-cols-1 gap-4 border-b border-line pb-4">
          {(w.contactInfo ?? []).map((c: any, i: number) => (
            <div key={i} className="flex gap-3.5 text-[14.5px]">
              <dt className="flex w-[82px] shrink-0 items-center gap-3.5 text-muted">
                <Icon name={CONTACT_ICON[String(c.icon).toLowerCase()] ?? "reply"} size={18} />
                {tr(c.label)}
              </dt>
              <dd className="min-w-0 break-words font-medium text-ink-2">
                {/@/.test(c.value) ? (
                  <a href={`mailto:${c.value}`} className="hover:underline underline-offset-2">
                    {tr(c.value)}
                  </a>
                ) : (
                  tr(c.value)
                )}
              </dd>
            </div>
          ))}
        </dl>
        {Array.isArray(w.offices) && w.offices.length > 0 && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {w.offices.map((o: any, i: number) => (
              <li key={i} className="grid grid-cols-1 gap-[3px] rounded-lg bg-surface-alt py-3 pl-4 pr-3">
                <span className="flex items-center gap-2.5 text-[15px] font-semibold text-ink-2">
                  <Icon name="map-pin" size={16} />
                  {tr(o.city)}
                </span>
                <small className="text-[11px] text-muted-3">{tr(o.note)}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  return (
    <QuoteForm
      anchor={w.anchor ?? "quote"}
      eyebrow={tr(w.eyebrow)}
      title={tr(w.title)}
      subtitle={tr(w.subtitle)}
      attachTitle={tr(w.attachTitle)}
      attachText={tr(w.attachText)}
      submitText={tr(w.submitText)}
      privacyNote={tr(w.privacyNote)}
      fallbackEmail={ctx.contactEmail}
    />
  );
}
