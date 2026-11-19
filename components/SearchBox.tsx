"use client";
// Search page box (Figma "Search box", node 94:816): text field with a clear ×, gold search button.
// Submitting starts a new search (/search?q=…), keeping the chosen tab (category_id) if there is one.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { UI } from "@/lib/ui";
import { Icon } from "./SmartLink";

export const SEARCH_INPUT_ID = "search-page-q";

export function SearchBox({ q, categoryId }: { q: string; categoryId?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(q);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <form
      role="search"
      className="flex h-12 w-full max-w-[620px] overflow-hidden rounded-[10px] border border-[#cfd6e0] bg-white focus-within:border-blue"
      onSubmit={(e) => {
        e.preventDefault();
        const p = new URLSearchParams();
        if (value.trim()) p.set("q", value.trim());
        if (categoryId) p.set("category_id", categoryId);
        router.push(`/search${p.size ? `?${p}` : ""}`);
      }}
    >
      <input
        ref={ref}
        id={SEARCH_INPUT_ID}
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={UI.searchBoxPlaceholder}
        aria-label={UI.searchBoxPlaceholder}
        className="min-w-0 flex-1 px-3.5 text-[15px] text-navy-deep placeholder:text-[#7a8699] focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          aria-label={UI.clearSearch}
          onClick={() => (setValue(""), ref.current?.focus())}
          className="grid w-10 shrink-0 cursor-pointer place-items-center"
        >
          <Icon name="sr-clear" size={12} />
        </button>
      )}
      <button type="submit" aria-label={UI.search} className="grid w-[46px] shrink-0 cursor-pointer place-items-center bg-[#b8862b] transition hover:brightness-110">
        <Icon name="sr-search" size={18} />
      </button>
    </form>
  );
}

/** "No products found" box (Figma 94:834). "Search again" puts the cursor back in the search box. */
export function NoResults({ q }: { q: string }) {
  return (
    <div className="grid justify-items-center rounded-xl border border-dashed border-[#d5dce6] bg-white px-5 py-10 text-center md:px-10 md:py-11">
      <Icon name="sr-none" size={44} />
      <h2 className="mt-3.5 font-head text-xl font-bold break-words text-navy-deep md:text-[22px]">{UI.noResultsFor(q)}</h2>
      <p className="mt-2 max-w-[460px] text-[15px] leading-[1.55] text-slate">{UI.noResultsText}</p>
      <div className="mt-5 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById(SEARCH_INPUT_ID) as HTMLInputElement | null;
            el?.focus();
            el?.select();
          }}
          className="h-11 cursor-pointer rounded-lg bg-[#b8862b] px-[22px] text-[15px] font-bold text-white transition hover:brightness-110"
        >
          {UI.searchAgain}
        </button>
        <Link href="/categories" className="flex h-11 items-center justify-center rounded-lg border-[1.5px] border-navy-deep bg-white px-[22px] text-[15px] font-bold text-navy-deep transition hover:bg-surface-alt">
          {UI.browseAllCategories}
        </Link>
      </div>
    </div>
  );
}
