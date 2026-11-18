import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsPage } from "../../components/cms/CmsPage";
import { getCmsPage } from "@/lib/api";
import { tr } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { widgetCtx } from "@/lib/ctx";

// About page = CMS page with slug "about", built in the TheCoins page builder (Figma "About").
const SLUG = "about";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage(SLUG);
  return page ? { title: tr(page.title) } : {};
}

export default async function AboutPage() {
  const [page, ctx] = await Promise.all([getCmsPage(SLUG), widgetCtx()]);
  if (!page) notFound();
  return (
    <>
      <Breadcrumbs current={tr(page.title)} />
      <CmsPage page={page} ctx={ctx} firstRowClass="pt-5 md:pt-5" />
    </>
  );
}
