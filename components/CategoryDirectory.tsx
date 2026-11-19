"use client";
// All categories page directory (Figma "Search wrap" 80:318 + "Columns" 80:325): a search box that filters the
// numbered category cards, shown in three titled columns. Cards and specialties are the mega-menu groups
// (lib/menu.ts, the store has no sub-categories yet); each specialty opens its store category with a search,
// "View category" opens the category. Groups whose store category doesn't exist are left out.
import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORY_COLUMNS, MENU_GROUPS, groupByTitle, subCategoryHref } from "@/lib/menu";
import { UI } from "@/lib/ui";
import { Icon } from "./SmartLink";

export function CategoryDirectory({ slugs }: { slugs: string[] }) {
  const [q, setQ] = useState("");
  const columns = useMemo(() => {
    // Match the start of a word ("ent" finds "ENT" and "Enteral", not "Intervention").
    const term = q.trim();
    const re = term ? new RegExp(`(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i") : null;
    const hit = (s: string) => !re || re.test(s);
    return CATEGORY_COLUMNS.map((col) => ({
      title: col.title,
      cards: col.groups
        .map((t) => groupByTitle(t))
        .filter((g): g is NonNullable<typeof g> => !!g && slugs.includes(g.category))
        .map((g) => {
          const titleHit = hit(g.title);
          const items = titleHit ? g.items : g.items.filter(hit);
          return { ...g, n: MENU_GROUPS.indexOf(g) + 1, items, show: titleHit || items.length > 0 };
        })
        .filter((g) => g.show),
    })).filter((c) => c.cards.length > 0);
  }, [q, slugs]);

  return (
    <div id="categories" className="grid scroll-mt-6 gap-10">
      <label className="flex h-[50px] items-center gap-3 rounded-xl border border-[#d5dce6] bg-white pl-4 focus-within:border-blue">
        <Icon name="ct-search" size={20} />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={UI.findCategory}
          aria-label={UI.findCategory}
          className="h-full min-w-0 flex-1 bg-transparent pr-4 text-[15px] text-navy-deep placeholder:text-[#7a8699] focus:outline-none"
        />
      </label>

      {columns.length === 0 ? (
        <p className="py-8 text-center text-[15px] text-muted">{UI.noCategoryMatch}</p>
      ) : (
        <div className="grid grid-cols-1 items-start gap-x-7 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
          {columns.map((col) => (
            <section key={col.title} className="grid gap-3.5">
              <h2 className="text-[13px] font-bold tracking-[0.14em] text-[#9a6a12] uppercase">{col.title}</h2>
              {col.cards.map((g) => (
                <article key={g.title} className="rounded-xl border border-[#dfe5ee] bg-white px-[18px] pt-[18px] pb-4 shadow-[0_1px_2px_rgb(11_27_58/0.04)]">
                  <h3 className="flex items-center gap-3">
                    <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-navy-deep text-[13px] font-bold text-white">{g.n}</span>
                    <span className="font-head text-[16.5px] leading-[1.25] font-bold text-navy-deep">{g.title}</span>
                  </h3>
                  <ul className="grid gap-1 pt-3.5">
                    {g.items.map((item) => (
                      <li key={item}>
                        <Link href={subCategoryHref(g.category, item)} className="flex items-start gap-3 py-[3px] pl-0.5 text-[14.5px] leading-[1.35] text-[#2d3b55] hover:text-blue-link">
                          <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-[1.5px] bg-[#1f5fd6]" />
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/category/${g.category}`} className="mt-4 inline-flex items-center gap-2 text-[14.5px] font-semibold text-[#9a6a12] hover:underline">
                    {UI.viewCategory}
                    <Icon name="ct-arrow-gold" size={16} />
                  </Link>
                </article>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
