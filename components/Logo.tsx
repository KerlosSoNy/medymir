import Link from "next/link";
import type { Tenant } from "@/lib/api";
import { cn } from "@/lib/cn";

/**
 * Store logo. Uses the logo uploaded in TheCoins when there is one; otherwise draws the
 * store name as a wordmark (second half in the brand's secondary colour) with the tagline.
 * Header sizes follow Figma: phone 19px, tablet 24px, desktop 31px.
 */
export function Logo({ tenant, variant = "header" }: { tenant: Tenant | null; variant?: "header" | "footer" }) {
  const name = (tenant?.name ?? "").toUpperCase();
  const tagline = tenant?.branding.tagline ?? "";
  const footer = variant === "footer";
  if (tenant?.branding.logo_url && !footer)
    return (
      <Link href="/" className="inline-flex shrink-0" aria-label={tenant.name}>
        <img src={tenant.branding.logo_url} alt={tenant.name} height={41} className="h-[26px] w-auto max-w-none md:h-8 lg:h-[41px]" />
      </Link>
    );
  const cut = Math.ceil(name.length / 2);
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 flex-col items-center whitespace-nowrap", footer ? "text-white" : "text-brand")}
      aria-label={tenant?.name}
    >
      <span
        className={cn(
          "font-head font-bold tracking-[-0.02em]",
          footer ? "text-[40px] leading-[44px]" : "text-[19.2px] leading-[21px] md:text-[24.2px] md:leading-[26.5px] lg:text-[31px] lg:leading-[34px]",
        )}
      >
        {name.slice(0, cut)}
        <span className={footer ? "text-gold-soft" : "text-gold"}>{name.slice(cut)}</span>
      </span>
      {tagline && (
        <span
          className={cn(
            "font-bold",
            footer ? "text-[7px] tracking-[0.1em]" : "text-[3.4px] tracking-[0.08em] md:text-[4.3px] lg:text-[5.5px]",
          )}
        >
          {tagline.toUpperCase()}
        </span>
      )}
    </Link>
  );
}
