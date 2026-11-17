"use client";
// Renders filters[] from get-category-products exactly as returned (order, labels, types)
// and maps each to the API's query params via the URL. No client-side product filtering.
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Filter } from "@/lib/api";
import { cn } from "@/lib/cn";
import { tr } from "@/lib/format";
import { btn } from "@/lib/styles";

const fLabel = "mb-1.5 block text-[13px] font-semibold";
const fBlock = "m-0 grid grid-cols-1 border-0 p-0 gap-0";
const check = "flex cursor-pointer items-center gap-2 py-1 text-sm [&_input]:size-4 [&_input]:accent-dark";
const fInput = "w-full min-w-0 rounded-[7px] border border-input-border bg-white px-2.5 py-2 text-sm focus:border-blue focus:outline-none";
const chip = "cursor-pointer rounded-full border border-chip-border bg-chip-bg px-2.5 py-1 text-xs font-medium whitespace-nowrap text-ink-3 hover:border-ink-3";

const BOOL_PARAM: Record<string, string> = { on_sale: "on_sale", is_featured: "is_featured", in_stock: "in_stock" };

function paramFor(f: Filter): string {
  switch (f.name) {
    case "sub_category":
      return "category_id";
    case "tags":
      return "filter";
    case "brand":
      return "brand";
    case "allergens":
      return "exclude_allergens";
    case "rating":
      return "rating_min";
    default:
      return BOOL_PARAM[f.name] ?? `attr_${f.name}`;
  }
}

export function Filters({
  filters,
  labels,
}: {
  filters: Filter[];
  labels: { filters: string; clear: string; min: string; max: string; apply: string };
}) {
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);

  const push = (mut: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(sp.toString());
    mut(p);
    p.delete("page"); // reset to page 1 on any change
    router.push(`${path}${p.size ? `?${p}` : ""}`, { scroll: false });
  };
  const set = (k: string, v: string | null) => push((p) => (v ? p.set(k, v) : p.delete(k)));

  const chips = [...sp.entries()].filter(([k]) => k !== "page" && k !== "q");
  const chipLabel = (k: string, v: string) => {
    if (k === "price_min" || k === "price_max") return `${k === "price_min" ? labels.min : labels.max} ${v}`;
    const f = filters.find((x) => paramFor(x) === k);
    if (!f) return v;
    if (v === "true") return tr(f.label);
    const hit = (f.values ?? []).find((x: any) => typeof x === "object" && String(x.id) === v);
    return hit ? tr(hit.name) : v;
  };

  return (
    <aside className="grid grid-cols-1 gap-3 lg:sticky lg:top-4">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-left font-bold lg:hidden"
        aria-expanded={open}
        aria-controls="filters-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <span>
          {labels.filters}
          {chips.length > 0 && <span className="ml-2 rounded-full bg-dark px-2 py-0.5 text-xs text-white">{chips.length}</span>}
        </span>
        <img src="/icons/chevron-down.svg" width={14} height={14} alt="" className={cn("size-3.5 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      <div id="filters-panel" className={cn("gap-4 rounded-xl border border-line p-3.5 lg:grid lg:grid-cols-1", open ? "grid grid-cols-1" : "hidden")}>
        <p className="hidden font-bold lg:block">{labels.filters}</p>
        {filters.map((f) => {
          const key = paramFor(f);
          const label = tr(f.label) || f.name;
          if (f.type === "boolean")
            return (
              <label key={f.name} className={check}>
                <input type="checkbox" checked={sp.get(key) === "true"} onChange={(e) => set(key, e.target.checked ? "true" : null)} />
                {label}
              </label>
            );
          if (f.type === "range" && f.name === "price_range")
            return (
              <form
                key={f.name}
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  push((p) => {
                    for (const k of ["price_min", "price_max"]) {
                      const v = String(fd.get(k) ?? "");
                      v ? p.set(k, v) : p.delete(k);
                    }
                  });
                }}
              >
                <span className={fLabel}>{label}</span>
                <div className="flex gap-1.5">
                  <input className={fInput} name="price_min" type="number" inputMode="numeric" min={f.min} max={f.max} placeholder={`${labels.min} ${f.min ?? ""}`} defaultValue={sp.get("price_min") ?? ""} />
                  <input className={fInput} name="price_max" type="number" inputMode="numeric" min={f.min} max={f.max} placeholder={`${labels.max} ${f.max ?? ""}`} defaultValue={sp.get("price_max") ?? ""} />
                  <button className={btn("dark", "sm")}>{labels.apply}</button>
                </div>
              </form>
            );
          if (f.type === "range")
            return (
              <label key={f.name} className={fBlock}>
                <span className={fLabel}>{label}</span>
                <input className={fInput} type="number" min={f.min} max={f.max} defaultValue={sp.get(key) ?? ""} onBlur={(e) => set(key, e.target.value || null)} />
              </label>
            );
          const values = (f.values ?? []).map((v: any) =>
            typeof v === "object" ? { id: String(v.id ?? v.value ?? v.name), name: tr(v.name ?? v.label ?? v.value) } : { id: String(v), name: String(v) },
          );
          if (f.type === "select")
            return (
              <label key={f.name} className={fBlock}>
                <span className={fLabel}>{label}</span>
                <select className={fInput} value={sp.get(key) ?? ""} onChange={(e) => set(key, e.target.value || null)}>
                  <option value="">—</option>
                  {values.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </label>
            );
          // multi_select: comma-joined values, sent exactly as returned
          const current = new Set((sp.get(key) ?? "").split(",").filter(Boolean));
          return (
            <fieldset key={f.name} className={fBlock}>
              <legend className={fLabel}>{label}</legend>
              {values.map((v) => (
                <label key={v.id} className={check}>
                  <input
                    type="checkbox"
                    checked={current.has(f.name === "sub_category" ? v.id : v.name)}
                    onChange={(e) => {
                      const val = f.name === "sub_category" ? v.id : v.name;
                      e.target.checked ? current.add(val) : current.delete(val);
                      set(key, [...current].join(",") || null);
                    }}
                  />
                  {v.name}
                </label>
              ))}
            </fieldset>
          );
        })}
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map(([k, v]) => (
            <button type="button" key={k} className={chip} onClick={() => set(k, null)}>
              {chipLabel(k, v)} ✕
            </button>
          ))}
          <button type="button" className={cn(chip, "bg-white underline")} onClick={() => push((p) => [...p.keys()].forEach((k) => k !== "q" && p.delete(k)))}>
            {labels.clear}
          </button>
        </div>
      )}
    </aside>
  );
}
