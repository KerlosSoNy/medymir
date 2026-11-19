"use client";
import { useState } from "react";
import { UI } from "@/lib/ui";
import { btn, notice } from "@/lib/styles";
import { useQuoteList } from "./QuoteListProvider";

/** "Add to quote list" button on product cards (adds 1; the product page has its own box in ProductBuy). */
export function AddToQuote({ productId, modifiers }: { productId: string; modifiers?: any }) {
  const { add } = useQuoteList();
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function go() {
    setState("busy");
    setErr("");
    try {
      await add({ menu_item_id: productId, quantity: 1, ...(modifiers ? { modifiers } : {}) });
      setState("done");
      setTimeout(() => setState("idle"), 1800);
    } catch (e: any) {
      setErr(e?.message ?? UI.error);
      setState("error");
    }
  }

  const label = state === "busy" ? UI.adding : state === "done" ? `✓ ${UI.added}` : UI.addToQuote;
  return (
    <>
      <button
        type="button"
        className={btn("dark", "sm", "w-full rounded-lg min-h-[38px] px-2.5 text-xs sm:min-h-[42px] sm:px-3.5 sm:text-sm whitespace-normal text-center")}
        onClick={go}
        disabled={state === "busy"}
      >
        {state === "idle" && <img src="/icons/plus-white.svg" width={12} height={12} alt="" className="hidden size-3 shrink-0 sm:block" />}
        {label}
      </button>
      {state === "error" && <p className={`${notice("err")} mt-2 text-xs`}>{err}</p>}
    </>
  );
}
