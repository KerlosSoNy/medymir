import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCmsPage } from "@/lib/api";
import { widgetCtx } from "@/lib/ctx";
import { tr } from "@/lib/format";
import { CmsPage } from "@/components/cms/CmsPage";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type Props = { params: Promise<{ slug: string }> };

// Pages that exist only to feed the layout or templates are not standalone pages.
const RESERVED = new Set(["home", "site-layout"]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = RESERVED.has(slug) ? null : await getCmsPage(slug);
  return page ? { title: tr(page.title) } : {};
}

// Any CMS page by slug (/about, /faq, /privacy-policy …). Missing -> 404, never invented content.
export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();
  const [page, ctx] = await Promise.all([getCmsPage(slug), widgetCtx()]);
  if (!page) notFound();
  return (
    <>
      <Breadcrumbs current={tr(page.title)} />
      <CmsPage page={page} ctx={ctx} firstRowClass="pt-5 md:pt-5" />
    </>
  );
}
