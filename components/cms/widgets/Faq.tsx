// FAQ / Accordion (faq-accordion). Variant "topics" → FaqTopics (FAQ page: search, topic buttons, questions).
import { tr } from "@/lib/format";
import { FaqTopics } from "../FaqTopics";
import { type P, html } from "./shared";

/* ---------- generic widgets ---------- */
export function Faq({ w }: P) {
  const items: any[] = w.items ?? [];
  if (!items.length) return null;
  if (w.variant === "topics")
    return (
      <FaqTopics
        items={items.map((it) => ({ question: tr(it.question), answer: html(it.answer), topic: tr(it.topic) }))}
        topics={(Array.isArray(w.topics) ? w.topics : []).map((t: unknown) => tr(t)).filter(Boolean)}
        allLabel={tr(w.allTopicsLabel)}
        searchPlaceholder={tr(w.searchPlaceholder)}
        noResults={tr(w.noResultsText)}
      />
    );
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
