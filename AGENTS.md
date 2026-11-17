# Instructions for AI assistants working on this project

You are working on **MedyMar**, a B2B medical supplies website for Oman. Customers build a **quote list** and request quotations; there is no checkout. It's a Next.js site that shows content from the **TheCoins** store "MedyMar" and is built from a **Figma** design.

The owner is **not technical**. Explain things in plain language, ask one decision at a time, and get approval before changing anything in the TheCoins store (products, pages, settings) or anything outside this folder.

---

## 1. Before you start any task

Read these, in this order:

1. **[PROGRESS.md](PROGRESS.md)**: where we are. What's finished per Figma screen and screen size, what works with the backend, what's broken, what's waiting on the owner.
2. **[SPECS.md](SPECS.md)**: stack, breakpoints, design tokens, styling rules, data flow, project structure.
3. **[FEATURES.md](FEATURES.md)**: what the site does, page by page.
4. **[README.md](README.md)**: how to run it and where content is edited in TheCoins.

Then look at the Figma frame for the screen you're working on (section 2) **before** writing UI code.

---

## 2. Figma (design source of truth)

- **File:** https://www.figma.com/design/tC40f2XIHH375SqjUyfxE8/Medymar (file key `tC40f2XIHH375SqjUyfxE8`)
- **Pages:**

| Page | Node | Contents |
|---|---|---|
| 🖥 Desktop — all pages | `108:2` | All screens at 1440 (home = `9:8`, mega menus `12:413`, `14:514`, `14:649`, `14:793`) |
| 📲 Tablet 768 — all pages | `120:2` | All screens at 768 (home `134:208`, menu drawer `136:263`…) |
| 📱 Mobile 390 — all pages | `120:3` | All screens at 390 (home `134:988`, menu drawer `136:2`…) |
| 🧩 Components | `108:11` | Buttons, cards, menu items, form field, FAQ item, responsive header/footer |
| 📋 Progress | `81:235` | Designer's notes |

- With the Figma MCP: call `create_session` first, follow the figma-design-to-code guidance before `get_design_context`, and treat its output as a reference to adapt to Tailwind and our components, not code to paste.
- Use Figma icons exactly as exported (`public/icons/`). Download any new ones there. Never point code at temporary Figma asset URLs.
- If Figma is missing a screen or state, build it in the same visual style and **say so** in your summary and in PROGRESS.md.

---

## 3. Working rules

- **Styling:** Tailwind CSS v4 only. Use the theme tokens and the `lib/styles.ts` helpers (`btn()`, `container`, `sectionX`, …) and combine classes with `cn()`. No new CSS files or global class names. See SPECS.md §5–6.
- **Responsive:** phone first. Every change must work at 360, 390, 768, 1024 and 1440 wide with no sideways page scroll.
- **Content comes from TheCoins.** Don't hard-code store texts, links or images in components. Exceptions: UI labels go in `lib/ui.ts` and mega-menu content in `lib/menu.ts`.
- **Private data** (quote list, login, forms) only goes through `lib/client-api.ts` in the browser. Public data goes through `lib/api.ts` on the server.
- **Store writes** (TheCoins products, pages, settings) need the owner's approval first. Log every store change in PROGRESS.md §4.
- **English only** (no Arabic / right-to-left).
- **Verify before saying it's done:** `npm run typecheck`, then look at the changed pages in a browser at phone, tablet and desktop sizes. If you can't verify something, say so.
- **Git:** commit only when the owner asks. End commit messages with the attribution line your tool requires.

---

## 4. Keep the documents up to date (required)

These files are how the next person or AI knows where things stand. **If your change affects them, update them in the same task, before you finish:**

| If you… | Update |
|---|---|
| Finish, start or break a screen or size from Figma | **PROGRESS.md** (status tables, "Last updated" date) |
| Add, remove or change what the site does (a feature, a page, a behaviour, a flow) | **FEATURES.md** |
| Change logic, data flow, an API endpoint, env vars, breakpoints, tokens, a styling rule, a dependency or the folder structure | **SPECS.md** |
| Change how to run the site or where content is edited | **README.md** |
| Change anything in the TheCoins store | **PROGRESS.md** §4 change log |
| Learn something important that the next AI must know (an API quirk, a decision by the owner) | **This file** or PROGRESS.md "Decisions" |

If a document turns out to be wrong, rewrite the wrong part. Don't just add a contradicting note. Keep the documents short and in plain language, since the owner reads them too.

---

## 5. Known traps

- **TheCoins public API:** hero-banner, logo-cloud, gallery and some strict widget types drop or reject extra keys. Home sections therefore use text-image, stats-counter, button-cta, testimonials, contact-form and faq with a custom `variant` key (see `components/cms/widgets.tsx`).
- **Draft pages are public:** the API serves draft CMS pages, so unpublished builder edits show on the site.
- **Caching:** public data is cached for 60 s, so store changes can take up to a minute to appear.
- **Sub-categories:** the store has only 8 top-level categories. Menu sub-categories link to the category page with a search.
- **Two dev servers:** to run a second one, use `NEXT_DIST_DIR=.next-test npx next dev -p 3001` so it doesn't clash with `.next`.
- The old café website is archived at `../heliopolisHub-cafe-site`. Don't build against café data.
