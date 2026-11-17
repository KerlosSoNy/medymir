import Link from "next/link";
import { getBrands } from "@/lib/api";
import { container, pageTitle } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { CmsSlot } from "@/components/CmsSlot";

export const metadata = { title: "Brands" };

// Brand directory: the store's Brand list (Products → product details → Brand), shown as
// Figma Card/Brand tiles (17:235). The logo uploaded for each brand is the tile's wordmark;
// a brand without a logo shows its name.
export default async function BrandsPage() {
  const brands = await getBrands();
  return (
    <>
      <div className={container}>
        <h1 className={pageTitle}>{UI.brands}</h1>
        <ul className="mt-4 mb-14 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 md:mb-[72px] md:grid-cols-3 lg:grid-cols-5">
          {brands.map((b) => (
            <li key={b.slug} className="min-w-0">
              <Link
                href={`/brand/${b.slug}`}
                className="group flex h-full flex-col items-center gap-1.5 rounded-xl border border-[#e3e7ed] bg-white px-3 pt-4 pb-4 text-center transition hover:border-[#c5cdd8] hover:shadow-[0_12px_30px_rgb(15_31_64/0.1)]"
              >
                <span className="flex h-[72px] w-full items-center justify-center overflow-hidden">
                  {b.logo ? (
                    <img
                      src={b.logo}
                      alt={b.name}
                      loading="lazy"
                      className="max-h-full max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <span className="font-head text-lg leading-tight font-bold break-words text-dark sm:text-[21px]">{b.name}</span>
                  )}
                </span>
                {b.logo && <span className="sr-only">{b.name}</span>}
                <span className="flex items-center gap-1.5 text-[13.5px] text-muted-2 group-hover:text-ink-2">
                  {UI.viewStore}
                  <img src="/icons/chevron-right-grey.svg" width={13} height={13} alt="" className="size-[13px] max-w-none shrink-0 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <CmsSlot slug="brands" />
    </>
  );
}
