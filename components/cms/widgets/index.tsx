// CMS widget renderer. One file per widget type in this folder; REGISTRY maps a TheCoins widget_type to it.
// To support a new widget type: add a file here, register it below, add a recipe in lib/cms-sections.ts,
// and update its status in CMS-WIDGETS.md.
import type { P } from "./shared";
import { Carousel } from "./Carousel";
import { Stats } from "./Stats";
import { TextImage } from "./TextImage";
import { Categories } from "./Categories";
import { Banners } from "./Banners";
import { Products } from "./Products";
import { Testimonials } from "./Testimonials";
import { ButtonCta } from "./ButtonCta";
import { ContactForm } from "./ContactForm";
import { Faq } from "./Faq";
import { Gallery } from "./Gallery";
import { Spacer } from "./Spacer";
import { Divider } from "./Divider";
import { TwoOneGrid } from "./TwoOneGrid";

export type { RowKind, WidgetCtx } from "./shared";

const REGISTRY: Record<string, React.FC<P>> = {
  carousel: Carousel,
  "stats-counter": Stats,
  "text-image": TextImage,
  "categories-grid": Categories,
  banners: Banners,
  // "Hero Banner" also arrives as small-banner cards (often empty: use a one-slide Carousel for a banner with a button).
  "hero-banner": Banners,
  "products-by-category": Products,
  "featured-products": Products,
  "recommended-products": Products,
  testimonials: Testimonials,
  "button-cta": ButtonCta,
  "contact-form": ContactForm,
  "faq-accordion": Faq,
  gallery: Gallery,
  spacer: Spacer,
  divider: Divider,
  "two-one-grid": TwoOneGrid,
};

export function WidgetRenderer({ w, ctx }: P) {
  const C = REGISTRY[w?.widget_type ?? w?.type];
  return C ? <C w={w} ctx={ctx} /> : null;
}
