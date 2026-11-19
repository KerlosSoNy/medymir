import { READY_STOCK_CATEGORY } from "@/lib/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCmsPage, resolveCategory } from "@/lib/api";
import { widgetCtx } from "@/lib/ctx";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CmsPage } from "@/components/cms/CmsPage";
import { CmsSlot } from "@/components/CmsSlot";
import { ProductListing, type SearchParams } from "@/components/ProductListing";

// Ready Stock page (Figma "Ready Stock — Desktop", node 92:50). The store category "ready-stock-offers"
// gets its own design: CMS page "ready-stock" (hero, promises, offers area, bulk-order bar, how it works,
// WhatsApp banner, reservation form). Until that CMS page exists, the normal category listing is shown.
const CATEGORY = READY_STOCK_CATEGORY;
const CMS_SLUG = "ready-stock";
const PATH = `/category/${CATEGORY}`;

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata(): Promise<Metadata> {
  const c = await resolveCategory(CATEGORY);
  return c ? { title: c.name, description: c.description ?? undefined } : {};
}

export default async function ReadyStockPage({ searchParams }: Props) {
  const [cat, page, ctx, sp] = await Promise.all([resolveCategory(CATEGORY), getCmsPage(CMS_SLUG), widgetCtx(), searchParams]);
  if (!cat) notFound();
  if (!page)
    return (
      <>
        <CmsSlot slug="category" />
        <ProductListing basePath={PATH} categoryId={cat.id} heading={cat.name} sp={sp} />
      </>
    );
  return (
    <>
      <Breadcrumbs current={cat.name} />
      <CmsPage page={page} ctx={{ ...ctx, path: PATH, sp }} firstRowClass="pt-5 md:pt-5" />
    </>
  );
}
