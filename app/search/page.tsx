import { CmsSlot } from "@/components/CmsSlot";
import { ProductListing, type SearchParams } from "@/components/ProductListing";

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  return (
    <>
      <CmsSlot slug="search" />
      <ProductListing basePath="/search" heading={q ? `“${q}”` : "Search"} sp={sp} />
    </>
  );
}
