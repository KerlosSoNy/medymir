// Renders a TheCoins CMS page: rows -> columns (12-col grid) -> widgets via the registry.
// Supports both the tree shape (page.rows) and the legacy flat list (page.content).
// Row spacing depends on what the row holds (see rowKind), so the page builder needs no CSS.
import { cn } from "@/lib/cn";
import { sectionX } from "@/lib/styles";
import { WidgetRenderer, type RowKind, type WidgetCtx } from "./widgets";

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

const widgetsOf = (row: any): any[] => (row.columns ?? []).flatMap((c: any) => c.widgets ?? []);
const kindOf = (w: any) => `${w?.widget_type ?? w?.type}/${w?.variant ?? ""}`;
const isHeader = (w: any) => w?.variant === "section-header";
const isHeaderOnly = (row: any) => {
  const ws = widgetsOf(row);
  return ws.length > 0 && ws.every(isHeader);
};

/** What kind of row this is decides its padding and width. */
function rowKind(row: any): RowKind {
  if (row.full_width) return "full";
  const ws = widgetsOf(row);
  const kinds = ws.map(kindOf);
  if (kinds.some((k) => k === "stats-counter/chips" || k === "stats-counter/features")) return "compact";
  if (kinds.some((k) => k.startsWith("categories-grid/") || k === "testimonials/brand-carousel")) return "bleed";
  if (ws.length > 0 && kinds.every((k) => k.startsWith("banners/"))) return "banner";
  return "boxed";
}

// Site gutter: 16 phone / 24 tablet (Figma 768) / 56 small desktop / 132 desktop 1440.
const GUTTER_X = sectionX;

const ROW: Record<RowKind, string> = {
  full: "p-0",
  boxed: cn("py-12 md:py-[72px]", GUTTER_X),
  banner: cn("pt-12 pb-6 md:pt-[72px]", GUTTER_X),
  // Popular searches + features strip is compact (Figma: 24 / 28px).
  compact: "pt-6 pb-7 px-[22px] md:px-8",
  // Carousels bleed off the right edge (Figma: left padding only).
  bleed: "py-12 md:py-[72px] pl-4 md:pl-6 lg:pl-14 xl:pl-[132px] pr-0",
};

const GRID: Record<RowKind, string> = {
  full: "grid-cols-1 gap-0",
  boxed: "max-w-[1176px] mx-auto gap-x-[23px]",
  banner: "max-w-[1176px] mx-auto gap-x-[23px]",
  compact: "",
  bleed: "xl:ml-[max(0px,calc((100vw-1176px-264px)/2))]",
};

export function CmsPage({ page, ctx, firstRowClass }: { page: any; ctx: WidgetCtx; firstRowClass?: string }) {
  if (!page) return null;
  const rows: any[] = Array.isArray(page.rows) && page.rows.length ? page.rows : Array.isArray(page.content) ? groupFlat(page.content) : [];
  return (
    <>
      {rows.map((row, ri) => {
        const kind = rowKind(row);
        const headOnly = isHeaderOnly(row);
        const afterHead = ri > 0 && isHeaderOnly(rows[ri - 1]);
        const multiCol = (row.columns ?? []).length > 1;
        const withArrows = widgetsOf(row).some((w) => kindOf(w) === "testimonials/brand-carousel");
        const rowCtx: WidgetCtx = { ...ctx, row: kind, beside: multiCol, withArrows };
        return (
          <section
            key={row.row_id ?? ri}
            id={row.row_id ?? undefined}
            className={cn(ROW[kind], headOnly && "pb-0 md:pb-0", afterHead && "pt-[34px] md:pt-[34px]", ri === 0 && firstRowClass)}
            style={{ background: row.background_color || undefined, padding: row.padding || undefined }}
          >
            <div className={cn("grid grid-cols-12 gap-y-6 lg:gap-y-0", GRID[kind])}>
              {(row.columns ?? []).map((col: any, ci: number) => {
                const ws: any[] = col.widgets ?? [];
                const sideCards = ws.some((w) => ["stats-counter/checklist", "contact-form/contact-card"].includes(kindOf(w)));
                return (
                  <div
                    key={col.column_id ?? ci}
                    className={cn(
                      "col-span-12 lg:col-span-(--span) min-w-0 flex flex-col",
                      ws.length === 1 && isHeader(ws[0]) ? "gap-0" : kind === "compact" ? "gap-[22px]" : sideCards ? "gap-5" : "gap-7",
                    )}
                    style={{ ["--span" as any]: col.span ?? 12 }}
                  >
                    {ws.map((w: any, wi: number) => (
                      <WidgetRenderer key={w.id ?? wi} w={w} ctx={rowCtx} />
                    ))}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
