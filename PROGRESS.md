# MedyMar website: progress

_Last updated: 17 November 2026_

## Summary

The new MedyMar website is built from the Figma design and shows the content of the TheCoins store "MedyMar". All home page sections, the header and the footer are in place. **Photos, products and the quotation form fields are still missing.**

Preview: run `npm run build && npm run start`, then open http://localhost:3000. On the developer's machine it runs at http://localhost:3107.

---

## 1. Done

### Website (this folder)
- [x] New Next.js site, English only, built from the Figma home page (Desktop 1440)
- [x] Header: announcement bar, MedyMar wordmark, search with category dropdown, account link, quote list with counter
- [x] Category bar ("Ready Stock Offers" highlighted) with the Figma mega menus: "All categories" (12 numbered groups) and a panel per category (sub-categories, "view all" link, quote card, featured brands). Opens on hover or keyboard focus on computers and closes with Esc. Tablets and phones get a hamburger menu that slides in from the side. Menu texts are in `lib/menu.ts`
- [x] Home page sections: hero slider, popular searches, features, shop by category carousel, Abbott banner and section, shop by brand carousel, "Lines buyers ask for most", exclusive brands in Oman, Stryker section, orthopaedic surgery callout, Medtronic banner, solutions, WhatsApp banner, quotation form, quotation details, procurement contact card
- [x] Footer: wordmark, about text, categories, top brands, contact, About & Support links, policy links, copyright
- [x] Quote list instead of a shopping cart (add to quote list, quote list page, list lines sent with the request)
- [x] Pages: category, search, all products, brand, brands, categories, product, quote list, account (SMS login), any page made in the page builder
- [x] Phone and tablet layouts
- [x] 40 Figma icons saved in `public/icons/`
- [x] 18 Figma images exported to `design-assets/` (`webp/` = compressed, ready to upload)
- [x] Old café website archived (still works) at `../heliopolisHub-cafe-site`

### Changes made in the TheCoins store
See section 4 for the full list.

---

## 2. Waiting on the store owner (TheCoins dashboard)

| # | Task | Why it matters |
|---|---|---|
| 1 | **Upload photos** to the image slots on the Home page (hero, banners, promos, brand cards, solutions, WhatsApp banner) and the payment logos in "site-layout" | Image sections are hidden until they have a photo. The Figma exports are low resolution, so original files are better |
| 2 | **Add category photos** to the 8 categories | Category cards show a plain blue area without them |
| 3 | **Set up the quotation form fields** (Contact form settings) | The form can only show fields configured there. Suggested: Full name*, Organisation, Work email*, Phone / WhatsApp, You are buying as (dropdown), Delivery city & country, What do you need?* (long text) |
| 4 | **Add products** (name, brand, REF/SKU, category, price in OMR, photo) | All product sections are empty |
| 5 | **Change the store country** from Egypt to Oman | Can't be changed through the connector |
| 6 | **Give a MedyMar phone number** (or clear the old café number) | The store still has the café phone |
| 7 | **Create the footer pages** if wanted: `about`, `tender-desk`, `verify-batch`, `distributors`, `help`, `faq`, `privacy-policy`, `shipping-policy`, `refund-policy`, `terms-of-service` | Those links show "page not found" until the pages exist |
| 8 | **Delete the page "ZZ widget test"** | Leftover test page; the connector can't delete pages |
| 9 | **Delete or rename the old "Header" menu** (café menu items) | Not used by the new site |
| 10 | Give the **WhatsApp number** for the "Request a quote on WhatsApp" banner | The banner link currently goes to the quote form |

---

## 3. Open decisions
- **How to add the photos:** the owner uploads the originals in the page builder (recommended), or the developer uploads the 18 Figma exports (lower quality and token-heavy).
- **Category names:** the design's category cards use longer names ("Cardiovascular & Cardiac Surgery") and mention "13 medical categories". The store currently has the 8 names from the menu bar.
- **Brands:** for now, brand pages search products by brand name. Once products exist, a proper "Brand" product detail will make brand pages and filters exact.

---

## 4. Log of changes made in TheCoins (store "MedyMar", formerly "Heliopolis Hub")

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

Nothing was deleted by the developer. TheCoins has no delete action.

---

## 5. Known issues
- **Drafts are public:** TheCoins serves draft pages through the public API, so unpublished builder edits can appear on the site.
- **Some section types drop settings:** the public API drops or renames some fields (Hero Banner, Logo Cloud, Gallery). The site uses section types that keep everything; details are in `README.md`.
- **Hidden settings:** some sections use extra settings (e.g. `variant`, `eyebrow`, `linkText`) that the page builder keeps but may not show as editable fields.
- **Not tested:** submitting a real quotation, because the form has no fields yet.

---

## 6. Next steps
1. Photos added (owner or developer, per decision above)
2. Quotation form fields set up, then test a real submission (with the owner's OK)
3. Products imported; add a "Brand" detail for brand pages and filters
4. Compare tablet (768) and mobile (390) pages against their Figma frames
5. Logo as an image file (optional; the site currently draws the wordmark from the store name)
6. Hosting and domain
