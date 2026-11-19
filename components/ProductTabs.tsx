"use client";
// Product page tabs (Figma "More (tabs)", node 76:369): Overview (product description), Specifications
// (the product's dynamic attributes) and any extra tab from the CMS page "product" (e.g. "Delivery & Ordering").
// Panels are rendered on the server and passed in; empty tabs are left out by the page.
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export function ProductTabs({ tabs }: { tabs: { label: string; panel: React.ReactNode }[] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  if (!tabs.length) return null;

  function onKey(e: React.KeyboardEvent) {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (active + d + tabs.length) % tabs.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  }

  return (
    <section className="pt-10 md:pt-12">
      <div role="tablist" className="flex flex-wrap gap-x-1 border-b border-[#e3e8ef]" onKeyDown={onKey}>
        {tabs.map((t, n) => (
          <button
            key={t.label}
            id={`${id}-tab-${n}`}
            role="tab"
            type="button"
            aria-selected={n === active}
            aria-controls={`${id}-panel-${n}`}
            tabIndex={n === active ? 0 : -1}
            onClick={() => setActive(n)}
            className={cn(
              "-mb-px cursor-pointer border-b-[3px] px-[18px] py-3 text-[15px] font-semibold whitespace-nowrap transition",
              n === active ? "border-gold-btn text-navy-deep" : "border-transparent text-slate hover:text-navy-deep",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, n) => (
        <div key={t.label} id={`${id}-panel-${n}`} role="tabpanel" aria-labelledby={`${id}-tab-${n}`} hidden={n !== active} className="pt-6">
          {t.panel}
        </div>
      ))}
    </section>
  );
}
