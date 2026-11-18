"use client";
// FAQ page list (Figma "FAQ — Desktop", node 98:80): search box, topic buttons and questions that open
// and close. Questions, answers, topics and labels all come from the CMS widget (faq-accordion, variant "topics").
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { UI } from "@/lib/ui";
import { Icon } from "../SmartLink";

export interface FaqItem {
  question: string;
  answer: string; // safe HTML (sanitised on the server)
  topic: string;
}

const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ");

export function FaqTopics(p: { items: FaqItem[]; topics: string[]; allLabel: string; searchPlaceholder: string; noResults: string }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return p.items
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => (!topic || it.topic === topic) && (!q || `${it.question} ${plain(it.answer)}`.toLowerCase().includes(q)));
  }, [p.items, query, topic]);

  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const chip = (label: string, value: string) => (
    <button
      key={value || "all"}
      type="button"
      aria-pressed={topic === value}
      onClick={() => setTopic(value)}
      className={cn(
        "h-9 cursor-pointer rounded-full border px-4 text-sm whitespace-nowrap transition",
        topic === value ? "border-navy-deep bg-navy-deep font-semibold text-white" : "border-[#d5dce6] bg-white font-medium text-navy-deep hover:border-navy-deep",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col items-center">
      <label className="flex h-[50px] w-full max-w-[620px] items-center gap-3 rounded-[10px] border border-[#cfd6e0] bg-white px-4 focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/15">
        <Icon name="faq-search" size={18} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={p.searchPlaceholder}
          aria-label={p.searchPlaceholder}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-navy-deep placeholder:text-[#7a8699] focus:outline-none"
        />
      </label>

      {p.topics.length > 0 && (
        <div className="mt-[18px] flex flex-wrap justify-center gap-2">
          {chip(p.allLabel || UI.all, "")}
          {p.topics.map((t) => chip(t, t))}
        </div>
      )}

      <div className="mt-[52px] flex w-full flex-col gap-[11px]">
        {shown.length === 0 && <p className="py-6 text-center text-slate">{p.noResults || UI.noResults}</p>}
        {shown.map(({ it, i }) => {
          const isOpen = open.has(i);
          return (
            <div key={i} className={cn("rounded-[10px] border bg-white", isOpen ? "border-[#c9d2de]" : "border-[#dce2ea]")}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => toggle(i)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-4 px-[17px] py-3 text-left font-head text-[15.5px] font-semibold text-navy-deep",
                    isOpen ? "min-h-14" : "min-h-12",
                  )}
                >
                  {it.question}
                  <Icon name={isOpen ? "faq-chevron-up" : "faq-chevron-down"} size={14} />
                </button>
              </h3>
              {isOpen && (
                <div id={`faq-a-${i}`} className="px-[18px] pb-[18px]">
                  <div className="flex flex-col gap-2.5 rounded-lg bg-surface-alt px-4 pt-3.5 pb-[18px]">
                    {it.topic && <p className="text-[11.5px] font-bold tracking-[0.06em] text-slate uppercase">{it.topic}</p>}
                    <div
                      className="text-[15px] leading-[1.62] text-navy-deep [&_a]:font-semibold [&_a]:text-gold-link [&_a]:underline [&_p+p]:mt-2.5 [&_strong]:font-bold"
                      dangerouslySetInnerHTML={{ __html: it.answer }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
