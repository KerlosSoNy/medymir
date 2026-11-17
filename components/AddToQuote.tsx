"use client";
import { useState } from "react";
import { UI } from "@/lib/ui";
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
      <button className="btn btn-sm btn-dark" onClick={go} disabled={state === "busy"}>
        {label}
      </button>
    );
  return (
    <div className="atq">
      <div className="qty" aria-label={UI.quantity}>
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="−">
          −
        </button>
        <input type="number" min={1} max={99} value={qty} onChange={(e) => setQty(Math.min(99, Math.max(1, Number(e.target.value) || 1)))} aria-label={UI.quantity} />
        <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="+">
          +
        </button>
      </div>
      <button className="btn btn-gold btn-lg" onClick={go} disabled={state === "busy"}>
        {label}
      </button>
      {state === "error" && <p className="notice err">{err}</p>}
    </div>
  );
}
