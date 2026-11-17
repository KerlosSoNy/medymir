import "server-only";
import { getCategories, getProductCount, getTenant } from "./api";
import type { WidgetCtx } from "@/components/cms/widgets";

/** Data every CMS widget may need (currency, categories with descriptions, counts). */
export async function widgetCtx(): Promise<WidgetCtx> {
  const [tenant, categories, productCount] = await Promise.all([getTenant(), getCategories(), getProductCount()]);
  return {
    currency: tenant?.locale.currency ?? null,
    categories,
    productCount,
    contactEmail: tenant?.contact.email ?? null,
  };
}
