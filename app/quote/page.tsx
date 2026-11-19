import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CmsPage } from "@/components/cms/CmsPage";
import { QuoteRequest, type QuoteTexts } from "@/components/QuoteRequest";
import { pickWidgets } from "@/lib/cms-pick";
import { templatePage } from "@/lib/cms-template";
import { widgetCtx } from "@/lib/ctx";
import { tr } from "@/lib/format";
import { cn } from "@/lib/cn";
import { container } from "@/lib/styles";
import { UI } from "@/lib/ui";

export const metadata = { title: "Quote list", robots: { index: false } };

// Quote list page (Figma "Quote list", node 23:298). The list, form and sidebar are in QuoteRequest; their texts
// come from the CMS page "quote" (Page builder → Quote):
//   contact-form/quote-page   → intro line, sidebar note + footnote, attachment box, consent line, small print, button text
//   stats-counter/quote-next  → "What happens next?" steps
//   button-cta/quote-whatsapp → "Prefer WhatsApp?" card (only shown when its link is set)
// Any other section on that page is shown below. Form fields come from the store's Contact form settings.
const CMS_SLUG = "quote";
const MAIN = "contact-form/quote-page";
const NEXT = "stats-counter/quote-next";
const WHATSAPP = "button-cta/quote-whatsapp";

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ draft?: string }> }) {
  const { draft } = await searchParams;
  const [page, ctx] = await Promise.all([templatePage(CMS_SLUG, draft), widgetCtx()]);
  const { picked, rest } = pickWidgets(page, [MAIN, NEXT, WHATSAPP]);
  const m = picked[MAIN][0] ?? {};
  const n = picked[NEXT][0];
  const wa = picked[WHATSAPP][0];

  const texts: QuoteTexts = {
    subtitle: tr(m.subtitle),
    noteTitle: tr(m.noteTitle),
    noteText: tr(m.noteText),
    footnote: tr(m.footnote),
    attachTitle: tr(m.attachTitle),
    attachText: tr(m.attachText),
    consentText: tr(m.consentText),
    privacyLinkText: tr(m.privacyLinkText),
    privacyLink: m.privacyLink ?? "",
    smallPrint: tr(m.smallPrint),
    submitText: tr(m.submitText),
    subject: tr(m.subject),
  };

  return (
    <>
      <Breadcrumbs current={UI.quoteList} shop />
      <div className={cn(container, "pt-5 pb-14 md:pb-[72px]")}>
        <QuoteRequest
          texts={texts}
          steps={n ? { title: tr(n.title), items: (n.items ?? []).map((i: any) => tr(i.label)).filter(Boolean) } : null}
          whatsapp={wa?.link ? { title: tr(wa.title), subtitle: tr(wa.subtitle), text: tr(wa.text), link: wa.link } : null}
          fallbackEmail={ctx.contactEmail}
        />
      </div>
      {rest?.rows?.length > 0 && <CmsPage page={rest} ctx={ctx} />}
    </>
  );
}
