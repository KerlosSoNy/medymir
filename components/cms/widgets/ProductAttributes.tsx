// Product Attributes (product-attributes): the values of a store product detail, straight from TheCoins.
// For the Brand detail it is the "Shop by brand" carousel (Figma node 10:62): one card per brand from the
// store's Brand list, in the list's order. Card picture = the brand's banner photo from the Brand list;
// without one, a card with the brand's logo, name and description. Nothing is typed into the section
// itself except which brands to show (selectedValueIds; empty = all active brands).
import { BRAND_ATTRIBUTE } from "@/lib/config";
import Link from "next/link";
import { UI } from "@/lib/ui";
import { Icon } from "../../SmartLink";
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

/**
 * Brands page "Brands by specialty" (Figma 18:539): one box per store category that has branded products, with a
 * navy header and a cell per brand (logo or name, the brand's description if written, "View store" = that brand's
 * products inside the category). Everything comes from the store: categories, and per category the brands of its
 * products (its Brand filter).
 */
export function ByCategory({ ctx }: { ctx: P["ctx"] }) {
  const byName = new Map(ctx.brands.map((b) => [b.name.toLowerCase(), b]));
  const groups = ctx.categories
    .map((c) => ({ c, names: ctx.categoryBrands?.[c.slug ?? c.id] ?? [] }))
    .filter((g) => g.names.length > 0);
  if (!groups.length) return null;
  return (
    <div className="grid gap-[18px]">
      {groups.map(({ c, names }) => (
        <section key={c.id} className="overflow-hidden rounded-xl border border-[#e3e7ed] bg-white">
          <h3 className="bg-gradient-to-r from-[#1e2a44] to-[#2d4875] px-[18px] py-3 font-head text-[15px] font-semibold text-white">{c.name}</h3>
          <ul className="-mr-px -mb-px grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {names.map((n) => {
              const b = byName.get(n.toLowerCase());
              return (
                <li key={n} className="flex min-h-[148px] flex-col gap-3 border-r border-b border-[#e3e7ed] p-[18px]">
                  <span className="flex h-11 items-center">
                    {b?.logo ? (
                      <img src={b.logo} alt={n} loading="lazy" className="max-h-full max-w-[170px] object-contain object-left" />
                    ) : (
                      <span className="font-head text-lg leading-tight font-semibold text-ink-2">{b?.name ?? n}</span>
                    )}
                  </span>
                  {b?.description && <p className="line-clamp-3 pl-3.5 text-[13.5px] leading-5 text-[#4b5565]">{b.description}</p>}
                  <Link
                    href={`/category/${c.slug ?? c.id}?${BRAND_ATTRIBUTE}=${encodeURIComponent(b?.name ?? n)}`}
                    className="mt-auto flex items-center gap-1.5 text-[13.5px] font-semibold text-[#1e5bb8] hover:underline"
                  >
                    {UI.viewStore}
                    <Icon name="br-chevron-blue" size={13} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
