# MedyMar website: features

_Last updated: 17 November 2026_

What the website does, page by page. ✅ = working · 🟡 = works but waits for content or setup in TheCoins · ⬜ = not built yet.
Technical details: [SPECS.md](SPECS.md). Status by Figma screen: [PROGRESS.md](PROGRESS.md).

---

## Site-wide

| Feature | Status | Notes |
|---|---|---|
| Announcement bar (4 messages) | ✅ | Text edited in CMS page `site-layout` |
| Logo (MEDY**MAR** wordmark + tagline) | ✅ | Uses the store logo instead if one is uploaded |
| Search bar with category dropdown | ✅ | Searches product names; can limit to one category |
| Account link ("Hello, sign in" / "Hello, Name") | ✅ | |
| Quote list link with counter | ✅ | Counter updates instantly when lines are added |
| Category bar with all store categories | ✅ | "Ready Stock Offers" highlighted in gold; "Brands" link from CMS |
| **Mega menus** (computer) | ✅ | Opens on hover or keyboard focus; "All categories" opens on click too; closes with Esc, outside click or a link click |
| └ All categories panel | ✅ | 12 numbered groups with sub-categories |
| └ Category panels (7) | ✅ | Sub-categories, "View all" link, "Request a quote" card, featured brands |
| **Menu drawer** (tablet & phone) | ✅ | ☰ button, slides in, categories expand to show sub-categories |
| Footer | ✅ | About text, categories, top brands, contact, About & Support links, policy links, payment logos |
| Brand colours from the store settings | ✅ | Changing colours in TheCoins changes the site |
| Tracking pixels from TheCoins | ✅ | Loaded on every page |
| Phone, tablet and computer layouts | ✅ | 360px → 1440px+ |
| English only | ✅ | No Arabic / right-to-left (decision) |

## Home page

All sections come from CMS page `home` in the page builder; texts, links and images are editable there.

| Section | Status | Notes |
|---|---|---|
| Hero slider | ✅ | Slides, arrows, dots |
| Popular searches (chips) | ✅ | Each chip runs a search |
| Features strip (3 benefits) | ✅ | |
| Shop by category carousel | 🟡 | 5 of 8 categories have no photo yet |
| Abbott banner + Abbott products + promo | ✅ | |
| Shop by brand carousel | ✅ | |
| "Lines buyers ask for most" (tabs + products) | ✅ | |
| Exclusive brands in Oman | ✅ | |
| Stryker section (products + promo) | ✅ | |
| Orthopaedic surgery callout | ✅ | |
| Medtronic banner | ✅ | |
| Solutions (doctors, clinics, imaging, hospitals) | ✅ | |
| WhatsApp banner | 🟡 | Goes to the quote form until a WhatsApp number is given |
| Quotation form | 🟡 | Form fields must be set up in TheCoins → Contact form settings |
| Quotation details + procurement contact card | ✅ | |

## Shopping

| Feature | Status | Notes |
|---|---|---|
| All categories page (`/categories`) | ✅ | Category tiles with photo, name, description |
| Category page (`/category/…`) | ✅ | Products, filters, sorting by API, pagination |
| Sub-category links from the menus | ✅ | Open the category with a search for the sub-category name (store has no real sub-categories yet) |
| All products (`/products`) | ✅ | |
| Search results (`/search?q=…`) | ✅ | Includes "no results" message |
| Filters (sub-category, price range, on sale, featured, in stock) | ✅ | Filters come from the store settings; collapsible on phones |
| Pagination | ✅ | |
| Brands page (`/brands`) and brand page (`/brand/…`) | ✅ | Brand page searches products by brand name until products have a "Brand" field |
| Product cards | ✅ | Photo in a fixed frame (any photo size fits), placeholder when no photo, REF/SKU, name, short text, price, sale price, "Add to quote list" |
| Product page (`/product/…`) | ✅ | Photo gallery, REF, price, sale price, description, options (size/pack), quantity, add to quote list, "currently unavailable" state |
| Ready Stock page design (special offer cards) | ⬜ | Uses the normal category page for now |

## Quote list and quotation (instead of a shopping cart)

| Feature | Status | Notes |
|---|---|---|
| Add to quote list (cards and product page) | ✅ | Saved in the store's cart for this browser |
| Quote list page (`/quote`) | ✅ | Change quantity, remove lines, empty state |
| Send quotation request | 🟡 | Sends the form plus all quote-list lines; waits for form fields in TheCoins |
| Prices shown as "indicative" in OMR | ✅ | |

## Account

| Feature | Status | Notes |
|---|---|---|
| Sign in with phone number + SMS code | ✅ | New customers are asked for their name |
| Request history (orders) | ✅ | |
| Loyalty points | ✅ | Shown if the store uses points |
| Sign out | ✅ | |
| Account menu (Overview, Orders, Quotation requests, Addresses, Account details) | ⬜ | In Figma, not built |

## Information pages

| Feature | Status | Notes |
|---|---|---|
| Any page made in the page builder (`/about`, `/faq`, `/privacy-policy`, …) | 🟡 | Works, but these pages don't exist in TheCoins yet. Footer links show "page not found" |
| About page design | ⬜ | In Figma, not built |
| FAQ page with open/close questions | ⬜ | In Figma, not built |
| Contact page (form, sent, error) | ⬜ | In Figma, not built |
| Policy pages with side menu | ⬜ | In Figma, not built |
| "Page not found" page | ✅ | |
