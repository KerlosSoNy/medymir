"use client";
import { useState } from "react";
import { UI } from "@/lib/ui";
import { btn, notice } from "@/lib/styles";
import { useQuoteList } from "./QuoteListProvider";

export function AddToQuote({ productId, compact, modifiers }: { productId: string; compact?: boolean; modifiers?: any }) {
  const { add } = useQuoteList();
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function go() {
    setState("busy");
    setErr("");
    try {
      await add({ menu_item_id: productId, quantity: qty, ...(modifiers ? { modifiers } : {}) });
      setState("done");
      setTimeout(() => setState("idle"), 1800);
    } catch (e: any) {
      setErr(e?.message ?? UI.error);
      setState("error");
    }
  }

  const label = state === "busy" ? UI.adding : state === "done" ? `✓ ${UI.added}` : UI.addToQuote;
  if (compact)
    return (
      <button
        type="button"
        className={btn("dark", "sm", "w-full rounded-lg min-h-[38px] px-2.5 text-xs sm:min-h-[42px] sm:px-3.5 sm:text-sm whitespace-normal text-center")}
        onClick={go}
        disabled={state === "busy"}
      >
        {state === "idle" && <img src="/icons/plus-white.svg" width={12} height={12} alt="" className="hidden size-3 shrink-0 sm:block" />}
        {label}
      </button>
    );
  return (
    <div className="flex flex-wrap items-stretch gap-3">
      <div className={qtyBox} aria-label={UI.quantity}>
        <button type="button" className={qtyBtn} onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="−">
          −
        </button>
        <input
          type="number"
          min={1}
          max={99}
          value={qty}
          onChange={(e) => setQty(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
          aria-label={UI.quantity}
          className="w-11 border-0 bg-transparent text-center font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button type="button" className={qtyBtn} onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="+">
          +
        </button>
      </div>
      <button type="button" className={btn("gold", "lg", "grow basis-44 rounded-lg px-5 text-[15px] sm:grow-0 sm:px-7 sm:text-base")} onClick={go} disabled={state === "busy"}>
        {label}
      </button>
      {state === "error" && <p className={`${notice("err")} w-full`}>{err}</p>}
    </div>
  );
}

/** Quantity stepper (− 1 +), shared with the quote list. */
export const qtyBox = "inline-flex items-center overflow-hidden rounded-full border border-input-border bg-white";
export const qtyBtn = "grid min-h-10 w-10 cursor-pointer place-items-center border-0 bg-transparent text-lg hover:bg-surface-alt";
