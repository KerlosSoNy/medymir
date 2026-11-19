# MedyMar website: progress

_Last updated: 19 November 2026 (product page built from Figma: ready stock, quotation and sold-out looks; "Delivery & Ordering" tab and help banner saved as CMS page `product`; prices now only on Ready Stock product cards; quote list page built from Figma, texts saved as CMS page `quote`; account page with menu, orders, saved addresses and account details)_

Where we are, measured against the Figma file. Also see [FEATURES.md](FEATURES.md) (what the site does), [SPECS.md](SPECS.md) (how it's built) and [AGENTS.md](AGENTS.md) (rules for AI assistants).

**Figma:** https://www.figma.com/design/tC40f2XIHH375SqjUyfxE8/Medymar

## Summary

- **The whole site now uses Tailwind CSS.** The old 2,500-line stylesheet is gone, and every page works on phone, tablet and computer with no sideways scrolling, checked at 360, 390, 768/820, 1024, 1280 and 1440 wide.
- **Done from Figma:**
  - home page, header, footer and navbar mega menus, at all three sizes
  - the tablet/phone menu drawer
  - all card designs (product, category, brand, exclusive brand, solution)
- **Product page done from Figma (19 Nov)** at all sizes: ready stock, quotation (no price) and sold-out looks, tabs and help banner (texts in Page builder → Product). Prices show only on Ready Stock offers, on product pages and cards.
- **Quote list page built from Figma (19 Nov)**: list, details form, summary sidebar; texts in Page builder → Quote list.
- **Account page built from Figma (19 Nov)**: menu, overview, orders, saved addresses, account details.
- **Shop pages work, with simpler layouts:** search, brands. Their larger Figma page layouts are not built yet.
- **About, Contact and FAQ pages are live (18 Nov)**, matching Figma. About still needs its photo; Contact shows the store's quotation fields (see section 3, task 3).
- **Not built yet:** Policy pages and the special Ready Stock page.
- **Page builder kit (18 Nov):** a section gallery (`/dev/widgets`, 31 section styles), a draft preview (`/dev/preview/<page>`) and the `/cms-page` command, so new pages (About, FAQ…) can be planned, previewed and approved before anything is saved to the store. Local only; checked at 360–1440 wide.
- **Still waiting on store content:** some photos, the quotation form fields, real products and the info pages.

Preview: `npm run dev` → http://localhost:3000. Production check: `npm run build && npm run start`.

Legend: ✅ done and matches Figma · 🟡 works, but simpler than Figma or waiting on content · ⬜ not built.

---

## 1. Figma screens: status by size

| Figma screen | Desktop 1440 | Tablet 768 | Mobile 390 | Notes |
|---|---|---|---|---|
| **Header + announcement bar** | ✅ | ✅ | ✅ | Tablet/phone: search on its own row |
| **Category bar + mega menus** (All categories, Cardiovascular, Surgical, Orthopedics) | ✅ | — | — | The 4 other categories use the same design. Their texts are ours; please check them |
| **Menu drawer** (closed + category open) | — | ✅ | ✅ | |
| **Footer** | ✅ | ✅ | ✅ | Payment logos hidden until uploaded |
| **Home** | ✅ | ✅ | ✅ | See section 2 for missing photos |
| Categories | 🟡 | 🟡 | 🟡 | Category tiles match Figma; the rest of the page layout is simplified |
| Category (e.g. Endoscopy) | ✅ | ✅ | ✅ | Matches Figma (checked at 360–1440): trail, hero (category name, description, picture), sub-category tiles (shown once the store has sub-categories), Featured brands (brands with products in the category), store filters, Products toolbar with Sort by, cards. Per-category promo banner / callout go in an optional CMS page `category-<slug>` (none made yet) |
| Ready Stock | 🟡 | 🟡 | 🟡 | Built to match Figma and live at `/category/ready-stock-offers` (checked at 360–1440). Hero photo not uploaded (`design-assets/upload/R01-hero-ready-stock.png`). Sidebar shows the store's filters (price, on sale, featured, in stock), not Figma's Categories/Brand/Pack size |
| Brands | 🟡 | 🟡 | 🟡 | Brand tiles match the card design; the full Figma page is not built |
| Product: ready stock / quotation / sold out | ✅ | ✅ | ✅ | Matches Figma (checked at 360–1440; tabs, quantity, enlarge picture, add to quote list and "Request bulk pricing" tested). Differences: the gold button says "Add to quote list" (Figma: "Add to cart"; the site has no checkout); thumbnails appear under the photo when a product has several pictures (not in Figma); on phones the photo box is square (Figma's phone frame has a 627px-tall box). "Chat on WhatsApp" waits for the number (task 11). Sold-out look not seen live yet: no product is sold out |
| Search: results / no results / empty | 🟡 | 🟡 | 🟡 | Results and "no results" work; the special "empty" design is not built |
| Quote list | ✅ | ✅ | ✅ | Built to match Figma (checked at 360–1440; quantity, remove, "Add another product", required-field check tested; no real request sent). Texts from the CMS page `quote` (saved 19 Nov). Figma's consent tick box is left out until the privacy policy page exists (owner, 19 Nov). Form shows the store's 7 fields, not Figma's 9. "Prefer WhatsApp?" card waits for the number (task 11). Figma's filled list has no design; rows built in the same style. Phone: the 3 steps stay in one row (Figma's phone frame stacks them) |
| Account: signed out / with orders / no orders | ✅ | ✅ | ✅ | Matches Figma (checked at 360–1440). Sign-in stays phone + SMS code (Figma says email). Figma only has Overview; Orders, Quotation requests, Addresses and Account details are built in the same style. Signed-in screens were checked with test data only: the address and profile calls have not been tried with a real login yet |
| About | 🟡 | 🟡 | 🟡 | Built to match Figma and live at `/about` (checked at 360–1440). Waiting on the hero photo (owner task 0) |
| FAQ | ✅ | ✅ | ✅ | Live at `/faq`, matches Figma (checked at 360–1440; search, topics and open/close tested). Figma had only the first answer; the other 12 were written by the developer and approved by the owner |
| Contact: form / sent / error | 🟡 | 🟡 | 🟡 | Built to match Figma and live at `/contact` (all 3 states checked at 360–1440; sent/error tested with a fake reply, no real enquiry sent). Shows the store's form fields (currently the quotation fields, not Figma's 6 contact fields); WhatsApp line left out until there is a number |
| Policies (privacy, shipping, refund, terms, contact info) | 🟡 | 🟡 | 🟡 | Built to match Figma (checked at 360–1440). 4 drafts with Figma texts (`cms-drafts/<slug>.json`), waiting for the owner to confirm the promises in them. Privacy: Figma text is a Shopify template, on hold. Not saved yet. When the privacy page is live, add the consent tick box to Page builder → Quote list (`consentText`, `privacyLinkText`) |
| "Page not found" | ✅ | ✅ | ✅ | No Figma frame; built in the same style |

**Cards** (Figma Components page): product card, category card and tile, brand card, exclusive-brand card, solution card, menu list item, menu category card and menu promo card are all ✅. Every card handles any photo size and shows a styled placeholder when there's no photo.

---

## 2. Backend (TheCoins store "MedyMar"): what works now

| Area | Status | Details |
|---|---|---|
| Store info, colours, currency (OMR) | ✅ | Country is still **EG** and phone is still the old café number (owner to change) |
| Home page (CMS `home`) | ✅ | Still a **draft**, which the API shows anyway |
| Site layout (CMS `site-layout`) | ✅ | Announcement bar, footer, brand list |
| Categories | ✅ | 8 categories; **7 have photos** (Ready Stock Offers has none); 3 have descriptions |
| Products | 🟡 | **25 demo products** marked "(Demo)", 13 with photos. Real products not added yet |
| Brand product detail | 🟡 | Created (8 brands); demo products don't have a brand set yet |
| Filters | ✅ | Sub-category, price range, on sale, featured, in stock (from store settings) |
| Search | ✅ | |
| Quote list (cart) | ✅ | Add, change quantity, remove |
| Quotation form | 🟡 | 7 fields set up in Contact form settings (also used by the Contact page). Problems: the **phone check only accepts Egyptian numbers**, "You are buying as" has **no choices**, some labels are lower-case. Never tested end to end |
| SMS login + orders | ✅ | |
| Tracking pixels | ✅ | |
| Info pages (about, faq, policies, tender-desk…) | 🟡 | `about`, `contact` and `faq` exist (drafts, shown publicly). The others don't exist yet; their footer links show "page not found" |

**Photos still missing on the home page:**
- the 6 exclusive-brand photos (ready in `design-assets/generated/`)
- brand-carousel photos for Boston Scientific, Medtronic and Abbott (they show a navy name card instead)
- payment logos in `site-layout`
- **Abbott promo:** the uploaded picture has a light strip on its left edge. A fixed version is ready at `design-assets/upload/06-promo-abbott-fixed.webp` and needs to replace it in Page builder → home.

---

## 3. Waiting on the store owner (TheCoins dashboard)

| # | Task | Why it matters |
|---|---|---|
| 0c | **Ready Stock:** upload the hero photo (Page builder → Ready Stock → first section → Image; file `design-assets/upload/R01-hero-ready-stock.png`), add the real offers to the Ready Stock Offers category with **Pack size** and **Unit** filled in, and switch on stock tracking where "Available: X" should show | The page and its offer cards read these from the store |
| 0b | **Brand list (Products → product details → Brand):** write a short description (tagline) for each brand, and upload a banner photo for the brands that still show the logo card | The home "Shop by brand" cards read both from there |
| 0 | **Add the About page photo:** Page builder → About → first section (Text & Image) → Image → upload `design-assets/upload/A01-about-hero.png` (from Figma, white corners already trimmed), or a better original from the designer | The About hero shows text only until then. The connector can't upload a photo this size (see AGENTS.md §5) |
| 1 | **Get clean background pictures from the designer** (no drawn-in text or buttons) for the hero, Abbott wide banner, Abbott promo and WhatsApp banner (the WhatsApp banner already shows real text and button; a clean picture just makes it sharper); upload them and fill each banner's title / description / button text | Real, clickable buttons and real text are built and switch on when a banner has button text. The hero already has button text, so its title shows twice until its clean picture is uploaded |
| 1b | **Replace the Abbott promo picture** with `design-assets/upload/06-promo-abbott-fixed.webp` (until the clean art arrives) | Removes the white strip beside it |
| 1c | **Upload tightly cropped brand logos** (Products → product details → Brand) for Boston Scientific, Terumo, Biotronik and Edwards; add a logo for MicroPort Orthopedics | These logo files have large empty margins, so the logos look small on the site |
| 2 | **Upload the missing photos** (section 2) | Cards show placeholders until then |
| 3 | **Fix the form fields** (Contact form settings): phone check accepts only Egyptian numbers (Omani customers can't send); add choices to "You are buying as"; capitalise "organization", "work email", "what do you need?" | Both the quotation form and the Contact page show these fields |
| 4 | **Add real products** (name, Brand, REF/SKU, category, price in OMR, photo) and remove the demo ones | The site currently shows demo products |
| 5 | **Change the store country** from Egypt to Oman | Can't be changed through the connector |
| 6 | **Give a MedyMar phone number** (or clear the old café number) | The store still has the café phone |
| 7 | **Create the footer pages**: `tender-desk`, `verify-batch`, `distributors`, `help`, `privacy-policy`, `shipping-policy`, `refund-policy`, `terms-of-service` | Those links show "page not found" until the pages exist |
| 8 | **Delete the page "ZZ widget test"** | Leftover test page; the connector can't delete pages |
| 9 | **Delete or rename the old "Header" menu** (café menu items) | Not used by the new site |
| 10 | Replace the 7 **placeholder brand cards** in "Shop by brand" (Home page) with real brand photos | They're simple navy cards with the brand name, made by the developer, not official logos |
| 11 | Give the **WhatsApp number** for the "Request a quote on WhatsApp" banner, the Contact page and product pages | The banner's button currently goes to the quote form. With the number it becomes a WhatsApp link, the Contact page panel gets its "Chat with our team on WhatsApp" line, and product pages get "Need help? Chat on WhatsApp" (all in Figma, left out for now) |
| 13 | **Decide the Contact form fields:** the store has one field list for both forms. Keep the quotation fields on the Contact page too, or change the list so it suits both (e.g. add an "Enquiry type" dropdown with "Quotation" as one choice) | Figma's Contact form has 6 fields (Name, Email, Phone, Organisation, Enquiry type, Message); the page currently shows the 7 quotation fields |
| 12 | **Check the mega-menu texts** for Endoscopy, Dialysis & Urology, Critical Care & Infusion and Hospital Supplies (`lib/menu.ts`) | These 4 menus aren't in Figma; we wrote their texts |

---

## 4. Open decisions
- **Decided 19 Nov (owner):** products outside Ready Stock show **"Quotation on request" with no price** on the product page (Figma). Product cards follow the same rule (owner, 19 Nov): no price outside Ready Stock, "Request a quotation" instead.
- **How to add the photos:** the owner uploads the originals in the page builder (recommended), or the developer uploads the Figma exports (lower quality).
- **Category names:** the design's category cards use longer names ("Cardiovascular & Cardiac Surgery") and mention "13 medical categories". The store currently has the 8 names from the menu bar. The menus show the 12 long-name groups as sub-sections.
- **Sub-categories:** the menus list sub-categories (e.g. "Structural Heart") that don't exist in the store, so they open the category with a search. Creating real sub-categories in the store would make them exact.
- **Brands:** the store now has a **Brand** product detail (17 Nov). Brand pages still search products by brand name until products have a brand set; then they will switch to the Brand detail.

---

## 5. Log of changes made in TheCoins (store "MedyMar", formerly "Heliopolis Hub")

| Date | Change |
|---|---|
| 16 Nov | Switched on 6 café products, created a café Home page and "Header" menu (first café site) |
| 16 Nov | _(Owner)_ Deleted all café products and categories |
| 16 Nov | Store renamed **Heliopolis Hub → MedyMar**; tagline "Healthcare procurement simplified"; colours navy #1B3A6B / gold #C99A2E; fonts Inter + Poppins |
| 16 Nov | Currency **EGP → OMR**; timezone Asia/Muscat; language English; contact email milani@shamhabib.com; address "Muscat · Kigali · Nairobi" |
| 16 Nov | Created 8 categories: Cardiovascular, Surgical, Endoscopy, Dialysis & Urology, Orthopedics & Trauma, Critical Care & Infusion, Hospital Supplies, Ready Stock Offers |
| 17 Nov | Created test page "ZZ widget test" to check which section types keep their settings, then emptied it |
| 17 Nov | **Replaced the Home page** with the MedyMar layout (all Figma sections and texts; images empty); still a draft |
| 17 Nov | Created page **"site-layout"** (announcement bar, category-bar extras, footer content) |
| 17 Nov | Added descriptions to Cardiovascular, Surgical and Endoscopy (category card subtitles) |
| 17 Nov | Created product detail (dynamic attribute) **Brand** (`brand`, pick-from-list, shown on product page, optional) with 8 brands: Abbott, Medtronic, Stryker, Boston Scientific, Terumo, Edwards, Biotronik, MicroPort Orthopedics |
| 17 Nov | Home page "Shop by brand": added 4 cards (Terumo, Edwards, Biotronik, MicroPort Orthopedics) and pointed 7 cards at **temporary placeholder images** in the website folder (`public/placeholders/brands/`). Stryker keeps its real photo |
| 17 Nov | Store now has 25 demo products and photos for 7 categories and several home sections (added in the dashboard or another session; not logged in detail) |
| 17 Nov | _(Owner approved)_ Set the **Brand** detail on 10 demo products: Abbott ×2, Boston Scientific ×2, Medtronic, MicroPort Orthopedics, Stryker ×3, Terumo |
| 17 Nov | _(Owner)_ Hero slide: added button text "Explore all brands"; added a **Two-One Grid** "Top Products" section (4 brands) at the bottom of the home page |
| 17 Nov | _(Owner approved)_ Home page "Shop by brand": removed 7 picture paths that pointed at files inside the website project (`/placeholders/brands/…`); those cards now show the brand logo, name and tagline |
| 18 Nov | _(Owner approved)_ Home page: the WhatsApp banner ("Short on time? Send us your list.") changed from a picture-only **Banners** section to a **Button CTA** with look `banner`: real label, title, text, button ("Request a quote on WhatsApp", still links to the quote form) and note; the old picture is kept as the art on the right. Record: `cms-drafts/home-whatsapp-banner.json` |
| 18 Nov | _(Owner approved)_ Home page, Abbott block: the right-hand picture beside the products changed from a picture-only **Banners** section to a **Button CTA** with look `banner` (shown as a tall card beside products): title "Abbott — Precision for every procedure", subtitle "Coronary and vascular devices, quoted to your cath lab's needs.", button "View Abbott products" → /brand/abbott; same picture. The hero banner's unused "mid-widget" tag was dropped (the save tool doesn't accept it). Record: `cms-drafts/home-abbott-promo.json` |
| 18 Nov | _(Owner approved)_ Home page: the WhatsApp banner had gone back to the picture-only **Banners** section (page saved at 11:20 UTC, probably the Abbott save above built from an older copy of the page). Put the **Button CTA** look `banner` back (same texts as `cms-drafts/home-whatsapp-banner.json`); nothing else changed. Checked at 390, 768 and 1440 |

| 18 Nov | _(Owner approved)_ Created page **"About"** (`about`, draft = shown publicly): page hero, intro + 3 link cards, "Two ways to buy" + 2 route cards, closing band, all texts from Figma. Hero photo left empty (owner to upload, section 3 task 0). Record: `cms-drafts/about.json` |
| 18 Nov | _(Owner approved)_ Created page **"Contact"** (`contact`, draft = shown publicly): heading, enquiry form (fields from Contact form settings), navy contact panel (email, locations, working hours), "Have a product list?" card; texts from Figma. Record: `cms-drafts/contact.json` |
| 18 Nov | _(Owner approved)_ Site layout: footer "About & Support" → **Contact** link changed from `/#quote` to `/contact` (re-read first; only that link changed, checked by comparing before/after). Record: `cms-drafts/site-layout.json` |
| 18 Nov | _(Owner approved)_ Created page **"FAQ"** (`faq`, draft = shown publicly): heading, search + 5 topics + 13 questions (FAQ / Accordion, look `topics`), "Still have a question?" bar. Question texts from Figma; answers drafted by the developer, approved by the owner. Record: `cms-drafts/faq.json` |
| 18 Nov | _(Owner approved)_ Home page: "Shop by brand" changed from a **Testimonials** section (8 typed-in cards with taglines, Stryker photo) to a **Product Attributes** section on the Brand list (same 8 brands, same order). Cards now take each brand's banner photo, logo and description from the Brand list; taglines are gone until descriptions are written there. Re-read first (unchanged since 12:11), nothing else changed. Record: `cms-drafts/home.json` |
| 18 Nov | _(Owner approved)_ Created two product details (dynamic attributes) for the Ready Stock offer cards: **Pack size** (`pack_size`, free text, e.g. "10 dressings / pack") and **Unit** (`unit`, pick-from-list: pack, box, unit, tub). Both shown on the product page, optional |
| 18 Nov | _(Owner approved)_ Created page **"Ready Stock"** (`ready-stock`, draft = shown publicly) for `/category/ready-stock-offers`: hero, 3 promises, offers area, bulk-order bar, How it works, info line, WhatsApp banner, reservation form; texts from Figma. Saved a second time a minute later to move the offers area from Products by Category (drops our settings publicly) to Text + Image look `offers`; nothing else changed. Hero photo still empty. Record: `cms-drafts/ready-stock.json` |
| 19 Nov | _(Owner approved)_ Created page **"Product"** (`product`, draft = shown publicly) for every product page: a "Delivery & Ordering" tab (Text + Image look `product-tab`, text written by the developer from the shipping policy draft) and the help banner "Need help finding the right reference?" (Button CTA look `product-help`, Figma text, button → /quote, WhatsApp link empty). New page, nothing else changed; checked on the live product page. Record: `cms-drafts/product.json` |
| 19 Nov | _(Owner approved)_ Created page **"Quote list"** (`quote`, draft = shown publicly) for `/quote`: intro line, attachment note (home form wording, no upload), small print, sidebar note "No payment required", button text, footnote, "What happens next?" (3 steps) and the "Prefer WhatsApp?" card with an empty link (hidden until the number is added). Consent tick box left empty on purpose. Texts from Figma. New page, nothing else changed; checked on the live page. Record: `cms-drafts/quote.json` |

Nothing was deleted by the developer. TheCoins has no delete action.

---

## 6. Known issues
- **Hero text shows twice** until the hero's clean background picture is uploaded (it has button text now, so the site draws a real title and button over a picture that still has its own).
- **Abbott promo strip:** see section 3, item 1.
- **Drafts are public:** TheCoins serves draft pages through the public API, so unpublished builder edits can appear on the site.
- **Some section types drop settings:** the public API drops or renames some fields (Hero Banner, Logo Cloud, Gallery). The site uses section types that keep everything; see SPECS.md §7.
- **Hidden settings:** some sections use extra settings (e.g. `variant`, `eyebrow`, `linkText`) that the page builder keeps but may not show as editable fields.
- **Category bar between 1025 and ~1200px wide:** the category names scroll sideways inside the bar because they don't all fit.
- **Not tested:** submitting a real quotation, because the form has no fields yet.

---

## 7. Next steps
1. Owner tasks in section 3, especially the Abbott picture, the photos and the quotation form fields
2. Policy pages: owner confirms the texts, then they are saved to the store
3. Bring the shop pages up to their full Figma layouts: brands page, empty search
4. Products imported, each with its **Brand** set; then switch brand pages from name search to the Brand detail and check the Brand filter
5. Test a real quotation submission (with the owner's OK)
5b. Sign in with a real phone once and check the account page (addresses, account details) against the live store
6. Logo as an image file (optional; the site currently draws the wordmark from the store name)
7. Hosting and domain
