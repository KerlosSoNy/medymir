// Ready Stock offers area (Figma "Ready Stock — Desktop", node 92:164): the store's filters on the left
// (exactly as configured in TheCoins, never invented), a title with the number of offers, and offer cards
// from one store category, with pages. Filters and pages work through the page address (?in_stock=1&page=2).
import Link from "next/link";
import { Suspense } from "react";
import { getCategoryProducts } from "@/lib/api";
import { cn } from "@/lib/cn";
import { UI } from "@/lib/ui";
import { Filters } from "./Filters";
import { OfferCard, type OfferLabels } from "./OfferCard";
import { listingQuery, type SearchParams } from "./ProductListing";
import type { Brand } from "@/lib/api";

export async function OfferListing(p: {
  categoryId: string;
  basePath: string;
  sp: SearchParams;
  title: string;
  currency: string | null;
  brands: Brand[];
  labels: OfferLabels;
  anchor?: string;
}) {
  const q = listingQuery(p.sp);
  const data = await getCategoryProducts({ per_page: 12, ...q, category_id: p.categoryId });
  if (!data) return <p className="py-16 text-center text-muted">{UI.error}</p>;
  const products = data.products ?? [];
  const count = data.pagination?.products_count ?? products.length;
  const { page = 1, total_pages = 1 } = data.pagination ?? ({} as any);
  const pageHref = (n: number) => {
    const s = new URLSearchParams(Object.entries(p.sp).flatMap(([k, v]) => (v == null ? [] : [[k, String(v)]])));
    s.set("page", String(n));
    return `${p.basePath}?${s}#${p.anchor ?? "offers"}`;
  };
  const logoOf = (name: string) => p.brands.find((b) => b.name.toLowerCase() === name.toLowerCase())?.logo ?? null;
  const hasFilters = (data.filters?.length ?? 0) > 0;
  const pagerLink = "rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-ink-2";

  return (
    <div id={p.anchor ?? "offers"} className={cn("grid scroll-mt-6 grid-cols-1 items-start gap-5 lg:gap-6", hasFilters && "lg:grid-cols-[240px_minmax(0,1fr)]")}>
      {hasFilters && (
        <Suspense>
          <Filters filters={data.filters} labels={{ filters: UI.filters, clear: UI.clearFilters, min: UI.min, max: UI.max, apply: UI.apply }} />
        </Suspense>
      )}
      <div className="min-w-0">
        {p.title && (
          <div className="mb-3.5">
            <h2 className="font-head text-[22px] font-bold text-[#202b40] md:text-2xl">{p.title}</h2>
            <p className="mt-0.5 text-[13px] text-[#5f6b7d]">{UI.offersCount(count)}</p>
          </div>
        )}
        {products.length ? (
          <div className="grid grid-cols-1 gap-[13px] sm:grid-cols-2 xl:grid-cols-3">
            {products.map((x: any) => (
              <OfferCard
                key={x.id}
                p={x}
                currency={p.currency}
                brandLogo={logoOf(String(x.custom_attributes?.brand ?? ""))}
                labels={p.labels}
              />
            ))}
          </div>
        ) : (
          <p className="grid min-h-60 grid-cols-1 place-items-center rounded-[14px] border border-dashed border-[#c9d2de] p-8 text-center text-sm text-muted-3">
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
  );
}
