import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CmsPage } from "@/components/cms/CmsPage";
import { ProductListing, type SearchParams } from "@/components/ProductListing";
import { NoResults, SearchBox } from "@/components/SearchBox";
import { resolveCategory } from "@/lib/api";
import { READY_STOCK_CATEGORY } from "@/lib/config";
import { templatePage } from "@/lib/cms-template";
import { widgetCtx } from "@/lib/ctx";
import { cn } from "@/lib/cn";
import { container } from "@/lib/styles";
import { UI } from "@/lib/ui";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

// Search page (Figma "Search — Results / No results / Empty", nodes 94:35, 94:743, 94:942).
// No search yet: title, search box and a hint (no product list). With a search: "Search results for …", count,
// search box, tabs (All products / Ready stock), then the store's filters, Sort by, product cards and pages; no
// match: the "No products found" box. Figma's "Quotation only" tab is left out: the store can't search
// "everything except one category". The help banner ("Can't find the right product?") and any other section
// come from the CMS page "search" (Page builder → Search).
export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams & { draft?: string }> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const categoryId = typeof sp.category_id === "string" ? sp.category_id : "";
  const [page, ctx, ready] = await Promise.all([templatePage("search", sp.draft as string | undefined), widgetCtx(), resolveCategory(READY_STOCK_CATEGORY)]);

  const tabs = ready
    ? [
        { label: UI.allProducts, id: "", active: categoryId !== ready.id },
        { label: UI.readyStockTab, id: ready.id, active: categoryId === ready.id },
      ]
    : [];
  const tabHref = (id: string) => `/search?${new URLSearchParams({ q, ...(id ? { category_id: id } : {}) })}`;

  const head = (count: number | null) => (
    <div className="grid gap-4 pt-4 pb-5 md:pb-6">
      <div>
        <h1 className="font-head text-[28px] leading-[1.18] font-bold break-words text-navy-deep md:text-[32px]">{q ? UI.searchResultsFor(q) : UI.search}</h1>
        {count != null && <p className="mt-1 text-sm text-slate">{UI.productsFound(count)}</p>}
      </div>
      <SearchBox q={q} categoryId={categoryId && ready && categoryId === ready.id ? categoryId : undefined} />
      {q && tabs.length > 0 && (
        <nav aria-label={UI.searchTabs} className="flex w-fit overflow-hidden rounded-lg border border-[#d5dce6]">
          {tabs.map((t, i) => (
            <Link
              key={t.label}
              href={tabHref(t.id)}
              aria-current={t.active ? "page" : undefined}
              className={cn(
                "px-4 py-2.5 text-sm font-semibold transition",
                i > 0 && "border-l border-[#d5dce6]",
                t.active ? "bg-navy-deep text-white" : "bg-white text-navy-deep hover:bg-surface-alt",
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );

  return (
    <>
      <Breadcrumbs current={UI.search} shop />
      {q ? (
        <ProductListing basePath="/search" sp={sp} head={head} sortOnly empty={<NoResults q={q} />} />
      ) : (
        <div className={cn(container, "pb-6")}>
          {head(null)}
          <p className="grid min-h-[92px] place-items-center rounded-xl border border-dashed border-[#d5dce6] bg-white px-5 py-6 text-center text-[15px] text-[#3b4a63]">
            {UI.searchHint}
          </p>
        </div>
      )}
      {page && <CmsPage page={page} ctx={ctx} firstRowClass="pt-0 md:pt-0" />}
    </>
  );
}
