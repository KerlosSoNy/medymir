import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCmsPage } from "@/lib/api";
import { widgetCtx } from "@/lib/ctx";
import { tr } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CmsPage } from "@/components/cms/CmsPage";

// Tender desk page = CMS page with slug "tender-desk", built in the TheCoins page builder (no Figma frame; same style as About / Contact).
const SLUG = "tender-desk";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage(SLUG);
  return page ? { title: tr(page.title) } : {};
}

export default async function TenderDeskPage() {
  const [page, ctx] = await Promise.all([getCmsPage(SLUG), widgetCtx()]);
  if (!page) notFound();
  return (
    <>
      <Breadcrumbs current={tr(page.title)} />
      <CmsPage page={page} ctx={ctx} firstRowClass="pt-5 md:pt-5" />
    </>
  );
}
