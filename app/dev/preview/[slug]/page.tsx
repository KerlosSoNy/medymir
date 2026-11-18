import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsPage } from "@/components/cms/CmsPage";
import { layoutToPage } from "@/lib/cms-sections";
import { devOnly, readDraft, withPreviewData } from "@/lib/cms-preview";
import { widgetCtx } from "@/lib/ctx";
import { cn } from "@/lib/cn";
import { container, notice } from "@/lib/styles";

export const metadata: Metadata = { title: "Draft preview", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Shows a planned page from cms-drafts/<slug>.json BEFORE it is saved to TheCoins
// (the store shows draft pages publicly, so we check the plan here first).
// Only on a developer's computer (npm run dev); the live site returns 404.
export default async function DraftPreview({ params }: { params: Promise<{ slug: string }> }) {
  devOnly();
  const { slug } = await params;
  const draft = await readDraft(slug);
  if (!draft) notFound();
  const ctx = await widgetCtx();
  const page = await withPreviewData(layoutToPage(draft.layout, draft.title), ctx);
  return (
    <>
      <div className={cn(container, "pt-6")}>
        <p className={notice("info")}>
          <strong>Draft preview of “{draft.title}”</strong> (/{slug}): not saved to the store yet. Sample pictures are shown where no picture has been
          uploaded.
        </p>
      </div>
      <CmsPage page={page} ctx={ctx} firstRowClass="pt-12 md:pt-12" />
    </>
  );
}
