import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanitize } from "@/lib/sanitize";
import { getBrands, getCmsPage, getProduct, getTenant } from "@/lib/api";
import { widgetCtx } from "@/lib/ctx";
import { pickWidgets } from "@/lib/cms-pick";
import { layoutToPage } from "@/lib/cms-sections";
import { isReadyStock, money, plain, tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { cn } from "@/lib/cn";
import { containerWide, pdRow as rowCls, pdRowLabel as rowLabel } from "@/lib/styles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CmsPage } from "@/components/cms/CmsPage";
import { ProductHelp } from "@/components/cms/widgets/ButtonCta";
import { productTabText } from "@/components/cms/widgets/TextImage";
import { ProductBuy } from "@/components/ProductBuy";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductTabs } from "@/components/ProductTabs";
import { Icon } from "@/components/SmartLink";

// Product page (Figma "Product — Ready stock / Quotation / Sold out", nodes 76:236, 76:471, 76:723; tablet and
// phone stack the photo above the details). Three looks, decided by the store data:
//   Ready stock = product in the Ready Stock Offers category: badge, stock line, price (with "Save %"), pack unit.
//   Sold out    = a ready-stock product that is unavailable or has 0 tracked stock.
//   Quotation   = every other product: no price ("Quotation on request", owner's decision 19 Nov).
// Everything about the product comes from TheCoins (brand and other details = dynamic attributes). The tabs
// "Delivery & Ordering" etc. and the help banner come from the CMS page "product" (sections text-image/product-tab
// and button-cta/product-help); any other section on that page is shown below, as before.

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ draft?: string }> };

const CMS_SLUG = "product";
const TAB = "text-image/product-tab";
const HELP = "button-cta/product-help";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).id);
  if (!p) return {};
  return {
    title: p.meta_title || p.name,
    description: p.meta_description || plain(p.description ?? "") || undefined,
    openGraph: p.image_url ? { images: [p.image_url] } : undefined,
  };
}

/** A dynamic attribute's value as text ("" when empty). Pick-from-list values use their labels. */
function attrText(a: any): string {
  const picked = (a.selected_options ?? []).map((o: any) => o.label || o.value).filter(Boolean);
  if (picked.length) return picked.join(", ");
  const v = a.value;
  return Array.isArray(v) ? v.filter(Boolean).join(", ") : v == null || typeof v === "object" ? "" : String(v).trim();
}

/** The CMS page "product", or (on a developer's computer, with ?draft=1) the planned cms-drafts/product.json. */
async function templatePage(draft: boolean) {
  if (draft && process.env.NODE_ENV === "development") {
    const { readDraft } = await import("@/lib/cms-preview");
    const d = await readDraft(CMS_SLUG);
    if (d) return layoutToPage(d.layout, d.title);
  }
  return getCmsPage(CMS_SLUG);
}

const factRow = "flex flex-wrap gap-x-3 gap-y-1 border-b border-[#e3e8ef] py-[11px] text-sm";
const factLabel = "w-[150px] shrink-0 font-semibold text-navy-deep";
const factValue = "min-w-0 break-words text-slate";

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { draft } = await searchParams;
  const [p, tenant, brands, template, ctx] = await Promise.all([getProduct(id), getTenant(), getBrands(), templatePage(draft === "1"), widgetCtx()]);
  if (!p) notFound();

  const currency = tenant?.locale.currency ?? null;
  const images: string[] = [p.image_url, ...(p.additional_images ?? [])].filter(Boolean);
  const schema: any[] = (p.custom_attributes_schema ?? []).filter((a: any) => a.show_in_product_page !== false);
  const attr = (name: string) => {
    const a = schema.find((x) => x.name === name);
    if (a) return attrText(a);
    const v = p.custom_attributes?.[name];
    return Array.isArray(v) ? v.join(", ") : v == null ? "" : String(v).trim();
  };
  const brandName = attr("brand");
  const brand = brands.find((b) => b.name.toLowerCase() === brandName.toLowerCase());
  const packUnit = attr("pack_size") || attr("unit");

  const ready = isReadyStock(p);
  const stock = p.track_inventory && p.stock_quantity != null ? Math.max(0, Number(p.stock_quantity)) : null;
  const soldOut = p.is_available === false || stock === 0;
  const mode = soldOut ? "soldout" : ready ? "stock" : "quote";
  const price = Number(p.price);
  const was = Number(p.compare_at_price);
  const save = was > price && price > 0 ? Math.round((1 - price / was) * 100) : 0;

  // Tabs: Overview (description), Specifications (dynamic attributes except the brand), then the CMS tabs.
  const specs = schema.filter((a) => a.name !== "brand").map((a) => [a.label || a.name, attrText(a)] as const).filter(([, v]) => v);
  const { picked, rest } = pickWidgets(template, [TAB, HELP]);
  const help = picked[HELP][0];
  const tabs = [
    p.description && {
      label: UI.overview,
      panel: <div className={cn(productTabText, "rich")} dangerouslySetInnerHTML={{ __html: sanitize(p.description) }} />,
    },
    specs.length > 0 && {
      label: UI.specifications,
      panel: (
        <dl className="max-w-[860px] border-t border-[#e3e8ef]">
          {specs.map(([k, v]) => (
            <div key={k} className={factRow}>
              <dt className={factLabel}>{k}</dt>
              <dd className={factValue}>{v}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    ...picked[TAB]
      .filter((w) => tr(w.title))
      .map((w) => ({ label: tr(w.title), panel: <div className={productTabText} dangerouslySetInnerHTML={{ __html: sanitize(tr(w.content)) }} /> })),
  ].filter(Boolean) as { label: string; panel: React.ReactNode }[];

  const facts: [string, string][] = ready
    ? [
        [UI.productReference, p.sku],
        [UI.packUnit, packUnit],
      ]
    : [
        [UI.pricing, UI.pricingValue],
        [UI.availability, UI.availabilityValue],
        [UI.leadTime, UI.leadTimeValue],
        [UI.productReference, p.sku],
      ];

  return (
    <>
      <Breadcrumbs current={p.name} wide />
      <div className={cn(containerWide, "pb-12")}>
        <div className="grid grid-cols-1 items-start gap-6 md:gap-5 lg:grid-cols-[minmax(0,627fr)_minmax(0,597fr)] lg:gap-10 xl:gap-14">
          <ProductGallery images={images} alt={p.name} />

          <div className="flex min-w-0 flex-col">
            {brandName &&
              (brand ? (
                <Link href={`/brand/${brand.slug}`} className="self-start text-xs font-bold tracking-[0.12em] text-[#8a6212] uppercase hover:underline">
                  {brandName}
                </Link>
              ) : (
                <p className="text-xs font-bold tracking-[0.12em] text-[#8a6212] uppercase">{brandName}</p>
              ))}
            <h1 className="mt-1.5 font-head text-[26px] leading-[1.2] font-bold break-words text-navy-deep md:text-[30px] lg:text-[32px]">{p.name}</h1>

            {ready && (
              <>
                <span className="mt-3 self-start rounded-full border-[1.5px] border-gold-btn px-3 py-[5px] text-xs leading-none font-bold tracking-[0.08em] text-[#8a6212] uppercase">
                  {UI.readyStock}
                </span>
                <p className={cn("mt-2.5 flex items-center gap-2 text-sm", soldOut ? "text-slate" : "text-[#167a43]")}>
                  <Icon name={soldOut ? "pd-dot-grey" : "pd-dot-green"} size={9} />
                  {soldOut ? UI.outOfStock : UI.inStock}
                </p>
              </>
            )}

            <hr className="my-[18px] border-[#e3e8ef]" />

            {ready ? (
              price > 0 && (
                <div className={cn(rowCls, "mb-3.5")}>
                  <span className={rowLabel}>{UI.price}</span>
                  <p className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1" title={UI.indicativePrice}>
                    <span className="font-head text-[22px] font-bold whitespace-nowrap text-navy-deep sm:text-[26px]">{money(price, currency)}</span>
                    {save > 0 && (
                      <>
                        <s className="text-[15px] whitespace-nowrap text-[#8a94a6]">{money(was, currency)}</s>
                        <span className="rounded-md bg-[#fbf1dc] px-2 py-[3px] text-xs font-bold whitespace-nowrap text-[#7a5410]">
                          {UI.save} {save}%
                        </span>
                      </>
                    )}
                  </p>
                </div>
              )
            ) : (
              <>
                <div className="grid gap-1">
                  <p className="font-head text-[22px] font-bold text-navy-deep">{UI.quotationOnRequest}</p>
                  <p className="text-[14.5px] text-slate">{UI.quotationOnRequestText}</p>
                </div>
                <hr className="my-[18px] border-[#e3e8ef]" />
              </>
            )}

            <ProductBuy
              productId={p.id}
              mode={mode}
              unit={ready ? packUnit : undefined}
              max={stock && stock > 0 ? stock : 999}
              groups={(p.modifiers ?? []).map((m: any) => ({
                id: m.id,
                name: m.name,
                required: !!(m.is_required ?? m.required),
                options: (m.options ?? []).filter((o: any) => o.is_available !== false).map((o: any) => ({ id: o.id, name: o.name, isDefault: !!o.is_default })),
              }))}
            />

            {help?.whatsappLink && (
              <a
                href={help.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 flex items-center gap-2 self-start text-[14.5px] font-semibold text-navy-deep underline hover:no-underline"
              >
                <Icon name="pd-whatsapp" size={20} />
                {UI.whatsappHelp}
              </a>
            )}

            <dl className="mt-5 border-t border-[#e3e8ef]">
              {facts
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className={factRow}>
                    <dt className={factLabel}>{k}</dt>
                    <dd className={factValue}>{v}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>

        <ProductTabs tabs={tabs} />

        {help && (
          <div className="pt-10">
            <ProductHelp w={help} />
          </div>
        )}
      </div>
      {rest?.rows?.length > 0 && <CmsPage page={rest} ctx={ctx} />}
    </>
  );
}
