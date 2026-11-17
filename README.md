# MedyMar website

Next.js site for MedyMar, built from the Figma design (file "Medymar"). **All content is managed in the TheCoins dashboard** (store "MedyMar"); the site only displays it.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Connection settings: `.env.local` (public storefront keys, see `.env.example`).

## Where content lives

| Part of the site | Where to edit in TheCoins |
|---|---|
| Home page sections, texts, banners, images | Page builder → page **home** |
| Announcement bar, footer texts, footer links, brand list, payment logos | Page builder → page **site-layout** |
| Category bar, category pages, footer categories | Categories (name, description, image, order) |
| Products, prices (OMR), photos, REF/SKU | Products |
| A product's brand; the list of brands to pick from | Products → product details → **Brand** (add new brands to the Brand list first) |
| Quotation form fields | Contact form settings |
| Store name, colours, logo, contact email | Store settings / branding |
| Extra pages (About, FAQ, policies…) | Page builder → new page with that slug, e.g. `about`, `faq`, `privacy-policy` |

Some sections use extra settings (e.g. `variant`, `eyebrow`, `linkText`) that the page builder keeps but may not show as form fields; ask your developer to change those.

Changes can take up to 60 seconds to appear.

## Design assets

`design-assets/` holds the images exported from Figma (`webp/` is ready to upload). `public/icons/` holds the Figma icons used by the site.
