// Product listing driven entirely by get-category-products: products, filters[] (rendered
// exactly as configured in the dashboard), pagination and SEO.
import Link from "next/link";
import { Suspense } from "react";
import { getCategoryProducts, getTenant } from "@/lib/api";
import { UI } from "@/lib/ui";
import { cn } from "@/lib/cn";
import { container, pageIntro, pageTitle } from "@/lib/styles";
import { ProductCard } from "./ProductCard";
import { Filters } from "./Filters";

export type SearchParams = Record<string, string | string[] | undefined>;

const PASS = /^(page|per_page|order_by|order|price_min|price_max|filter|brand|rating_min|exclude_allergens|on_sale|is_featured|in_stock|search|branch_id|attr_.+|category_id)$/;

export function listingQuery(sp: SearchParams) {
  const q: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    const val = Array.isArray(v) ? v.join(",") : v;
    if (val && PASS.test(k)) q[k] = val;
  }
  if (sp.q && !q.search) q.search = String(sp.q);
  return q;
}

export async function ProductListing({
  basePath,
  categoryId,
  search,
  filter,
  heading,
  intro,
  sp,
}: {
  basePath: string;
  categoryId?: string;
  search?: string;
  /** Fixed filters for this page, e.g. { brand: "Stryker" } on a brand page. */
  filter?: Record<string, string>;
  heading?: string;
  intro?: string;
  sp: SearchParams;
}) {
  const q = listingQuery(sp);
  const query = { per_page: 24, ...q, ...filter, category_id: q.category_id || categoryId, search: q.search || search };
  const [data, tenant] = await Promise.all([getCategoryProducts(query), getTenant()]);
  const currency = tenant?.locale.currency ?? null;
  if (!data) return <p className={cn(container, "py-16 text-center text-muted")}>{UI.error}</p>;

  const title = heading || data.seo?.heading || data.category?.name || "";
  const { page = 1, total_pages = 1 } = data.pagination ?? ({} as any);
  const pageHref = (n: number) => {
    const p = new URLSearchParams(Object.entries(sp).flatMap(([k, v]) => (v == null ? [] : [[k, String(v)]])));
    p.set("page", String(n));
    return `${basePath}?${p}`;
  };

  const hasFilters = data.filters?.length > 0;
  const pagerLink = "rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-ink-2";

  return (
    <div className={cn(container, "pb-14 md:pb-[72px]")}>
      {title && <h1 className={pageTitle}>{title}</h1>}
      {(intro || data.category?.description) && <p className={pageIntro}>{intro || data.category?.description}</p>}
      <div className={cn("grid grid-cols-1 items-start gap-5 lg:gap-7", hasFilters && "lg:grid-cols-[240px_minmax(0,1fr)]")}>
        {hasFilters && (
          <Suspense>
            <Filters filters={data.filters} labels={{ filters: UI.filters, clear: UI.clearFilters, min: UI.min, max: UI.max, apply: UI.apply }} />
          </Suspense>
        )}
        <div className="min-w-0">
          {data.products?.length ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3">
              {data.products.map((p) => (
                <ProductCard key={p.id} p={p} currency={currency} />
              ))}
            </div>
          ) : (
            <p className="grid grid-cols-1 min-h-60 place-items-center rounded-[14px] border border-dashed border-[#c9d2de] p-8 text-center text-sm text-muted-3 gap-0">
              {UI.noProducts}
            </p>
          )}
          {total_pages > 1 && (
            <nav className="mt-7 flex items-center justify-center gap-4 text-sm" aria-label={UI.page}>
              {page > 1 && (
                <Link className={pagerLink} href={pageHref(page - 1)}>
                  {UI.prev}
                </Link>
              )}
              <span className="text-muted">
                {page} / {total_pages}
              </span>
              {page < total_pages && (
                <Link className={pagerLink} href={pageHref(page + 1)}>
                  {UI.next}
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
