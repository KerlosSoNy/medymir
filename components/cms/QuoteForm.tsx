"use client";
// "Request a quotation" form (Figma node 11:234). The FIELDS come from the store's
// contact-form settings in TheCoins (never hard-coded); the quote list lines are attached
// to the submission automatically.
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { contactFormApi, type FormField } from "@/lib/client-api";
import { cn } from "@/lib/cn";
import { btn, notice } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { useQuoteList } from "../QuoteListProvider";
import { Icon } from "../SmartLink";
import { card, eyebrow } from "./classes";

export const control =
  "w-full rounded-[7px] border border-input-border bg-white px-[15px] py-[13px] text-sm text-ink-2 transition placeholder:text-muted-3 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/15";
const fieldCls = "grid grid-cols-1 content-start gap-2";
const full = "md:col-span-2";
const infoBox = "flex items-center gap-4 rounded-lg px-5 [&_strong]:text-sm [&_strong]:font-semibold [&>div]:grid [&>div]:gap-[3px] [&_span]:text-[12.5px] [&_span]:text-muted [&_img]:shrink-0";

const SHORT = new Set(["text", "email", "tel", "phone", "number", "select", "dropdown", "date", "url"]);

export function options(f: FormField): string[] {
  const o = f.options;
  if (Array.isArray(o)) return o.map((x: any) => (typeof x === "object" ? String(x.label ?? x.value ?? "") : String(x))).filter(Boolean);
  if (typeof o === "string") return o.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
  return [];
}

/** One store form field (label + input / select / textarea), Figma Form/Field. Textareas and long fields span 2 columns. */
export function Field({ f }: { f: FormField }) {
  const t = f.field_type?.toLowerCase();
  const common = { name: f.field_name, required: f.is_required, placeholder: f.placeholder ?? undefined, id: `qf-${f.id}` };
  const label = (
    <label htmlFor={common.id} className="text-sm font-medium text-ink-2">
      {f.field_label}
      {f.is_required && <span className="text-[#d92d20]"> *</span>}
    </label>
  );
  if (t === "textarea")
    return (
      <div className={cn(fieldCls, full)}>
        {label}
        <textarea {...common} rows={4} className={cn(control, "min-h-[92px] resize-y")} />
      </div>
    );
  if (t === "select" || t === "dropdown")
    return (
      <div className={fieldCls}>
        {label}
        <div className="relative">
          <select {...common} defaultValue="" className={cn(control, "cursor-pointer appearance-none pr-10")}>
            <option value="" disabled>
              {f.placeholder ?? ""}
            </option>
            {options(f).map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <img src="/icons/form-chevron-down.svg" width={15} height={15} alt="" className="pointer-events-none absolute right-4 top-1/2 size-[15px] max-w-none -translate-y-1/2" />
        </div>
      </div>
    );
  const type = t === "phone" ? "tel" : SHORT.has(t) ? t : "text";
  return (
    <div className={cn(fieldCls, !(SHORT.has(t) || !t) && full)}>
      {label}
      <input {...common} type={type} pattern={f.validation_regex ?? undefined} title={f.validation_message ?? undefined} className={control} />
    </div>
  );
}

/** Store form fields in their saved order (null while loading, [] when the store has none). */
export function useFormFields() {
  const [fields, setFields] = useState<FormField[] | null>(null);
  useEffect(() => {
    contactFormApi
      .fields()
      .then((r) => setFields([...(r.fields ?? [])].sort((a, b) => a.sort_order - b.sort_order)))
      .catch(() => setFields([]));
  }, []);
  return fields;
}

/** Sends a quotation request: the store fields from `form` plus the quote list lines (as text in "quote_list"). */
export async function sendQuote(fields: FormField[], form: HTMLFormElement, lines: any[], subject: string) {
  const fd = new FormData(form);
  const form_data: Record<string, string> = {};
  for (const f of fields) form_data[f.field_name] = String(fd.get(f.field_name) ?? "");
  if (lines.length)
    form_data["quote_list"] = lines.map((l: any) => `${l.quantity} × ${l.name}${l.sku ? ` (REF ${l.sku})` : ""}`).join("\n");
  return contactFormApi.submit(form_data, { subject });
}

/** Readable error from a failed form submission. */
export const sendError = (e: any) => e?.body?.validation_errors?.map((v: any) => v.message).join(" ") || e?.message || UI.error;

export function QuoteForm(p: {
  anchor: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  attachTitle: string;
  attachText: string;
  submitText: string;
  privacyNote: string;
  fallbackEmail: string | null;
}) {
  const { data, count, clear } = useQuoteList();
  const fields = useFormFields();
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const firstTextarea = useMemo(() => fields?.findIndex((f) => f.field_type?.toLowerCase() === "textarea") ?? -1, [fields]);
  const lines = data?.items ?? [];

  const status = (
    <div className={cn(infoBox, "border border-[#cfddf3] bg-[#ebf2fc] py-[18px] [&_a]:font-semibold [&_a]:text-blue-link [&_a:hover]:underline")}>
      <Icon name="quote-file-text" size={22} />
      <div>
        {count > 0 ? (
          <>
            <strong>{UI.quoteItems(lines.length)}</strong>
            <span>
              {UI.quoteItemsText} <Link href="/quote">{UI.quoteList} →</Link>
            </span>
          </>
        ) : (
          <>
            <strong>{UI.quoteEmptyTitle}</strong>
            <span>{UI.quoteEmptyText}</span>
          </>
        )}
      </div>
    </div>
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    setErr("");
    try {
      await sendQuote(fields ?? [], e.currentTarget, lines, p.title || UI.requestQuote);
      setState("done");
      if (lines.length) clear();
    } catch (e: any) {
      setErr(sendError(e));
      setState("error");
    }
  }

  return (
    <div className={cn(card, "flex scroll-mt-6 flex-col gap-4 px-[18px] py-6 md:px-[34px] md:pb-[34px] md:pt-9")} id={p.anchor}>
      {p.eyebrow && <p className={eyebrow("gold", true)}>{p.eyebrow}</p>}
      {p.title && <h2 className="font-head text-[28px] font-bold tracking-[-0.02em] text-ink-2 md:text-[37px]">{p.title}</h2>}
      {p.subtitle && <p className="text-[15.5px] text-muted">{p.subtitle}</p>}

      {state === "done" ? (
        <p className={notice("ok")}>{UI.quoteSent}</p>
      ) : fields === null ? (
        <p className="text-muted">{UI.loading}</p>
      ) : fields.length === 0 ? (
        <>
          {status}
          <p className={notice()}>
            {UI.formNotReady} {p.fallbackEmail && <a href={`mailto:${p.fallbackEmail}`}>{p.fallbackEmail}</a>}
          </p>
        </>
      ) : (
        <form onSubmit={submit} className="grid grid-cols-1 gap-x-[18px] gap-y-4 md:grid-cols-2">
          {fields.map((f, i) => (
            <FieldWithStatus key={f.id} f={f} status={i === firstTextarea ? status : null} />
          ))}
          {firstTextarea < 0 && <div className={full}>{status}</div>}
          {(p.attachTitle || p.attachText) && (
            <div className={cn(infoBox, full, "border border-dashed border-input-border bg-[#f8f9fb] py-3.5 [&_strong]:text-[#4b5565]")}>
              <Icon name="paperclip" size={22} />
              <div>
                <strong>{p.attachTitle}</strong>
                <span>{p.attachText}</span>
              </div>
            </div>
          )}
          {state === "error" && <p className={cn(notice("err"), full)}>{err}</p>}
          <div className={cn(full, "flex flex-col items-stretch gap-3 md:flex-row md:flex-wrap md:items-center md:gap-5")}>
            <button className={btn("gold", "lg")} disabled={state === "busy"}>
              {state === "busy" ? UI.sending : p.submitText || UI.requestQuote}
              <Icon name="arrow-right-submit" size={16} />
            </button>
            {p.privacyNote && <small className="text-xs text-muted">{p.privacyNote}</small>}
          </div>
        </form>
      )}
    </div>
  );
}

function FieldWithStatus({ f, status }: { f: FormField; status: React.ReactNode }) {
  return (
    <>
      {status && <div className={full}>{status}</div>}
      <Field f={f} />
    </>
  );
}
