"use client";
// Category bar with mega menus (Figma "Menus" row) and the tablet/phone menu drawer (Figma 136:2 / 136:263).
// Desktop: hovering or focusing a category opens its panel; "All categories" opens on hover or click.
// Touch screens: tapping a category goes to its page; "All categories" opens on tap.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CATEGORY_MENUS,
  DELIVERING_TO,
  MENU_GROUPS,
  QUOTE_LINK,
  groupByTitle,
  subCategoryHref,
  type MenuGroup,
} from "@/lib/menu";
import { slugify } from "@/lib/format";
import { cn } from "@/lib/cn";
import { btn } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { SmartLink } from "./SmartLink";

export type NavCategory = { name: string; slug: string };
export type NavExtra = { label: string; link: string };

const ALL = "__all";
const OPEN_DELAY = 90;
const CLOSE_DELAY = 160;

const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);
const groupsOf = (slug: string) => (CATEGORY_MENUS[slug]?.groups ?? []).map(groupByTitle).filter((g): g is MenuGroup => !!g);

/** Category bar item: white label, gold on hover, 3px gold underline (8px wider than the label) when open/active. */
const barItem = (active: boolean, highlight = false) =>
  cn(
    "relative inline-flex shrink-0 items-center gap-[7px] whitespace-nowrap py-3.5 text-[13.5px] font-medium leading-tight text-white transition-colors hover:text-gold-hl",
    "after:absolute after:inset-x-[-8px] after:bottom-0 after:h-[3px] after:bg-gold-line after:transition-transform after:duration-200 after:content-['']",
    active ? "after:scale-x-100" : "after:scale-x-0",
    highlight && "text-gold-hl",
  );

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
      requestAnimationFrame(() => navRef.current?.querySelector<HTMLElement>("#mega-menu a, #mega-menu button")?.focus());
    },
  });

  const menu = open && open !== ALL ? CATEGORY_MENUS[open] : null;

  return (
    <nav
      className="relative z-50 hidden border-b border-catbar-border bg-catbar lg:block"
      aria-label={UI.categories}
      ref={navRef}
      onMouseLeave={() => canHover() && later(() => setOpen(null), CLOSE_DELAY)}
      onMouseEnter={() => open && clear()}
    >
      <div className="flex items-center gap-[15px] overflow-x-auto px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          className={cn(barItem(open === ALL), "mr-1 cursor-pointer border-0 bg-transparent", open === ALL && "text-gold-hl")}
          data-menu={ALL}
          aria-expanded={open === ALL}
          aria-controls="mega-menu"
          onClick={() => (clear(), setOpen((o) => (o === ALL ? null : ALL)))}
          onMouseEnter={() => canHover() && later(() => setOpen(ALL), open ? 0 : OPEN_DELAY)}
          onKeyDown={hoverProps(ALL).onKeyDown}
        >
          <img src="/icons/menu.svg" width={17} height={17} alt="" className="size-[17px] max-w-none shrink-0" />
          {title}
        </button>
        {categories.map((c) => {
          const href = `/category/${c.slug}`;
          const hasMenu = !!CATEGORY_MENUS[c.slug];
          return (
            <Link
              key={c.slug}
              href={href}
              className={barItem(open === c.slug || isActive(path, href), c.slug === highlight)}
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
          <span key={i} className="contents" onMouseEnter={() => canHover() && later(() => setOpen(null), 0)} onFocus={close}>
            <SmartLink to={x.link} className={barItem(isActive(path, x.link))}>
              {x.label}
            </SmartLink>
          </span>
        ))}
      </div>

      {open && (
        <div
          id="mega-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100vh-160px)] animate-[fade-down_0.16s_ease-out] overflow-y-auto border-b border-line bg-white shadow-menu"
          onMouseEnter={clear}
          onClick={(e) => (e.target as Element).closest("a") && close()}
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-[42px] pb-5 pt-8">
            {open === ALL ? <AllCategoriesPanel /> : menu && <CategoryPanel slug={open} menu={menu} />}
          </div>
        </div>
      )}
    </nav>
  );
}

/** Bullet list (Figma Menu/List item 12:362): 7px blue square + label. */
function Bullets({ group, size = "sm", twoCol }: { group: MenuGroup; size?: "sm" | "lg"; twoCol?: boolean }) {
  return (
    <ul
      className={cn(
        "flex flex-col",
        size === "sm" ? "gap-[11px] pl-2" : "gap-4 pl-[18px]",
        twoCol && "grid grid-flow-col grid-cols-2 grid-rows-4 gap-x-6",
      )}
    >
      {group.items.map((item) => (
        <li key={item}>
          <Link
            href={subCategoryHref(group.category, item)}
            className={cn(
              "flex gap-3.5 before:mt-[6.5px] before:size-[7px] before:shrink-0 before:bg-blue before:content-[''] hover:text-blue-link hover:underline hover:underline-offset-[3px]",
              size === "sm" ? "text-sm leading-5 text-ink-3" : "text-[15.5px] leading-[22px] text-ink-2",
            )}
          >
            {item}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Figma 12:476 — every group as a numbered card, four per row. */
function AllCategoriesPanel() {
  return (
    <div className="grid grid-cols-4 gap-x-6 gap-y-5 pb-4 xl:gap-x-12 xl:gap-y-7">
      {MENU_GROUPS.map((g, i) => (
        <section key={g.title} className="flex flex-col gap-3.5 rounded-xl border border-line bg-surface px-[18px] pb-[22px] pt-5">
          <Link
            href={`/category/${g.category}`}
            className="group flex items-center gap-2.5 font-head text-base font-bold leading-5 text-ink-2"
          >
            <span className="shrink-0 rounded-md bg-dark px-1.5 py-1 font-sans text-[11px] font-semibold leading-tight text-white">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="group-hover:text-blue-link">{g.title}</span>
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
  const spread = (menu.brands?.length ?? 0) > 3;
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-[30px]">
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${split ? 1 : groups.length}, minmax(0, 1fr))` }}>
            {groups.map((g) => (
              <section key={g.title}>
                <h3 className="mb-5 font-head text-[23px] font-bold leading-[1.3] text-ink-2">{g.title}</h3>
                <Bullets group={g} size="lg" twoCol={split} />
              </section>
            ))}
          </div>
          {menu.viewAll && (
            <Link
              href={`/category/${slug}`}
              className="self-start text-[15px] font-semibold text-gold-menu hover:underline hover:underline-offset-[3px]"
            >
              {menu.viewAll}
            </Link>
          )}
        </div>
        {menu.promo && (
          <aside className="flex shrink-0 basis-[300px] flex-col items-start gap-3 rounded-xl border border-[#e3e7ed] bg-surface-alt px-[25px] pb-[26px] pt-7 xl:basis-[340px]">
            <h4 className="font-head text-xl font-bold leading-[25px] text-ink-2">{menu.promo.title}</h4>
            <p className="mb-1.5 text-[15px] leading-6 text-muted-2">{menu.promo.text}</p>
            <Link href={QUOTE_LINK} className={btn("dark")}>
              {UI.requestAQuote}
              <img src="/icons/arrow-right-white.svg" width={16} height={16} alt="" className="size-4 max-w-none shrink-0" />
            </Link>
          </aside>
        )}
      </div>
      {!!menu.brands?.length && (
        <div
          className={cn(
            "flex items-center overflow-x-auto whitespace-nowrap border-t border-line pt-6 [scrollbar-width:none]",
            spread ? "justify-between gap-8" : "gap-20",
          )}
        >
          <span className={cn("text-[13.5px] text-muted", !spread && "mr-[30px]")}>{UI.featuredBrands}</span>
          {menu.brands.map((b) => (
            <Link
              key={b}
              href={`/brand/${slugify(b)}`}
              className="font-head text-[22px] font-bold tracking-[-0.01em] text-brandgrey transition-colors hover:text-ink-2"
            >
              {b}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

/* ---------------- Tablet / phone drawer (Figma 136:2 closed, 136:56 / 136:132 / 136:195 open; tablet 136:263…) ---------------- */

const drawerText = "text-[#0b1b3a]";

function PlusMinus({ open }: { open: boolean }) {
  return <img src={open ? "/icons/drawer-minus.svg" : "/icons/drawer-plus.svg"} width={14} height={14} alt="" className="size-3.5 max-w-none shrink-0" />;
}

/** Row of the drawer: 52px tall, 16px semibold label, plus/minus on the right when it expands. */
const rowCls = cn("flex h-[52px] w-full items-center justify-between gap-3 px-1 text-left text-base font-semibold", drawerText);
const subLink = "block py-2 text-[15px] text-[#3b4a63] hover:text-blue-link";

export function MobileMenu({
  categories,
  extras,
  brands = [],
}: {
  categories: NavCategory[];
  extras: NavExtra[];
  brands?: NavExtra[];
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
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

  /** Open one category at a time; a category with a single group shows that group's links straight away. */
  const toggleCategory = (key: string) => {
    if (expanded === key) return setExpanded(null);
    setExpanded(key);
    const groups = groupsOf(key);
    setOpenGroups(groups.length === 1 ? [groups[0].title] : []);
  };
  const toggleGroup = (title: string) =>
    setOpenGroups((g) => (g.includes(title) ? g.filter((t) => t !== title) : [...g, title]));

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="-m-1 inline-flex shrink-0 cursor-pointer border-0 bg-transparent p-1 lg:hidden"
        aria-label={UI.menu}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <img src="/icons/menu-dark.svg" width={22} height={22} alt="" className="size-[22px] max-w-none shrink-0" />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-90 bg-[rgb(11_27_58/0.55)] transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={UI.menu}
        inert={!open}
        onClick={(e) => (e.target as Element).closest("a") && setOpen(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-91 flex w-[min(343px,88vw)] flex-col overflow-y-auto bg-white px-4 pb-6 pt-4 shadow-[6px_0_24px_rgb(0_0_0/0.18)] transition-[transform,visibility] duration-250 md:w-[380px] lg:hidden",
          open ? "visible translate-x-0" : "invisible -translate-x-full",
        )}
      >
        <div className="flex items-center justify-between pb-2.5">
          <strong className={cn("font-head text-[19px] font-bold", drawerText)}>{UI.menu}</strong>
          <button
            ref={closeRef}
            type="button"
            className="flex size-10 cursor-pointer items-center justify-center rounded-[10px] border-0 bg-[#f1f4f8]"
            aria-label={UI.close}
            onClick={() => setOpen(false)}
          >
            <img src="/icons/drawer-close.svg" width={16} height={16} alt="" className="size-4 max-w-none shrink-0" />
          </button>
        </div>

        <ul>
          {categories.map((c) => {
            const groups = groupsOf(c.slug);
            const href = `/category/${c.slug}`;
            if (!groups.length)
              return (
                <li key={c.slug} className="border-b border-[#e6eaf0]">
                  <Link href={href} className={cn(rowCls, isActive(path, href) && "text-blue-link")}>
                    {c.name}
                  </Link>
                </li>
              );
            const isOpen = expanded === c.slug;
            return (
              <li key={c.slug} className="border-b border-[#e6eaf0]">
                <button
                  type="button"
                  className={cn(rowCls, "cursor-pointer border-0 bg-transparent")}
                  aria-expanded={isOpen}
                  aria-controls={`mm-${c.slug}`}
                  onClick={() => toggleCategory(c.slug)}
                >
                  {c.name}
                  <PlusMinus open={isOpen} />
                </button>
                {isOpen && (
                  <div id={`mm-${c.slug}`} className="pb-2.5">
                    {groups.map((g) => {
                      const gOpen = openGroups.includes(g.title);
                      const gid = `mm-${slugify(g.title)}`;
                      return (
                        <div key={g.title}>
                          <button
                            type="button"
                            className={cn(
                              "flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent py-2 pl-3.5 pr-1 text-left text-[15px] font-semibold",
                              drawerText,
                            )}
                            aria-expanded={gOpen}
                            aria-controls={gid}
                            onClick={() => toggleGroup(g.title)}
                          >
                            {g.title}
                            <PlusMinus open={gOpen} />
                          </button>
                          {gOpen && (
                            <ul id={gid} className="pl-6">
                              <li>
                                <Link href={`/category/${g.category}`} className={cn(subLink, "font-semibold", drawerText)}>
                                  {UI.viewAll} {g.title}
                                </Link>
                              </li>
                              {g.items.map((item) => (
                                <li key={item}>
                                  <Link href={subCategoryHref(g.category, item)} className={subLink}>
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}

          {extras.map((x, i) => {
            // The "Brands" link expands into the brand list (same list as the footer).
            const expandable = x.link === "/brands" && brands.length > 0;
            const key = `extra-${i}`;
            const isOpen = expanded === key;
            return (
              <li key={key} className="border-b border-[#e6eaf0]">
                {expandable ? (
                  <>
                    <button
                      type="button"
                      className={cn(rowCls, "cursor-pointer border-0 bg-transparent")}
                      aria-expanded={isOpen}
                      aria-controls={`mm-${key}`}
                      onClick={() => setExpanded(isOpen ? null : key)}
                    >
                      {x.label}
                      <PlusMinus open={isOpen} />
                    </button>
                    {isOpen && (
                      <ul id={`mm-${key}`} className="pb-2.5 pl-3.5">
                        {brands.map((b, j) => (
                          <li key={j}>
                            <SmartLink to={b.link} className={cn(subLink, b.link === x.link && cn("font-semibold", drawerText))}>
                              {b.label}
                            </SmartLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <SmartLink to={x.link} className={rowCls}>
                    {x.label}
                  </SmartLink>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-0.5 pt-5">
          <span className="text-[13px] text-[#4a5873]">{DELIVERING_TO.label}</span>
          <strong className={cn("text-[15px] font-bold", drawerText)}>{DELIVERING_TO.value}</strong>
        </div>
      </div>
    </>
  );
}
