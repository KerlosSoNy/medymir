import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BrandDirectory } from "@/components/BrandDirectory";
import { CmsPage } from "@/components/cms/CmsPage";
import { getBrands } from "@/lib/api";
import { templatePage } from "@/lib/cms-template";
import { widgetCtx } from "@/lib/ctx";
import { cn } from "@/lib/cn";
import { container, pageTitle } from "@/lib/styles";
import { UI } from "@/lib/ui";

export const metadata = { title: "Brands" };

// Brands page (Figma "Brands — Desktop 1440", node 17:276), built from the CMS page "brands" (Page builder → Brands):
// hero, trust bar, brand directory, brands by specialty, featured regional brand stores, shop by category.
// Brands, logos, categories and which brands each category has all come from the store. Until that CMS page
// exists, the plain brand directory is shown.
export default async function BrandsPage({ searchParams }: { searchParams: Promise<{ draft?: string }> }) {
  const { draft } = await searchParams;
  const [page, ctx, brands] = await Promise.all([templatePage("brands", draft), widgetCtx(), getBrands()]);
  return (
    <>
      <Breadcrumbs current={UI.brands} shop />
      {page ? (
        <CmsPage page={page} ctx={{ ...ctx, path: "/brands" }} firstRowClass="pt-5 md:pt-5" />
      ) : (
        <div className={cn(container, "pb-14 md:pb-[72px]")}>
          <h1 className={pageTitle}>{UI.brands}</h1>
          <BrandDirectory brands={brands.map((b) => ({ name: b.name, slug: b.slug, logo: b.logo }))} />
        </div>
      )}
    </>
  );
}
