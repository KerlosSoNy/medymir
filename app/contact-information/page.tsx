import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCmsPage } from "@/lib/api";
import { widgetCtx } from "@/lib/ctx";
import { tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CmsPage } from "@/components/cms/CmsPage";

// Contact information = CMS page with slug "contact-information", built in the TheCoins page builder (Figma "Policy — Contact information").
const SLUG = "contact-information";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage(SLUG);
  return page ? { title: tr(page.title) } : {};
}

export default async function ContactInformationPage() {
  const [page, ctx] = await Promise.all([getCmsPage(SLUG), widgetCtx()]);
  if (!page) notFound();
  return (
    <>
      <Breadcrumbs parent={UI.policies} current={tr(page.title)} />
      <CmsPage page={page} ctx={{ ...ctx, path: `/${SLUG}` }} firstRowClass="pt-5 md:pt-5" />
    </>
  );
}
