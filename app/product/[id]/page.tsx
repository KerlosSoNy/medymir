import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanitize } from "@/lib/sanitize";
import { getProduct, getTenant } from "@/lib/api";
import { money, plain } from "@/lib/format";
import { UI } from "@/lib/ui";
import { CmsSlot } from "@/components/CmsSlot";
import { ProductBuy } from "@/components/ProductBuy";
import { ProductPhoto } from "@/components/ProductCard";
import { cn } from "@/lib/cn";
import { container, notice } from "@/lib/styles";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).id);
  if (!p) return {};
  return {
    title: p.meta_title || p.name,
    description: p.meta_description || plain(p.description ?? "") || undefined,
    openGraph: p.image_url ? { images: [p.image_url] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const [p, tenant] = await Promise.all([getProduct(id), getTenant()]);
  if (!p) notFound();
  const images: string[] = [p.image_url, ...(p.additional_images ?? [])].filter(Boolean);
  // Extra product details come only from the product's dynamic attributes.
  const attrs = Object.entries(p.custom_attributes ?? {}).filter(([, v]) => v !== null && v !== "" && typeof v !== "object");
  const onSale = p.compare_at_price != null && Number(p.compare_at_price) > Number(p.price);

  return (
    <>
      <div className={cn(container, "grid grid-cols-1 items-start gap-8 pt-6 pb-14 md:pt-10 md:pb-[72px] lg:grid-cols-2 lg:gap-12")}>
        <div className="grid grid-cols-1 gap-3 lg:sticky lg:top-4">
          <ProductPhoto src={images[0]} alt={p.name} size="lg" eager className="aspect-square rounded-2xl border border-line" />
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {images.slice(1).map((src, i) => (
                <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="block rounded-lg transition hover:opacity-80">
                  <ProductPhoto src={src} alt={`${p.name} ${i + 2}`} size="sm" className="aspect-square border border-line" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 min-w-0 gap-3">
          {p.category_name && (
            <Link
              className="text-xs font-semibold tracking-[0.12em] text-blue uppercase hover:underline"
              href={`/category/${p.category_slug || p.category_id}`}
            >
              {p.category_name}
            </Link>
          )}
          <h1 className="font-head text-[26px] leading-tight font-bold text-ink md:text-3xl lg:text-[34px]">{p.name}</h1>
          {p.sku && <p className="text-[13px] font-semibold text-muted">REF {p.sku}</p>}
          {p.price != null && Number(p.price) > 0 && (
            <p className="flex flex-wrap items-baseline gap-2.5 text-[22px] font-bold">
              {money(p.price, tenant?.locale.currency)}
              {onSale && <s className="text-[15px] font-normal text-muted-3">{money(p.compare_at_price, tenant?.locale.currency)}</s>}
              <small className="text-xs font-medium text-muted">{UI.indicativePrice}</small>
            </p>
          )}
          {p.description && (
            <div className="rich text-[15px] text-[#3a4252]" dangerouslySetInnerHTML={{ __html: sanitize(p.description) }} />
          )}
          {attrs.length > 0 && (
            <dl className="m-0 grid grid-cols-1 border-t border-line text-sm gap-0">
              {attrs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(110px,40%)_1fr] gap-2.5 border-b border-line py-2.5">
                  <dt className="font-semibold">{k}</dt>
                  <dd className="m-0 break-words text-muted">{String(v)}</dd>
                </div>
              ))}
            </dl>
          )}
          {p.is_available !== false ? (
            <ProductBuy
              productId={p.id}
              groups={(p.modifiers ?? []).map((m: any) => ({
                id: m.id,
                name: m.name,
                required: !!(m.is_required ?? m.required),
                options: (m.options ?? []).filter((o: any) => o.is_available !== false).map((o: any) => ({ id: o.id, name: o.name, isDefault: !!o.is_default })),
              }))}
            />
          ) : (
            <p className={notice()}>{UI.unavailable}</p>
          )}
        </div>
      </div>
      <CmsSlot slug="product" />
    </>
  );
}
