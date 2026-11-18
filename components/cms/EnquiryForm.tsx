"use client";
// Contact page enquiry form (Figma "Contact — Form / Sent / Error", nodes 101:65, 101:317, 101:530).
// The FIELDS come from the store's contact-form settings in TheCoins (never hard-coded); the texts
// around them (privacy note, button, thank-you and error titles) come from the CMS widget.
import { useEffect, useMemo, useState } from "react";
import { contactFormApi, type FormField } from "@/lib/client-api";
import { cn } from "@/lib/cn";
import { notice } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { Icon, SmartLink } from "../SmartLink";
import { goldBtn } from "./classes";
import { options } from "./QuoteForm";

const control =
  "w-full rounded-lg border border-[#cfd6e0] bg-white px-3.5 text-[15px] text-navy-deep transition placeholder:text-[#7a8699] focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/15";
const SHORT = new Set(["text", "email", "tel", "phone", "number", "date", "url"]);

function Field({ f }: { f: FormField }) {
  const t = f.field_type?.toLowerCase() ?? "text";
  const id = `ef-${f.id}`;
  const common = { id, name: f.field_name, required: f.is_required, placeholder: f.placeholder ?? undefined };
  const wide = !SHORT.has(t);
  const label = (
    <label htmlFor={id} className="flex items-baseline gap-[5px] text-sm font-semibold text-navy-deep">
      {f.field_label}
      {f.is_required ? (
        <span className="text-[#c0392b]" aria-hidden>
          *
        </span>
      ) : (
        <span className="text-[11.5px] font-normal text-[#7a8699]">{UI.optionalTag}</span>
      )}
    </label>
  );
  let input: React.ReactNode;
  if (t === "textarea") input = <textarea {...common} className={cn(control, "h-[140px] resize-y py-[13px]")} />;
  else if (t === "select" || t === "dropdown")
    input = (
      <div className="relative">
        <select {...common} defaultValue="" className={cn(control, "h-[46px] cursor-pointer appearance-none pr-10")}>
          <option value="" disabled>
            {f.placeholder || UI.selectOne}
          </option>
          {options(f).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2">
          <Icon name="select-chevron" size={14} />
        </span>
      </div>
    );
  else
    input = (
      <input
        {...common}
        type={t === "phone" ? "tel" : SHORT.has(t) ? t : "text"}
        pattern={f.validation_regex ?? undefined}
        title={f.validation_message ?? undefined}
        className={cn(control, "h-[46px]")}
      />
    );
  return (
    <div className={cn("flex min-w-0 flex-col gap-[7px]", wide && "md:col-span-2")}>
      {label}
      {input}
    </div>
  );
}

export function EnquiryForm(p: {
  subject: string;
  privacyNote: string;
  privacyLinkText: string;
  privacyLink: string;
  submitText: string;
  successTitle: string;
  successText: string;
  errorTitle: string;
  fallbackEmail: string | null;
}) {
  const [fields, setFields] = useState<FormField[] | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    contactFormApi
      .fields()
      .then((r) => setFields([...(r.fields ?? [])].sort((a, b) => a.sort_order - b.sort_order)))
      .catch(() => setFields([]));
  }, []);

  const names = useMemo(() => (fields ?? []).map((f) => f.field_name), [fields]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    setErrors([]);
    const fd = new FormData(e.currentTarget);
    const form_data: Record<string, string> = {};
    for (const n of names) form_data[n] = String(fd.get(n) ?? "");
    try {
      await contactFormApi.submit(form_data, p.subject ? { subject: p.subject } : {});
      setState("done");
    } catch (err: any) {
      const list: string[] = err?.body?.validation_errors?.map((v: any) => String(v.message)).filter(Boolean) ?? [];
      setErrors(list.length ? list : [UI.sendFailed]);
      setState("error");
    }
  }

  const box = "flex flex-col rounded-xl border border-line-3 bg-white p-5 md:p-[27px]";

  if (state === "done")
    return (
      <div className={box} role="status">
        <div className="rounded-lg border border-[#cfe6d6] bg-[#edf7f0] px-4 py-[18px]">
          <p className="font-head text-[17px] font-bold text-[#1e6b3a]">{p.successTitle}</p>
          {p.successText && <p className="mt-1.5 text-[13px] text-slate">{p.successText}</p>}
        </div>
      </div>
    );

  if (fields === null)
    return (
      <div className={box}>
        <p className="text-slate">{UI.loading}</p>
      </div>
    );

  if (fields.length === 0)
    return (
      <div className={box}>
        <p className={notice()}>
          {UI.formNotReady} {p.fallbackEmail && <a href={`mailto:${p.fallbackEmail}`}>{p.fallbackEmail}</a>}
        </p>
      </div>
    );

  return (
    <form onSubmit={submit} className={box}>
      {state === "error" && (
        <div role="alert" className="mb-[18px] rounded-lg border border-[#f2c6c6] bg-[#fdeeee] px-3 py-3 text-[13px]">
          <p className="text-[#a3302a]">{p.errorTitle}</p>
          <ul className="mt-1.5 list-disc pl-[18px] text-[#c0392b]">
            {errors.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-1 gap-x-[18px] gap-y-4 md:grid-cols-2">
        {fields.map((f) => (
          <Field key={f.id} f={f} />
        ))}
      </div>
      {(p.privacyNote || p.privacyLinkText) && (
        <p className="mt-[18px] text-[13px] text-slate">
          {p.privacyNote}{" "}
          {p.privacyLinkText && (
            <SmartLink to={p.privacyLink} className="text-gold-link underline underline-offset-2 hover:no-underline">
              {p.privacyLinkText}
            </SmartLink>
          )}
        </p>
      )}
      <button className={cn(goldBtn, "mt-4 cursor-pointer px-[22px] disabled:cursor-wait disabled:opacity-70")} disabled={state === "busy"}>
        {state === "busy" ? UI.sending : p.submitText || UI.send}
        <Icon name="arrow-right-white-14" size={14} />
      </button>
    </form>
  );
}
