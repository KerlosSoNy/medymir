"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth } from "@/lib/client-api";
import { UI } from "@/lib/ui";
import { useQuoteList } from "./QuoteListProvider";

export function HeaderSearch({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter();
  const [cat, setCat] = useState("");
  return (
    <form
      className="flex h-10 overflow-hidden rounded-lg border border-[#cfd6e0] md:h-[45px] md:rounded-[9px] md:border-input-border"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
        const p = new URLSearchParams();
        if (q) p.set("q", q);
        if (cat) p.set("category_id", cat);
        router.push(`/search${p.size ? `?${p}` : ""}`);
      }}
    >
      <label className="relative hidden w-[124px] shrink-0 bg-[#f3f5f8] md:block lg:w-[150px]">
        <span className="sr-only">{UI.categories}</span>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="size-full cursor-pointer appearance-none border-0 bg-transparent pl-4 pr-[34px] text-[13px] text-ink-3"
        >
          <option value="">{UI.all}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <img
          src="/icons/chevron-down.svg"
          width={14}
          height={14}
          alt=""
          className="pointer-events-none absolute right-3 top-1/2 size-3.5 max-w-none -translate-y-1/2"
        />
      </label>
      <input
        name="q"
        type="search"
        placeholder={UI.searchPlaceholder}
        aria-label={UI.searchPlaceholder}
        className="min-w-0 flex-1 border-0 bg-white pl-3 pr-3 text-[15px] outline-none placeholder:text-[#6b7280] md:pl-3.5"
      />
      <button
        type="submit"
        className="flex w-[46px] shrink-0 cursor-pointer items-center justify-center border-0 bg-dark md:w-14"
        aria-label={UI.searchPlaceholder}
      >
        <img src="/icons/search-white.svg" width={19} height={19} alt="" className="size-[19px] max-w-none shrink-0" />
      </button>
    </form>
  );
}

const action = "flex items-center gap-2.5";
/** "Hello, sign in / Account & quotes" text: only on wide screens (icons alone below 1281px). */
const actionText = "hidden flex-col leading-tight xl:flex";

export function AccountLink() {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => setName(getAuth()?.customer?.name ?? null), []);
  return (
    <Link href="/account" className={action} aria-label={UI.accountAndQuotes}>
      <img src="/icons/user.svg" width={22} height={22} alt="" className="size-[22px] max-w-none shrink-0" />
      <span className={actionText}>
        <small className="text-[11px] text-muted">{name ? `Hello, ${name.split(" ")[0]}` : UI.signInHello}</small>
        <strong className="text-[13px] font-semibold text-ink-2">{UI.accountAndQuotes}</strong>
      </span>
    </Link>
  );
}

export function QuoteListLink() {
  const { count } = useQuoteList();
  return (
    <Link href="/quote" className={action} aria-label={`${UI.quoteList} (${count})`}>
      <span className="relative size-[26px] shrink-0 pt-1">
        <img src="/icons/clipboard.svg" width={22} height={22} alt="" className="size-[22px] max-w-none shrink-0" />
        <span className="absolute -top-1.5 left-2.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      </span>
      <span className={actionText}>
        <small className="text-[11px] text-muted">{UI.your}</small>
        <strong className="text-[13px] font-semibold text-ink-2">{UI.quoteList}</strong>
      </span>
    </Link>
  );
}
