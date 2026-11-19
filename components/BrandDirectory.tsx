"use client";
// Brands page directory (Figma "Toolbar" 17:407 + "Brand grid" 17:419 + "Request a brand" 17:769): search box and
// sort, then one Card/Brand per brand of the store's Brand list (logo, name, "View store"), then an optional
// "Don't see a brand?" bar whose texts come from the CMS section.
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { UI } from "@/lib/ui";
import { SmartLink, Icon } from "./SmartLink";

export interface DirectoryBrand {
  name: string;
  slug: string;
  logo: string | null;
}

export function BrandDirectory({
  brands,
  request,
}: {
  brands: DirectoryBrand[];
  request?: { title: string; subtitle: string; buttonText: string; link: string } | null;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("");
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const hits = brands.filter((b) => !term || b.name.toLowerCase().includes(term));
    if (sort === "az") return [...hits].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") return [...hits].sort((a, b) => b.name.localeCompare(a.name));
    return hits;
  }, [brands, q, sort]);

  return (
    <div className="grid gap-[18px]">
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex h-[42px] w-full items-center gap-3 rounded-lg border-[1.5px] border-input-border bg-white px-4 focus-within:border-blue sm:w-[367px]">
          <Icon name="br-search" size={17} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={UI.brandSearch}
            aria-label={UI.brandSearchLabel}
            className="min-w-0 flex-1 bg-transparent text-sm text-ink-2 placeholder:text-brandgrey focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2.5 self-end text-[13.5px] text-muted sm:self-auto">
          {UI.sortBy}
          <span className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-[42px] cursor-pointer appearance-none rounded-lg border border-input-border bg-white pr-9 pl-3.5 text-sm font-medium text-ink-2 focus:border-blue focus:outline-none"
            >
              {UI.brandSort.map(([v, label]) => (
                <option key={v} value={v}>
                  {label}
                </option>
              ))}
            </select>
            <img src="/icons/br-chevron-down.svg" width={13} height={13} alt="" className="pointer-events-none absolute top-1/2 right-3 size-[13px] -translate-y-1/2" />
          </span>
        </label>
      </div>

      {list.length === 0 ? (
        <p className="py-6 text-center text-[15px] text-muted">{UI.noBrandsFound}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {list.map((b) => (
            <li key={b.slug} className="min-w-0">
              <Link
                href={`/brand/${b.slug}`}
                className="group flex h-full flex-col items-center gap-1.5 rounded-xl border border-[#e3e7ed] bg-white px-3 pt-5 pb-4 text-center transition hover:border-[#c5cdd8] hover:shadow-[0_12px_30px_rgb(15_31_64/0.1)]"
              >
                <span className="flex h-[52px] w-full items-center justify-center overflow-hidden">
                  {b.logo ? (
                    <img src={b.logo} alt="" loading="lazy" className="max-h-full max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-[1.04]" />
                  ) : (
                    <span className="font-head text-lg leading-tight font-semibold break-words text-ink-2 sm:text-[21px]">{b.name}</span>
                  )}
                </span>
                <span className="mt-1 text-[15px] font-semibold break-words text-ink-2">{b.name}</span>
                <span className="flex items-center gap-1.5 text-[13.5px] text-muted-2 group-hover:text-ink-2">
                  {UI.viewStore}
                  <img src="/icons/chevron-right-grey.svg" width={13} height={13} alt="" className="size-[13px] shrink-0 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {request && (request.title || request.buttonText) && (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-[#dce5f3] bg-[#eef3fb] px-[22px] py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <Icon name="br-shield-question" size={24} />
            <div className="grid gap-[3px]">
              {request.title && <p className="font-head text-[17px] font-bold text-ink-2">{request.title}</p>}
              {request.subtitle && <p className="text-[13.5px] text-[#4b5565]">{request.subtitle}</p>}
            </div>
          </div>
          {request.buttonText && (
            <SmartLink
              to={request.link}
              className={cn(
                "flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border-[1.5px] border-ink-2 bg-white px-5 py-[11px] text-sm font-semibold text-ink-2 transition hover:bg-surface-alt md:w-auto",
              )}
            >
              {request.buttonText}
              <Icon name="br-arrow-dark" size={14} />
            </SmartLink>
          )}
        </div>
      )}
    </div>
  );
}
