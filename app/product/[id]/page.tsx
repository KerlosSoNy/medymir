import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { getProduct, getTenant } from "@/lib/api";
import { money, plain } from "@/lib/format";
import { UI } from "@/lib/ui";
import { CmsSlot } from "@/components/CmsSlot";
import { ProductBuy } from "@/components/ProductBuy";

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
      <div className="container product-page">
        <div className="pp-media">
          {images.length ? images.map((src, i) => <img key={i} src={src} alt={p.name} loading={i ? "lazy" : "eager"} />) : <span className="pcard-ph big" />}
        </div>
        <div className="pp-info">
          {p.category_name && (
            <Link className="pp-cat" href={`/category/${p.category_slug || p.category_id}`}>
              {p.category_name}
            </Link>
          )}
          <h1>{p.name}</h1>
          {p.sku && <p className="pp-ref">REF {p.sku}</p>}
          {p.price != null && Number(p.price) > 0 && (
            <p className="pp-price">
              {money(p.price, tenant?.locale.currency)}
              {onSale && <s>{money(p.compare_at_price, tenant?.locale.currency)}</s>}
              <small>{UI.indicativePrice}</small>
            </p>
          )}
          {p.description && <div className="rich" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(p.description) }} />}
          {attrs.length > 0 && (
            <dl className="attrs">
              {attrs.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{String(v)}</dd>
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
            <p className="notice">{UI.unavailable}</p>
          )}
        </div>
      </div>
      <CmsSlot slug="product" />
    </>
  );
}
