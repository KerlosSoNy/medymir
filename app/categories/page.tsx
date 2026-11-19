import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryDirectory } from "@/components/CategoryDirectory";
import { CmsPage } from "@/components/cms/CmsPage";
import { getCategories } from "@/lib/api";
import { templatePage } from "@/lib/cms-template";
import { widgetCtx } from "@/lib/ctx";
import { cn } from "@/lib/cn";
import { container, pageTitle } from "@/lib/styles";
import { UI } from "@/lib/ui";

export const metadata = { title: "All categories" };

// All categories page (Figma "Categories — Desktop 1440", node 80:236), built from the CMS page "categories"
// (Page builder → Categories): photo banner (text-image/categories-hero), the searchable numbered category
// cards (text-image/category-directory, from the mega-menu groups in lib/menu.ts) and the
// "Can't find what you need?" bar (button-cta/list-bar). Until that page exists, only the cards are shown.
export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ draft?: string }> }) {
  const { draft } = await searchParams;
  const [page, ctx, cats] = await Promise.all([templatePage("categories", draft), widgetCtx(), getCategories()]);
  return (
    <>
      <Breadcrumbs current={UI.allCategories} shop />
      {page ? (
        <CmsPage page={page} ctx={ctx} firstRowClass="pt-5 md:pt-5" />
      ) : (
        <div className={cn(container, "pb-14 md:pb-[72px]")}>
          <h1 className={pageTitle}>{UI.allCategories}</h1>
          <CategoryDirectory slugs={cats.map((c) => c.slug ?? c.id)} />
        </div>
      )}
    </>
  );
}
