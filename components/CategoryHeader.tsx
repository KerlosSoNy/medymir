// Category page header (Figma "Category — Endoscopy & Gastroenterology", node 87:94), all from the store:
// hero with the category's name, description and picture; tiles for its sub-categories (only when the store
// has sub-categories); and "Featured brands" = the brands that have products in this category, with the
// logos from the Brand list. Anything missing is left out.
import Link from "next/link";
import { getBrands, getCategoryBrands, getSubcategories, type Category } from "@/lib/api";
import { UI } from "@/lib/ui";
import { Icon } from "./SmartLink";

export async function CategoryHeader({ cat }: { cat: Category }) {
  const [subs, byCategory, brands] = await Promise.all([getSubcategories(cat.id), getCategoryBrands(), getBrands()]);
  const names = byCategory[cat.slug ?? cat.id] ?? [];
  const featured = names
    .map((n) => brands.find((b) => b.name.toLowerCase() === String(n).toLowerCase()) ?? { name: String(n), slug: "", logo: null })
    .slice(0, 6);
  return (
    <div className="flex flex-col gap-[18px]">
      <section className="relative flex flex-col overflow-hidden rounded-[14px] border border-[#e3eaf3] bg-[linear-gradient(90deg,#e8eff9,#f1f5fb_55%,#f6f8fb)] md:min-h-[240px] md:flex-row-reverse">
        {cat.image_url && (
          <div className="relative h-[180px] shrink-0 sm:h-[220px] md:h-auto md:w-[46%]">
            <img src={cat.image_url} alt="" className="absolute inset-0 size-full object-cover" />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-[43px]">
          <h1 className="max-w-[520px] font-head text-[30px] leading-[1.12] font-bold text-balance text-[#202b40] md:text-[34px] lg:text-[38px]">{cat.name}</h1>
          {cat.description && <p className="mt-3.5 max-w-[540px] text-base text-[#3b4a63] md:text-[17px]">{cat.description}</p>}
        </div>
      </section>

      {subs.length > 0 && (
        <nav aria-label={cat.name} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {subs.map((s) => (
            <Link
              key={s.id}
              href={`/category/${s.slug}`}
              className="group flex min-h-[84px] items-center gap-[18px] rounded-xl border border-[#dce3ed] bg-white px-5 py-3 transition hover:border-[#b9c2cf] hover:shadow-[0_8px_24px_rgb(15_31_64/0.08)]"
            >
              {s.image_url && <img src={s.image_url} alt="" loading="lazy" className="size-14 shrink-0 rounded-lg object-cover" />}
              <span className="min-w-0 flex-1 font-head text-base font-bold text-[#202b40]">{s.name}</span>
              <span className="shrink-0 transition-transform group-hover:translate-x-0.5">
                <Icon name="chevron-right-dark" size={18} />
              </span>
            </Link>
          ))}
        </nav>
      )}

      {featured.length > 0 && (
        <section className="flex flex-col gap-3 rounded-xl border border-[#ebeff4] bg-[#f6f8fb] px-5 py-4 md:flex-row md:items-center md:gap-5 md:py-[15px]">
          <h2 className="shrink-0 font-head text-[15px] font-bold text-[#202b40]">{UI.featuredBrands}</h2>
          <span aria-hidden className="hidden h-7 w-px shrink-0 bg-[#dce3ed] md:block" />
          <ul className="grid flex-1 grid-cols-2 items-center gap-3 sm:grid-cols-3 md:flex md:gap-5">
            {featured.map((b) => (
              <li key={b.name} className="flex min-w-0 flex-1 items-center justify-center">
                <Link
                  href={b.slug ? `/brand/${b.slug}` : `/search?q=${encodeURIComponent(b.name)}`}
                  className="flex h-11 items-center justify-center transition hover:opacity-75"
                  aria-label={b.name}
                >
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} loading="lazy" className="max-h-11 max-w-[140px] object-contain" />
                  ) : (
                    <span className="font-head text-lg font-bold whitespace-nowrap text-[#202b40]">{b.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
