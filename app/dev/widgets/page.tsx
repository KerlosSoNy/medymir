import type { Metadata } from "next";
import { CmsPage } from "@/components/cms/CmsPage";
import { cn } from "@/lib/cn";
import { SECTIONS, WIDGET_MENU, layoutToPage, recipeWidget, recipesFor, type MenuWidget, type SectionRecipe } from "@/lib/cms-sections";
import { devOnly, withPreviewData } from "@/lib/cms-preview";
import { widgetCtx } from "@/lib/ctx";
import { container, pageIntro, pageTitle } from "@/lib/styles";
import { GallerySearch } from "./GallerySearch";

export const metadata: Metadata = { title: "Section gallery", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const BADGE = {
  yes: "bg-[#e3f4ec] text-[#11603a]",
  avoid: "bg-[#fff4dc] text-[#7a5200]",
  no: "bg-surface-alt text-muted",
};
const BADGE_TEXT = { yes: "On our website", avoid: "Don't use", no: "Not on our website yet" };

// The TheCoins "Add widget" menu, widget by widget (lib/cms-sections.ts → WIDGET_MENU), and under each widget
// the looks our site can give it (SECTIONS recipes), drawn with sample content.
// Only on a developer's computer (npm run dev); the live site returns 404.
export default async function SectionGallery() {
  devOnly();
  const ctx = await widgetCtx();
  const pages = new Map(await Promise.all(SECTIONS.map(async (s) => [s.id, await withPreviewData(layoutToPage([s.row]), ctx)] as const)));
  const total = WIDGET_MENU.reduce((n, g) => n + g.widgets.length, 0);

  const Look = ({ r }: { r: SectionRecipe }) => {
    const variant = recipeWidget(r).settings.variant;
    return (
      <article id={r.id} className="scroll-mt-24 border-t border-dashed border-line">
        <header className={cn(container, "flex flex-col gap-1 pt-5")}>
          <p className="flex flex-wrap items-center gap-2 text-[15px] text-ink-2">
            <span className="text-muted">Look:</span>
            <strong>{r.name}</strong>
            <code className="rounded bg-surface-alt px-2 py-0.5 text-xs text-muted">{r.id}</code>
          </p>
          <p className="text-sm text-muted">{r.use}</p>
          {r.notes && <p className="text-[13px] text-muted-3">Note: {r.notes}</p>}
          {variant && (
            <p className="text-[13px] text-muted-3">
              Needs the hidden setting <code>variant: "{variant}"</code>, which the TheCoins form doesn't show. Ask Claude to add this look.
            </p>
          )}
        </header>
        <CmsPage page={pages.get(r.id)} ctx={ctx} />
        <details className={cn(container, "pb-6 text-xs text-muted")}>
          <summary className="cursor-pointer">Saved data (for Claude)</summary>
          <pre className="mt-2 max-h-80 overflow-auto rounded-lg bg-surface-alt p-3">{JSON.stringify(r.row, null, 2)}</pre>
        </details>
      </article>
    );
  };

  const Widget = ({ m }: { m: MenuWidget }) => {
    const looks = m.support === "yes" ? recipesFor(m.type) : [];
    return (
      <section id={m.type} data-widget={`${m.name} ${m.description} ${m.type}`.toLowerCase()} className="scroll-mt-24">
        <header className={cn(container, "flex flex-col gap-1 py-4")}>
          <p className="flex flex-wrap items-center gap-2.5">
            <strong className="text-lg text-ink">{m.name}</strong>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", BADGE[m.support])}>{BADGE_TEXT[m.support]}</span>
            {looks.length > 1 && <span className="text-xs text-muted">{looks.length} looks</span>}
          </p>
          <p className="text-sm text-muted">{m.description}</p>
          {m.note && <p className="text-[13px] text-muted-3">{m.note}</p>}
        </header>
        {looks.map((r) => (
          <Look key={r.id} r={r} />
        ))}
      </section>
    );
  };

  return (
    <>
      <div className={container}>
        <h1 className={pageTitle}>Section gallery</h1>
        <p className={pageIntro}>
          Every widget in the TheCoins page builder (<em>Add widget</em> menu), with the same names. Under each widget you see how it looks on our
          website, with sample texts and pictures. To use one, tell Claude the widget and the look, e.g.{" "}
          <em>“/cms-page about: a Text + Image, then an FAQ / Accordion”</em>.
        </p>
        <GallerySearch total={total} />
        <nav className="mb-4 flex flex-wrap gap-2" aria-label="Menu groups">
          {WIDGET_MENU.map(({ group }) => (
            <a
              key={group}
              href={`#${slug(group)}`}
              className="rounded-full border border-chip-border bg-chip-bg px-4 py-2 text-[13px] font-medium text-ink-3 hover:border-ink-3"
            >
              {group}
            </a>
          ))}
        </nav>
      </div>

      {WIDGET_MENU.map(({ group, widgets }) => (
        <div key={group} id={slug(group)} data-group className="scroll-mt-24">
          <h2 className={cn(container, "mt-8 border-b border-line pb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted")}>{group}</h2>
          <div className="divide-y divide-line">
            {widgets.map((m) => (
              <Widget key={m.type} m={m} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
