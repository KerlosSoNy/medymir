import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCmsPage } from "@/lib/api";
import { widgetCtx } from "@/lib/ctx";
import { tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CmsPage } from "@/components/cms/CmsPage";

// Privacy policy = CMS page with slug "privacy-policy", built in the TheCoins page builder (Figma "Policy — Privacy policy").
const SLUG = "privacy-policy";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage(SLUG);
  return page ? { title: tr(page.title) } : {};
}

export default async function PrivacyPolicyPage() {
  const [page, ctx] = await Promise.all([getCmsPage(SLUG), widgetCtx()]);
  if (!page) notFound();
  return (
    <>
      <Breadcrumbs parent={UI.policies} current={tr(page.title)} />
      <CmsPage page={page} ctx={{ ...ctx, path: `/${SLUG}` }} firstRowClass="pt-5 md:pt-5" />
    </>
  );
}
