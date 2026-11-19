import Link from "next/link";
import { cn } from "@/lib/cn";
import { isReadyStock, money, plain } from "@/lib/format";
import { btn } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { AddToQuote } from "./AddToQuote";

/**
 * Product photo in a fixed frame. Any photo shape (wide, tall, small, transparent PNG, white
 * background) is shown whole: contained, padded and blended onto a light background.
 * Without a photo it shows a neutral placeholder instead of an empty box.
 */
export function ProductPhoto({
  src,
  alt,
  className,
  imgClassName,
  size = "md",
  eager,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  size?: "sm" | "md" | "lg";
  eager?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-[#f4f6f9] isolate", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          className={cn(
            "absolute inset-0 size-full object-contain mix-blend-multiply transition-transform duration-300",
            size === "sm" ? "p-1" : size === "lg" ? "p-6 md:p-10" : "p-3 md:p-4",
            imgClassName,
          )}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-3" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={size === "sm" ? "size-6" : size === "lg" ? "size-14" : "size-9"}
          >
            <path d="M21 8.5 12 3.5 3 8.5l9 5 9-5Z" />
            <path d="M21 8.5v7L12 20.5 3 15.5v-7M12 20.5v-7" />
          </svg>
          {size !== "sm" && <span className="text-xs font-medium">{UI.noImage}</span>}
        </div>
      )}
    </div>
  );
}

/** B2B product card (Figma Card/Product 87:3): brand/REF, photo, name, description, price (Ready Stock only), add to quote list. */
export function ProductCard({ p, currency }: { p: any; currency: string | null }) {
  const href = `/product/${p.id}`;
  const brand = p.custom_attributes?.brand ?? p.custom_attributes?.Brand;
  const hasOptions = !Array.isArray(p.modifiers) || p.modifiers.length > 0 || (p.variation_groups?.length ?? 0) > 0;
  const available = p.is_available !== false && p.is_in_stock !== false;
  const onSale = p.compare_at_price != null && Number(p.compare_at_price) > Number(p.price);
  // Prices only on Ready Stock offers; other products are "Request a quotation" (owner's decision, 19 Nov).
  const hasPrice = isReadyStock(p) && p.price != null && Number(p.price) > 0;
  return (
    <article className="group flex h-full min-w-0 flex-col rounded-xl border border-[#e6eaf0] bg-white p-2.5 transition hover:border-[#cfd6e0] hover:shadow-[0_12px_30px_rgb(15_31_64/0.1)] sm:p-[15px]">
      {(brand || p.sku) && (
        <p className="mb-2 flex min-h-4 flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#4b5565] sm:text-[11px]">
          {brand && <span className="text-ink-2">{String(brand)}</span>}
          {p.sku && <span className="truncate">REF {p.sku}</span>}
        </p>
      )}
      <Link href={href} aria-label={p.name} className="block">
        <ProductPhoto src={p.image_url} alt={p.name} className="aspect-[4/3]" imgClassName="group-hover:scale-[1.04]" />
      </Link>
      <h3 className="mt-3 line-clamp-2 font-head text-sm leading-[1.3] font-bold text-[#202b40] sm:text-[15px]">
        <Link href={href} className="hover:text-blue-link">
          {p.name}
        </Link>
      </h3>
      {p.description && <p className="mt-1 line-clamp-2 text-xs text-[#5f6b7d] sm:text-[13px]">{plain(p.description)}</p>}
      <div className="mt-auto flex flex-col gap-2.5 pt-3.5">
        {hasPrice ? (
          <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-bold text-ink-2 sm:text-[15px]" title={UI.indicativePrice}>
            {money(p.price, currency)}
            {onSale && <s className="text-xs font-normal text-muted-3 sm:text-[13px]">{money(p.compare_at_price, currency)}</s>}
          </p>
        ) : (
          <p className="flex items-center gap-2 text-xs font-semibold text-[#202b40] sm:text-[13px]">
            <img src="/icons/card-file.svg" width={14} height={14} alt="" className="size-3.5 shrink-0" />
            {UI.requestQuote}
          </p>
        )}
        {!available && (
          <p className="flex items-center gap-2 text-xs text-[#8a6a23] sm:text-[13px]">
            <img src="/icons/card-box.svg" width={14} height={14} alt="" className="size-3.5 shrink-0" />
            {UI.unavailable}
          </p>
        )}
        {available &&
          (hasOptions ? (
            <Link href={href} className={btn("dark", "sm", "w-full rounded-lg min-h-[38px] px-2.5 text-xs sm:min-h-[42px] sm:px-3.5 sm:text-sm whitespace-normal text-center")}>
              {UI.viewDetails}
            </Link>
          ) : (
            <AddToQuote productId={p.id} />
          ))}
      </div>
    </article>
  );
}
