import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveCategory } from "@/lib/api";
import { CmsSlot } from "@/components/CmsSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryHeader } from "@/components/CategoryHeader";
import { container } from "@/lib/styles";
import { ProductListing, type SearchParams } from "@/components/ProductListing";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await resolveCategory((await params).slug);
  return c ? { title: c.name, description: c.description ?? undefined } : {};
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const cat = await resolveCategory(slug);
  if (!cat) notFound();
  // Figma "Category — Endoscopy" (87:94): trail, header from the store (hero, sub-categories, featured brands),
  // shared "category" CMS sections, products with filters and sort, then this category's own CMS page
  // "category-<slug>" (e.g. its promo banner and "Equipping your … unit?" bar), when it exists.
  return (
    <>
      <Breadcrumbs current={cat.name} shop />
      <div className={`${container} pt-3.5 pb-[26px]`}>
        <CategoryHeader cat={cat} />
      </div>
      <CmsSlot slug="category" />
      <ProductListing basePath={`/category/${slug}`} categoryId={cat.id} heading={cat.name} sp={await searchParams} toolbar />
      <CmsSlot slug={`category-${slug}`} />
    </>
  );
}
