// Categories (categories-grid): category carousel.
import { tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { CategoryCarousel } from "../CategoryCarousel";
import { type P, url } from "./shared";

export function Categories({ w, ctx }: P) {
  const byId = new Map(ctx.categories.map((c) => [c.id, c]));
  const cats = (w.data ?? w.categories ?? []).map((c: any) => {
    const full = byId.get(c.id);
    return {
      id: c.id,
      name: tr(c.title ?? c.name) || full?.name || "",
      description: w.showDescription === false ? "" : full?.description ?? "",
      image: url(c.image || c.image_url || full?.image_url),
      href: `/category/${c.slug ?? full?.slug ?? c.id}`,
    };
  });
  if (!cats.length) return null;
  return <CategoryCarousel cats={cats} label={UI.exploreCategory} footnote={UI.exploreCategories(cats.length)} />;
}
