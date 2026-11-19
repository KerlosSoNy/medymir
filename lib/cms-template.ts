import "server-only";
import { getCmsPage } from "./api";
import { layoutToPage } from "./cms-sections";

/**
 * The CMS page `slug` for a template page (product, quote, brands…). On a developer's computer, `?draft=1`
 * shows the planned cms-drafts/<slug>.json instead, so the real page can be checked before the draft is saved.
 */
export async function templatePage(slug: string, draft?: string) {
  if (draft === "1" && process.env.NODE_ENV === "development") {
    const { readDraft } = await import("./cms-preview");
    const d = await readDraft(slug);
    if (d) return layoutToPage(d.layout, d.title);
  }
  return getCmsPage(slug);
}
