# TheCoins page-builder widgets: full reference

_Last updated: 17 November 2026. Source: TheCoins storefront API docs (sections `cms-widget-types`, `cms-widget-components`, `cms-response-shapes`) and what we tested on the MedyMar store._

Every page in TheCoins (home, site-layout, about…) is built from **rows → columns → widgets**. This file lists **every widget type**: what it's for, the fields it saves, what the server adds, and whether the MedyMar website can show it.

See also: [SPECS.md](SPECS.md) §7 (data flow) and [AGENTS.md](AGENTS.md) §5 (known traps).

**Building a page?** Use the `/cms-page` command. Ready-made sections are in `lib/cms-sections.ts` (shown at `/dev/widgets`). When you make a ⬜ type render, add a recipe there too.

---

## 1. How widgets reach the website

**Three names per widget** (each widget in the API has all three):

| Field | Meaning | Example |
|---|---|---|
| `widget_type` | Internal type (the one the page builder and our code use) | `carousel` |
| `type` | "Storefront" type, after mapping | `swiper` |
| `widget_name` | Name shown in the dashboard | `Carousel` |

**Page shape** (`get-cms-pages?slug=…`):
- `page.rows`: always present, **use this**. `rows[] → columns[] (span 1–12) → widgets[]`. Row fields: `row_id`, `full_width`, `background_color`, `padding`, `columns_layout` (e.g. `"7+5"`).
- `page.content`: older flat list (one entry per widget with `row_index`, `column_index`, `column_span`). Only a fallback.

**General rules**
- Saved settings appear **at the top level** of the widget object (`w.title`, not `w.settings.title`). Fallback: `const s = w.settings ?? w`.
- Text may be a plain string or `{ en, ar }`. We use `tr()` from `lib/format.ts`.
- Images: use `mobileImageUrl` / `tabletImageUrl` in a `<picture>` when present.
- Rich text (HTML) must be sanitised (DOMPurify).
- Missing or empty data → render nothing.
- **Draft pages are public**: the API serves drafts too.
- Public data is cached by the store for ~60 s, so edits can take a minute to show.

**Writing pages** (connector tool `manage_page_layout`): send the **whole** layout with the latest `updated_at`. Custom HTML is not allowed through the connector. **Strict types** (`hero-banner`, `featured-products`, `spacer`, `gallery`) only accept their exact fields; every other type accepts extra keys (we use this for our `variant` key).

**Status column** in the tables below:
- ✅ the MedyMar site renders it
- 🟡 renders, with limits (see notes)
- ⬜ not supported by our site yet (shows nothing)

---

## 2. All widget types at a glance

| `widget_type` | `type` (storefront) | Dashboard name | What it is | MedyMar site |
|---|---|---|---|---|
| `hero-banner` | small-banner | Hero Banner | Full-width banner with title, subtitle, button | 🟡 see §4 trap |
| `carousel` | swiper | Carousel | Image/content slideshow | ✅ hero slider; real text + button when `ctaText` is set |
| `banners` | small-banner | Banners | Promotional banner grid | ✅ picture banners (**drops button text**) |
| `featured-products` | products-slider | Featured Products | Grid of featured products | ✅ |
| `recommended-products` | products-slider | Recommended For You | Product suggestions | ✅ (same product grid) |
| `products-by-category` | products-slider | Products by Category | Products from a category or a ranking | ✅ |
| `categories-grid` | categories-grid | Categories | Category cards | ✅ category carousel (**drops our `variant` publicly**: for category tiles use Text + Image `category-tiles`) |
| `text-image` | text-image | Text + Image | Rich text with image | ✅ (+ our `section-header`, `split-hero`, `policy`, `stock-hero`, `offers`, `product-tab`, `brands-hero`, `brand-directory`, `brands-by-category`, `category-tiles` variants) |
| `testimonials` | testimonials | Testimonials | Customer quotes | ✅ (+ our `brand-carousel`, `exclusive-brands`, `solutions` variants) |
| `stats-counter` | stats-counter | Stats / Counters | Numbers & metrics | ✅ (+ our `chips`, `features`, `tabs`, `checklist`, `link-cards`, `route-cards`, `policy-menu`, `service-bar`, `steps`, `quote-next`, `trust-bar` variants) |
| `button-cta` | button-cta | Button / CTA | One call-to-action button | ✅ (+ our `note`, `callout`, `banner`, `band`, `help`, `product-help`, `quote-whatsapp`, `bulk`, `info` variants) |
| `contact-form` | contact-form | Contact Form | Form linked to the Contact Us plugin | ✅ (our `quote`, `quote-page`, `contact-card`, `contact`, `contact-panel` variants) |
| `faq-accordion` | faq-accordion | FAQ / Accordion | Questions & answers saved in the widget | ✅ (+ our `topics` variant) |
| `gallery` | gallery | Image Gallery | Grid of images | ✅ |
| `spacer` | spacer | Spacer | Vertical space | ✅ |
| `divider` | divider | Divider | Horizontal line | ✅ |
| `two-one-grid` | two-one-grid | Two-One Grid | Products/brands on one side, category images on the other | ✅ brands + products; 🟡 category images side |
| `video` | video | Video | Embedded video | ⬜ |
| `countdown` | countdown | Countdown Timer | Count down to a date | ⬜ |
| `newsletter` | newsletter | Newsletter Signup | Email subscription form | ⬜ |
| `logo-cloud` | partners | Logo Cloud | Partner/brand logo grid | ⬜ (drops/renames keys) |
| `partners` | partners | Partners | Auto-scrolling logo carousel | ⬜ |
| `map` | map | Map Embed | Embedded map | ⬜ |
| `offer-card` | offer-card | Offer Card | Offer with price, icon, image | ⬜ |
| `swiper-grid-cards` | swiper-grid-cards | Swiper Grid Cards | Promo cards with products (slider) | ⬜ |
| `grid-cards` | grid-cards | Grid Cards | Promo cards with products (grid) | ⬜ |
| `product-attributes` | product-attributes | Product Attributes | Values of an attribute (e.g. all Brands) | ✅ Brand only: the "Shop by brand" carousel (**drops our `variant` and extra texts publicly**, tested 19 Nov: the Brands page directory and "by specialty" are Text + Image looks) |
| `order-history` | order-history | Order History | Customer's orders | ⬜ (we have the Account page) |
| `customer-service-center` | customer-service-center | Customer Service Center | Help center with recent orders | ⬜ |
| `newsletter-subscription` | newsletter-subscription | Newsletter Subscription | Newsletter plugin form | ⬜ |
| `blog-posts` | blog-posts | Blog & News | Latest blog posts | ⬜ |
| `faq-plugin` | faq-plugin | FAQ (Plugin) | FAQs from the FAQ plugin | ⬜ |
| `loyalty-points` | loyalty-points | Loyalty Points | Customer points balance | ⬜ |
| `loyalty-tiers` | loyalty-tiers | Loyalty Tiers | Tier levels and benefits | ⬜ |
| `referral-program` | referral-program | Referral Program | Invite friends | ⬜ |
| `active-campaigns` | active-campaigns | Active Campaigns | Current offers | ⬜ |
| `promocode-input` | promocode-input | Promo Code | Promo code entry | ⬜ |
| `flash-sale-banner` | flash-sale-banner | Flash Sale Banner | Sale banner with countdown | ⬜ |
| `campaign-rewards` | campaign-rewards | Campaign Rewards | Redeemable rewards | ⬜ |
| `size-guide` | size-guide | Size Guide | Size charts | ⬜ |
| `product-reviews` | product-reviews | Product Reviews | Reviews of one product | ⬜ |
| `reviews-summary` | reviews-summary | Reviews Summary | Ratings overview | ⬜ |
| `ad-slot` | ad-slot | Ad Slot (Ads Manager) | A campaign from Ads Manager | ⬜ |
| `custom-html` | custom-html | Custom HTML | Raw HTML block | ⬜ (not allowed through the connector) |

Our renderer is the folder `components/cms/widgets/`: one file per widget type, and the `REGISTRY` in `widgets/index.tsx` maps each `widget_type` to its file. Adding a ⬜ type means adding a file there and registering it.

---

## 3. Fields of every widget

Format for each widget:
- **Fields**: what the page builder saves.
- **Defaults**: values for a new widget.
- **Server adds**: extra data the API attaches.

### Banners & media

#### `hero-banner`: Hero Banner
```ts
title: string; subtitle: string;
imageUrl: string; mobileImageUrl: string; tabletImageUrl: string;
ctaText: string; ctaLink: string;
overlay: boolean; height: 'small' | 'medium' | 'large';
textAlign: 'left' | 'center' | 'right';
theme?: string; backgroundColor?: string;
```
Defaults: title "Welcome to our store", ctaText "Shop Now", ctaLink "/menu", overlay true, height medium, textAlign center, theme light.
Server adds: title/subtitle/ctaText translated.
**Strict type** (exact fields only). ⚠️ **Tested on MedyMar (17 Nov):** saved correctly, but the public API returned only `title` and an **empty `cards: []`**. The picture, text and button never reach the website. Use `carousel` instead (see §4).

#### `carousel`: Carousel
```ts
title: string;
slides: { imageUrl; mobileImageUrl; tabletImageUrl; title; subtitle; ctaText; ctaLink;
          bgColor?; price?; productImage? }[];
autoplay: boolean; interval: number; height: 'small' | 'medium' | 'large';
showDots: boolean; showArrows: boolean; shadow?: boolean;
```
Defaults: 2 slides, autoplay true, interval 5, height medium, dots and arrows on.
Server adds: nothing. Public shape: `images[]` with `desk`, `tab`, `mobile`, `title`, `subtitle`, `cta_text`, `cta_link`.
**Keeps button text.** This is the reliable way to get a banner with a real title and button (one slide = a banner; the site hides arrows and dots).

#### `banners`: Banners
```ts
title: string;
items: { imageUrl; mobileImageUrl; tabletImageUrl; title; subtitle; link; badge }[];
columns: 1 | 2 | 3; height: 'small' | 'medium' | 'large';
borderRadius: 'none' | 'small' | 'medium' | 'large'; overlay: boolean;
```
Defaults: 2 items, columns 2, height medium, radius medium, overlay true.
Server adds: section `title`. Public shape: `cards[]` with `theme`, `title`, `description` (= subtitle), `image`, `mobile_image`, `tablet_image`, `link`, `badge`.
⚠️ **Has no button field.** An extra `ctaText` is saved but dropped from the public output (tested 17 Nov). Use it for picture banners; the whole picture is the link.

#### `gallery`: Image Gallery
```ts
title: string; columns: number;
images: { url; caption; mobileImageUrl; tabletImageUrl; linkUrl? }[];
```
Defaults: title "Gallery", columns 3. **Strict type.** Known to drop/rename keys publicly.

#### `video`: Video
```ts
title: string; videoUrl: string; autoplay: boolean;
```

#### `logo-cloud`: Logo Cloud
```ts
title: string; logos: { url; alt; link }[]; columns: 3 | 4 | 5 | 6; grayscale: boolean;
```
Public `type` is `partners`; we saw keys dropped/renamed.

#### `partners`: Partners
```ts
title: string; partners: { name; logoUrl; link }[]; columns: 3 | 4 | 5 | 6;
autoScroll: boolean; scrollSpeed: number; grayscale: boolean; showName: boolean; backgroundColor: string;
```

#### `map`: Map Embed
```ts
title: string; embedUrl: string; height: number;
```
Pair with `get-public-branches` for pins.

### Products, categories, brands

#### `featured-products`: Featured Products
```ts
title: string; columns: 2 | 3 | 4; limit: number; categoryId?: string;
showPrice: boolean; showDescription: boolean;
```
Server adds: `data: Product[]`, the store's featured products (falls back to popular), cut to `limit`. **Strict type.**

#### `recommended-products`: Recommended For You
```ts
title; subtitle; columns: 2 | 3 | 4; limit: number;
source: 'popular' | 'recent' | 'personalized' | 'random' | 'related'; relatedCategoryId?;
showPrice; showRating; showAddToCart;
```
Server adds: `data: Product[]` (featured or popular), cut to `limit` (default 8).

#### `products-by-category`: Products by Category
```ts
title; subtitle; categoryId; categoryName; includeSubcategories: boolean;
productSource?: 'category' | 'best_selling' | 'new_arrival' | 'most_popular' | 'trending' | 'clearance'
              | 'on_sale' | 'low_stock' | 'bought_together' | 'recently_purchased' | 'most_wishlisted'
              | 'price_drop' | 'back_in_stock' | 'top_rated' | 'in_cart';
bestSellingScope?: 'all' | 'category'; bestSellingDays?; popularDays?; clearanceMinDiscount?;
trendingDays?; lowStockMax?; boughtTogetherDays?; recentlyPurchasedDays?; wishlistDays?;
priceDropDays?; priceDropMin?; backInStockDays?; minRating?; inCartDays?;
vendorId?; vendorName?;
featuredOnly: boolean; inStockOnly: boolean; minPrice: number | null; maxPrice: number | null;
limit: number; columns: 2 | 3 | 4 | 5 | 6; mobileColumns: 1 | 2 | 3;
sortBy: 'sort_order' | 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rating' | 'random';
style: 'grid' | 'carousel' | 'list';
showPrice; showDescription; showRating; showAddToCart; showCategoryBadge; showDiscountBadge;
showViewAll; viewAllText; viewAllLink; showButton?; buttonText?; buttonLink?;
theme: 'light' | 'dark'; backgroundColor;
```
Server adds: `data: Product[]` and `category_slug` for the "view all" link.

#### `categories-grid`: Categories
```ts
title: string; columns: number (1–8); showDescription: boolean;
style: 'card' | 'overlay' | 'swiper'; limit?: number;
categories?: { id; name; imageUrl?; link? }[];   // empty = all categories
```
Server adds: categories with their **current** image, `slug`, `link` (default `/category/<id>`). Public field: `data[]`.

#### `two-one-grid`: Two-One Grid
```ts
oneSectionTitle: string; secondSectionTitle: string;
oneGridData: { type: 'product' | 'brand'; productId?; brandName?; brandLogo? }[];
secondGridData: { image: string; title: string; link?: string }[];
```
Server adds: `one-grid-data[]` (hyphenated copy). `product` items get `data` = full product; `brand` items get `data` = the Brand value `{ id, value, image_url, products_count, … }`.
Our site: brand cards (logo, name, product count → brand page), product cards. The `secondGridData` category-image side shows only when filled.

#### `product-attributes`: Product Attributes
```ts
title; attributeId; attributeName; selectedValueIds?; showImages; showDescription;
columns: 2 | 3 | 4 | 6; style: 'grid' | 'list' | 'chips'; theme; backgroundColor;
```
Server adds: `data: { attribute, values[] }` (active values only).
MedyMar: with `attributeName: "brand"` it is the **"Shop by brand" carousel**, filled from the store's Brand list (`getBrands()`): `selectedValueIds` = which brands, in that order (empty = all, in the list's order). Per brand, the card picture is its first **banner** in the Brand list; without one, a card with its **logo**, name and **description** (tagline). `showImages: false` = always the logo card; `showDescription: false` = no tagline. Other attributes are not shown yet.
⚠️ Public output (tested 18 Nov): settings come back in snake_case (`attribute_id`, `attribute_name`, `show_images`, `show_description`) and **`selectedValueIds` is dropped**; the chosen brands arrive, in the chosen order, as `data.values` (ids). Our renderer reads both shapes.

#### `swiper-grid-cards` / `grid-cards`
```ts
cards: { col; row; title; description; imageUrl; productIds?; limit? }[];
images: { mobile; tab; desk }[];        // swiper-grid-cards only
```
Server adds: `cards[].products` (resolved product IDs, else popular), cut to `limit` (default 4).

#### `offer-card`: Offer Card
```ts
title; offerText; description; itemPrice; theme: 'light' | 'dark'; icon;
imageUrl; mobileImageUrl; tabletImageUrl; link;
```

### Text & layout

#### `text-image`: Text + Image
```ts
title; content (rich HTML); imageUrl; mobileImageUrl; tabletImageUrl;
imagePosition: 'left' | 'right' | 'top' | 'bottom'; backgroundColor;
```
MedyMar also uses `variant: "section-header"` with `eyebrow`, `eyebrowColor`, `size` (`sm` for info pages), `eyebrowLines: false` (no lines beside a centred label), `align`, `linkText`, `linkUrl`, `linkColor`; and `variant: "policy"` (policy page text: `eyebrow`, `title` as the page heading, `content` rich text with h2/h3/p/ul/links); and `variant: "split-hero"` (info-page hero: navy box, `eyebrow`, `title` as the page heading, `content`, gold button `linkText` + `linkUrl`, picture `imageUrl` / `tabletImageUrl` / `mobileImageUrl`).
`variant: "brands-hero"` (Brands page hero: `eyebrow`, `title` bold line, `subtitle` light line, `content`, `linkText` + `linkUrl`, `noteStrong` + `note`; the logo wall is the first 6 brands of the Brand list). `variant: "brand-directory"` (Brands page: all brands with search and sort; `anchor`, and the "Don't see a brand?" bar `title`, `subtitle`, `linkText` + `linkUrl`), `variant: "brands-by-category"` (one box per store category with the brands of its products) and `variant: "category-tiles"` (all store categories as tiles); these read store data and live on Text + Image because Product Attributes / Categories drop our settings. `variant: "product-tab"` (only in the CMS page `product`): an extra tab on every product page, `title` = tab name, `content` = tab text.

#### `testimonials`: Testimonials
```ts
title; items: { name; text; avatar; rating }[];
```
MedyMar variants: `brand-carousel` (`name` = "Brand — tagline", `avatar`, `link`), `exclusive-brands` (+ `brandColor`, `brandStyle`, `badge`, `buttonText`), `solutions` (+ `tags`, `linkText`, `link`).

#### `stats-counter`: Stats / Counters
```ts
title; items: { value; label; prefix; suffix }[]; columns: 2 | 3 | 4;
```
MedyMar variants: `chips`, `features` (`icon`), `tabs`, `checklist`, `policy-menu` (policies menu: `label` + `link` per item; highlights the current page), `link-cards` and `route-cards` (info-page cards; `route-cards` + `tone: "plain"` = icon without square, arrow on the button; `label` = title, `value` = sentence, `icon` = cart | file-text | chat | warehouse | quote, `linkText` + `link`), `trust-bar` (Brands page: 4 items, `icon` channels | batch | documents | authentic), `quote-next` (CMS page `quote`: "What happens next?" steps in the quote list sidebar; `title`, `label` per step), plus `announcement`, `category-nav`, `footer-column`, `footer-links`, `legal-links` on `site-layout`.

#### `button-cta`: Button / CTA
```ts
text; link; style: 'primary' | 'secondary' | 'outline' | 'ghost';
size: 'small' | 'medium' | 'large'; align: 'left' | 'center' | 'right'; fullWidth: boolean;
```
MedyMar variants: `note`, `callout` (+ `title`, `subtitle`, `icon`, `tone`), and `banner`: a boxed navy banner with real text over a picture (+ `eyebrow`, `title`, `subtitle`, `note`, `icon: 'whatsapp'`, `imageUrl`, `tabletImageUrl`, `mobileImageUrl`; button = `text` + `link`). Use it for a boxed banner with a label, a button and a note (e.g. the home WhatsApp banner). `band`: light grey closing box with centred `title`, `subtitle` and a gold button (`text` + `link`). `help`: grey bar with a chat icon, `title`, `subtitle` and a gold button (FAQ "Still have a question?"). `product-help`: cream bar with a list icon, `title`, `subtitle` and a navy outline button (`text` + `link`), plus optional `whatsappLink` (adds "Need help? Chat on WhatsApp" under the product buttons). Only for the CMS page `product`: it shows under the tabs of every product page. `quote-whatsapp` (CMS page `quote`): "Prefer WhatsApp?" card in the quote list sidebar (`title`, `subtitle`, button `text` + `link`); hidden while `link` is empty.

#### `faq-accordion`: FAQ / Accordion
```ts
title; items: { question; answer }[];
```
MedyMar variant `topics` (FAQ page): + `searchPlaceholder`, `allTopicsLabel`, `noResultsText`, `topics: string[]`, and `topic` on each item. Search and topic buttons filter the list in the browser.

#### `spacer`: Spacer
`height: number` (default 48). **Strict type.**

#### `divider`: Divider
```ts
style: 'solid' | 'dashed' | 'dotted' | 'gradient'; color; thickness: number; width: number;
```

#### `countdown`: Countdown Timer
```ts
title; targetDate; expiredMessage; style: 'cards' | 'inline' | 'minimal';
```

#### `custom-html`: Custom HTML
Raw HTML. Not allowed through the connector; avoid it.

### Forms & plugins
Plugin widgets carry `pluginSlug` and only work when that plugin is active in the store.

#### `contact-form`: Contact Form (plugin `contact`)
```ts
title; subtitle; style: 'card' | 'inline' | 'split'; showMap; mapEmbedUrl;
contactInfo: { icon; label; value }[]; theme; backgroundColor; pluginSlug: 'contact';
```
Fields of the form itself come from `GET contact-form` (Contact form settings); submit with `POST contact-form`.
MedyMar variants: `quote` (quotation form with quote-list lines), `contact-card`, `contact` (Contact page enquiry form: store fields + `subject`, `privacyNote`, `privacyLinkText`, `privacyLink`, `submitText`, `successTitle`, `successText`, `errorTitle`) and `contact-panel` (navy panel: `title`, `subtitle`, `contactInfo[{ icon: email | whatsapp | pin | clock, label, value, link }]`). `quote-page` (CMS page `quote`): the texts around the quote list page form: `subtitle`, `attachTitle`, `attachText`, `consentText` + `privacyLinkText` + `privacyLink` (required tick box), `smallPrint`, sidebar `noteTitle`, `noteText`, `submitText`, `footnote`, and `subject` (email subject). Both forms use the **same** store field list.

#### `newsletter`: Newsletter Signup
```ts
title; subtitle; buttonText; placeholder; style: 'inline' | 'stacked';
```
Submit: `POST newsletter-api`.

#### `newsletter-subscription` (plugin `newsletter`)
```ts
title; subtitle; buttonText; placeholder; successMessage; style: 'inline' | 'stacked' | 'card';
showNameField; theme; backgroundColor; pluginSlug: 'newsletter';
```

#### `faq-plugin` (plugin `faq`)
```ts
title; subtitle; limit; categoryFilter; style: 'accordion' | 'list' | 'cards';
showSearch; theme; pluginSlug: 'faq';
```
FAQs come from the `faq-list` API.

#### `blog-posts` (plugin `blog`)
```ts
title; subtitle; columns: 2 | 3 | 4; limit; style: 'grid' | 'list' | 'carousel';
showExcerpt; showDate; showAuthor; showCoverImage; showTags; tagFilter;
ctaText; ctaLink; theme; backgroundColor; pluginSlug: 'blog';
```
Posts come from `blog-list-posts` / `blog-get-post`.

#### `size-guide` (plugin `size-chart`)
```ts
title; subtitle; categoryId; showTitle; style: 'accordion' | 'tabs' | 'inline';
theme; backgroundColor; pluginSlug: 'size-chart';
```

#### `product-reviews` (plugin `product-reviews`)
```ts
title; subtitle; productId; limit; showRating; showPhotos; showVerifiedBadge;
sortBy: 'newest' | 'highest' | 'lowest' | 'most-helpful'; style: 'cards' | 'list' | 'compact';
theme; backgroundColor; pluginSlug: 'product-reviews';
```

#### `reviews-summary` (plugin `product-reviews`)
```ts
title; subtitle; showDistribution; showAverageRating; showTotalCount; showFeaturedReviews;
featuredLimit; columns: 2 | 3 | 4; style: 'card' | 'banner' | 'inline'; theme; backgroundColor;
```

### Customer account & loyalty
These need a signed-in customer (session token).

#### `order-history`
```ts
title; limit; showStatus; showTracking; showReorder; emptyMessage; theme;
```
Data: `get-customer-orders`.

#### `customer-service-center`
```ts
title; subtitle; ctaText; ctaLink; columns: 2 | 3 | 4; limit;
gridContent: 'recent-orders' | 'popular-products' | 'categories' | 'featured-products' | 'recommended-products' | 'custom-links';
customLinks?: { label; link; icon?; imageUrl? }[]; showOrderDate; showProductImage; theme; backgroundColor;
```

#### `loyalty-points` (plugin `loyalty`)
```ts
title; subtitle; showBalance; showHistory; historyLimit; showTier; showProgressBar;
ctaText; ctaLink; style: 'card' | 'banner' | 'minimal'; theme; backgroundColor;
```

#### `loyalty-tiers` (plugin `loyalty`)
```ts
title; subtitle; showBenefits; showRequirements; highlightCurrentTier;
columns: 2 | 3 | 4; style: 'cards' | 'table' | 'steps'; theme; backgroundColor;
```

#### `referral-program` (plugin `loyalty`)
```ts
title; subtitle; description; showReferralCode; showShareButtons; showRewardInfo;
rewardText; ctaText; style: 'card' | 'banner' | 'inline'; theme; backgroundColor;
```

### Campaigns & ads

#### `active-campaigns` (plugin `campaigns`)
```ts
title; subtitle; columns: 2 | 3 | 4; limit; showDescription; showCountdown; showDiscount;
style: 'cards' | 'list' | 'carousel'; theme; backgroundColor; selectedCampaignIds?: string[];
```

#### `promocode-input` (plugin `campaigns`)
```ts
title; subtitle; placeholder; buttonText; successMessage; style: 'card' | 'inline' | 'banner'; theme; backgroundColor;
```

#### `flash-sale-banner` (plugin `campaigns`)
```ts
title; subtitle; badgeText; ctaText; ctaLink; showCountdown; targetDate; expiredMessage;
style: 'gradient' | 'solid' | 'image'; imageUrl; theme; backgroundColor;
```

#### `campaign-rewards` (plugin `campaigns`)
```ts
title; subtitle; columns: 2 | 3 | 4; limit; showPointsCost; showProgress; showCategory;
style: 'cards' | 'list' | 'compact'; theme; backgroundColor;
```

#### `ad-slot`: Ad Slot (Ads Manager)
```ts
title; slotKey; campaignId; limit; style: 'single' | 'carousel' | 'grid';
columns: 1 | 2 | 3 | 4; showTitle; backgroundColor;
```

---

## 4. MedyMar findings (tested on the live store)

| What | Result | What to do |
|---|---|---|
| Banner with a real, clickable button | `banners` drops the button text; `hero-banner` returns an empty card publicly | Full-width: a **one-slide `carousel`** (keeps title, subtitle, `ctaText`, `ctaLink`). Boxed, with a small label or a note: `button-cta` variant `banner`. Beside products (side column): the same `button-cta` banner, which then shows as a tall card |
| Extra keys (our `variant`, `eyebrow`, `linkText`…) | Kept by text-image, stats-counter, button-cta, testimonials, contact-form, faq | Use those types for custom sections |
| Product Attributes / Categories with extra settings | The public output drops `variant` and our texts (tested 19 Nov) | Store-data sections with our own look are Text + Image looks (`brand-directory`, `brands-by-category`, `category-tiles`) |
| Products by Category with extra settings | Public output keeps only `title`, `subtitle`, `button`, `view_all` and the resolved products (`data`); `variant`, `categoryId` and our texts are dropped (tested 18 Nov) | Custom product areas (e.g. Ready Stock offers) are a `text-image` with our variant that loads its products itself |
| Strict types | `hero-banner`, `featured-products`, `spacer`, `gallery` reject or drop extra keys | Only send their exact fields |
| Images | Stored in TheCoins media (`media.thecoins.app/…`) | Never point a widget at files in the website project |
| Brands | `two-one-grid` brand items resolve to the store's Brand list (logo, product count) | Brands always come from the store's Brand detail |
