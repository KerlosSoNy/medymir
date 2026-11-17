"use client";
// Option pickers (size, pack, …) + quantity + "Add to quote list" for the product page.
import { useState } from "react";
import { UI } from "@/lib/ui";
import { AddToQuote } from "./AddToQuote";

interface Group {
  id: string;
  name: string;
  required: boolean;
  options: { id: string; name: string; isDefault: boolean }[];
}

export function ProductBuy({ productId, groups }: { productId: string; groups: Group[] }) {
  const [sel, setSel] = useState<Record<string, string>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, g.options.find((o) => o.isDefault)?.id ?? (g.required ? g.options[0]?.id ?? "" : "")])),
  );
  const modifiers: Record<string, { id: string; name: string; price_modifier: number }> = {};
  for (const g of groups) {
    const o = g.options.find((x) => x.id === sel[g.id]);
    if (o) modifiers[g.id] = { id: o.id, name: o.name, price_modifier: 0 };
  }
  return (
    <div className="buy">
      {groups.map((g) => (
        <label key={g.id} className="buy-opt">
          <span>
            {g.name} <small>{g.required ? UI.required : UI.optional}</small>
          </span>
          <div className="qf-select">
            <select value={sel[g.id]} onChange={(e) => setSel((s) => ({ ...s, [g.id]: e.target.value }))}>
              {!g.required && <option value="">—</option>}
              {g.options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <img src="/icons/form-chevron-down.svg" width={15} height={15} alt="" />
          </div>
        </label>
      ))}
      <AddToQuote productId={productId} modifiers={groups.length ? modifiers : undefined} />
    </div>
  );
}
