// Product Attributes (product-attributes): the values of a store product detail, straight from TheCoins.
// For the Brand detail it is the "Shop by brand" carousel (Figma node 10:62): one card per brand from the
// store's Brand list, in the list's order. Card picture = the brand's banner photo from the Brand list;
// without one, a card with the brand's logo, name and description. Nothing is typed into the section
// itself except which brands to show (selectedValueIds; empty = all active brands).
import { BRAND_ATTRIBUTE } from "@/lib/config";
import { BrandCarousel } from "../BrandCarousel";
import { type P } from "./shared";

export function ProductAttributes({ w, ctx }: P) {
  const attrName = String(w.attributeName ?? w.attribute_name ?? w.data?.attribute?.name ?? "").toLowerCase();
  const showImages = (w.showImages ?? w.show_images) !== false;
  const showDescription = (w.showDescription ?? w.show_description) !== false;
  if (attrName !== BRAND_ATTRIBUTE) return null; // only the Brand detail has a design so far
  // Which brands, in which order: the public API drops selectedValueIds but sends the chosen values
  // (in the chosen order) as data.values; the draft preview has selectedValueIds instead.
  const picked: string[] = Array.isArray(w.selectedValueIds)
    ? w.selectedValueIds.filter(Boolean)
    : Array.isArray(w.data?.values)
      ? w.data.values.map((v: any) => v?.id).filter(Boolean)
      : [];
  const brands = picked.length ? picked.map((id) => ctx.brands.find((b) => b.id === id)).filter((b) => !!b) : ctx.brands;
  const cards = brands.map((b) => ({
    name: b.description && showDescription ? `${b.name} — ${b.description}` : b.name,
    image: showImages ? (b.banner ?? "") : "",
    link: `/brand/${b.slug}`,
    logo: b.logo,
  }));
  if (!cards.length) return null;
  return <BrandCarousel cards={cards} />;
}
