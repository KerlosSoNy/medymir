// Section catalog: every CMS section style the MedyMar site can show, as a ready-to-save TheCoins row.
//
// Used by:
//  - the section gallery  (/dev/widgets)       → shows each recipe with sample content
//  - the draft preview    (/dev/preview/<slug>) → shows a planned page from cms-drafts/<slug>.json
//  - the /cms-page command (.claude/skills/cms-page) → copies recipes into a page layout
//
// Each `row` is in the WRITE shape of TheCoins `manage_page_layout` ({ id, columns[{ id, span, widgets[{ id, type, settings }] }] }).
// The texts here are placeholders that show the shape only; real texts are written into the CMS per page.
// Empty image fields ("") are filled with neutral sample pictures in the gallery only.
// Never put brand names, logos or brand pictures in this file (AGENTS.md §5).

export interface LayoutWidget {
  id: string;
  type: string;
  settings: Record<string, any>;
}
export interface LayoutColumn {
  id: string;
  span: number;
  widgets: LayoutWidget[];
}
export interface LayoutRow {
  id: string;
  fullWidth?: boolean;
  backgroundColor?: string;
  padding?: string;
  columns: LayoutColumn[];
}


export interface SectionRecipe {
  /** Stable id, used in the gallery and by the /cms-page command. */
  id: string;
  name: string;
  /** Plain-language: when to use it. */
  use: string;
  /** Things to know before using it (traps). */
  notes?: string;
  row: LayoutRow;
}

/* ---------- small builders (keep the recipes short) ---------- */
const one = (id: string, widgets: LayoutWidget[], row: Partial<LayoutRow> = {}): LayoutRow => ({
  id: `row-${id}`,
  ...row,
  columns: [{ id: `col-${id}`, span: 12, widgets }],
});
const w = (id: string, type: string, settings: Record<string, any>): LayoutWidget => ({ id: `w-${id}`, type, settings });

const IMG = { imageUrl: "", mobileImageUrl: "", tabletImageUrl: "" };
const stat = (label: string, extra: Record<string, any> = {}) => ({ label, value: "", prefix: "", suffix: "", ...extra });

/** Section header (text-image, variant "section-header"). Goes above most content sections. */
export const header = (id: string, s: Record<string, any>) =>
  w(id, "text-image", {
    variant: "section-header",
    eyebrow: "",
    title: "",
    content: "",
    ...IMG,
    imagePosition: "right",
    backgroundColor: "",
    linkText: "",
    linkUrl: "",
    ...s,
  });

const productsByCategory = (id: string, s: Record<string, any> = {}) =>
  w(id, "products-by-category", {
    title: "",
    subtitle: "",
    categoryId: "",
    categoryName: "",
    includeSubcategories: true,
    featuredOnly: false,
    inStockOnly: false,
    minPrice: null,
    maxPrice: null,
    limit: 4,
    columns: 2,
    mobileColumns: 2,
    sortBy: "sort_order",
    style: "grid",
    showPrice: true,
    showDescription: false,
    showRating: false,
    showAddToCart: true,
    showCategoryBadge: false,
    showDiscountBadge: true,
    showViewAll: false,
    viewAllText: "",
    viewAllLink: "",
    theme: "light",
    backgroundColor: "",
    ...s,
  });

const pictureBanner = (id: string, item: Record<string, any>, s: Record<string, any> = {}) =>
  w(id, "banners", {
    title: "",
    columns: 1,
    height: "large",
    borderRadius: "large",
    overlay: false,
    items: [{ ...IMG, title: "", subtitle: "", link: "", badge: "", ...item }],
    ...s,
  });

const cta = (id: string, s: Record<string, any>) =>
  w(id, "button-cta", { text: "", link: "", style: "outline", size: "medium", align: "right", fullWidth: false, ...s });

/* ---------- the catalog ---------- */
export const SECTIONS: SectionRecipe[] = [
  /* Banners */
  {
    id: "hero-slider",
    name: "Hero slider",
    use: "Big picture slides at the very top of a page, each with a title and a button.",
    notes: "A slide shows real text + button only when its button text is filled; otherwise the picture is shown as it is.",
    row: one(
      "hero",
      [
        w("hero", "carousel", {
          title: "",
          slides: [
            { ...IMG, title: "Slide title", subtitle: "", ctaText: "Button text", ctaLink: "/products" },
            { ...IMG, title: "Second slide title", subtitle: "", ctaText: "Button text", ctaLink: "/categories" },
          ],
          autoplay: true,
          interval: 6,
          height: "medium",
          showDots: true,
          showArrows: true,
          shadow: false,
        }),
      ],
      { fullWidth: true },
    ),
  },
  {
    id: "banner-with-button",
    name: "Banner with a button",
    use: "One wide banner with a real title, text and button (the page reads them, the picture is background).",
    notes: "A Carousel with one slide (arrows and dots are hidden). Hero Banner and Banners can't do this: they lose the button text.",
    row: one(
      "banner-cta",
      [
        w("banner-cta", "carousel", {
          title: "",
          slides: [{ ...IMG, title: "Banner title", subtitle: "One short sentence.", ctaText: "Request a quote", ctaLink: "#quote" }],
          autoplay: false,
          interval: 6,
          height: "medium",
          showDots: false,
          showArrows: false,
          shadow: false,
        }),
      ],
      { fullWidth: true },
    ),
  },
  {
    id: "picture-banner",
    name: "Picture banner (edge to edge)",
    use: "A finished promo picture (text already drawn in it) across the full width; the whole picture is a link.",
    row: one("banner-wide", [pictureBanner("banner-wide", { title: "Picture description", link: "/products" }, { borderRadius: "none" })], {
      fullWidth: true,
    }),
  },
  {
    id: "picture-banner-boxed",
    name: "Picture banner (boxed)",
    use: "A finished promo picture inside the page width, with rounded corners.",
    row: one("banner-boxed", [pictureBanner("banner-boxed", { title: "Picture description", link: "#quote" })], { backgroundColor: "#f5f7fa" }),
  },

  {
    id: "split-hero",
    name: "Page hero (text + picture)",
    use: "The top of an info page (About…): navy box with a small label, big title, one line and a gold button on the left, picture on the right.",
    notes: "Text + Image, look 'split-hero'. The title is the page's main heading. Phone/tablet: text above, picture below.",
    row: one("split-hero", [
      w("split-hero", "text-image", {
        variant: "split-hero",
        eyebrow: "Small label",
        title: "Big page title",
        content: "<p>One or two short sentences.</p>",
        linkText: "Button text",
        linkUrl: "/contact",
        ...IMG,
        imagePosition: "right",
        backgroundColor: "",
      }),
    ]),
  },

  /* Headings & text */
  {
    id: "section-header",
    name: "Section heading",
    use: "Small label + big title + one line of text + 'View all' link. Put it above a list, grid or carousel.",
    notes: "eyebrowColor: blue | gold | grey | teal | sky. size: sm (info pages) | md | lg | xl. linkColor: blue | gold. '{count}' in the link text becomes the number of products.",
    row: one("heading", [
      header("heading", {
        eyebrow: "SMALL LABEL",
        eyebrowColor: "blue",
        size: "lg",
        title: "Section title",
        content: "<p>One sentence that explains the section.</p>",
        linkText: "View all {count} products",
        linkUrl: "/products",
        linkColor: "blue",
      }),
    ]),
  },
  {
    id: "section-header-center",
    name: "Section heading (centred)",
    use: "A centred heading, for a section that stands on its own.",
    row: one("heading-center", [
      header("heading-center", {
        align: "center",
        eyebrow: "SMALL LABEL",
        eyebrowColor: "teal",
        title: "Centred section title",
        content: "<p>One sentence that explains the section.</p>",
      }),
    ]),
  },
  {
    id: "text-image",
    name: "Text + picture",
    use: "A paragraph of text next to a picture (About page, explanations).",
    notes: "imagePosition: left | right. Content is rich text (paragraphs, lists, links).",
    row: one("text-image", [
      w("text-image", "text-image", {
        title: "Title",
        content: "<p>A paragraph of text. It can have <strong>bold words</strong>, lists and links.</p><ul><li>First point</li><li>Second point</li></ul>",
        ...IMG,
        imagePosition: "right",
        backgroundColor: "",
      }),
    ]),
  },

  /* Highlights */
  {
    id: "chips",
    name: "Search chips",
    use: "A row of round buttons ('Popular searches'), each a link.",
    row: one("chips", [
      w("chips", "stats-counter", {
        variant: "chips",
        title: "Popular searches",
        columns: 4,
        items: [stat("First search", { link: "/search?q=first" }), stat("Second search", { link: "/search?q=second" }), stat("Third search", { link: "/search?q=third" })],
      }),
    ]),
  },
  {
    id: "features",
    name: "Three features with icons",
    use: "Three short selling points side by side, each with an icon.",
    notes: "icon: search | file-text | whatsapp (only these icons exist).",
    row: one("features", [
      w("features", "stats-counter", {
        variant: "features",
        title: "",
        columns: 3,
        items: [
          stat("First feature", { icon: "search", value: "One sentence about it." }),
          stat("Second feature", { icon: "file-text", value: "One sentence about it." }),
          stat("Third feature", { icon: "whatsapp", value: "One sentence about it." }),
        ],
      }),
    ]),
  },
  {
    id: "tabs",
    name: "Tab-style links",
    use: "Pill links above a product list (the first one is highlighted).",
    row: one("tabs", [
      w("tabs", "stats-counter", {
        variant: "tabs",
        title: "",
        columns: 4,
        items: [stat("First group", { link: "/products" }), stat("Second group", { link: "/categories" }), stat("Third group", { link: "/brands" })],
      }),
    ]),
  },
  {
    id: "numbers",
    name: "Numbers",
    use: "Big numbers with a label (years, products, cities…).",
    row: one("numbers", [
      w("numbers", "stats-counter", {
        title: "Section title",
        columns: 3,
        items: [
          { label: "First number", value: "20", prefix: "", suffix: "+" },
          { label: "Second number", value: "500", prefix: "", suffix: "" },
          { label: "Third number", value: "3", prefix: "", suffix: "" },
        ],
      }),
    ]),
  },

  {
    id: "link-cards",
    name: "Cards with icon and link",
    use: "Three white cards side by side, each with an icon, a title, one sentence and an underlined link (About page).",
    notes: "Stats / Counters, look 'link-cards'. label = title, value = sentence. icon: cart | file-text | chat | warehouse | quote. Usually with a small centred Section heading (size 'sm') above it in the same column.",
    row: one("link-cards", [
      w("link-cards", "stats-counter", {
        variant: "link-cards",
        title: "",
        columns: 3,
        items: [
          stat("First card", { icon: "cart", value: "One sentence about it.", linkText: "Link text", link: "/categories" }),
          stat("Second card", { icon: "file-text", value: "One sentence about it.", linkText: "Link text", link: "/quote" }),
          stat("Third card", { icon: "chat", value: "One sentence about it.", linkText: "Link text", link: "/contact" }),
        ],
      }),
    ]),
  },
  {
    id: "route-cards",
    name: "Two cards with icon and button",
    use: "Two side-by-side cards with an icon in a gold square, a title, one sentence and an outlined button ('Two ways to buy').",
    notes: "Stats / Counters, look 'route-cards'. Same fields and icons as 'Cards with icon and link'. tone 'plain': icon without the gold square and an arrow on the button (Contact page 'Have a product list?' card; one card fills its column).",
    row: one("route-cards", [
      header("route-cards-head", { align: "center", size: "sm", title: "Section title", content: "<p>One sentence.</p>" }),
      w("route-cards", "stats-counter", {
        variant: "route-cards",
        title: "",
        columns: 2,
        items: [
          stat("First route", { icon: "warehouse", value: "One sentence about it.", linkText: "Button text", link: "/products" }),
          stat("Second route", { icon: "quote", value: "One sentence about it.", linkText: "Button text", link: "/quote" }),
        ],
      }),
    ]),
  },

  /* Products & categories */
  {
    id: "category-carousel",
    name: "Category carousel",
    use: "All store categories as picture cards that scroll sideways.",
    notes: "Pictures and names come from the store's categories. Usually with a Section heading above it.",
    row: one("categories", [
      header("categories-head", { eyebrow: "SMALL LABEL", eyebrowColor: "blue", size: "xl", title: "Shop by category", linkText: "View all categories", linkUrl: "/categories" }),
      w("categories", "categories-grid", { title: "", columns: 3, showDescription: true, style: "swiper" }),
    ]),
  },
  {
    id: "products-grid",
    name: "Product grid",
    use: "Products from one category in a grid.",
    notes: "Pick the category in the widget. 2–6 per row.",
    row: one("products", [productsByCategory("products", { columns: 4, limit: 8 })]),
  },
  {
    id: "featured-grid",
    name: "Featured products grid",
    use: "The store's featured products in a grid.",
    notes: "Only title, columns, limit, showPrice and showDescription are kept (strict type).",
    row: one("featured", [w("featured", "featured-products", { title: "", columns: 4, limit: 8, showPrice: true, showDescription: false })]),
  },
  {
    id: "products-with-promo",
    name: "Products + tall promo picture",
    use: "Products on the left (7 of 12 columns), a tall promo picture on the right (5 of 12).",
    row: {
      id: "row-products-promo",
      backgroundColor: "#f5f7fa",
      columns: [
        { id: "col-products-promo-list", span: 7, widgets: [productsByCategory("products-promo", { limit: 4 })] },
        { id: "col-products-promo-side", span: 5, widgets: [pictureBanner("products-promo-side", { title: "Picture description", link: "/products" })] },
      ],
    },
  },
  {
    id: "brand-grid",
    name: "Brand grid",
    use: "Brand cards (logo, name, number of products) that link to each brand page.",
    notes: "Pick brands from the store's Brand list (brandName + brandLogo); never invent one. Optional second title + secondGridData for a right-hand column.",
    row: one("brand-grid", [w("brand-grid", "two-one-grid", { oneSectionTitle: "Brands", secondSectionTitle: "", oneGridData: [], secondGridData: [] })]),
  },

  /* Brands & cards */
  {
    id: "brand-carousel",
    name: "Brand picture carousel",
    use: "Big brand pictures that scroll sideways, with arrows.",
    notes: "Each card: name = \"Brand — tagline\", a picture and a link to the brand page. The brand must be in the store's Brand list.",
    row: one("brand-carousel", [
      header("brand-carousel-head", { size: "lg", title: "Shop by brand", content: "<p>One sentence.</p>", linkText: "View all brands", linkUrl: "/brands" }),
      w("brand-carousel", "testimonials", {
        variant: "brand-carousel",
        title: "",
        items: [
          { name: "Brand — tagline", text: "", avatar: "", rating: 0, link: "/brands" },
          { name: "Brand — tagline", text: "", avatar: "", rating: 0, link: "/brands" },
          { name: "Brand — tagline", text: "", avatar: "", rating: 0, link: "/brands" },
        ],
      }),
    ]),
  },
  {
    id: "exclusive-cards",
    name: "Name cards with badge and button",
    use: "Cards with a coloured name, a small badge, a picture, one line and a button.",
    notes: "brandStyle: bold | semibold | bold-italic | italic. brandColor: any #colour.",
    row: one("exclusive", [
      w("exclusive", "testimonials", {
        variant: "exclusive-brands",
        title: "",
        items: [
          { name: "Name", text: "One line about it.", avatar: "", rating: 0, brandColor: "#0b1f3f", brandStyle: "bold", badge: "EXCLUSIVE", buttonText: "View products", link: "/brands" },
          { name: "Name", text: "One line about it.", avatar: "", rating: 0, brandColor: "#0b1f3f", brandStyle: "italic", badge: "EXCLUSIVE", buttonText: "View products", link: "/brands" },
          { name: "Name", text: "One line about it.", avatar: "", rating: 0, brandColor: "#0b1f3f", brandStyle: "semibold", badge: "EXCLUSIVE", buttonText: "View products", link: "/brands" },
        ],
      }),
    ]),
  },
  {
    id: "solution-cards",
    name: "Picture cards with tags",
    use: "Four cards with picture, title, text, small tags and a link ('Solutions', 'Who we serve').",
    row: one(
      "solutions",
      [
        header("solutions-head", { eyebrow: "SMALL LABEL", eyebrowColor: "gold", title: "Section title", linkColor: "gold" }),
        w("solutions", "testimonials", {
          variant: "solutions",
          title: "",
          items: [1, 2, 3, 4].map((n) => ({ name: `Card ${n}`, text: "One or two sentences.", avatar: "", rating: 0, tags: ["Tag", "Tag"], linkText: "Explore", link: "/products" })),
        }),
      ],
      { backgroundColor: "#f6f4ef" },
    ),
  },
  {
    id: "quotes",
    name: "Customer quotes",
    use: "Short quotes from customers with their name.",
    row: one("quotes", [
      w("quotes", "testimonials", {
        title: "",
        items: [
          { name: "Name, role", text: "A short quote.", avatar: "", rating: 5 },
          { name: "Name, role", text: "A short quote.", avatar: "", rating: 5 },
        ],
      }),
    ]),
  },

  /* Calls to action */
  {
    id: "note",
    name: "Note bar with button",
    use: "A quiet dashed bar with one sentence and a button (under a product list).",
    row: one("note", [cta("note", { variant: "note", title: "Bold start of the sentence?", subtitle: "Rest of the sentence.", text: "Button text", link: "#quote" })]),
  },
  {
    id: "callout",
    name: "Callout bar",
    use: "An icon, a title, one line and a button. tone 'light' = white card, otherwise a soft blue band.",
    row: one("callout", [
      cta("callout", { variant: "callout", tone: "", icon: "file-text", title: "Callout title", subtitle: "One short sentence.", text: "Button text", link: "#quote" }),
    ]),
  },
  {
    id: "cta-banner",
    name: "Banner with text, button and note",
    use: "A boxed navy banner: small label, big title, one or two lines of text, a button and a small note under it. The picture is art on the right.",
    notes: "icon 'whatsapp' puts the WhatsApp logo on the button. Keeps every field (unlike Banners, which loses the button text). Best picture: art on the right, nothing important on the left half. Put it in a side column (e.g. span 5 beside a span-7 product grid) and it becomes a tall card: title + text at the top, button at the bottom; theme 'light' = light panel.",
    row: one(
      "cta-banner",
      [
        cta("cta-banner", {
          variant: "banner",
          eyebrow: "Small label",
          title: "Banner title",
          subtitle: "One or two short sentences.",
          text: "Button text",
          link: "#quote",
          icon: "",
          note: "Small note under the button",
          imageUrl: "",
          tabletImageUrl: "",
          mobileImageUrl: "",
        }),
      ],
      { backgroundColor: "#f5f7fa" },
    ),
  },
  {
    id: "band",
    name: "Closing band with button",
    use: "A light grey box with a centred title, one line and a gold button, at the end of an info page.",
    notes: "Button / CTA, look 'band'.",
    row: one("band", [cta("band", { variant: "band", title: "Band title", subtitle: "One short sentence.", text: "Button text", link: "/contact", style: "primary", align: "center" })]),
  },
  {
    id: "button",
    name: "Single button",
    use: "Just one button. style 'outline' = outlined, anything else = dark. align left | center | right.",
    row: one("button", [cta("button", { text: "Button text", link: "/products", style: "primary", align: "center" })]),
  },

  /* Forms */
  {
    id: "quote-form",
    name: "Quote form + side cards",
    use: "The quotation request form (left) with a checklist and a contact card (right).",
    notes: "The form fields come from the store's Contact form settings. anchor 'quote' makes '#quote' links scroll here.",
    row: {
      id: "row-quote",
      backgroundColor: "#f5f7fa",
      columns: [
        {
          id: "col-quote-form",
          span: 7,
          widgets: [
            w("quote-form", "contact-form", {
              variant: "quote",
              anchor: "quote",
              eyebrow: "REQUEST A QUOTATION",
              title: "Form title",
              subtitle: "One sentence.",
              attachTitle: "Attach your product list",
              attachText: "How to send files.",
              submitText: "Send",
              privacyNote: "How we use the details.",
              style: "card",
              showMap: false,
              mapEmbedUrl: "",
              contactInfo: [],
              theme: "light",
              backgroundColor: "",
              pluginSlug: "contact",
            }),
          ],
        },
        {
          id: "col-quote-side",
          span: 5,
          widgets: [
            w("quote-checklist", "stats-counter", { variant: "checklist", title: "Checklist title", columns: 1, items: [stat("First point"), stat("Second point"), stat("Third point")] }),
            w("quote-contact", "contact-form", {
              variant: "contact-card",
              title: "Contact card title",
              subtitle: "",
              style: "card",
              showMap: false,
              mapEmbedUrl: "",
              theme: "light",
              backgroundColor: "",
              pluginSlug: "contact",
              contactInfo: [
                { icon: "email", label: "Email", value: "name@example.com" },
                { icon: "hours", label: "Hours", value: "Opening hours" },
                { icon: "reply", label: "Reply", value: "When we reply" },
              ],
              offices: [{ city: "City", note: "Time zone" }],
            }),
          ],
        },
      ],
    },
  },

  {
    id: "enquiry-form",
    name: "Enquiry form + contact panel",
    use: "The Contact page: the enquiry form (left) with a navy 'contact us' panel and a small card (right).",
    notes: "Contact Form, looks 'contact' and 'contact-panel'. The form fields come from the store's Contact form settings (shared with the quote form). Panel icons: email | whatsapp | pin | clock; a value with '@' becomes an email link, a new line in a value starts a new line; 'link' makes it a link (e.g. WhatsApp).",
    row: {
      id: "row-enquiry",
      columns: [
        {
          id: "col-enquiry-form",
          span: 8,
          widgets: [
            w("enquiry-form", "contact-form", {
              variant: "contact",
              title: "",
              subtitle: "",
              subject: "Contact enquiry",
              privacyNote: "How we use the details. See our",
              privacyLinkText: "Privacy policy",
              privacyLink: "/privacy-policy",
              submitText: "Send enquiry",
              successTitle: "Thank you title",
              successText: "What happens next.",
              errorTitle: "Not sent title",
              style: "card",
              showMap: false,
              mapEmbedUrl: "",
              contactInfo: [],
              theme: "light",
              backgroundColor: "",
              pluginSlug: "contact",
            }),
          ],
        },
        {
          id: "col-enquiry-side",
          span: 4,
          widgets: [
            w("enquiry-panel", "contact-form", {
              variant: "contact-panel",
              title: "Panel title",
              subtitle: "One sentence.",
              style: "card",
              showMap: false,
              mapEmbedUrl: "",
              theme: "dark",
              backgroundColor: "",
              pluginSlug: "contact",
              contactInfo: [
                { icon: "email", label: "Email", value: "name@example.com", link: "" },
                { icon: "pin", label: "Locations", value: "City\nCity", link: "" },
                { icon: "clock", label: "Working hours", value: "Opening hours", link: "" },
              ],
            }),
          ],
        },
      ],
    },
  },

  /* Other */
  {
    id: "faq",
    name: "Questions & answers",
    use: "A list of questions that open to show the answer.",
    row: one("faq", [
      w("faq", "faq-accordion", {
        title: "Frequently asked questions",
        items: [
          { question: "First question?", answer: "<p>The answer.</p>" },
          { question: "Second question?", answer: "<p>The answer.</p>" },
        ],
      }),
    ]),
  },
  {
    id: "gallery",
    name: "Picture gallery",
    use: "A grid of pictures, each optionally a link.",
    notes: "Strict type: each image needs url, caption, mobileImageUrl, tabletImageUrl (linkUrl optional). Picture links must be full https:// addresses.",
    row: one("gallery", [
      w("gallery", "gallery", {
        title: "",
        columns: 3,
        images: [1, 2, 3].map((n) => ({ url: "", caption: `Picture ${n}`, mobileImageUrl: "", tabletImageUrl: "" })),
      }),
    ]),
  },
  {
    id: "divider",
    name: "Line",
    use: "A thin horizontal line between sections.",
    row: one("divider", [w("divider", "divider", { style: "solid", color: "", thickness: 1, width: 100 })]),
  },
  {
    id: "spacer",
    name: "Empty space",
    use: "Extra empty space (height in pixels).",
    notes: "Strict type: only 'height'.",
    row: one("spacer", [w("spacer", "spacer", { height: 48 })]),
  },
];


/**
 * Turns a saved layout (write shape) into the shape the public API returns and CmsPage renders:
 * row/column ids and colours renamed, each widget's settings moved to the top level.
 */
export function layoutToPage(layout: LayoutRow[], title = ""): { title: string; rows: any[] } {
  return {
    title,
    rows: layout.map((r) => ({
      row_id: r.id,
      full_width: !!r.fullWidth,
      background_color: r.backgroundColor ?? null,
      padding: r.padding ?? null,
      columns: r.columns.map((c) => ({
        column_id: c.id,
        span: c.span,
        widgets: c.widgets.map((x) => ({ ...x.settings, id: x.id, widget_type: x.type })),
      })),
    })),
  };
}

/* ---------- The TheCoins page-builder menu ("Add widget") ---------- */

export type WidgetSupport = "yes" | "avoid" | "no";

export interface MenuWidget {
  /** widget_type, the internal name. */
  type: string;
  /** Name exactly as in the TheCoins "Add widget" menu. */
  name: string;
  /** The menu's one-line description. */
  description: string;
  /** yes = our site shows it · avoid = don't use it (see note) · no = our site doesn't show it yet. */
  support: WidgetSupport;
  note?: string;
}

/**
 * Every widget in the TheCoins "Add widget" menu (44), in menu groups. Names and descriptions follow the menu.
 * Only the first two group names are confirmed from the menu (owner's screenshot, 18 Nov); the rest are our best grouping.
 */
export const WIDGET_MENU: { group: string; widgets: MenuWidget[] }[] = [
  {
    group: "Hero & Banners",
    widgets: [
      { type: "hero-banner", name: "Hero Banner", description: "Full-width banner with title, subtitle & CTA", support: "avoid", note: "Its picture, text and button don't reach our site. Use a Carousel with one slide instead." },
      { type: "carousel", name: "Carousel", description: "Image/content slideshow", support: "yes" },
      { type: "banners", name: "Banners", description: "Promotional banners grid", support: "yes", note: "Loses the button text: use it for finished pictures only." },
      { type: "swiper-grid-cards", name: "Swiper Grid Cards", description: "Grid of promotional cards with products and responsive images (slider)", support: "no" },
      { type: "grid-cards", name: "Grid Cards", description: "Grid of cards with title, description, image and resolved products", support: "no" },
    ],
  },
  {
    group: "Commerce",
    widgets: [
      { type: "featured-products", name: "Featured Products", description: "Grid of selected products", support: "yes" },
      { type: "recommended-products", name: "Recommended For You", description: "Product suggestions", support: "yes", note: "Shown as the same product grid." },
      { type: "products-by-category", name: "Products by Category", description: "Products from a category or a ranking", support: "yes" },
      { type: "categories-grid", name: "Categories", description: "Category cards", support: "yes" },
      { type: "two-one-grid", name: "Two-One Grid", description: "Products/brands on one side, category images on the other", support: "yes" },
      { type: "product-attributes", name: "Product Attributes", description: "Values of an attribute (e.g. all Brands)", support: "no" },
      { type: "offer-card", name: "Offer Card", description: "Offer with price, icon, image", support: "no" },
    ],
  },
  {
    group: "Content",
    widgets: [
      { type: "text-image", name: "Text + Image", description: "Rich text with image", support: "yes" },
      { type: "stats-counter", name: "Stats / Counters", description: "Numbers & metrics", support: "yes" },
      { type: "testimonials", name: "Testimonials", description: "Customer quotes", support: "yes" },
      { type: "button-cta", name: "Button / CTA", description: "One call-to-action button", support: "yes" },
      { type: "faq-accordion", name: "FAQ / Accordion", description: "Questions & answers saved in the widget", support: "yes" },
      { type: "gallery", name: "Image Gallery", description: "Grid of images", support: "yes" },
      { type: "video", name: "Video", description: "Embedded video", support: "no" },
      { type: "countdown", name: "Countdown Timer", description: "Count down to a date", support: "no" },
      { type: "logo-cloud", name: "Logo Cloud", description: "Partner/brand logo grid", support: "no" },
      { type: "partners", name: "Partners", description: "Auto-scrolling logo carousel", support: "no" },
      { type: "map", name: "Map Embed", description: "Embedded map", support: "no" },
    ],
  },
  {
    group: "Layout",
    widgets: [
      { type: "spacer", name: "Spacer", description: "Vertical space", support: "yes" },
      { type: "divider", name: "Divider", description: "Horizontal line", support: "yes" },
      { type: "custom-html", name: "Custom HTML", description: "Raw HTML block", support: "avoid", note: "Not allowed for our site (safety)." },
    ],
  },
  {
    group: "Forms & plugins",
    widgets: [
      { type: "contact-form", name: "Contact Form", description: "Form linked to the Contact Us plugin", support: "yes" },
      { type: "newsletter", name: "Newsletter Signup", description: "Email subscription form", support: "no" },
      { type: "newsletter-subscription", name: "Newsletter Subscription", description: "Newsletter plugin form", support: "no" },
      { type: "faq-plugin", name: "FAQ (Plugin)", description: "FAQs from the FAQ plugin", support: "no" },
      { type: "blog-posts", name: "Blog & News", description: "Latest blog posts", support: "no" },
      { type: "size-guide", name: "Size Guide", description: "Size charts", support: "no" },
      { type: "product-reviews", name: "Product Reviews", description: "Reviews of one product", support: "no" },
      { type: "reviews-summary", name: "Reviews Summary", description: "Ratings overview", support: "no" },
    ],
  },
  {
    group: "Customer & loyalty",
    widgets: [
      { type: "order-history", name: "Order History", description: "Customer's orders", support: "no", note: "Our Account page already shows this." },
      { type: "customer-service-center", name: "Customer Service Center", description: "Help center with recent orders", support: "no" },
      { type: "loyalty-points", name: "Loyalty Points", description: "Customer points balance", support: "no" },
      { type: "loyalty-tiers", name: "Loyalty Tiers", description: "Tier levels and benefits", support: "no" },
      { type: "referral-program", name: "Referral Program", description: "Invite friends", support: "no" },
    ],
  },
  {
    group: "Campaigns & ads",
    widgets: [
      { type: "active-campaigns", name: "Active Campaigns", description: "Current offers", support: "no" },
      { type: "promocode-input", name: "Promo Code", description: "Promo code entry", support: "no" },
      { type: "flash-sale-banner", name: "Flash Sale Banner", description: "Sale banner with countdown", support: "no" },
      { type: "campaign-rewards", name: "Campaign Rewards", description: "Redeemable rewards", support: "no" },
      { type: "ad-slot", name: "Ad Slot (Ads Manager)", description: "A campaign from Ads Manager", support: "no" },
    ],
  },
];

/** The TheCoins widget a recipe is built on: its first widget that isn't a section heading (else its first widget). */
export function recipeWidget(r: SectionRecipe): LayoutWidget {
  const ws = r.row.columns.flatMap((c) => c.widgets);
  return ws.find((x) => x.settings.variant !== "section-header") ?? ws[0];
}

/** Recipes (styles) for one TheCoins widget type. */
export const recipesFor = (type: string) => SECTIONS.filter((r) => recipeWidget(r).type === type);
