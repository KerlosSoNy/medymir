import Link from "next/link";
import { getCategories } from "@/lib/api";
import { UI } from "@/lib/ui";
import { CmsSlot } from "@/components/CmsSlot";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const cats = await getCategories();
  return (
    <>
      <div className="container">
        <h1 className="page-title">{UI.categories}</h1>
        <ul className="directory cats">
          {cats.map((c) => (
            <li key={c.id}>
              <Link href={`/category/${c.slug}`}>
                <strong>{c.name}</strong>
                {c.description && <span>{c.description}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <CmsSlot slug="categories" />
    </>
  );
}
