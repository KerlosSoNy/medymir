// Mega menu content for the category bar (Figma "Menus" row: nodes 12:413, 14:514, 14:649, 14:793).
// The store only has the 8 top-level categories, so the sub-category lists, promo cards and
// featured brands live here. Each sub-category links to its store category with a search term.
// Menus are matched to store categories by slug; a category without an entry here is a plain link.

export interface MenuGroup {
  /** Card / column title, e.g. "Cardiovascular & Cardiac Surgery". */
  title: string;
  /** Slug of the store category this group belongs to. */
  category: string;
  items: string[];
}

export interface CategoryMenu {
  /** Titles of the groups (from MENU_GROUPS) shown in this category's panel. */
  groups: string[];
  /** "View all … products →" link text. Omitted = no link. */
  viewAll?: string;
  promo?: { title: string; text: string };
  brands?: string[];
}

/** "All categories" panel: 12 numbered cards (Figma 12:476). */
export const MENU_GROUPS: MenuGroup[] = [
  {
    title: "Cardiovascular & Cardiac Surgery",
    category: "cardiovascular",
    items: [
      "Coronary Intervention",
      "Cath Lab Access & Accessories",
      "Rhythm Management & Electrophysiology",
      "Structural Heart",
      "Peripheral Vascular Intervention",
      "Interventional Radiology",
      "Cardiac Surgery & Perfusion",
    ],
  },
  {
    title: "Surgery & Operating Room",
    category: "surgical",
    items: [
      "Laparoscopic Access & Instruments",
      "Surgical Energy & Smoke Management",
      "Ablation & Pain Management",
      "Sutures & Wound Closure",
      "Hernia Repair & Surgical Mesh",
      "Surgical Instruments",
      "Hemostasis, Sealants & Drains",
    ],
  },
  {
    title: "Endoscopy & Gastroenterology",
    category: "endoscopy",
    items: ["ERCP & GI Stents", "Endoscopic Instruments & Accessories"],
  },
  {
    title: "Urology",
    category: "dialysis-urology",
    items: ["Endourology & Stone Management", "Urinary Drainage & Incontinence"],
  },
  {
    title: "Dialysis & Renal Care",
    category: "dialysis-urology",
    items: ["Dialysis Equipment & Consumables", "Dialysis Access", "Acute Renal Therapy"],
  },
  {
    title: "Infusion & Vascular Access",
    category: "critical-care-infusion",
    items: ["Infusion Pumps, Sets & IV Cannulas", "Central Venous Access & Ports", "Oncology Infusion & Drug Safety"],
  },
  {
    title: "Critical Care, Respiratory & Nutrition",
    category: "critical-care-infusion",
    items: ["Patient Monitoring & Warming", "Airway Management", "Breathing Circuits & Suction", "Enteral Feeding"],
  },
  {
    title: "Orthopedics & Trauma",
    category: "orthopedics-trauma",
    items: ["Orthopedic Implants & Reconstruction", "Arthroscopy & Orthopedic Instruments", "Braces, Splints & Casting"],
  },
  {
    title: "Specialty Surgery",
    category: "surgical",
    items: ["Neurosurgery", "ENT", "Obstetrics & Gynecology", "Ophthalmic Surgery"],
  },
  {
    title: "Wound Care & Dressings",
    category: "hospital-supplies",
    items: ["Dressings, Bandages & Skin Protection", "Negative Pressure Wound Therapy"],
  },
  {
    title: "Infection Control & PPE",
    category: "hospital-supplies",
    items: ["Protective Wear, Gloves & Drapes", "Sterilization & Disinfection"],
  },
  {
    title: "General Medical Consumables",
    category: "hospital-supplies",
    items: ["Syringes & Needles", "Blood & Specimen Collection"],
  },
];

/** Per-category panels. Cardiovascular, Surgical and Orthopedics are from Figma; the rest follow the same pattern. */
export const CATEGORY_MENUS: Record<string, CategoryMenu> = {
  cardiovascular: {
    groups: ["Cardiovascular & Cardiac Surgery"],
    viewAll: "View all cardiovascular products →",
    promo: {
      title: "Cath lab & structural heart",
      text: "Send your case list for pricing, availability and product documentation.",
    },
    brands: ["Abbott", "Medtronic", "Boston Scientific", "Terumo", "Edwards", "Biotronik"],
  },
  surgical: {
    groups: ["Surgery & Operating Room", "Specialty Surgery"],
    viewAll: "View all surgical products →",
    promo: { title: "Equipping an operating theatre?", text: "Send your product list for pricing and availability." },
  },
  endoscopy: {
    groups: ["Endoscopy & Gastroenterology"],
    viewAll: "View all endoscopy products →",
    promo: {
      title: "Endoscopy suite supplies",
      text: "Send your procedure list for pricing, availability and product documentation.",
    },
  },
  "dialysis-urology": {
    groups: ["Dialysis & Renal Care", "Urology"],
    viewAll: "View all dialysis & urology products →",
    promo: { title: "Running a dialysis unit?", text: "Share your monthly consumption for a standing-order quotation." },
  },
  "orthopedics-trauma": {
    groups: ["Orthopedics & Trauma"],
    viewAll: "View all orthopedics & trauma products →",
    promo: { title: "Implants and trauma systems", text: "Sizes and sets are confirmed in the quotation." },
    brands: ["stryker", "MicroPort Orthopedics"],
  },
  "critical-care-infusion": {
    groups: ["Critical Care, Respiratory & Nutrition", "Infusion & Vascular Access"],
    viewAll: "View all critical care & infusion products →",
    promo: { title: "ICU and infusion programmes", text: "Send your product list for pricing and availability." },
  },
  "hospital-supplies": {
    groups: ["General Medical Consumables", "Wound Care & Dressings", "Infection Control & PPE"],
    viewAll: "View all hospital supplies →",
    promo: { title: "Restocking the wards?", text: "Send your monthly list — we reply with a quotation within one working day." },
  },
};

/** Where "Request a quote" in the promo cards goes (the quotation form on the home page). */
export const QUOTE_LINK = "/#quote";

export const groupByTitle = (title: string) => MENU_GROUPS.find((g) => g.title === title);

/** Link for a sub-category: its store category, searched for the sub-category name. */
export const subCategoryHref = (category: string, item: string) =>
  `/category/${category}?q=${encodeURIComponent(item)}`;
