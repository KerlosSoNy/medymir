// Announcement bar + main header + category bar (Figma nodes 9:9, 9:22, 9:56).
// Announcement items and extra category-bar links come from the CMS "site-layout" page;
// categories come from the catalogue.
import Link from "next/link";
import type { Category, Tenant } from "@/lib/api";
import { tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { Logo } from "./Logo";
import { SmartLink } from "./SmartLink";
import { HeaderSearch, QuoteListLink, AccountLink, CategoryMenuButton } from "./HeaderClient";

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
  const extra: any[] = nav?.items ?? [];

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
        <Logo tenant={tenant} />
        <HeaderSearch categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
        <div className="header-actions">
          <AccountLink />
          <QuoteListLink />
        </div>
      </div>

      <nav className="category-bar" aria-label={UI.categories}>
        <div className="category-bar-inner">
          <CategoryMenuButton label={tr(nav?.title) || UI.allCategories} categories={categories.map((c) => ({ name: c.name, slug: c.slug ?? c.id }))} />
          {categories.map((c) => (
            <Link key={c.id} href={`/category/${c.slug ?? c.id}`} className={c.slug === highlight ? "hl" : undefined}>
              {c.name}
            </Link>
          ))}
          {extra.map((x, i) => (
            <SmartLink key={i} to={x.link}>
              {tr(x.label)}
            </SmartLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
