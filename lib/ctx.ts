import "server-only";
import { getBrands, getCategories, getProductCount, getTenant } from "./api";
import type { WidgetCtx } from "@/components/cms/widgets";

/** Data every CMS widget may need (currency, categories with descriptions, counts). */
export async function widgetCtx(): Promise<WidgetCtx> {
  const [tenant, categories, productCount, brands] = await Promise.all([getTenant(), getCategories(), getProductCount(), getBrands()]);
  return {
    currency: tenant?.locale.currency ?? null,
    categories,
    brands,
    productCount,
    contactEmail: tenant?.contact.email ?? null,
  };
}
