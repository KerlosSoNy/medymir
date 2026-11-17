import Link from "next/link";
import type { Tenant } from "@/lib/api";

/**
 * Store logo. Uses the logo uploaded in TheCoins when there is one; otherwise draws the
 * store name as a wordmark (second half in the brand's secondary colour) with the tagline.
 */
export function Logo({ tenant, variant = "header" }: { tenant: Tenant | null; variant?: "header" | "footer" }) {
  const name = (tenant?.name ?? "").toUpperCase();
  const tagline = tenant?.branding.tagline ?? "";
  if (tenant?.branding.logo_url && variant === "header")
    return (
      <Link href="/" className="logo" aria-label={tenant.name}>
        <img src={tenant.branding.logo_url} alt={tenant.name} height={41} />
      </Link>
    );
  const cut = Math.ceil(name.length / 2);
  const first = name.slice(0, cut);
  const second = name.slice(cut);
  return (
    <Link href="/" className={`logo logo-${variant}`} aria-label={tenant?.name}>
      <span className="logo-word">
        {first}
        <span className="logo-accent">{second}</span>
      </span>
      {tagline && <span className="logo-tagline">{tagline.toUpperCase()}</span>}
    </Link>
  );
}
