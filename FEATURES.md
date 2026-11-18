# MedyMar website: features

_Last updated: 18 November 2026_

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
| └ Category panels (7) | ✅ | Sub-categories, "View all" link, "Request a quote" card, featured brands (from the store: the brands of that category's products) |
| **Menu drawer** (tablet & phone) | ✅ | As in Figma: ☰ button, slides in, categories open into groups and sub-categories, Brands list, "Delivering to" line; closes with ×, Esc, backdrop or a link |
| Footer | ✅ | About text, categories, top brands, contact, About & Support links, policy links, payment logos |
| Brand colours from the store settings | ✅ | Changing colours in TheCoins changes the site |
| Tracking pixels from TheCoins | ✅ | Loaded on every page |
| Phone, tablet and computer layouts | ✅ | 360px → 1440px+ |
| English only | ✅ | No Arabic / right-to-left (decision) |

## Home page

All sections come from CMS page `home` in the page builder; texts, links and images are editable there.

| Section | Status | Notes |
|---|---|---|
| Hero slider | ✅ | Slides, arrows, dots. A slide with button text gets a real title, subtitle and button (see Banners below) |
| Popular searches (chips) | ✅ | Each chip runs a search |
| Features strip (3 benefits) | ✅ | |
| Shop by category carousel | 🟡 | 5 of 8 categories have no photo yet |
| Abbott banner + Abbott products + promo | ✅ | |
| Shop by brand carousel | ✅ | Name, tagline and link from the CMS; brand logo from the store's Brand list; a CMS photo replaces the card when uploaded |
| Banners with real text and button | 🟡 | Built: a banner with button text shows a real title, text and button. Waits for the designer's clean background pictures (current pictures have text drawn in) |
| Top Products (Two-One Grid) | ✅ | Brand cards with logo and product count, product cards or category tiles, as set in the page builder |
| "Lines buyers ask for most" (tabs + products) | ✅ | |
| Exclusive brands in Oman | ✅ | |
| Stryker section (products + promo) | ✅ | |
| Orthopaedic surgery callout | ✅ | |
| Medtronic banner | ✅ | |
| Solutions (doctors, clinics, imaging, hospitals) | ✅ | |
| WhatsApp banner | 🟡 | Goes to the quote form until a WhatsApp number is given |
| Quotation form | 🟡 | Fields come from TheCoins → Contact form settings (7 quotation fields set up; the phone check still only accepts Egyptian numbers). The Contact page uses the same fields |
| Quotation details + procurement contact card | ✅ | |

## Shopping

| Feature | Status | Notes |
|---|---|---|
| All categories page (`/categories`) | ✅ | Category tiles with photo, name, description; tiles without a photo show initials |
| Category page (`/category/…`) | ✅ | Products, filters, sorting by API, pagination |
| Sub-category links from the menus | ✅ | Open the category with a search for the sub-category name (store has no real sub-categories yet) |
| All products (`/products`) | ✅ | |
| Search results (`/search?q=…`) | ✅ | Includes "no results" message |
| Filters (sub-category, price range, on sale, featured, in stock) | ✅ | Filters come from the store settings; collapsible on phones |
| Pagination | ✅ | |
| Brands page (`/brands`) | ✅ | The store's Brand list with each brand's uploaded logo |
| Brand page (`/brand/…`) | ✅ | Exactly the products whose Brand detail is that brand, plus a Brand filter. Brands not in the store's Brand list (e.g. Hermann) fall back to a name search |
| Product cards | ✅ | Figma design: REF/SKU, photo shown whole in a fixed frame (any photo size fits), "No product image yet" placeholder, name and text cut to 2 lines, price or "Request a quotation", full-width "Add to quote list"; all cards in a row line up |
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
| Info pages from the page builder | 🟡 | Each has its own route file (About, Contact, FAQ so far). Policy and other footer pages don't exist yet and show "page not found" |
| About page (`/about`) | 🟡 | Built from Figma (hero, intro, 3 link cards, "Two ways to buy", closing band); texts editable in Page builder → About. Hero photo not uploaded yet |
| Breadcrumbs on info pages | ✅ | "Home › Page title" above About, Contact, FAQ (and future info pages) |
| FAQ page (`/faq`) | ✅ | Built from Figma: search box, topic buttons, 13 questions that open and close, "Still have a question?" bar. Questions, answers and topics editable in Page builder → FAQ |
| Contact page (form, sent, error) | 🟡 | Live at `/contact`, built from Figma: enquiry form, navy contact panel, "Have a product list?" card, thank-you and error messages. Its fields are the store's Contact form fields, the same list as the quotation form. Texts editable in Page builder → Contact |
| Policy pages with side menu | ⬜ | In Figma, not built |
| "Page not found" page | ✅ | |

## Page-building tools (on the developer's computer only)

| Feature | Status | Notes |
|---|---|---|
| Section gallery `/dev/widgets` | ✅ | Follows the TheCoins "Add widget" menu: all 44 widgets with their menu names, a badge (on our website / don't use / not yet), and under each widget the looks our site gives it, with sample content. Search box like the menu |
| Draft preview `/dev/preview/<page>` | ✅ | Shows a planned page from `cms-drafts/<page>.json` before it is saved to TheCoins |
| `/cms-page` command in Claude Code | ✅ | Step-by-step: plan → draft → preview → owner approves → save to TheCoins → log |
