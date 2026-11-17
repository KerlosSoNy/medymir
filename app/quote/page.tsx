import { CmsSlot } from "@/components/CmsSlot";
import { QuoteListView } from "@/components/QuoteListView";
import { UI } from "@/lib/ui";

export const metadata = { title: "Quote list", robots: { index: false } };

// The quote list itself, then the CMS "quote" page (e.g. the request form) below it.
export default function QuotePage() {
  return (
    <>
      <div className="container narrow">
        <h1 className="page-title">{UI.quoteList}</h1>
        <QuoteListView />
      </div>
      <CmsSlot slug="quote" />
    </>
  );
}
