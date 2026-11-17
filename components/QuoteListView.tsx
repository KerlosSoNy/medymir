"use client";
import Link from "next/link";
import { UI } from "@/lib/ui";
import { useQuoteList } from "./QuoteListProvider";

function optionNames(item: any): string[] {
  const m = item?.modifiers;
  if (Array.isArray(m)) return m.map((x) => x?.name).filter(Boolean);
  if (m && typeof m === "object") return Object.values(m).map((x: any) => x?.name).filter(Boolean);
  return [];
}

export function QuoteListView() {
  const { data, loading, error, update, remove } = useQuoteList();
  if (loading && !data) return <p className="muted">{UI.loading}</p>;
  const items = data?.items ?? [];
  if (!items.length)
    return (
      <div className="empty-state">
        <p>
          <strong>{UI.quoteEmptyTitle}</strong>
        </p>
        <p className="muted">{UI.quoteEmptyText}</p>
        <div className="empty-actions">
          <Link href="/products" className="btn btn-dark">
            {UI.continueBrowsing}
          </Link>
          <Link href="/#quote" className="btn btn-outline">
            {UI.requestQuote}
          </Link>
        </div>
      </div>
    );
  return (
    <div className="qlist">
      {error && <p className="notice err">{error}</p>}
      <ul>
        {items.map((it) => (
          <li key={it.id} className="qline">
            {it.image_url ? <img src={it.image_url} alt="" width={64} height={64} /> : <span className="pcard-ph sm" />}
            <div className="qline-info">
              <Link href={`/product/${it.menu_item_id}`}>{it.name}</Link>
              {it.sku && <small>REF {it.sku}</small>}
              {optionNames(it).length > 0 && <small>{optionNames(it).join(" · ")}</small>}
            </div>
            <div className="qty">
              <button aria-label="−" onClick={() => (it.quantity > 1 ? update(it.id, it.quantity - 1) : remove(it.id)).catch(() => {})}>
                −
              </button>
              <span>{it.quantity}</span>
              <button aria-label="+" onClick={() => update(it.id, Math.min(99, it.quantity + 1)).catch(() => {})}>
                +
              </button>
            </div>
            <button className="link-btn" onClick={() => remove(it.id).catch(() => {})}>
              {UI.remove}
            </button>
          </li>
        ))}
      </ul>
      <Link href="/#quote" className="btn btn-gold btn-lg">
        {UI.requestQuote}
        <img src="/icons/arrow-right-submit.svg" width={16} height={16} alt="" />
      </Link>
    </div>
  );
}
