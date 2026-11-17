// Announcement bar + main header + category bar (Figma nodes 9:9, 9:22, 9:56).
// Announcement items and extra category-bar links come from the CMS "site-layout" page;
// categories come from the catalogue.
import type { Brand, Category, Tenant } from "@/lib/api";
import { tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { Logo } from "./Logo";
import { HeaderSearch, QuoteListLink, AccountLink } from "./HeaderClient";
import { CategoryNav, MobileMenu, type NavBrand, type NavCategory, type NavExtra } from "./CategoryNav";

export function Header({
  tenant,
  layout,
  categories,
  brands: storeBrands,
  categoryBrands,
}: {
  tenant: Tenant | null;
  layout: Record<string, any>;
  categories: Category[];
  /** The store's Brand list (Products → product details → Brand). */
  brands: Brand[];
  /** Brand names that have products in each category, keyed by category slug. */
  categoryBrands: Record<string, string[]>;
}) {
  const announcement: any[] = layout.announcement?.items ?? [];
  const nav = layout["category-nav"];
  const highlight: string | undefined = nav?.highlight;
  const navCats: NavCategory[] = categories.map((c) => ({ name: c.name, slug: c.slug ?? c.id }));
  const extras: NavExtra[] = (nav?.items ?? []).map((x: any) => ({ label: tr(x.label), link: x.link }));
  // Brands come from the store's Brand list: the drawer's "Brands" row lists them all, and each mega menu
  // features the brands that actually have products in that category.
  const brands: NavExtra[] = storeBrands.map((b) => ({ label: b.name, link: `/brand/${b.slug}` }));
  const bySlug = new Map(storeBrands.map((b) => [b.name, b]));
  const featuredBrands: Record<string, NavBrand[]> = Object.fromEntries(
    Object.entries(categoryBrands).map(([cat, names]) => [cat, names.map((n) => bySlug.get(n)).filter((b): b is Brand => !!b)]),
  );

  return (
    <header>
      {announcement.length > 0 && (
        <div className="overflow-hidden bg-announce text-white" role="note">
          <div className="flex gap-10 overflow-x-auto whitespace-nowrap px-4 py-[9px] [scrollbar-width:none] lg:justify-between lg:px-10 [&::-webkit-scrollbar]:hidden">
            {announcement.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-10 text-[11px] font-semibold tracking-[0.12em] opacity-85">
                <span className="text-xs text-gold-line" aria-hidden>
                  •
                </span>
                {tr(a.label)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Phone / tablet (Figma Header/Mobile 112:149, Header/Tablet 112:175): menu + logo + icons, search on its own row.
          Desktop (Figma 9:22): logo, search and actions on one row. */}
      <div className="flex flex-wrap items-center gap-x-3.5 border-b border-[#e5ebf0] bg-white px-4 md:px-6 lg:flex-nowrap lg:gap-x-4 lg:border-b-0 lg:py-4 lg:pl-9 lg:pr-8 xl:gap-x-[21px]">
        <MobileMenu categories={navCats} extras={extras} brands={brands} />
        <div className="mr-auto lg:mr-0">
          <Logo tenant={tenant} />
        </div>
        <div className="order-last basis-full pb-3 md:pb-3.5 lg:order-none lg:max-w-[908px] lg:flex-1 lg:basis-auto lg:pb-0">
          <HeaderSearch categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
        </div>
        <div className="flex h-[58px] shrink-0 items-center gap-3.5 md:h-[66px] lg:h-auto lg:gap-6">
          <AccountLink />
          <QuoteListLink />
        </div>
      </div>

      <CategoryNav title={tr(nav?.title) || UI.allCategories} categories={navCats} highlight={highlight} extras={extras} featuredBrands={featuredBrands} />
    </header>
  );
}
