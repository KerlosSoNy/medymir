# MedyMar website: technical specs

_Last updated: 19 November 2026_

This is the reference for **what the site is built with and the rules it follows**. For what the site can do, see [FEATURES.md](FEATURES.md). For what is finished, see [PROGRESS.md](PROGRESS.md).

---

## 1. Stack

| Part | What we use | Version |
|---|---|---|
| Framework | Next.js (App Router, server components) | 15.5 |
| UI library | React | 19 |
| Language | TypeScript (strict) | 5.9 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss`) | 4.3 |
| Class helpers | `clsx` + `tailwind-merge` → `cn()` in `lib/cn.ts` | 2.1 / 3.7 |
| HTML sanitising (CMS rich text, product descriptions) | `xss` via `sanitize()` in `lib/sanitize.ts` (pure JS; the earlier `isomorphic-dompurify`/jsdom crashed request-time pages on Vercel) | 1.0.17 |
| Carousels ("Shop by brand", "Shop by category") | `swiper` (React build, core CSS only: `swiper/css`) | 14.4 |
| Backend | TheCoins storefront API (Supabase edge functions) | — |
| Fonts | Inter (body), Poppins (headings), loaded with `next/font/google` | — |

Commands:

```bash
npm install
npm run dev         # http://localhost:3000
npm run build && npm run start
npm run typecheck   # tsc --noEmit
```

To run a second dev server next to the main one (e.g. for testing) use a separate build folder:
`NEXT_DIST_DIR=.next-test npx next dev -p 3001`.

---

## 2. Environment variables

Set in `.env.local` (local) or the hosting provider. All three are **public** storefront values (safe in the browser). The site refuses to start if one is missing (`lib/config.ts`).

| Variable | Meaning |
|---|---|
| `NEXT_PUBLIC_THECOINS_API_URL` | TheCoins functions base URL |
| `NEXT_PUBLIC_THECOINS_API_KEY` | Public (anon) API key |
| `NEXT_PUBLIC_THECOINS_TENANT_ID` | Store id of "MedyMar" |

---

## 3. Design source

- **Figma file:** "Medymar", key `tC40f2XIHH375SqjUyfxE8`
- Pages: `🖥 Desktop — all pages` (1440 wide), `📲 Tablet 768`, `📱 Mobile 390`, `🧩 Components`
- Icons exported from Figma live in `public/icons/` (SVG, used as-is; don't redraw or recolour them in code)
- Image exports live in `design-assets/` (`webp/` = compressed, ready to upload to TheCoins)

---

## 4. Screen sizes (breakpoints)

Styles are written **phone first**, then adjusted for bigger screens with Tailwind prefixes.

| Prefix | From width | Device | Figma frame |
|---|---|---|---|
| _(none)_ | 0 | Phone | Mobile 390 |
| `sm:` | 480px | Large phone | — |
| `md:` | 761px | Tablet | Tablet 768 |
| `lg:` | 1025px | Laptop / desktop | Desktop 1440 |
| `xl:` | 1281px | Wide desktop | Desktop 1440 |
| `2xl:` | 1441px | Very wide | — |

Rules:
- No sideways page scroll at any width from 360px to 1440px (carousels may scroll inside themselves).
- Tablet and phone use the ☰ menu drawer; the category bar with mega menus shows from `lg:` up.
- Side padding (from Figma): home sections 16px phone · 24px tablet · 56px laptop · 132px at 1440 (`sectionX`). Other pages use `container`: 16 · 24 · 32px, max content width 1176px. Both are in `lib/styles.ts`.

---

## 5. Design tokens (Tailwind theme)

Defined in `app/globals.css` (`@theme`). Use them as Tailwind classes, e.g. `text-ink-2`, `bg-catbar`, `border-line`, `font-head`.

**Brand colours** (come from TheCoins store branding at runtime, these are the defaults):

| Token | Value | Use |
|---|---|---|
| `brand` | `#1b3a6b` | Logo, navy accents |
| `gold` | `#c99a2e` | Logo accent, badges |

**Fixed colours**

| Token | Value | Use |
|---|---|---|
| `ink` / `ink-2` / `ink-3` | `#0f1e36` / `#13233f` / `#2a3446` | Headings / body text / secondary text |
| `dark` | `#1b2a44` | Dark buttons, badges |
| `navy-btn` | `#0d2350` | Navy buttons |
| `announce` | `#1a2638` | Announcement bar |
| `catbar` / `catbar-border` | `#1e2a3b` / `#33415a` | Category bar |
| `cat-card` | `#0a1d47` | Category card background |
| `muted` / `muted-2` / `muted-3` | `#5b6577` / `#667085` / `#8a93a3` | Grey texts |
| `brandgrey` | `#7a8494` | Brand names in menus |
| `line` / `line-2` | `#e6e9ef` / `#e5e8ee` | Borders, dividers |
| `input-border` | `#d5dae2` | Form fields |
| `surface` / `surface-alt` | `#fbfcfd` / `#f5f7fa` | Light card / panel backgrounds |
| `chip-bg` / `chip-border` | `#f2f4f7` / `#e2e6ec` | Chips |
| `blue` / `blue-link` | `#2f5dd0` / `#1e4fb5` | Bullets, focus ring / links |
| `gold-btn`, `gold-text`, `gold-link`, `gold-menu`, `gold-soft`, `gold-hl`, `gold-line` | `#b8862e`, `#9a6b1e`, `#8a5a12`, `#b07e22`, `#e0ae52`, `#f2b544`, `#d9a54a` | Gold buttons, texts, highlights, active underline |
| `teal`, `sky` | `#2a9db0`, `#2f7fd0` | Accents |
| `navy-deep`, `slate`, `line-3`, `gold-tint`, `mist` | `#0b1b3a`, `#4a5873`, `#e1e6ee`, `#fbf3e2`, `#dce5f5` | Info pages (About, FAQ, Contact, Policies): headings, text, card borders, icon squares, light text on navy |

**Type**

| Token | Font | Use |
|---|---|---|
| `font-sans` (default) | Inter | Body, buttons, forms |
| `font-head` | Poppins | Headings, logo, brand names |

**Other:** `max-w-site` content width 1176px · `shadow-card` · `shadow-menu`.

---

## 6. Styling rules

- **Tailwind utilities only.** Don't add new CSS files or global class names. (Only exception: Swiper's own core stylesheet `swiper/css`, imported in `components/cms/BrandCarousel.tsx` and `CategoryCarousel.tsx`.) Shared recipes live in `lib/styles.ts`:
  - `btn(variant, size, extra)`: buttons (`dark`, `navy`, `outline`, `white`, `gold`, `plain`; sizes `sm`, `md`, `lg`)
  - `container`, `containerWide` (product page, 1280px), `pdRow` / `pdRowLabel` (product page label + control rows), `sectionX`, `pageTitle`, `pageIntro`, `notice()`, `linkBtn`, `field`, `input`
  - CMS sections have their own recipes in `components/cms/classes.ts` (section headers, eyebrows, carousel tracks)
- Use `cn()` (from `lib/cn.ts`) to combine or conditionally apply classes.
- **The only global classes:** `.rich` (styles HTML that comes from the CMS, which we can't put classes on) and the `fade-down` animation.
- Use tokens, not hex codes, whenever a token exists. One-off Figma values may use arbitrary values, e.g. `text-[15.5px]`.
- **Icons:** Figma SVGs use `preserveAspectRatio="none"`, so always give them their exact width and height plus `shrink-0` (the `Icon` component in `components/SmartLink.tsx` does this). Otherwise they get squeezed in flex rows.
- Images: always inside a fixed aspect-ratio frame. Use `object-cover` for photos and `object-contain` with padding for product shots and logos. Every image slot needs a styled fallback for when there's no image.
- Accessibility: visible focus ring (global), `alt` text on content images (empty `alt` on decorative icons), menus usable by keyboard (Tab, ↓, Esc), and reduced motion respected.

---

## 7. Data flow

| Data | Where it is read | Caching |
|---|---|---|
| Store info, branding, currency | `get-tenant-info` (`lib/api.ts`) | 60 s |
| Brands (name, slug, logo) | `get-product-attributes` → the **Brand** detail (`BRAND_ATTRIBUTE` in `lib/config.ts`) via `getBrands()` | 60 s |
| Brands per category (mega-menu "Featured brands") | the `brand` filter values of `get-category-products?category_id=` via `getCategoryBrands()` | 60 s |
| CMS pages (home, site-layout, any slug) | `get-cms-pages` | 60 s |
| Categories | `get-full-menu` + `get-category-products` (for slugs) | 60 s |
| Product lists, filters, pagination, search | `get-category-products` | 60 s |
| One product | `get-menu-items?item_id=` | 60 s |
| Quote list (TheCoins cart) | `lib/client-api.ts` → cart endpoints, in the browser | never cached |
| Quotation form fields + submit | `contact-form` (GET / POST) | never cached |
| SMS login | `send-otp`, `verify-otp` | never cached |
| Customer orders | `get-customer-orders` | never cached |
| Customer profile (account details) | `get-customer`, `update-customer-profile` (`customerApi` in `lib/client-api.ts`) | never cached |
| Saved addresses | `customer-addresses` (GET list, POST add, PUT edit / set default, DELETE `?id=`) | never cached |
| Tracking pixels | `get-pixel-config` (`PixelLoader`) | never cached |

- Public data is read on the server (`lib/api.ts`, marked `server-only`). Private data (quote list, login) is read in the browser (`lib/client-api.ts`).
- The site never hard-codes store content. Texts, links and images come from TheCoins. Exceptions:
  - button and form labels: `lib/ui.ts`
  - mega-menu sub-categories and promo cards: `lib/menu.ts`, because the store has no sub-categories yet. **Featured brands are NOT hard-coded**; they come from the store (brands of each category's products).
- **CMS widget variants:** home sections use TheCoins widget types that keep extra settings (text-image, stats-counter, button-cta, testimonials, contact-form, faq) and add a `variant` key. The widget files in `components/cms/widgets/` pick the layout from that variant. Some widget types (hero-banner, logo-cloud, gallery) drop extra keys, so we don't use them.
- **Info-page sections:** rows containing the info-page looks (`text-image/split-hero`, `stats-counter/link-cards`, `stats-counter/route-cards`, `button-cta/band`) (and `contact-form/contact`, `contact-form/contact-panel`, `faq-accordion/topics`, `button-cta/help`, `stats-counter/policy-menu`, `text-image/policy`, and the Ready Stock looks `text-image/stock-hero`, `stats-counter/service-bar`, `stats-counter/steps`, `text-image/offers`, `button-cta/bulk`, `button-cta/info`) use the tighter "stack" row spacing (28–32px top and bottom) from Figma About. Info pages have their own route file (`app/about/page.tsx`, `app/contact/page.tsx`, `app/faq/page.tsx`), built in advance and refreshed every 60 s; each shows a "Home › Page title" trail (`components/Breadcrumbs.tsx`) above `CmsPage`. Their buttons use `goldBtn` / `goldOutlineBtn` from `components/cms/classes.ts`.
- Site-wide content (announcement bar, category-bar extras, footer, footer brand links, payment logos) comes from the CMS page **`site-layout`**.
- **Brands** come from the store's Brand detail: `/brands` lists them with their uploaded logos, `/brand/[slug]` filters products by `brand=<name>` (falls back to a name search for brands only linked from the CMS, e.g. exclusive brands), the drawer's Brands row and each mega menu use them, and brand cards in the home carousel show the brand's logo.
- **Never put content images in the project** (`public/`). Every content picture is uploaded to TheCoins and referenced from the CMS. `public/icons/` holds only UI icons.
- **Banners and hero slides** (`components/cms/widgets/Banners.tsx`, `Carousel.tsx` → `HeroSlider`): a card/slide **with a button text** (`cta_text`) is treated as background art; its badge, title, description/subtitle and a real button are rendered as page content. A card **without** button text is shown as a picture (it may contain its own text) and the whole picture is the link. The plain "Banners" type drops the button text and "Hero Banner" reaches the site empty, so a banner that needs a real button must be a **one-slide Carousel** (see CMS-WIDGETS.md §4). Theme `dark` = navy panel with white text, `light` = light panel with dark text.
- **Product page** (`app/product/[id]/page.tsx`): one product from `get-menu-items`. Look: category `ready-stock-offers` (`READY_STOCK_CATEGORY` in `lib/config.ts`, checked by `isReadyStock()` in `lib/format.ts`, which product cards use too, so prices only show on Ready Stock) = ready stock (price shown); unavailable or tracked stock 0 = sold out; anything else = quotation (no price). Brand, Pack size / Unit and the Specifications tab come from `custom_attributes_schema` (labels, `show_in_product_page`). The CMS page **`product`** supplies extra tabs (`text-image/product-tab`: title = tab name) and the help banner (`button-cta/product-help`, optional `whatsappLink`); `lib/cms-pick.ts` lifts them out and any other section of that page renders below the product. On a developer's computer `?draft=1` uses `cms-drafts/product.json` instead. Client parts: `ProductGallery`, `ProductBuy` (every button adds to the quote list; the outline button then opens `/quote`), `ProductTabs`. Note: class-name constants exported from a `"use client"` file arrive empty in server components, so shared recipes go in `lib/styles.ts`.
- **Quote list page** (`app/quote/page.tsx` + `components/QuoteRequest.tsx`): list = the store cart (`useQuoteList`), form fields from `contact-form` GET (`useFormFields`), sending through `sendQuote()` (all three shared with the home form in `components/cms/QuoteForm.tsx`). The sidebar's send button submits the form via `form="quote-request"`. Texts come from the CMS page **`quote`**: `contact-form/quote-page`, `stats-counter/quote-next`, `button-cta/quote-whatsapp` (lifted out with `lib/cms-pick.ts`; these looks render nothing anywhere else). `?draft=1` previews `cms-drafts/quote.json` on a developer's computer.
- **Account page** (`app/account/page.tsx` + `components/Account.tsx`): sections by address, `/account` (Overview) and `?tab=orders | quotes | addresses | details`. All data is private and loaded in the browser with the customer's session token. Labels and the explanatory texts are UI texts in `lib/ui.ts` (`UI.acct`), because they describe how the site works.
- **Template pages from the CMS** (`lib/cms-template.ts` → `templatePage(slug, draft)`): product, quote and brands read their CMS page through it; `?draft=1` on a developer's computer previews `cms-drafts/<slug>.json` on the real page.
- **Brands page** (`app/brands/page.tsx`): Breadcrumbs + CMS page `brands` (looks `text-image/brands-hero`, `stats-counter/trust-bar`, `text-image/brand-directory`, `text-image/brands-by-category`, `text-image/category-tiles`; the last three read store data but sit on Text + Image because Product Attributes / Categories drop our settings publicly); falls back to `BrandDirectory` alone while that page does not exist. Section context `ctx.categoryBrands` (category slug → brand names, from each category's Brand filter) feeds "by category". `CategoryTile` is shared with /categories.
- **Search page** (`app/search/page.tsx`): no `q` → title, `SearchBox` and a hint (no product list); with `q` → `ProductListing` with `head` (title, count, search box, tabs), `sortOnly` and `empty` (`NoResults`). The "Ready stock" tab adds `category_id` of `READY_STOCK_CATEGORY`. Help bar and other sections: CMS page `search` (look `button-cta/search-help`). `Filters` never shows `q`, `category_id`, `page` or `draft` as filter chips.
- **All categories page** (`app/categories/page.tsx`): CMS page `categories` with `text-image/categories-hero` (photo banner, `highlight` word in gold), `text-image/category-directory` (`CategoryDirectory`: search + cards from `MENU_GROUPS` arranged by `CATEGORY_COLUMNS` in `lib/menu.ts`, only groups whose store category exists) and `button-cta/list-bar`; falls back to `CategoryDirectory` alone. Mega-menu "Request a quote" (`QUOTE_LINK`) now opens `/quote`.
- **Two-One Grid** (`two-one-grid`): two titled groups (2/3 + 1/3, or full width when one is empty) of brand, product or category entries.
- **Page builder kit** (building CMS pages, not showing them):
  - `lib/cms-sections.ts`: `WIDGET_MENU` = the 44 widgets of the TheCoins "Add widget" menu (menu names, groups, whether our site shows them) and the **section catalog** `SECTIONS`. One recipe ("look") per supported section style, each a ready-to-save row in the `manage_page_layout` write shape (`{ id, columns[{ id, span, widgets[{ id, type, settings }] }] }`), plus `layoutToPage()`, which turns that shape into the public shape `CmsPage` renders. When the site learns a new section, add its recipe here too.
  - `/dev/widgets`: gallery of every recipe with sample content. `/dev/preview/<slug>`: shows `cms-drafts/<slug>.json` (`{ title, layout }`) before it is saved to the store. Both use `lib/cms-preview.ts`, which adds what the server normally adds (products, categories, brands) and fills empty pictures with neutral sample photos. Both return 404 in production (`devOnly()`).
  - `.claude/skills/cms-page/SKILL.md`: the `/cms-page <slug>` command, the step-by-step process (read → plan → draft file → preview → owner approval → save → check → log).

---

## 8. Project structure

```
app/                  routes (pages)
  layout.tsx          header + footer + quote-list provider, brand colours
  globals.css         Tailwind import + theme tokens + .rich
  page.tsx            home (CMS page "home")
  about/ contact/ faq/  info pages: one route file per page, each = Breadcrumbs + CmsPage for its CMS slug
  category/ready-stock-offers/  Ready Stock page: Breadcrumbs + CmsPage "ready-stock" (ctx.path + ctx.sp for the offers area);
                      falls back to the normal category listing until that CMS page exists
  tender-desk/ verify-batch/ distributors/ help/  footer info pages (same route file as faq/, no Figma design)
  privacy-policy/ shipping-policy/ refund-policy/ terms-of-service/ contact-information/
                      policy pages: same, plus "Policies & information" in the trail and ctx.path (menu highlight)
                      (a new info page, e.g. privacy-policy, needs its own folder with the same page.tsx)
  categories/ category/[slug]/ (Breadcrumbs + CategoryHeader + listing with toolbar + CMS "category-<slug>")
  products/ search/ brands/ brand/[slug]/
  product/[id]/ quote/ account/ not-found.tsx
  dev/                local-only tools: widgets/ (section gallery), preview/[slug]/ (draft preview)
components/           shared UI (Header, CategoryNav, Footer, ProductCard, Filters, …)
  cms/                CMS page renderer (CmsPage), carousels, classes.ts (shared CMS class recipes)
    widgets/          one file per CMS widget type; index.tsx = REGISTRY (widget_type → component), shared.ts = types + helpers
lib/
  api.ts              server reads (public data)
  cms-sections.ts     section catalog (recipes for building CMS pages)
  cms-preview.ts      helpers for the dev gallery / draft preview
  client-api.ts       browser calls (quote list, login, forms)
  config.ts           env vars, cache time
  menu.ts             mega-menu content
  ui.ts               UI labels
  styles.ts, cn.ts    Tailwind helpers
public/icons/         Figma icons
design-assets/        Figma image exports
cms-drafts/           planned CMS pages (<slug>.json), previewed at /dev/preview/<slug>
.claude/skills/       Claude Code commands (cms-page)
```

---

## 9. Quality checks before shipping a change

1. `npm run typecheck` passes.
2. Check the changed pages at **390, 768 and 1440** wide (and 360 / 1024 for edge cases): nothing scrolls sideways, nothing overlaps, and text isn't cut.
3. Check against the matching Figma frame.
4. Interactive parts still work: menus, drawer, carousels, add to quote list, filters, forms.
