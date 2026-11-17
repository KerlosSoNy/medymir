import { getSiteLayout } from "@/lib/api";
import { tr } from "@/lib/format";
import { container, pageTitle } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { CmsSlot } from "@/components/CmsSlot";
import { SmartLink } from "@/components/SmartLink";

export const metadata = { title: "Brands" };

// Brand directory: the brand links managed in the CMS "site-layout" page, shown as
// Figma Card/Brand tiles (17:235). Brands have no logo field yet, so the name is the wordmark.
export default async function BrandsPage() {
  const layout = await getSiteLayout();
  const brands = (layout["footer-column"]?.items ?? []).filter((i: any) => /^\/brand\//.test(i.link ?? ""));
  return (
    <>
      <div className={container}>
        <h1 className={pageTitle}>{UI.brands}</h1>
        <ul className="mt-4 mb-14 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 md:mb-[72px] md:grid-cols-3 lg:grid-cols-5">
          {brands.map((b: any, i: number) => {
            const name = tr(b.label);
            return (
              <li key={i} className="min-w-0">
                <SmartLink
                  to={b.link}
                  className="group flex h-full flex-col items-center gap-1.5 rounded-xl border border-[#e3e7ed] bg-white px-3 pt-5 pb-4 text-center transition hover:border-[#c5cdd8] hover:shadow-[0_12px_30px_rgb(15_31_64/0.1)]"
                >
                  <span className="flex h-[52px] w-full items-center justify-center overflow-hidden font-head text-lg leading-tight font-bold break-words text-dark sm:text-[21px]">
                    {name}
                  </span>
                  <span className="flex items-center gap-1.5 text-[13.5px] text-muted-2 group-hover:text-ink-2">
                    {UI.viewStore}
                    <img src="/icons/chevron-right-grey.svg" width={13} height={13} alt="" className="size-[13px] shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </SmartLink>
              </li>
            );
          })}
        </ul>
      </div>
      <CmsSlot slug="brands" />
    </>
  );
}
