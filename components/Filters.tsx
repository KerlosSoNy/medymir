"use client";
// Renders filters[] from get-category-products exactly as returned (order, labels, types)
// and maps each to the API's query params via the URL. No client-side product filtering.
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Filter } from "@/lib/api";
import { tr } from "@/lib/format";

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
    <aside className="filters">
      <details open>
        <summary>{labels.filters}</summary>
        {filters.map((f) => {
          const key = paramFor(f);
          const label = tr(f.label) || f.name;
          if (f.type === "boolean")
            return (
              <label key={f.name} className="check">
                <input type="checkbox" checked={sp.get(key) === "true"} onChange={(e) => set(key, e.target.checked ? "true" : null)} />
                {label}
              </label>
            );
          if (f.type === "range" && f.name === "price_range")
            return (
              <form
                key={f.name}
                className="range"
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
                <span className="f-label">{label}</span>
                <div className="range-row">
                  <input name="price_min" type="number" inputMode="numeric" min={f.min} max={f.max} placeholder={`${labels.min} ${f.min ?? ""}`} defaultValue={sp.get("price_min") ?? ""} />
                  <input name="price_max" type="number" inputMode="numeric" min={f.min} max={f.max} placeholder={`${labels.max} ${f.max ?? ""}`} defaultValue={sp.get("price_max") ?? ""} />
                  <button className="btn btn-sm">{labels.apply}</button>
                </div>
              </form>
            );
          if (f.type === "range")
            return (
              <label key={f.name} className="f-block">
                <span className="f-label">{label}</span>
                <input type="number" min={f.min} max={f.max} defaultValue={sp.get(key) ?? ""} onBlur={(e) => set(key, e.target.value || null)} />
              </label>
            );
          const values = (f.values ?? []).map((v: any) =>
            typeof v === "object" ? { id: String(v.id ?? v.value ?? v.name), name: tr(v.name ?? v.label ?? v.value) } : { id: String(v), name: String(v) },
          );
          if (f.type === "select")
            return (
              <label key={f.name} className="f-block">
                <span className="f-label">{label}</span>
                <select value={sp.get(key) ?? ""} onChange={(e) => set(key, e.target.value || null)}>
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
            <fieldset key={f.name} className="f-block">
              <legend className="f-label">{label}</legend>
              {values.map((v) => (
                <label key={v.id} className="check">
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
      </details>
      {chips.length > 0 && (
        <div className="chips">
          {chips.map(([k, v]) => (
            <button key={k} className="chip" onClick={() => set(k, null)}>
              {chipLabel(k, v)} ✕
            </button>
          ))}
          <button className="chip clear" onClick={() => push((p) => [...p.keys()].forEach((k) => k !== "q" && p.delete(k)))}>
            {labels.clear}
          </button>
        </div>
      )}
    </aside>
  );
}
