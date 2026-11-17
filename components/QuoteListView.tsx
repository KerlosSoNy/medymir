"use client";
import Link from "next/link";
import { UI } from "@/lib/ui";
import { btn, linkBtn, notice } from "@/lib/styles";
import { qtyBox, qtyBtn } from "./AddToQuote";
import { ProductPhoto } from "./ProductCard";
import { useQuoteList } from "./QuoteListProvider";

function optionNames(item: any): string[] {
  const m = item?.modifiers;
  if (Array.isArray(m)) return m.map((x) => x?.name).filter(Boolean);
  if (m && typeof m === "object") return Object.values(m).map((x: any) => x?.name).filter(Boolean);
  return [];
}

export function QuoteListView() {
  const { data, loading, error, update, remove } = useQuoteList();
  if (loading && !data) return <p className="text-muted">{UI.loading}</p>;
  const items = data?.items ?? [];
  if (!items.length)
    return (
      <div className="mb-14 flex flex-col items-center gap-2.5 rounded-2xl border border-line px-4 pt-12 pb-14 text-center md:mb-[72px]">
        <p>
          <strong>{UI.quoteEmptyTitle}</strong>
        </p>
        <p className="text-muted">{UI.quoteEmptyText}</p>
        <div className="mt-3 flex w-full flex-wrap justify-center gap-3">
          <Link href="/products" className={btn("dark")}>
            {UI.continueBrowsing}
          </Link>
          <Link href="/#quote" className={btn("outline")}>
            {UI.requestQuote}
          </Link>
        </div>
      </div>
    );
  return (
    <div className="mb-14 md:mb-[72px]">
      {error && <p className={`${notice("err")} mb-4`}>{error}</p>}
      <section className="rounded-2xl border border-line bg-white p-4 sm:p-6">
        <h2 className="mb-4 border-b border-line pb-4 font-head text-lg font-bold text-ink-2">{UI.itemsForQuotation(items.length)}</h2>
        <ul className="m-0 grid grid-cols-1 list-none gap-3 p-0">
          {items.map((it) => (
            <li
              key={it.id}
              className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-line pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[64px_minmax(0,1fr)_auto_auto]"
            >
              <ProductPhoto src={it.image_url} alt="" size="sm" className="size-14 sm:size-16" />
              <div className="grid grid-cols-1 min-w-0 gap-0.5">
                <Link href={`/product/${it.menu_item_id}`} className="font-semibold hover:text-blue-link">
                  {it.name}
                </Link>
                {it.sku && <small className="text-xs text-muted">REF {it.sku}</small>}
                {optionNames(it).length > 0 && <small className="text-xs text-muted">{optionNames(it).join(" · ")}</small>}
              </div>
              <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-auto sm:contents">
                <div className={qtyBox}>
                  <button
                    type="button"
                    className={qtyBtn}
                    aria-label="−"
                    onClick={() => (it.quantity > 1 ? update(it.id, it.quantity - 1) : remove(it.id)).catch(() => {})}
                  >
                    −
                  </button>
                  <span className="w-11 text-center font-semibold">{it.quantity}</span>
                  <button type="button" className={qtyBtn} aria-label="+" onClick={() => update(it.id, Math.min(99, it.quantity + 1)).catch(() => {})}>
                    +
                  </button>
                </div>
                <button type="button" className={linkBtn} onClick={() => remove(it.id).catch(() => {})}>
                  {UI.remove}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <Link href="/#quote" className={btn("gold", "lg", "mt-6 w-full rounded-lg sm:w-auto")}>
        {UI.requestQuote}
        <img src="/icons/arrow-right-submit.svg" width={16} height={16} alt="" className="size-4 shrink-0" />
      </Link>
    </div>
  );
}
