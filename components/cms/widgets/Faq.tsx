// FAQ / Accordion (faq-accordion).
import { tr } from "@/lib/format";
import { type P, html } from "./shared";

/* ---------- generic widgets ---------- */
export function Faq({ w }: P) {
  const items: any[] = w.items ?? [];
  if (!items.length) return null;
  return (
    <div>
      {w.title && <h2 className="mb-4 font-head text-[26px] font-bold text-ink lg:text-[34px]">{tr(w.title)}</h2>}
      {items.map((it, i) => (
        <details key={i} className="group border-b border-line py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink-2 [&::-webkit-details-marker]:hidden">
            {tr(it.question)}
            <img src="/icons/chevron-down.svg" width={14} height={14} alt="" className="block shrink-0 grow-0 max-w-none size-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <div className="rich pt-3" dangerouslySetInnerHTML={{ __html: html(it.answer) }} />
        </details>
      ))}
    </div>
  );
}
