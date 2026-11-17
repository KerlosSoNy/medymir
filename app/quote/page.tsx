import { CmsSlot } from "@/components/CmsSlot";
import { QuoteListView } from "@/components/QuoteListView";
import { UI } from "@/lib/ui";
import { cn } from "@/lib/cn";
import { container, pageTitle } from "@/lib/styles";

export const metadata = { title: "Quote list", robots: { index: false } };

// The quote list itself, then the CMS "quote" page (e.g. the request form) below it.
export default function QuotePage() {
  return (
    <>
      <div className={cn(container, "max-w-[820px]")}>
        <h1 className={pageTitle}>{UI.quoteList}</h1>
        <QuoteListView />
      </div>
      <CmsSlot slug="quote" />
    </>
  );
}
