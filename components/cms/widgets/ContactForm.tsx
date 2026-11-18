// Contact Form (contact-form) variants: quote form (default), contact-card, contact (enquiry form) and contact-panel.
import { tr } from "@/lib/format";
import { Icon, SmartLink } from "../../SmartLink";
import { EnquiryForm } from "../EnquiryForm";
import { QuoteForm } from "../QuoteForm";
import { eyebrow, sideCard, sideTitle } from "../classes";
import { type P } from "./shared";

/* ---------- contact-form variants: quote form, contact card ---------- */
const CONTACT_ICON: Record<string, string> = { email: "email", mail: "email", hours: "hours", clock: "hours", reply: "reply" };

/** Gold line icons of the Contact page panel (Figma "Contact MEDYMAR"). */
const PANEL_ICON: Record<string, string> = {
  email: "contact-email",
  mail: "contact-email",
  whatsapp: "contact-whatsapp",
  pin: "contact-pin",
  location: "contact-pin",
  clock: "contact-clock",
  hours: "contact-clock",
};

export function ContactForm({ w, ctx }: P) {
  if (w.variant === "footer-contact") return null; // rendered by the footer
  if (w.variant === "contact")
    return (
      <EnquiryForm
        subject={tr(w.subject)}
        privacyNote={tr(w.privacyNote)}
        privacyLinkText={tr(w.privacyLinkText)}
        privacyLink={w.privacyLink}
        submitText={tr(w.submitText)}
        successTitle={tr(w.successTitle)}
        successText={tr(w.successText)}
        errorTitle={tr(w.errorTitle)}
        fallbackEmail={ctx.contactEmail}
      />
    );
  if (w.variant === "contact-panel")
    // Navy card with the ways to reach the team. contactInfo: [{ icon, label, value, link }];
    // a value with "@" becomes an email link, "\n" starts a new line.
    return (
      <div className="rounded-xl bg-navy-deep px-[26px] py-7 text-white">
        {w.title && <h2 className="font-head text-xl font-bold">{tr(w.title)}</h2>}
        {w.subtitle && <p className="mt-2 text-[14.5px] leading-normal text-mist">{tr(w.subtitle)}</p>}
        <dl className="mt-[22px] grid grid-cols-1 gap-5">
          {(w.contactInfo ?? []).map((c: any, i: number) => {
            const value = tr(c.value);
            const link = c.link || (/^\S+@\S+$/.test(value) ? `mailto:${value}` : "");
            return (
              <div key={i} className="flex items-start gap-4">
                {PANEL_ICON[String(c.icon).toLowerCase()] && (
                  <span className="flex shrink-0">
                    <Icon name={PANEL_ICON[String(c.icon).toLowerCase()]} size={22} />
                  </span>
                )}
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-[3px]">
                  <dt className="text-[15px] font-bold">{tr(c.label)}</dt>
                  <dd className="text-sm leading-normal break-words whitespace-pre-line text-mist">
                    {link ? (
                      <SmartLink to={link} className="underline underline-offset-2 hover:text-white">
                        {value}
                      </SmartLink>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    );
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
