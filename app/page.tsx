import { notFound } from "next/navigation";
import { getCmsPage } from "@/lib/api";
import { widgetCtx } from "@/lib/ctx";
import { CmsPage } from "@/components/cms/CmsPage";

// Home = CMS page with slug "home", built in the TheCoins page builder.
export default async function Home() {
  const [page, ctx] = await Promise.all([getCmsPage("home"), widgetCtx()]);
  if (!page) notFound();
  return <CmsPage page={page} ctx={ctx} />;
}
