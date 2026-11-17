// Announcement bar + main header + category bar (Figma nodes 9:9, 9:22, 9:56).
// Announcement items and extra category-bar links come from the CMS "site-layout" page;
// categories come from the catalogue.
import type { Category, Tenant } from "@/lib/api";
import { tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { Logo } from "./Logo";
import { HeaderSearch, QuoteListLink, AccountLink } from "./HeaderClient";
import { CategoryNav, MobileMenu, type NavCategory, type NavExtra } from "./CategoryNav";

export function Header({
  tenant,
  layout,
  categories,
}: {
  tenant: Tenant | null;
  layout: Record<string, any>;
  categories: Category[];
}) {
  const announcement: any[] = layout.announcement?.items ?? [];
  const nav = layout["category-nav"];
  const highlight: string | undefined = nav?.highlight;
  const navCats: NavCategory[] = categories.map((c) => ({ name: c.name, slug: c.slug ?? c.id }));
  const extras: NavExtra[] = (nav?.items ?? []).map((x: any) => ({ label: tr(x.label), link: x.link }));

  return (
    <header className="site-header">
      {announcement.length > 0 && (
        <div className="announce" role="note">
          <div className="announce-track">
            {announcement.map((a, i) => (
              <span key={i} className="announce-item">
                <span className="announce-dot" aria-hidden>
                  •
                </span>
                {tr(a.label)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="header-main">
        <MobileMenu categories={navCats} extras={extras} />
        <Logo tenant={tenant} />
        <HeaderSearch categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
        <div className="header-actions">
          <AccountLink />
          <QuoteListLink />
        </div>
      </div>

      <CategoryNav title={tr(nav?.title) || UI.allCategories} categories={navCats} highlight={highlight} extras={extras} />
    </header>
  );
}
