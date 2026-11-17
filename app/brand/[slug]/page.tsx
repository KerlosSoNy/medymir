import type { Metadata } from "next";
import { getSiteLayout } from "@/lib/api";
import { slugify, tr, unslug } from "@/lib/format";
import { CmsSlot } from "@/components/CmsSlot";
import { ProductListing, type SearchParams } from "@/components/ProductListing";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

/** Brand display name: taken from the brand links in the CMS site layout, else from the URL. */
async function brandName(slug: string) {
  const layout = await getSiteLayout();
  const hit = (layout["footer-column"]?.items ?? []).find((i: any) => i.link === `/brand/${slug}` || slugify(tr(i.label)) === slug);
  return hit ? tr(hit.label) : unslug(slug).replace(/\b\w/g, (m) => m.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: await brandName((await params).slug) };
}

// Until products carry a "brand" attribute, brand pages search the catalogue by brand name.
export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const name = await brandName(slug);
  return (
    <>
      <CmsSlot slug={`brand-${slug}`} />
      <ProductListing basePath={`/brand/${slug}`} heading={name} search={name} sp={await searchParams} />
    </>
  );
}
