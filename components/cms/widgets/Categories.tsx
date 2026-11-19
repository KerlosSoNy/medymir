// Categories (categories-grid): category carousel. CategoryTiles = all store categories as a grid of tiles.
import { tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { CategoryCarousel } from "../CategoryCarousel";
import { CategoryTile } from "../../CategoryTile";
import { type P, url } from "./shared";

export function Categories({ w, ctx }: P) {
  const byId = new Map(ctx.categories.map((c) => [c.id, c]));
  // No categories picked in the section → all store categories.
  const picked: any[] = w.data?.length ? w.data : w.categories?.length ? w.categories : ctx.categories;
  const cats = picked.map((c: any) => {
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

/** All store categories as tiles (Figma Brands "Shop by category", 18:1088), 6 across on computers. */
export function CategoryTiles({ ctx }: { ctx: P["ctx"] }) {
  if (!ctx.categories.length) return null;
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {ctx.categories.map((c) => (
        <li key={c.id} className="min-w-0">
          <CategoryTile cat={c} hideDescription />
        </li>
      ))}
    </ul>
  );
}
