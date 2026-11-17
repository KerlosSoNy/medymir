# MedyMar website: technical specs

_Last updated: 17 November 2026_

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
| HTML sanitising (CMS rich text) | `isomorphic-dompurify` | 2.36 |
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

**Type**

| Token | Font | Use |
|---|---|---|
| `font-sans` (default) | Inter | Body, buttons, forms |
| `font-head` | Poppins | Headings, logo, brand names |

**Other:** `max-w-site` content width 1176px · `shadow-card` · `shadow-menu`.

---

## 6. Styling rules

- **Tailwind utilities only.** Don't add new CSS files or global class names. Shared recipes live in `lib/styles.ts`:
  - `btn(variant, size, extra)`: buttons (`dark`, `navy`, `outline`, `white`, `gold`, `plain`; sizes `sm`, `md`, `lg`)
  - `container`, `sectionX`, `pageTitle`, `pageIntro`, `notice()`, `linkBtn`, `field`, `input`
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
| CMS pages (home, site-layout, any slug) | `get-cms-pages` | 60 s |
| Categories | `get-full-menu` + `get-category-products` (for slugs) | 60 s |
| Product lists, filters, pagination, search | `get-category-products` | 60 s |
| One product | `get-menu-items?item_id=` | 60 s |
| Quote list (TheCoins cart) | `lib/client-api.ts` → cart endpoints, in the browser | never cached |
| Quotation form fields + submit | `contact-form` (GET / POST) | never cached |
| SMS login | `send-otp`, `verify-otp` | never cached |
| Customer orders | `get-customer-orders` | never cached |
| Tracking pixels | `get-pixel-config` (`PixelLoader`) | never cached |

- Public data is read on the server (`lib/api.ts`, marked `server-only`). Private data (quote list, login) is read in the browser (`lib/client-api.ts`).
- The site never hard-codes store content. Texts, links and images come from TheCoins. Exceptions:
  - button and form labels: `lib/ui.ts`
  - mega-menu sub-categories, promo cards and featured brands: `lib/menu.ts`, because the store has no sub-categories yet
- **CMS widget variants:** home sections use TheCoins widget types that keep extra settings (text-image, stats-counter, button-cta, testimonials, contact-form, faq) and add a `variant` key. `components/cms/widgets.tsx` picks the layout from that variant. Some widget types (hero-banner, logo-cloud, gallery) drop extra keys, so we don't use them.
- Site-wide content (announcement bar, category-bar extras, footer, brand list, payment logos) comes from the CMS page **`site-layout`**.

---

## 8. Project structure

```
app/                  routes (pages)
  layout.tsx          header + footer + quote-list provider, brand colours
  globals.css         Tailwind import + theme tokens + .rich
  page.tsx            home (CMS page "home")
  [slug]/             any page made in the page builder (about, faq, policies…)
  categories/ category/[slug]/ products/ search/ brands/ brand/[slug]/
  product/[id]/ quote/ account/ not-found.tsx
components/           shared UI (Header, CategoryNav, Footer, ProductCard, Filters, …)
  cms/                CMS page renderer, section components, classes.ts (shared CMS class recipes)
lib/
  api.ts              server reads (public data)
  client-api.ts       browser calls (quote list, login, forms)
  config.ts           env vars, cache time
  menu.ts             mega-menu content
  ui.ts               UI labels
  styles.ts, cn.ts    Tailwind helpers
public/icons/         Figma icons
public/placeholders/  temporary placeholder images (e.g. brand cards) until real photos are uploaded in TheCoins
design-assets/        Figma image exports
```

---

## 9. Quality checks before shipping a change

1. `npm run typecheck` passes.
2. Check the changed pages at **390, 768 and 1440** wide (and 360 / 1024 for edge cases): nothing scrolls sideways, nothing overlaps, and text isn't cut.
3. Check against the matching Figma frame.
4. Interactive parts still work: menus, drawer, carousels, add to quote list, filters, forms.
