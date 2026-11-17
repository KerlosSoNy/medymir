/** Shows a price exactly as returned by the API, in the store's currency. */
export function money(value: number | null | undefined, currency: string | null | undefined) {
  if (value == null || Number.isNaN(Number(value))) return "";
  const n = Number(value);
  if (!currency) return n.toLocaleString("en-GB");
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency, currencyDisplay: "code" }).format(n);
  } catch {
    return `${currency} ${n}`;
  }
}

/** CMS strings may be plain or { en, ar } objects. */
export function tr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    const val = o.en ?? Object.values(o)[0];
    return typeof val === "string" ? val : "";
  }
  return String(v);
}

export const plain = (html: string) =>
  (html ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

export const isExternal = (link: string) => /^(https?:|mailto:|tel:)/.test(link);

/** Turn a display name into a URL slug: "Boston Scientific" -> "boston-scientific". */
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-");

export const unslug = (s: string) => decodeURIComponent(s).replace(/-/g, " ");
