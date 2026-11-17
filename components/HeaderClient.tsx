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
      className="search"
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
      <label className="search-cat">
        <span className="sr-only">{UI.categories}</span>
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">{UI.all}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <img src="/icons/chevron-down.svg" width={14} height={14} alt="" />
      </label>
      <input name="q" type="search" placeholder={UI.searchPlaceholder} aria-label={UI.searchPlaceholder} />
      <button type="submit" className="search-btn" aria-label={UI.searchPlaceholder}>
        <img src="/icons/search-white.svg" width={19} height={19} alt="" />
      </button>
    </form>
  );
}

export function AccountLink() {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => setName(getAuth()?.customer?.name ?? null), []);
  return (
    <Link href="/account" className="hdr-action">
      <img src="/icons/user.svg" width={22} height={22} alt="" />
      <span className="hdr-action-text">
        <small>{name ? `Hello, ${name.split(" ")[0]}` : UI.signInHello}</small>
        <strong>{UI.accountAndQuotes}</strong>
      </span>
    </Link>
  );
}

export function QuoteListLink() {
  const { count } = useQuoteList();
  return (
    <Link href="/quote" className="hdr-action">
      <span className="quote-icon">
        <img src="/icons/clipboard.svg" width={22} height={22} alt="" />
        <span className="quote-badge" aria-label={`${count}`}>
          {count}
        </span>
      </span>
      <span className="hdr-action-text">
        <small>{UI.your}</small>
        <strong>{UI.quoteList}</strong>
      </span>
    </Link>
  );
}
