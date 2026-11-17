"use client";
// "Request a quotation" form (Figma node 11:234). The FIELDS come from the store's
// contact-form settings in TheCoins (never hard-coded); the quote list lines are attached
// to the submission automatically.
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { contactFormApi, type FormField } from "@/lib/client-api";
import { UI } from "@/lib/ui";
import { useQuoteList } from "../QuoteListProvider";

const SHORT = new Set(["text", "email", "tel", "phone", "number", "select", "dropdown", "date", "url"]);

function options(f: FormField): string[] {
  const o = f.options;
  if (Array.isArray(o)) return o.map((x: any) => (typeof x === "object" ? String(x.label ?? x.value ?? "") : String(x))).filter(Boolean);
  if (typeof o === "string") return o.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
  return [];
}

function Field({ f }: { f: FormField }) {
  const t = f.field_type?.toLowerCase();
  const common = { name: f.field_name, required: f.is_required, placeholder: f.placeholder ?? undefined, id: `qf-${f.id}` };
  const label = (
    <label htmlFor={common.id} className="qf-label">
      {f.field_label}
      {f.is_required && " *"}
    </label>
  );
  if (t === "textarea")
    return (
      <div className="qf-field full">
        {label}
        <textarea {...common} rows={4} />
      </div>
    );
  if (t === "select" || t === "dropdown")
    return (
      <div className="qf-field">
        {label}
        <div className="qf-select">
          <select {...common} defaultValue="">
            <option value="" disabled>
              {f.placeholder ?? ""}
            </option>
            {options(f).map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <img src="/icons/form-chevron-down.svg" width={15} height={15} alt="" />
        </div>
      </div>
    );
  const type = t === "phone" ? "tel" : SHORT.has(t) ? t : "text";
  return (
    <div className={`qf-field ${SHORT.has(t) || !t ? "" : "full"}`}>
      {label}
      <input {...common} type={type} pattern={f.validation_regex ?? undefined} title={f.validation_message ?? undefined} />
    </div>
  );
}

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
  const [fields, setFields] = useState<FormField[] | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  useEffect(() => {
    contactFormApi
      .fields()
      .then((r) => setFields([...(r.fields ?? [])].sort((a, b) => a.sort_order - b.sort_order)))
      .catch(() => setFields([]));
  }, []);

  const firstTextarea = useMemo(() => fields?.findIndex((f) => f.field_type?.toLowerCase() === "textarea") ?? -1, [fields]);
  const lines = data?.items ?? [];

  const status = (
    <div className="qf-status">
      <img src="/icons/quote-file-text.svg" width={22} height={22} alt="" />
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
    const fd = new FormData(e.currentTarget);
    const form_data: Record<string, string> = {};
    for (const f of fields ?? []) form_data[f.field_name] = String(fd.get(f.field_name) ?? "");
    if (lines.length)
      form_data["quote_list"] = lines
        .map((l: any) => `${l.quantity} × ${l.name}${l.sku ? ` (REF ${l.sku})` : ""}`)
        .join("\n");
    try {
      await contactFormApi.submit(form_data, { subject: p.title || UI.requestQuote });
      setState("done");
      if (lines.length) clear();
    } catch (e: any) {
      setErr(e?.body?.validation_errors?.map((v: any) => v.message).join(" ") || e?.message || UI.error);
      setState("error");
    }
  }

  return (
    <div className="card quote-form" id={p.anchor}>
      {p.eyebrow && <p className="eyebrow eb-gold wide">{p.eyebrow}</p>}
      {p.title && <h2>{p.title}</h2>}
      {p.subtitle && <p className="qf-sub">{p.subtitle}</p>}

      {state === "done" ? (
        <p className="notice ok">{UI.quoteSent}</p>
      ) : fields === null ? (
        <p className="muted">{UI.loading}</p>
      ) : fields.length === 0 ? (
        <>
          {status}
          <p className="notice">
            {UI.formNotReady} {p.fallbackEmail && <a href={`mailto:${p.fallbackEmail}`}>{p.fallbackEmail}</a>}
          </p>
        </>
      ) : (
        <form onSubmit={submit} className="qf-grid">
          {fields.map((f, i) => (
            <FieldWithStatus key={f.id} f={f} status={i === firstTextarea ? status : null} />
          ))}
          {firstTextarea < 0 && <div className="full">{status}</div>}
          {(p.attachTitle || p.attachText) && (
            <div className="qf-attach full">
              <img src="/icons/paperclip.svg" width={22} height={22} alt="" />
              <div>
                <strong>{p.attachTitle}</strong>
                <span>{p.attachText}</span>
              </div>
            </div>
          )}
          {state === "error" && <p className="notice err full">{err}</p>}
          <div className="qf-submit full">
            <button className="btn btn-gold btn-lg" disabled={state === "busy"}>
              {state === "busy" ? UI.sending : p.submitText || UI.requestQuote}
              <img src="/icons/arrow-right-submit.svg" width={16} height={16} alt="" />
            </button>
            {p.privacyNote && <small>{p.privacyNote}</small>}
          </div>
        </form>
      )}
    </div>
  );
}

function FieldWithStatus({ f, status }: { f: FormField; status: React.ReactNode }) {
  return (
    <>
      {status && <div className="full">{status}</div>}
      <Field f={f} />
    </>
  );
}
