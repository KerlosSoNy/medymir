// Connection to TheCoins. All values are public storefront keys (see .env.example).
// Read with literal names so Next.js can inline them into the browser bundle.
export const API_URL = process.env.NEXT_PUBLIC_THECOINS_API_URL ?? "";
export const API_KEY = process.env.NEXT_PUBLIC_THECOINS_API_KEY ?? "";
export const TENANT_ID = process.env.NEXT_PUBLIC_THECOINS_TENANT_ID ?? "";

const missing = [
  !API_URL && "NEXT_PUBLIC_THECOINS_API_URL",
  !API_KEY && "NEXT_PUBLIC_THECOINS_API_KEY",
  !TENANT_ID && "NEXT_PUBLIC_THECOINS_TENANT_ID",
].filter(Boolean);
if (missing.length) {
  throw new Error(
    `Missing environment variables: ${missing.join(", ")}. ` +
      "Set them in .env.local for local runs, or in the hosting provider's environment settings (see .env.example).",
  );
}

// Public catalogue / CMS responses are cached for at most this many seconds.
export const PUBLIC_REVALIDATE_SECONDS = 60;

// CMS page that holds site-wide content (announcement bar, category bar extras, footer).
export const SITE_LAYOUT_SLUG = "site-layout";

// Key of the store's "Brand" product detail (dynamic attribute). Brand pages, the brands page and the
// mega-menu "Featured brands" all read brands from it.
export const BRAND_ATTRIBUTE = "brand";
