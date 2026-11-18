import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCmsPage } from "@/lib/api";
import { widgetCtx } from "@/lib/ctx";
import { tr } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CmsPage } from "@/components/cms/CmsPage";

// FAQ page = CMS page with slug "faq", built in the TheCoins page builder (Figma "FAQ").
const SLUG = "faq";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage(SLUG);
  return page ? { title: tr(page.title) } : {};
}

export default async function FaqPage() {
  const [page, ctx] = await Promise.all([getCmsPage(SLUG), widgetCtx()]);
  if (!page) notFound();
  return (
    <>
      <Breadcrumbs current={tr(page.title)} />
      <CmsPage page={page} ctx={ctx} firstRowClass="pt-5 md:pt-5" />
    </>
  );
}
