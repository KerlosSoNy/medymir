"use client";
// Category bar with mega menus (Figma "Menus" row) and the tablet/phone menu drawer.
// Desktop: hovering or focusing a category opens its panel; "All categories" opens on hover or click.
// Touch screens: tapping a category goes to its page; "All categories" opens on tap.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORY_MENUS, MENU_GROUPS, QUOTE_LINK, groupByTitle, subCategoryHref, type MenuGroup } from "@/lib/menu";
import { slugify } from "@/lib/format";
import { UI } from "@/lib/ui";
import { SmartLink } from "./SmartLink";

export type NavCategory = { name: string; slug: string };
export type NavExtra = { label: string; link: string };

const ALL = "__all";
const OPEN_DELAY = 90;
const CLOSE_DELAY = 160;

const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

export function CategoryNav({
  title,
  categories,
  highlight,
  extras,
}: {
  title: string;
  categories: NavCategory[];
  highlight?: string;
  extras: NavExtra[];
}) {
  const path = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const later = (fn: () => void, ms: number) => {
    clear();
    timer.current = setTimeout(fn, ms);
  };
  const close = useCallback(() => {
    clear();
    setOpen(null);
  }, []);

  // Close on navigation, outside click and Escape.
  useEffect(close, [path, close]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !navRef.current?.contains(e.target as Node) && close();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const trigger = navRef.current?.querySelector<HTMLElement>(`[data-menu="${open}"]`);
      close();
      trigger?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  useEffect(() => clear, []);

  const hoverProps = (key: string) => ({
    onMouseEnter: () => canHover() && later(() => setOpen(key), open ? 0 : OPEN_DELAY),
    onFocus: () => canHover() && (clear(), setOpen(key)),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowDown") return;
      e.preventDefault();
      setOpen(key);
      requestAnimationFrame(() => navRef.current?.querySelector<HTMLElement>(".mm-panel a, .mm-panel button")?.focus());
    },
  });

  const menu = open && open !== ALL ? CATEGORY_MENUS[open] : null;

  return (
    <nav
      className="category-bar"
      aria-label={UI.categories}
      ref={navRef}
      onMouseLeave={() => canHover() && later(() => setOpen(null), CLOSE_DELAY)}
      onMouseEnter={() => open && clear()}
    >
      <div className="category-bar-inner">
        <button
          type="button"
          className={`allcats${open === ALL ? " is-open" : ""}`}
          data-menu={ALL}
          aria-expanded={open === ALL}
          aria-controls="mega-menu"
          onClick={() => (clear(), setOpen((o) => (o === ALL ? null : ALL)))}
          onMouseEnter={() => canHover() && later(() => setOpen(ALL), open ? 0 : OPEN_DELAY)}
          onKeyDown={hoverProps(ALL).onKeyDown}
        >
          <img src="/icons/menu.svg" width={17} height={17} alt="" />
          {title}
        </button>
        {categories.map((c) => {
          const href = `/category/${c.slug}`;
          const hasMenu = !!CATEGORY_MENUS[c.slug];
          const cls = [c.slug === highlight && "hl", (open === c.slug || isActive(path, href)) && "is-open"].filter(Boolean).join(" ");
          return (
            <Link
              key={c.slug}
              href={href}
              className={cls || undefined}
              data-menu={c.slug}
              aria-expanded={hasMenu ? open === c.slug : undefined}
              aria-controls={hasMenu ? "mega-menu" : undefined}
              {...(hasMenu
                ? hoverProps(c.slug)
                : { onMouseEnter: () => canHover() && later(() => setOpen(null), open ? 0 : OPEN_DELAY), onFocus: close })}
            >
              {c.name}
            </Link>
          );
        })}
        {extras.map((x, i) => (
          <span key={i} onMouseEnter={() => canHover() && later(() => setOpen(null), 0)} onFocus={close}>
            <SmartLink to={x.link} className={isActive(path, x.link) ? "is-open" : undefined}>
              {x.label}
            </SmartLink>
          </span>
        ))}
      </div>

      {open && (
        <div className="mm-panel" id="mega-menu" onMouseEnter={clear} onClick={(e) => (e.target as Element).closest("a") && close()}>
          <div className="mm-inner">
            {open === ALL ? <AllCategoriesPanel /> : menu && <CategoryPanel slug={open} menu={menu} />}
          </div>
        </div>
      )}
    </nav>
  );
}

function Bullets({ group, className }: { group: MenuGroup; className?: string }) {
  return (
    <ul className={`mm-list ${className ?? ""}`}>
      {group.items.map((item) => (
        <li key={item}>
          <Link href={subCategoryHref(group.category, item)}>{item}</Link>
        </li>
      ))}
    </ul>
  );
}

/** Figma 12:476 — every group as a numbered card, four per row. */
function AllCategoriesPanel() {
  return (
    <div className="mm-all">
      {MENU_GROUPS.map((g, i) => (
        <section key={g.title} className="mm-card">
          <Link href={`/category/${g.category}`} className="mm-card-head">
            <span className="mm-badge">{String(i + 1).padStart(2, "0")}</span>
            <span>{g.title}</span>
          </Link>
          <Bullets group={g} />
        </section>
      ))}
    </div>
  );
}

/** Figma 14:594 / 14:729 / 14:873 — groups, "view all" link, promo card, featured brands. */
function CategoryPanel({ slug, menu }: { slug: string; menu: (typeof CATEGORY_MENUS)[string] }) {
  const groups = menu.groups.map(groupByTitle).filter((g): g is MenuGroup => !!g);
  // A single long group is split over two columns, as in the Cardiovascular design.
  const split = groups.length === 1 && groups[0].items.length > 5;
  return (
    <>
      <div className="mm-content">
        <div className="mm-subs">
          <div className="mm-groups" style={{ "--cols": split ? 1 : groups.length } as React.CSSProperties}>
            {groups.map((g) => (
              <section key={g.title} className="mm-group">
                <h3>{g.title}</h3>
                <Bullets group={g} className={split ? "two-col" : undefined} />
              </section>
            ))}
          </div>
          {menu.viewAll && (
            <Link href={`/category/${slug}`} className="mm-viewall">
              {menu.viewAll}
            </Link>
          )}
        </div>
        {menu.promo && (
          <aside className="mm-promo">
            <h4>{menu.promo.title}</h4>
            <p>{menu.promo.text}</p>
            <Link href={QUOTE_LINK} className="btn btn-dark">
              {UI.requestAQuote}
              <img src="/icons/arrow-right-white.svg" width={16} height={16} alt="" />
            </Link>
          </aside>
        )}
      </div>
      {!!menu.brands?.length && (
        <div className={`mm-brands${menu.brands.length > 3 ? " spread" : ""}`}>
          <span className="mm-brands-label">{UI.featuredBrands}</span>
          {menu.brands.map((b) => (
            <Link key={b} href={`/brand/${slugify(b)}`} className="mm-brand">
              {b}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

/** Tablet / phone: hamburger button + slide-in drawer (Figma Header/Tablet 112:175, Header/Mobile 112:149). */
export function MobileMenu({ categories, extras }: { categories: NavCategory[]; extras: NavExtra[] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      btnRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="menu-btn"
        aria-label={UI.menu}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <img src="/icons/menu-dark.svg" width={22} height={22} alt="" />
      </button>
      <div className={`drawer-backdrop${open ? " open" : ""}`} onClick={() => setOpen(false)} aria-hidden />
      <div
        id="mobile-menu"
        className={`drawer${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={UI.menu}
        inert={!open}
        onClick={(e) => (e.target as Element).closest("a") && setOpen(false)}
      >
        <div className="drawer-head">
          <strong>{UI.allCategories}</strong>
          <button ref={closeRef} type="button" className="drawer-close" aria-label={UI.close} onClick={() => setOpen(false)}>
            <span aria-hidden />
          </button>
        </div>
        <ul className="drawer-list">
          {categories.map((c) => {
            const groups = (CATEGORY_MENUS[c.slug]?.groups ?? []).map(groupByTitle).filter((g): g is MenuGroup => !!g);
            const isOpen = expanded === c.slug;
            return (
              <li key={c.slug} className={isOpen ? "open" : undefined}>
                <div className="drawer-row">
                  <Link href={`/category/${c.slug}`} className={isActive(path, `/category/${c.slug}`) ? "active" : undefined}>
                    {c.name}
                  </Link>
                  {groups.length > 0 && (
                    <button
                      type="button"
                      className="drawer-toggle"
                      aria-expanded={isOpen}
                      aria-label={`${c.name}: ${isOpen ? UI.collapse : UI.expand}`}
                      onClick={() => setExpanded(isOpen ? null : c.slug)}
                    >
                      <img src="/icons/chevron-down.svg" width={14} height={14} alt="" />
                    </button>
                  )}
                </div>
                {isOpen &&
                  groups.map((g) => (
                    <div key={g.title} className="drawer-group">
                      {groups.length > 1 && <h4>{g.title}</h4>}
                      <Bullets group={g} />
                    </div>
                  ))}
              </li>
            );
          })}
          {extras.map((x, i) => (
            <li key={`x${i}`}>
              <div className="drawer-row">
                <SmartLink to={x.link}>{x.label}</SmartLink>
              </div>
            </li>
          ))}
          <li>
            <div className="drawer-row">
              <Link href="/categories">{UI.categories} →</Link>
            </div>
          </li>
        </ul>
        <div className="drawer-foot">
          <Link href={QUOTE_LINK} className="btn btn-dark">
            {UI.requestAQuote}
            <img src="/icons/arrow-right-white.svg" width={16} height={16} alt="" />
          </Link>
        </div>
      </div>
    </>
  );
}
