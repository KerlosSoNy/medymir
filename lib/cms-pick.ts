// Takes chosen sections out of a CMS page so a template page can place them itself
// (e.g. the product page puts "product-tab" sections in its tabs and "product-help" under them).

/** Widgets of `page` whose `type/variant` is in `kinds` (in page order), and the page without them. */
export function pickWidgets(page: any, kinds: string[]): { picked: Record<string, any[]>; rest: any } {
  const picked: Record<string, any[]> = Object.fromEntries(kinds.map((k) => [k, []]));
  if (!page || !Array.isArray(page.rows)) return { picked, rest: page };
  const kindOf = (w: any) => `${w?.widget_type ?? w?.type}/${w?.variant ?? ""}`;
  const rows = page.rows
    .map((row: any) => ({
      ...row,
      columns: (row.columns ?? []).map((col: any) => ({
        ...col,
        widgets: (col.widgets ?? []).filter((w: any) => {
          const k = kindOf(w);
          if (!(k in picked)) return true;
          picked[k].push(w);
          return false;
        }),
      })),
    }))
    .filter((row: any) => row.columns.some((c: any) => c.widgets.length));
  return { picked, rest: { ...page, rows } };
}
