"use client";
// Quote list page body (Figma "Quote list", node 23:298; tablet/phone stack the sidebar under the form):
// "Items for quotation" (the quote list = the store's cart), "Your details" (the store's Contact form fields,
// shared with the home quotation form) and a sidebar: Request summary with the send button, WhatsApp card,
// "What happens next?". Texts around the form come from the CMS page "quote" (see app/quote/page.tsx);
// a text left empty there is simply not shown.
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { notice } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { Field, sendError, sendQuote, useFormFields } from "./cms/QuoteForm";
import { ProductPhoto } from "./ProductCard";
import { useQuoteList } from "./QuoteListProvider";
import { Icon, SmartLink } from "./SmartLink";

export interface QuoteTexts {
  subtitle: string;
  noteTitle: string;
  noteText: string;
  footnote: string;
  attachTitle: string;
  attachText: string;
  consentText: string;
  privacyLinkText: string;
  privacyLink: string;
  smallPrint: string;
  submitText: string;
  subject: string;
}

const FORM_ID = "quote-request";
const panel = "rounded-[10px] border border-[#e3e7ed] bg-white p-[18px] sm:p-[26px]";
const panelTitle = "font-head text-[20px] font-semibold text-[#0f2a4a]";
const cell = "grid size-9 cursor-pointer place-items-center bg-white text-lg font-semibold text-navy-deep transition hover:bg-surface-alt";

function optionNames(item: any): string[] {
  const m = item?.modifiers;
  if (Array.isArray(m)) return m.map((x) => x?.name).filter(Boolean);
  if (m && typeof m === "object") return Object.values(m).map((x: any) => x?.name).filter(Boolean);
  return [];
}

export function QuoteRequest({
  texts: t,
  steps,
  whatsapp,
  fallbackEmail,
}: {
  texts: QuoteTexts;
  steps: { title: string; items: string[] } | null;
  whatsapp: { title: string; subtitle: string; text: string; link: string } | null;
  fallbackEmail: string | null;
}) {
  const { data, loading, error, update, remove, clear } = useQuoteList();
  const fields = useFormFields();
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const items: any[] = data?.items ?? [];
  const total = items.reduce((n, it) => n + (Number(it.quantity) || 0), 0);
  const canSend = !!fields?.length;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fields) return;
    setState("busy");
    setErr("");
    try {
      await sendQuote(fields, e.currentTarget, items, t.subject || UI.requestQuote);
      setState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (items.length) clear();
    } catch (e: any) {
      setErr(sendError(e));
      setState("error");
    }
  }

  /** "Add another product or REF": jump to the free-text field of the form. */
  function describe() {
    const el = document.querySelector<HTMLTextAreaElement>(`#${FORM_ID} textarea`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  }

  const head = (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div className="grid gap-2.5">
        <h1 className="font-head text-[30px] leading-tight font-bold text-[#0f2a4a] md:text-[37px]">{UI.quoteTitle}</h1>
        {t.subtitle && <p className="text-base text-ink-2">{t.subtitle}</p>}
        <Link href="/products" className="flex items-center gap-2 self-start text-[15px] text-gold-menu underline underline-offset-2 hover:no-underline">
          {UI.continueBrowsing}
          <Icon name="ql-arrow-gold" size={14} />
        </Link>
      </div>
      {state !== "done" && (
        <ol className="relative grid shrink-0 grid-cols-3 md:w-[372px]" aria-label={UI.quoteSteps.join(", ")}>
          <span aria-hidden className="absolute top-[14px] right-[calc(100%/6)] left-[calc(100%/6)] h-[1.5px] bg-[#c5ccd8]" />
          {UI.quoteSteps.map((s, n) => (
            <li key={s} className="relative flex flex-col items-center gap-2.5 text-center">
              <span className="grid size-[29px] place-items-center rounded-full border-[1.5px] border-ink-2 bg-white text-[13px] font-semibold text-ink-2">{n + 1}</span>
              <span className="text-[12.5px] font-medium text-ink-2 sm:text-[13px]">{s}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );

  if (state === "done")
    return (
      <>
        {head}
        <div className={cn(panel, "mt-7 grid max-w-[807px] gap-3")}>
          <h2 className={panelTitle}>{UI.quoteSentTitle}</h2>
          <p className={notice("ok")}>{UI.quoteSent}</p>
        </div>
      </>
    );

  return (
    <>
      {head}
      <div className="mt-7 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-[29px]">
        <div className="grid min-w-0 gap-6">
          {/* Items for quotation */}
          <section className={cn(panel, "grid gap-[18px]")}>
            <h2 className={panelTitle}>{UI.itemsForQuotation(items.length)}</h2>
            <hr className="border-[#e3e7ed]" />
            {error && <p className={notice("err")}>{error}</p>}
            {loading && !data ? (
              <p className="text-muted">{UI.loading}</p>
            ) : items.length === 0 ? (
              <div className="grid justify-items-center gap-2.5 pt-4 pb-[18px] text-center">
                <p className="text-[16.5px] font-bold text-[#0f2a4a]">{UI.quoteEmptyTitle}</p>
                <p className="text-[14.5px] text-muted">{UI.quoteEmptyText}</p>
                <Link href="/categories" className="flex items-center gap-1.5 pt-1 text-[14.5px] font-semibold text-gold-menu hover:underline">
                  {UI.browseCategories}
                  <Icon name="ql-arrow-gold-2" size={14} />
                </Link>
              </div>
            ) : (
              <ul className="grid gap-4">
                {items.map((it) => (
                  <li
                    key={it.id}
                    className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-[#e3e7ed] pb-4 sm:grid-cols-[64px_minmax(0,1fr)_auto_auto]"
                  >
                    <ProductPhoto src={it.image_url} alt="" size="sm" className="size-14 border border-[#e3e7ed] sm:size-16" />
                    <div className="grid min-w-0 gap-0.5">
                      <Link href={`/product/${it.menu_item_id}`} className="font-semibold text-[#0f2a4a] hover:text-blue-link">
                        {it.name}
                      </Link>
                      {it.sku && <small className="text-xs text-muted">REF {it.sku}</small>}
                      {optionNames(it).length > 0 && <small className="text-xs text-muted">{optionNames(it).join(" · ")}</small>}
                    </div>
                    <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-auto sm:contents">
                      <div className="flex overflow-hidden rounded-lg border border-[#cfd6e0]" role="group" aria-label={UI.quantity}>
                        <button
                          type="button"
                          className={cell}
                          aria-label="−"
                          onClick={() => (it.quantity > 1 ? update(it.id, it.quantity - 1) : remove(it.id)).catch(() => {})}
                        >
                          −
                        </button>
                        <span className="grid w-12 place-items-center border-x border-[#cfd6e0] text-[15px] font-medium text-navy-deep">{it.quantity}</span>
                        <button type="button" className={cell} aria-label="+" onClick={() => update(it.id, Math.min(999, it.quantity + 1)).catch(() => {})}>
                          +
                        </button>
                      </div>
                      <button type="button" className="cursor-pointer text-[13px] text-muted underline hover:text-ink-2" onClick={() => remove(it.id).catch(() => {})}>
                        {UI.remove}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {canSend && (
              <button type="button" onClick={describe} className="flex cursor-pointer items-start gap-3.5 self-start text-left">
                <span className="grid size-[29px] shrink-0 place-items-center rounded-full bg-[#c18a2c]">
                  <Icon name="ql-plus" size={15} />
                </span>
                <span className="grid gap-1.5 pt-1">
                  <span className="text-[15.5px] font-semibold text-[#0f2a4a] underline underline-offset-2">{UI.addAnother}</span>
                  <span className="text-[13.5px] text-ink-2">{UI.addAnotherText}</span>
                </span>
              </button>
            )}
          </section>

          {/* Your details */}
          <section className={cn(panel, "grid gap-4")}>
            <h2 className={panelTitle}>{UI.yourDetails}</h2>
            {fields === null ? (
              <p className="text-muted">{UI.loading}</p>
            ) : !canSend ? (
              <p className={notice()}>
                {UI.formNotReady} {fallbackEmail && <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>}
              </p>
            ) : (
              <form id={FORM_ID} onSubmit={submit} className="grid grid-cols-1 gap-x-[23px] gap-y-4 md:grid-cols-2">
                {fields.map((f) => (
                  <Field key={f.id} f={f} />
                ))}
                {(t.attachTitle || t.attachText) && (
                  <div className="flex items-center gap-5 rounded-lg border border-dashed border-[#c9d0da] px-5 py-5 sm:px-[26px] sm:py-6 md:col-span-2">
                    <Icon name="ql-paperclip" size={24} />
                    <div className="grid min-w-0 gap-[5px]">
                      {t.attachTitle && <strong className="text-[14.5px] font-semibold text-[#0f2a4a]">{t.attachTitle}</strong>}
                      {t.attachText && <span className="text-[13.5px] break-words text-ink-2">{t.attachText}</span>}
                    </div>
                  </div>
                )}
                {t.consentText && (
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-2 md:col-span-2">
                    <input type="checkbox" required className="mt-px size-[18px] shrink-0 cursor-pointer rounded accent-[#c18a2c]" />
                    <span>
                      {t.consentText}{" "}
                      {t.privacyLinkText && (
                        <SmartLink to={t.privacyLink} className="text-gold-menu hover:underline">
                          {t.privacyLinkText}
                        </SmartLink>
                      )}
                    </span>
                  </label>
                )}
                {t.smallPrint && <p className="text-[12.5px] text-muted md:col-span-2">{t.smallPrint}</p>}
              </form>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="grid min-w-0 gap-[19px]">
          <section className="grid gap-4 rounded-[10px] bg-[#0e2d52] px-[22px] pt-7 pb-6 text-white sm:px-[25px]">
            <h2 className="font-head text-[21px] font-semibold">{UI.requestSummary}</h2>
            <dl className="grid gap-4 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="opacity-90">{UI.productLines}</dt>
                <dd className="font-bold">{items.length}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="opacity-90">{UI.totalQuantity}</dt>
                <dd className="font-bold">{total}</dd>
              </div>
            </dl>
            <hr className="border-white/18" />
            {(t.noteTitle || t.noteText) && (
              <div className="flex items-start gap-[18px] pt-1.5">
                <span className="flex shrink-0">
                  <Icon name="ql-file-text" size={22} />
                </span>
                <div className="grid gap-1.5">
                  {t.noteTitle && <p className="text-[15.5px] font-semibold">{t.noteTitle}</p>}
                  {t.noteText && <p className="text-sm leading-5 opacity-85">{t.noteText}</p>}
                </div>
              </div>
            )}
            {err && <p className={notice("err")}>{err}</p>}
            {canSend && (
              <button
                type="submit"
                form={FORM_ID}
                disabled={state === "busy"}
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md bg-[#c18a2c] px-4 py-4 text-base font-semibold text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
              >
                {state === "busy" ? UI.sending : t.submitText || UI.sendQuoteRequest}
                <Icon name="ql-arrow-white" size={16} />
              </button>
            )}
            {t.footnote && <p className="text-center text-[12.5px] leading-[18px] opacity-75">{t.footnote}</p>}
          </section>

          {whatsapp && (
            <section className={cn(panel, "grid gap-[18px]")}>
              <div className="flex items-start gap-4">
                <span className="grid size-[46px] shrink-0 place-items-center rounded-full bg-[#25d366]">
                  <Icon name="ql-whatsapp-white" size={24} />
                </span>
                <div className="grid gap-1">
                  {whatsapp.title && <h2 className="font-head text-[17px] font-semibold text-[#0f2a4a]">{whatsapp.title}</h2>}
                  {whatsapp.subtitle && <p className="text-sm leading-5 text-ink-2">{whatsapp.subtitle}</p>}
                </div>
              </div>
              <a
                href={whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-md border-2 border-[#25b04f] py-[13px] text-[15.5px] font-semibold text-[#1e8e3e] transition hover:bg-[#25b04f]/5"
              >
                <Icon name="ql-whatsapp-green" size={18} />
                {whatsapp.text}
              </a>
            </section>
          )}

          {steps && steps.items.length > 0 && (
            <section className={cn(panel, "grid gap-5")}>
              {steps.title && <h2 className={panelTitle}>{steps.title}</h2>}
              <ol className="grid gap-5">
                {steps.items.map((s, n) => (
                  <li key={s} className="flex items-center gap-4 text-[14.5px] text-ink-2">
                    <span className="grid size-[31px] shrink-0 place-items-center rounded-full bg-[#c18a2c] text-[13px] font-semibold text-white">{n + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}
