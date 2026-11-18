# MedyMar website: progress

_Last updated: 18 November 2026 (Abbott side card on the home page now has a subtitle and button)_

Where we are, measured against the Figma file. Also see [FEATURES.md](FEATURES.md) (what the site does), [SPECS.md](SPECS.md) (how it's built) and [AGENTS.md](AGENTS.md) (rules for AI assistants).

**Figma:** https://www.figma.com/design/tC40f2XIHH375SqjUyfxE8/Medymar

## Summary

- **The whole site now uses Tailwind CSS.** The old 2,500-line stylesheet is gone, and every page works on phone, tablet and computer with no sideways scrolling, checked at 360, 390, 768/820, 1024, 1280 and 1440 wide.
- **Done from Figma:**
  - home page, header, footer and navbar mega menus, at all three sizes
  - the tablet/phone menu drawer
  - all card designs (product, category, brand, exclusive brand, solution)
- **Shop pages work, with simpler layouts:** category, search, product, quote list, account, brands. Their larger Figma page layouts are not built yet.
- **Not built yet:** About, FAQ, Contact, Policy pages and the special Ready Stock page.
- **Page builder kit (18 Nov):** a section gallery (`/dev/widgets`, 27 section styles), a draft preview (`/dev/preview/<page>`) and the `/cms-page` command, so new pages (About, FAQ…) can be planned, previewed and approved before anything is saved to the store. Local only; checked at 360–1440 wide.
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
| Category (e.g. Endoscopy) | 🟡 | 🟡 | 🟡 | Products, filters and pagination work. Figma's category header and featured brands are not built |
| Ready Stock | ⬜ | ⬜ | ⬜ | Uses the normal category page; offer cards (Card/Offer) not built |
| Brands | 🟡 | 🟡 | 🟡 | Brand tiles match the card design; the full Figma page is not built |
| Product: ready stock / quotation / sold out | 🟡 | 🟡 | 🟡 | Gallery, price, REF, options, add to quote list and "unavailable" all work. Figma's tabs and extra blocks are not built |
| Search: results / no results / empty | 🟡 | 🟡 | 🟡 | Results and "no results" work; the special "empty" design is not built |
| Quote list | 🟡 | 🟡 | 🟡 | Works; Figma's summary sidebar is not built |
| Account: signed out / with orders / no orders | 🟡 | 🟡 | 🟡 | SMS login and orders work; Figma's account menu and header are not built |
| About | ⬜ | ⬜ | ⬜ | Page can be made in the page builder (`about`), but the Figma design isn't built |
| FAQ | ⬜ | ⬜ | ⬜ | |
| Contact: form / sent / error | ⬜ | ⬜ | ⬜ | |
| Policies (privacy, shipping, refund, terms, contact info) | ⬜ | ⬜ | ⬜ | |
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
| Quotation form | 🟡 | **No fields set up** in Contact form settings, so it can't be sent yet. Never tested end to end |
| SMS login + orders | ✅ | |
| Tracking pixels | ✅ | |
| Info pages (about, faq, policies, tender-desk…) | ⬜ | None exist in the page builder; footer links show "page not found" |

**Photos still missing on the home page:**
- the 6 exclusive-brand photos (ready in `design-assets/generated/`)
- brand-carousel photos for Boston Scientific, Medtronic and Abbott (they show a navy name card instead)
- payment logos in `site-layout`
- **Abbott promo:** the uploaded picture has a light strip on its left edge. A fixed version is ready at `design-assets/upload/06-promo-abbott-fixed.webp` and needs to replace it in Page builder → home.

---

## 3. Waiting on the store owner (TheCoins dashboard)

| # | Task | Why it matters |
|---|---|---|
| 1 | **Get clean background pictures from the designer** (no drawn-in text or buttons) for the hero, Abbott wide banner, Abbott promo and WhatsApp banner (the WhatsApp banner already shows real text and button; a clean picture just makes it sharper); upload them and fill each banner's title / description / button text | Real, clickable buttons and real text are built and switch on when a banner has button text. The hero already has button text, so its title shows twice until its clean picture is uploaded |
| 1b | **Replace the Abbott promo picture** with `design-assets/upload/06-promo-abbott-fixed.webp` (until the clean art arrives) | Removes the white strip beside it |
| 1c | **Upload tightly cropped brand logos** (Products → product details → Brand) for Boston Scientific, Terumo, Biotronik and Edwards; add a logo for MicroPort Orthopedics | These logo files have large empty margins, so the logos look small on the site |
| 2 | **Upload the missing photos** (section 2) | Cards show placeholders until then |
| 3 | **Set up the quotation form fields** (Contact form settings) | The form can only show fields configured there. Suggested: Full name*, Organisation, Work email*, Phone / WhatsApp, You are buying as (dropdown), Delivery city & country, What do you need?* (long text) |
| 4 | **Add real products** (name, Brand, REF/SKU, category, price in OMR, photo) and remove the demo ones | The site currently shows demo products |
| 5 | **Change the store country** from Egypt to Oman | Can't be changed through the connector |
| 6 | **Give a MedyMar phone number** (or clear the old café number) | The store still has the café phone |
| 7 | **Create the footer pages**: `about`, `tender-desk`, `verify-batch`, `distributors`, `help`, `faq`, `privacy-policy`, `shipping-policy`, `refund-policy`, `terms-of-service` | Those links show "page not found" until the pages exist |
| 8 | **Delete the page "ZZ widget test"** | Leftover test page; the connector can't delete pages |
| 9 | **Delete or rename the old "Header" menu** (café menu items) | Not used by the new site |
| 10 | Replace the 7 **placeholder brand cards** in "Shop by brand" (Home page) with real brand photos | They're simple navy cards with the brand name, made by the developer, not official logos |
| 11 | Give the **WhatsApp number** for the "Request a quote on WhatsApp" banner | The banner's button currently goes to the quote form. With the number it becomes a WhatsApp link (Page builder → home → WhatsApp banner → link) |
| 12 | **Check the mega-menu texts** for Endoscopy, Dialysis & Urology, Critical Care & Infusion and Hospital Supplies (`lib/menu.ts`) | These 4 menus aren't in Figma; we wrote their texts |

---

## 4. Open decisions
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
2. Build the remaining Figma pages: About, FAQ, Contact (3 states), Policies (5), Ready Stock
3. Bring the shop pages up to their full Figma layouts: category header, product tabs, quote-list summary, account menu, brands page
4. Products imported, each with its **Brand** set; then switch brand pages from name search to the Brand detail and check the Brand filter
5. Test a real quotation submission (with the owner's OK)
6. Logo as an image file (optional; the site currently draws the wordmark from the store name)
7. Hosting and domain
