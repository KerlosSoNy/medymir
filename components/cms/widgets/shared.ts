// Shared types and helpers for all CMS widgets.
import DOMPurify from "isomorphic-dompurify";
import type { Brand, Category } from "@/lib/api";
import { tr } from "@/lib/format";

export type RowKind = "full" | "boxed" | "banner" | "compact" | "bleed" | "stack";

export interface WidgetCtx {
  currency: string | null;
  categories: Category[];
  /** The store's Brand list (with logos), used to show a brand's logo on its card. */
  brands: Brand[];
  productCount: number;
  contactEmail: string | null;
  row?: RowKind;
  beside?: boolean;
  withArrows?: boolean;
  /** Current page path (e.g. "/shipping-policy"), so a menu can highlight the page it is on. */
  path?: string;
}
export type P = { w: any; ctx: WidgetCtx };

export const html = (s: unknown) => DOMPurify.sanitize(tr(s), { USE_PROFILES: { html: true } });
export const url = (u: unknown) => (typeof u === "string" && /^(https?:|\/)/.test(u) ? u : "");
