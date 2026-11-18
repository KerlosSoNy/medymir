// Local-only helpers for the section gallery (/dev/widgets) and the draft preview (/dev/preview/<slug>).
// They add what the TheCoins server normally adds (product lists, category list, brand data) and fill
// empty pictures with neutral sample pictures, so a planned section can be seen before it is saved.
import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { getCategoryProducts } from "./api";
import type { LayoutRow } from "./cms-sections";
import type { WidgetCtx } from "@/components/cms/widgets";

/** The dev pages exist only on a developer's computer, never on the live site. */
export function devOnly() {
  if (process.env.NODE_ENV === "production") notFound();
}

/** Neutral sample pictures (no brands). Shown only where a section has no picture yet. */
const SAMPLE = ["/media/19-solution-doctors.webp", "/media/20-solution-clinics.webp", "/media/21-solution-imaging.webp", "/media/22-solution-hospitals.webp", "/media/02-category-cardiovascular.webp", "/media/03-category-surgical.webp"];

const IMAGE_KEYS = new Set(["imageUrl", "avatar", "url"]);
const PRODUCT_TYPES = new Set(["products-by-category", "featured-products", "recommended-products"]);

/** Fills empty picture fields (imageUrl / avatar / url) with sample pictures, recursively. */
function fillImages(v: any, next: () => string): any {
  if (Array.isArray(v)) return v.map((x) => fillImages(x, next));
  if (!v || typeof v !== "object") return v;
  const out: any = {};
  for (const [k, x] of Object.entries(v)) out[k] = IMAGE_KEYS.has(k) && x === "" ? next() : fillImages(x, next);
  return out;
}

/** Adds server data to a page in the render shape (see layoutToPage) so CmsPage can show it. */
export async function withPreviewData(page: { rows: any[] }, ctx: WidgetCtx) {
  let n = 0;
  const next = () => SAMPLE[n++ % SAMPLE.length];
  const rows = await Promise.all(
    page.rows.map(async (row) => ({
      ...row,
      columns: await Promise.all(
        row.columns.map(async (col: any) => ({
          ...col,
          widgets: await Promise.all(
            col.widgets.map(async (raw: any) => {
              const w = fillImages(raw, next);
              const type = w.widget_type;
              if (PRODUCT_TYPES.has(type) && !w.data) {
                const r = await getCategoryProducts({ category_id: w.categoryId || undefined, per_page: Number(w.limit) || 4 });
                w.data = r?.products ?? [];
              }
              if (type === "categories-grid" && !w.data) w.data = w.categories?.length ? w.categories : ctx.categories;
              if (type === "two-one-grid" && !(w.oneGridData ?? []).length)
                w.oneGridData = ctx.brands.slice(0, 4).map((b) => ({ type: "brand", brandName: b.name, brandLogo: b.logo ?? "" }));
              return w;
            }),
          ),
        })),
      ),
    })),
  );
  return { ...page, rows };
}

/** Folder for planned pages: cms-drafts/<slug>.json = { title, layout: LayoutRow[] }. */
export const DRAFTS_DIR = path.join(process.cwd(), "cms-drafts");

export async function readDraft(slug: string): Promise<{ title: string; layout: LayoutRow[] } | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  try {
    const json = JSON.parse(await readFile(path.join(DRAFTS_DIR, `${slug}.json`), "utf8"));
    return Array.isArray(json.layout) ? { title: String(json.title ?? slug), layout: json.layout } : null;
  } catch {
    return null;
  }
}
