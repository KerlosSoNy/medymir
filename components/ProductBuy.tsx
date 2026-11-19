"use client";
// Product page buying box (Figma "Product — Ready stock / Quotation / Sold out", nodes 76:330–76:353, 76:559–76:600,
// 76:820–76:837): option pickers (size, cartridge colour, …), quantity stepper with the pack unit beside it,
// a gold button and an outline button. There is no checkout: every button puts the line in the quote list
// (the store's cart); the outline button (and "Request availability") then opens the quote list to send it.
//   stock   → "Add to quote list" + "Request bulk pricing"
//   quote   → "Add to quote list" + "Request a quotation"   (quantity row is called "Required quantity")
//   soldout → "Request availability" + "Request bulk pricing"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { notice, pdRow as rowCls, pdRowLabel as rowLabel } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { useQuoteList } from "./QuoteListProvider";
import { Icon } from "./SmartLink";

export interface OptionGroup {
  id: string;
  name: string;
  required: boolean;
  options: { id: string; name: string; isDefault: boolean }[];
}


const cell = "grid size-11 cursor-pointer place-items-center bg-white text-xl font-semibold text-navy-deep transition hover:bg-surface-alt disabled:cursor-default disabled:text-[#a3acba] disabled:hover:bg-white";
const bigBtn = "flex h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border-[1.5px] px-5 text-base font-bold transition disabled:cursor-wait disabled:opacity-80";

export function ProductBuy({
  productId,
  groups,
  mode,
  unit,
  max = 999,
}: {
  productId: string;
  groups: OptionGroup[];
  mode: "stock" | "quote" | "soldout";
  /** Shown in the grey box beside the stepper (the product's Pack size or Unit detail). */
  unit?: string;
  max?: number;
}) {
  const router = useRouter();
  const { add } = useQuoteList();
  const [sel, setSel] = useState<Record<string, string>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, g.options.find((o) => o.isDefault)?.id ?? (g.required ? (g.options[0]?.id ?? "") : "")])),
  );
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const modifiers: Record<string, { id: string; name: string; price_modifier: number }> = {};
  for (const g of groups) {
    const o = g.options.find((x) => x.id === sel[g.id]);
    if (o) modifiers[g.id] = { id: o.id, name: o.name, price_modifier: 0 };
  }

  /** Adds the line to the quote list; `thenOpen` goes to the quote list afterwards (to send the request). */
  async function go(thenOpen: boolean) {
    setState("busy");
    setErr("");
    try {
      await add({ menu_item_id: productId, quantity: qty, ...(groups.length ? { modifiers } : {}) });
      if (thenOpen) return router.push("/quote");
      setState("done");
      setTimeout(() => setState("idle"), 1800);
    } catch (e: any) {
      // A sold-out line may be refused by the store: still open the quote form so they can ask for it.
      if (thenOpen) return router.push("/quote");
      setErr(e?.message ?? UI.error);
      setState("error");
    }
  }

  const busy = state === "busy";
  const primary = mode === "soldout" ? UI.requestAvailability : UI.addToQuote;
  const secondary = mode === "quote" ? UI.requestQuote : UI.requestBulkPricing;

  return (
    <div className="grid grid-cols-1 gap-3.5">
      {groups.map((g) => (
        <label key={g.id} className={rowCls}>
          <span className={rowLabel}>{g.name}</span>
          <span className="relative min-w-0 flex-1">
            <select
              className="h-[46px] w-full cursor-pointer appearance-none truncate rounded-lg border border-[#cfd6e0] bg-white pr-9 pl-3 text-[15px] font-medium text-navy-deep focus:border-blue focus:ring-2 focus:ring-blue/20 focus:outline-none"
              value={sel[g.id]}
              required={g.required}
              onChange={(e) => setSel((s) => ({ ...s, [g.id]: e.target.value }))}
            >
              {!g.required && <option value="">{UI.selectOne}</option>}
              {g.options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <img src="/icons/pd-chevron.svg" width={12} height={8} alt="" className="pointer-events-none absolute top-1/2 right-3 h-2 w-3 shrink-0 -translate-y-1/2" />
          </span>
        </label>
      ))}

      <div className={rowCls}>
        <span className={rowLabel}>{mode === "quote" ? UI.requiredQuantity : UI.quantity}</span>
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <div className="flex overflow-hidden rounded-lg border border-[#cfd6e0]" role="group" aria-label={UI.quantity}>
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
              className="h-11 w-[60px] border-x border-[#cfd6e0] bg-white text-center text-[15px] font-medium text-navy-deep [appearance:textfield] focus:outline-none sm:w-[76px] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button type="button" className={cell} onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max} aria-label="+">
              +
            </button>
          </div>
          {unit && (
            <span className="flex h-[46px] max-w-full items-center truncate rounded-lg border border-[#e3e8ef] bg-[#f6f8fb] px-3.5 text-sm text-slate">{unit}</span>
          )}
        </div>
      </div>

      <div className="mt-1.5 grid grid-cols-1 gap-3">
        <button type="button" className={cn(bigBtn, "border-gold-btn bg-gold-btn text-white hover:brightness-110")} onClick={() => go(mode === "soldout")} disabled={busy}>
          {state === "idle" && mode !== "soldout" && <Icon name="pd-list" size={20} />}
          {busy ? UI.adding : state === "done" ? `✓ ${UI.added}` : primary}
        </button>
        <button type="button" className={cn(bigBtn, "border-navy-deep bg-white text-navy-deep hover:bg-surface-alt")} onClick={() => go(true)} disabled={busy}>
          {secondary}
        </button>
        {state === "error" && <p className={notice("err")}>{err}</p>}
      </div>
    </div>
  );
}
