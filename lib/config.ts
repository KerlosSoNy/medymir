// Connection to TheCoins. All values are public storefront keys (see .env.example).
export const API_URL = process.env.NEXT_PUBLIC_THECOINS_API_URL ?? "";
export const API_KEY = process.env.NEXT_PUBLIC_THECOINS_API_KEY ?? "";
export const TENANT_ID = process.env.NEXT_PUBLIC_THECOINS_TENANT_ID ?? "";

// Public catalogue / CMS responses are cached for at most this many seconds.
export const PUBLIC_REVALIDATE_SECONDS = 60;

// CMS page that holds site-wide content (announcement bar, category bar extras, footer).
export const SITE_LAYOUT_SLUG = "site-layout";
