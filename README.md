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
| Product pages: "Delivery & Ordering" tab (and any other extra tab), the "Need help finding the right reference?" banner, the WhatsApp link | Page builder → page **product** (one text section per tab; the WhatsApp link is the banner's `whatsappLink` setting) |
| Quote list page texts (intro, attachment note, consent line, sidebar note, "What happens next?", "Prefer WhatsApp?" card and its link) | Page builder → page **quote** (the form fields themselves: Contact form settings) |
| Search page help bar ("Can't find the right product?") | Page builder → page **search** |
| Brands page texts | Page builder → page **brands** |
| Extra pages (About, FAQ, policies…) | Page builder → new page with that slug, e.g. `about`, `faq`, `privacy-policy` |

Some sections use extra settings (e.g. `variant`, `eyebrow`, `linkText`) that the page builder keeps but may not show as form fields; ask your developer to change those.

Changes can take up to 60 seconds to appear.

## Building pages with Claude

1. Run the site (`npm run dev`) and open **http://localhost:3000/dev/widgets** to see every section style the site supports.
2. In Claude Code, type **`/cms-page <page>`** plus what you want, e.g. `/cms-page about — intro text with a picture, then questions & answers`.
3. Claude writes a draft and shows it at **http://localhost:3000/dev/preview/<page>**. Nothing is saved to TheCoins yet.
4. When you say yes, Claude saves it to TheCoins and logs the change in PROGRESS.md.

These `/dev/…` pages only exist on your computer, not on the live site.

## Design assets

`design-assets/` holds the images exported from Figma (`webp/` is ready to upload). `public/icons/` holds the Figma icons used by the site.
