// Server-side reads of PUBLIC TheCoins data (CMS, catalogue, branding).
// Cached for at most PUBLIC_REVALIDATE_SECONDS. Private data (quote list, customer)
// never goes through here — see lib/client-api.ts.
import "server-only";
import { cache } from "react";
import { API_KEY, API_URL, BRAND_ATTRIBUTE, PUBLIC_REVALIDATE_SECONDS, SITE_LAYOUT_SLUG, TENANT_ID } from "./config";
import { slugify } from "./format";

type Query = Record<string, string | number | boolean | undefined | null>;

async function get<T = any>(endpoint: string, query: Query = {}): Promise<T | null> {
  const url = new URL(`${API_URL}/${endpoint}`);
  url.searchParams.set("tenant_id", TENANT_ID);
  url.searchParams.set("lang", "en");
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  try {
    const res = await fetch(url, {
      headers: { apikey: API_KEY, "Accept-Language": "en" },
      next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface Tenant {
  id: string;
  name: string;
  branding: {
    logo_url: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    tagline: string | null;
  };
  contact: { phone: string | null; email: string | null; address: string | null };
  locale: { currency: string | null };
}

export const getTenant = cache(async (): Promise<Tenant | null> => {
  const r = await get<{ success: boolean; data: Tenant }>("get-tenant-info");
  return r?.success ? r.data : null;
});

/** A CMS page by slug, or null when it doesn't exist. */
export const getCmsPage = cache(async (slug: string) => {
  const r = await get<{ success: boolean; page?: any }>("get-cms-pages", { slug });
  return r?.success && r.page ? r.page : null;
});

/** All widgets of the site-wide layout page, keyed by their `variant`. */
export const getSiteLayout = cache(async (): Promise<Record<string, any>> => {
  const page = await getCmsPage(SITE_LAYOUT_SLUG);
  const out: Record<string, any> = {};
  for (const row of page?.rows ?? [])
    for (const col of row.columns ?? [])
      for (const w of col.widgets ?? []) if (w.variant && !out[w.variant]) out[w.variant] = w;
  return out;
});

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  parent_category_id: string | null;
  sort_order: number;
}

export const getFullMenu = cache(async () =>
  get<{ categories: Category[]; items: any[]; modifiers: any[] }>("get-full-menu"),
);

/** Top-level active categories in display order, each with its slug. */
export const getCategories = cache(async (): Promise<Category[]> => {
  const [menu, listing] = await Promise.all([getFullMenu(), getCategoryProducts({ per_page: 1 })]);
  const slugs = new Map<string, string>((listing?.sub_categories ?? []).map((c: any) => [c.id, c.slug]));
  return (menu?.categories ?? [])
    .filter((c) => c.is_active && !c.parent_category_id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({ ...c, slug: slugs.get(c.id) ?? c.id }));
});

export interface Filter {
  name: string;
  label: string;
  type: "select" | "multi_select" | "range" | "boolean";
  values?: any[];
  min?: number;
  max?: number;
}

export async function getCategoryProducts(query: Query) {
  return get<{
    category: any | null;
    sub_categories: any[];
    filters: Filter[];
    products: any[];
    pagination: { page: number; per_page: number; total_pages: number; products_count: number };
    active_filters: Record<string, unknown>;
    seo: { title?: string; description?: string; heading?: string } | null;
  }>("get-category-products", query);
}

/** Category links may use an id or a slug. Resolve both to an id. */
/** Active sub-categories of a category (store categories whose parent is this one), in the store's order. */
export async function getSubcategories(parentId: string): Promise<Category[]> {
  const menu = await getFullMenu();
  return (menu?.categories ?? [])
    .filter((c) => c.parent_category_id === parentId && c.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((c) => ({ ...c, slug: c.slug || slugify(c.name) }));
}

export async function resolveCategory(slugOrId: string): Promise<Category | null> {
  const cats = await getCategories();
  return cats.find((c) => c.id === slugOrId || c.slug === slugOrId) ?? null;
}

export async function getProduct(id: string) {
  const r = await get<{ success: boolean; data: any[] }>("get-menu-items", { item_id: id });
  const p = r?.success ? r.data?.[0] : null;
  return p && p.id === id ? p : null;
}

export const getProductCount = cache(async () => {
  const r = await getCategoryProducts({ per_page: 1 });
  return r?.pagination?.products_count ?? 0;
});

/* ---------- Brands: the store's "Brand" product detail (dynamic attribute) ---------- */

export interface Brand {
  /** Brand name as stored on products, e.g. "Boston Scientific". */
  name: string;
  slug: string;
  /** Logo uploaded for the brand in TheCoins (Products → product details → Brand). */
  logo: string | null;
  /** Id of the brand in the Brand list (used by "Product Attributes" sections to pick brands). */
  id?: string;
  /** First banner picture uploaded for the brand in the Brand list (a photo, not the logo), if any. */
  banner?: string | null;
  /** Description written for the brand in the Brand list (used as its tagline). */
  description?: string | null;
}

/** All active brands from the store's Brand list, in the store's order. */
export const getBrands = cache(async (): Promise<Brand[]> => {
  const r = await get<{ success: boolean; attributes: any[] }>("get-product-attributes");
  const attr = r?.attributes?.find((a) => a.name === BRAND_ATTRIBUTE);
  return (attr?.values ?? [])
    .filter((v: any) => v.is_active !== false && v.value)
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((v: any) => ({
      id: v.id,
      name: v.value,
      slug: v.slug || slugify(v.value),
      logo: v.image_url || null,
      banner: (Array.isArray(v.banners) && v.banners.find((b: unknown) => typeof b === "string" && b)) || null,
      description: typeof v.description === "string" && v.description.trim() ? v.description.trim() : null,
    }));
});

export async function resolveBrand(slug: string): Promise<Brand | null> {
  return (await getBrands()).find((b) => b.slug === slug) ?? null;
}

/** Brands that have products in each category (the category's Brand filter), keyed by category slug. */
export const getCategoryBrands = cache(async (): Promise<Record<string, string[]>> => {
  const cats = await getCategories();
  const entries = await Promise.all(
    cats.map(async (c) => {
      const r = await getCategoryProducts({ category_id: c.id, per_page: 1 });
      const f = r?.filters?.find((x) => x.name === BRAND_ATTRIBUTE);
      return [c.slug ?? c.id, (f?.values ?? []).map(String)] as const;
    }),
  );
  return Object.fromEntries(entries);
});
