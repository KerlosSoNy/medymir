import Link from "next/link";
import { money, plain } from "@/lib/format";
import { UI } from "@/lib/ui";
import { AddToQuote } from "./AddToQuote";

/** B2B product card: image, brand/REF from product data, indicative price, add to quote list. */
export function ProductCard({ p, currency }: { p: any; currency: string | null }) {
  const href = `/product/${p.id}`;
  const brand = p.custom_attributes?.brand ?? p.custom_attributes?.Brand;
  const hasOptions = !Array.isArray(p.modifiers) || p.modifiers.length > 0 || (p.variation_groups?.length ?? 0) > 0;
  const available = p.is_available !== false && p.is_in_stock !== false;
  const onSale = p.compare_at_price != null && Number(p.compare_at_price) > Number(p.price);
  return (
    <article className="pcard">
      <Link href={href} className="pcard-media" aria-label={p.name}>
        {p.image_url ? <img src={p.image_url} alt={p.name} loading="lazy" /> : <span className="pcard-ph" aria-hidden />}
      </Link>
      <div className="pcard-body">
        {(brand || p.sku) && (
          <p className="pcard-meta">
            {brand && <span>{String(brand)}</span>}
            {p.sku && <span>REF {p.sku}</span>}
          </p>
        )}
        <h3 className="pcard-name">
          <Link href={href}>{p.name}</Link>
        </h3>
        {p.description && <p className="pcard-desc">{plain(p.description)}</p>}
        <div className="pcard-foot">
          {p.price != null && Number(p.price) > 0 && (
            <span className="pcard-price" title={UI.indicativePrice}>
              {money(p.price, currency)}
              {onSale && <s>{money(p.compare_at_price, currency)}</s>}
            </span>
          )}
          {available &&
            (hasOptions ? (
              <Link href={href} className="btn btn-sm btn-dark">
                {UI.viewDetails}
              </Link>
            ) : (
              <AddToQuote productId={p.id} compact />
            ))}
        </div>
      </div>
    </article>
  );
}
