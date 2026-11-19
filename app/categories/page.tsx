import { getCategories } from "@/lib/api";
import { container, pageTitle } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { CmsSlot } from "@/components/CmsSlot";
import { CategoryTile } from "@/components/CategoryTile";

export const metadata = { title: "Categories" };

// Category tiles (Figma Card/Category tile 17:268): photo on top, name + chevron below.
export default async function CategoriesPage() {
  const cats = await getCategories();
  return (
    <>
      <div className={container}>
        <h1 className={pageTitle}>{UI.categories}</h1>
        <ul className="mt-4 mb-14 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 md:mb-[72px] md:grid-cols-3 lg:grid-cols-4">
          {cats.map((c) => (
            <li key={c.id} className="min-w-0">
              <CategoryTile cat={c} />
            </li>
          ))}
        </ul>
      </div>
      <CmsSlot slug="categories" />
    </>
  );
}
