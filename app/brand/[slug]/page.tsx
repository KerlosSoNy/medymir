import type { Metadata } from "next";
import { getSiteLayout, resolveBrand } from "@/lib/api";
import { slugify, tr, unslug } from "@/lib/format";
import { BRAND_ATTRIBUTE } from "@/lib/config";
import { CmsSlot } from "@/components/CmsSlot";
import { ProductListing, type SearchParams } from "@/components/ProductListing";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

/**
 * A brand page lists the products whose Brand detail (store dynamic attribute) is this brand.
 * Brands that are only linked from the CMS (e.g. an exclusive brand not yet in the store's Brand list)
 * fall back to searching products by the brand's name.
 */
async function brandInfo(slug: string) {
  const brand = await resolveBrand(slug);
  if (brand) return { name: brand.name, filter: { [BRAND_ATTRIBUTE]: brand.name } };
  const layout = await getSiteLayout();
  const hit = (layout["footer-column"]?.items ?? []).find((i: any) => i.link === `/brand/${slug}` || slugify(tr(i.label)) === slug);
  const name = hit ? tr(hit.label) : unslug(slug).replace(/\b\w/g, (m) => m.toUpperCase());
  return { name, search: name };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: (await brandInfo((await params).slug)).name };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const b = await brandInfo(slug);
  return (
    <>
      <CmsSlot slug={`brand-${slug}`} />
      <ProductListing basePath={`/brand/${slug}`} heading={b.name} filter={b.filter} search={b.search} sp={await searchParams} />
    </>
  );
}
