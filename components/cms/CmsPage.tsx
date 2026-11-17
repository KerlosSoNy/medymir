// Renders a TheCoins CMS page: rows -> columns (12-col grid) -> widgets via the registry.
// Supports both the tree shape (page.rows) and the legacy flat list (page.content).
import { WidgetRenderer, type WidgetCtx } from "./widgets";

function groupFlat(list: any[]): any[] {
  const byRow = new Map<number, any>();
  for (const w of list ?? []) {
    const r = w.row_index ?? byRow.size;
    if (!byRow.has(r))
      byRow.set(r, { row_id: w.row_id, full_width: w.row_full_width, background_color: w.row_background_color, padding: w.row_padding, cols: new Map() });
    const c: Map<number, any> = byRow.get(r).cols;
    const ci = w.column_index ?? 0;
    if (!c.has(ci)) c.set(ci, { span: w.column_span ?? 12, widgets: [] });
    c.get(ci).widgets.push(...(w.items ?? [w]));
  }
  return [...byRow.values()].map((r) => ({ ...r, columns: [...r.cols.values()] }));
}

const isHeaderOnly = (row: any) => {
  const ws = (row.columns ?? []).flatMap((c: any) => c.widgets ?? []);
  return ws.length > 0 && ws.every((w: any) => w.variant === "section-header");
};

export function CmsPage({ page, ctx }: { page: any; ctx: WidgetCtx }) {
  if (!page) return null;
  const rows: any[] = Array.isArray(page.rows) && page.rows.length ? page.rows : Array.isArray(page.content) ? groupFlat(page.content) : [];
  return (
    <>
      {rows.map((row, ri) => {
        const headOnly = isHeaderOnly(row);
        const afterHead = ri > 0 && isHeaderOnly(rows[ri - 1]);
        const cls = ["cms-row", row.full_width ? "full" : "boxed", headOnly && "row-head", afterHead && "row-after-head"].filter(Boolean).join(" ");
        return (
          <section key={row.row_id ?? ri} id={row.row_id ?? undefined} className={cls} style={{ background: row.background_color || undefined, padding: row.padding || undefined }}>
            <div className="cms-grid">
              {(row.columns ?? []).map((col: any, ci: number) => (
                <div key={col.column_id ?? ci} className="cms-col" style={{ ["--span" as any]: col.span ?? 12 }}>
                  {(col.widgets ?? []).map((w: any, wi: number) => (
                    <WidgetRenderer key={w.id ?? wi} w={w} ctx={ctx} />
                  ))}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
