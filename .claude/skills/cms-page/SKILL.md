---
name: cms-page
description: Build or change a MedyMar CMS page (home, about, faq, category/product template slots…) from the section catalog — plan it as a local draft, preview it, get the owner's approval, then save it to TheCoins. Use when the owner asks to add, change, move or remove sections on a page, or types /cms-page.
argument-hint: "<page-slug> [what you want, in words]"
---

# /cms-page: build a page from catalog sections

The owner is **not technical**. Speak plainly, ask one decision at a time, and never write to the store before they say yes.

Arguments: `$ARGUMENTS` (first word = page slug, e.g. `about`, `home`, `faq`, `category`, `product`, `brand-<slug>`; the rest = what they want).

## Know the parts
- **Catalog:** `lib/cms-sections.ts`, `SECTIONS`. Every section style the site can show, as a ready-to-save TheCoins row. Use these recipes; don't invent new widget shapes.
- **Gallery:** `http://localhost:3000/dev/widgets` follows the TheCoins "Add widget" menu (`WIDGET_MENU`): each widget by its menu name, then its looks (recipes). Anchors: `#<widget_type>` and `#<recipe-id>`. Send the owner there to choose, and talk about sections by their TheCoins menu name + look name (e.g. "Stats / Counters, look: Search chips").
- **Draft file:** `cms-drafts/<slug>.json` = `{ "title": "...", "layout": [ ...rows ] }` (the `manage_page_layout` write shape).
- **Draft preview:** `http://localhost:3000/dev/preview/<slug>` shows the draft file with real products/categories/brands.
- **Reference:** `CMS-WIDGETS.md` (all widget fields, traps). `AGENTS.md` §5 (known traps).
- Template pages show their CMS page as extra sections: `products`, `category`, `product`, `quote`, `search`, `account`, `brands`, `categories`, `brand-<slug>` (see `components/CmsSlot.tsx`). Any other slug is an info page at `/<slug>`: it needs its own route file `app/<slug>/page.tsx` (copy `app/faq/page.tsx` and change `SLUG`), with Breadcrumbs + CmsPage. Without that file the page shows "page not found". `home` and `site-layout` are special.

## Steps

1. **Read what's there.** `mcp__thecoins__list_pages` → find the page id and `updated_at`. If it exists, `manage_page_layout` `action: "read"` with `page_id` (its `content` is the layout as a JSON string). Tell the owner in one or two lines what's on the page now.

2. **Agree the plan in words.** List the sections top to bottom, using the catalog **names** (link the gallery anchors, e.g. `/dev/widgets#faq`). Ask for the real texts, links and pictures you don't have. Never invent store facts (prices, brands, contacts, claims). Brands must come from the store's Brand list (`getBrands()` / `get-product-attributes`). Categories come from `list_categories`.

3. **Write the draft file** `cms-drafts/<slug>.json`:
   - Start from the existing layout (if any) and change only what was agreed.
   - Copy each new section's `row` from `SECTIONS`, then fill in the real content.
   - Give every row, column and widget a **unique** id (e.g. `row-about-intro`, `col-about-intro`, `w-about-intro`). Keep existing ids.
   - Pictures must be full `https://` links uploaded to the store (`mcp__thecoins__upload_store_image`, with approval). Leave `""` if there is none yet.
   - Follow the traps: a banner with a button = one-slide `carousel`; strict types (`hero-banner`, `featured-products`, `spacer`, `gallery`) take only their exact fields; no `custom-html`.

4. **Preview.** Make sure the dev server runs (`npm run dev`), open `/dev/preview/<slug>` at 390, 768 and 1440 wide and check it yourself (no sideways scroll, nothing empty). Then send the owner the link and a short summary. Fix and repeat until they approve.

5. **Save to TheCoins (only after a clear "yes").**
   - New page: `manage_page_layout` `action: "create"` with `slug`, `title`, `layout`.
   - Existing page: re-read first to get the latest `updated_at`, then `action: "update"` with `page_id`, `expected_updated_at`, the **whole** `layout`.
   - Remember: the store serves draft pages publicly, so it is live (after up to ~60 s cache) as soon as it is saved. Publishing is a separate step; ask before doing it.

6. **Check the real page** (`/<slug>` or the template page) in the browser. If a section disappeared, the API dropped fields: compare with `call_storefront_api get-cms-pages?slug=<slug>` and see CMS-WIDGETS.md.

7. **Log it.** Add a line to the "Log of changes made in TheCoins" table in PROGRESS.md with the date and what changed, and update the page's status if a Figma screen moved forward. Keep `cms-drafts/<slug>.json` as the record of what was saved.

## A section the catalog doesn't have
If the owner wants something no recipe covers: check CMS-WIDGETS.md for a widget type that fits. If the site can't render it yet (⬜), say so plainly and offer the closest recipe, or add support: a new file in `components/cms/widgets/` registered in its `index.tsx` (REGISTRY) **plus** a recipe in `lib/cms-sections.ts` **plus** a status update in CMS-WIDGETS.md, all in the same task.
