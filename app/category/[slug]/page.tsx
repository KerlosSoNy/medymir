import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveCategory } from "@/lib/api";
import { CmsSlot } from "@/components/CmsSlot";
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
  return (
    <>
      <CmsSlot slug="category" />
      <ProductListing basePath={`/category/${slug}`} categoryId={cat.id} heading={cat.name} sp={await searchParams} />
    </>
  );
}
