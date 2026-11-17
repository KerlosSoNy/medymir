import { CmsSlot } from "@/components/CmsSlot";
import { ProductListing, type SearchParams } from "@/components/ProductListing";

export const metadata = { title: "All products" };

export default async function AllProducts({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <>
      <CmsSlot slug="products" />
      <ProductListing basePath="/products" heading="All products" sp={await searchParams} />
    </>
  );
}
