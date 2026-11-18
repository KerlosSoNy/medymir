"use client";
// Ready Stock offer card (Figma Card/Offer, e.g. node 92:286). Everything shown comes from the product in
// TheCoins: brand (Brand detail, with its logo), photo, name, description, Pack size and Unit details,
// price and compare-at price (→ "SAVE 25%"), and the stock quantity when stock is tracked. Texts around it
// (badge, note, button, footnote) come from the CMS section. A missing value is simply left out.
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { money, plain } from "@/lib/format";
import { notice } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { ProductPhoto } from "./ProductCard";
import { useQuoteList } from "./QuoteListProvider";
import { Icon } from "./SmartLink";

export interface OfferLabels {
  badge: string;
  note: string;
  button: string;
  footnote: string;
}

/** "box" → "boxes", "pack" → "packs" (English units only). */
const plural = (unit: string, n: number) => (n === 1 ? unit : /(x|s|ch|sh)$/i.test(unit) ? `${unit}es` : `${unit}s`);

const attr = (p: any, key: string): string => {
  const v = p.custom_attributes?.[key];
  return Array.isArray(v) ? v.filter(Boolean).join(", ") : v == null ? "" : String(v).trim();
};

const cell = "grid size-[30px] cursor-pointer place-items-center rounded-md border border-[#cfd6e0] bg-white text-base font-semibold text-[#202b40] disabled:cursor-default disabled:border-[#e3e8ef] disabled:text-[#a3acba]";

export function OfferCard({ p, currency, brandLogo, labels }: { p: any; currency: string | null; brandLogo: string | null; labels: OfferLabels }) {
  const { add } = useQuoteList();
  const href = `/product/${p.id}`;
  const brand = attr(p, "brand");
  const packSize = attr(p, "pack_size");
  const unit = attr(p, "unit");
  const price = Number(p.price);
  const was = Number(p.compare_at_price);
  const save = was > price && price > 0 ? Math.round((1 - price / was) * 100) : 0;
  const stock = p.track_inventory && p.stock_quantity != null ? Math.max(0, Number(p.stock_quantity)) : null;
  const available = p.is_available !== false && stock !== 0;
  const hasOptions = Array.isArray(p.modifiers) && p.modifiers.length > 0;
  const max = stock ?? 999;
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function reserve() {
    setState("busy");
    setErr("");
    try {
      await add({ menu_item_id: p.id, quantity: qty });
      setState("done");
      setTimeout(() => setState("idle"), 1800);
    } catch (e: any) {
      setErr(e?.message ?? UI.error);
      setState("error");
    }
  }

  return (
    <article className="group flex h-full min-w-0 flex-col rounded-xl border border-[#e6eaf0] bg-white p-[15px] transition hover:border-[#cfd6e0] hover:shadow-[0_12px_30px_rgb(15_31_64/0.1)]">
      <div className="flex min-h-[26px] items-center justify-between gap-2">
        <span className="flex min-w-0 items-center">
          {brandLogo ? (
            <img src={brandLogo} alt={brand} loading="lazy" className="h-[22px] max-w-[96px] object-contain object-left" />
          ) : (
            brand && <span className="truncate text-xs font-semibold text-[#202b40]">{brand}</span>
          )}
        </span>
        {labels.badge && (
          <span className="flex h-[22px] shrink-0 items-center gap-[5px] rounded-full bg-[#e3f4f1] px-2.5 text-[10.5px] font-bold tracking-[0.08em] whitespace-nowrap text-[#0f6b5c] uppercase">
            <Icon name="rs-badge-pin" size={11} />
            {labels.badge}
          </span>
        )}
      </div>

      <Link href={href} aria-label={p.name} className="relative mt-2 block">
        <ProductPhoto src={p.image_url} alt={p.name} className="h-[204px]" imgClassName="group-hover:scale-[1.04]" />
        {save > 0 && (
          <span className="absolute bottom-[4px] left-0 flex h-[21px] items-center rounded-md bg-[#b88a2e] px-2 text-[11px] font-bold tracking-[0.06em] text-white uppercase">
            {UI.save} {save}%
          </span>
        )}
      </Link>

      <h3 className="mt-3.5 line-clamp-2 font-head text-[15px] leading-[1.25] font-bold text-[#202b40]">
        <Link href={href} className="hover:text-blue-link">
          {p.name}
        </Link>
      </h3>
      {p.description && <p className="mt-1 line-clamp-1 text-[13px] text-[#5f6b7d]">{plain(p.description)}</p>}
      {packSize && (
        <p className="mt-0.5 text-[13px] text-[#5f6b7d]">
          {UI.packSize}: {packSize}
        </p>
      )}

      <div className="mt-auto pt-2">
        {price > 0 ? (
          <p className="flex flex-wrap items-baseline gap-x-2 whitespace-nowrap" title={UI.indicativePrice}>
            <span className="font-head text-[17px] font-bold text-[#8a6a23]">{money(price, currency)}</span>
            {save > 0 && <s className="text-[12.5px] text-[#8a94a6]">{money(was, currency)}</s>}
            {unit && <span className="text-[11.5px] text-[#5f6b7d]">/ {unit}</span>}
          </p>
        ) : (
          <p className="text-[13px] font-semibold text-[#202b40]">{UI.requestQuote}</p>
        )}
        {stock != null && stock > 0 && (
          <p className="mt-1 text-[13px] font-semibold text-[#0f6b5c]">
            {UI.available}: {stock} {unit ? plural(unit, stock) : ""}
          </p>
        )}
        {labels.note && <p className="mt-1 text-[12.5px] text-[#5f6b7d]">{labels.note}</p>}

        {!available ? (
          <p className="mt-[22px] flex items-center gap-2 text-[13px] text-[#8a6a23]">
            <img src="/icons/card-box.svg" width={14} height={14} alt="" className="size-3.5 shrink-0" />
            {UI.unavailable}
          </p>
        ) : hasOptions ? (
          <Link href={href} className="mt-[22px] flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#202b40] text-sm font-semibold text-white transition hover:brightness-125">
            {UI.viewDetails}
          </Link>
        ) : (
          <>
            <div className="mt-[22px] flex items-center gap-[7px]" aria-label={UI.quantity}>
              <button type="button" className={cell} onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="−">
                −
              </button>
              <input
                type="number"
                min={1}
                max={max}
                value={qty}
                onChange={(e) => setQty(Math.min(max, Math.max(1, Number(e.target.value) || 1)))}
                aria-label={UI.quantity}
                className="h-[30px] w-12 rounded-md border border-[#cfd6e0] bg-white text-center text-[13px] font-medium text-[#202b40] [appearance:textfield] focus:border-blue focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button type="button" className={cell} onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max} aria-label="+">
                +
              </button>
              {unit && <span className="text-[13px] text-[#3b4a63]">{unit}</span>}
            </div>
            <button
              type="button"
              onClick={reserve}
              disabled={state === "busy"}
              className={cn(
                "mt-2.5 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#202b40] text-sm font-semibold text-white transition hover:brightness-125 disabled:cursor-wait disabled:opacity-80",
              )}
            >
              {state === "busy" ? UI.adding : state === "done" ? `✓ ${UI.added}` : labels.button || UI.addToQuote}
              {state === "idle" && <Icon name="arrow-right-white-14" size={14} />}
            </button>
            {state === "error" && <p className={cn(notice("err"), "mt-2 text-xs")}>{err}</p>}
          </>
        )}
        {labels.footnote && <p className="mt-1.5 text-center text-[11.5px] text-[#5f6b7d]">{labels.footnote}</p>}
      </div>
    </article>
  );
}
