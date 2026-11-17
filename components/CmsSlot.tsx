// Template pages (category, product, quote, …) render their own CMS page slug as
// editable sections. If the owner hasn't created that page, nothing is rendered.
import { getCmsPage } from "@/lib/api";
import { widgetCtx } from "@/lib/ctx";
import { CmsPage } from "./cms/CmsPage";

export async function CmsSlot({ slug }: { slug: string }) {
  const [page, ctx] = await Promise.all([getCmsPage(slug), widgetCtx()]);
  return page ? <CmsPage page={page} ctx={ctx} /> : null;
}
