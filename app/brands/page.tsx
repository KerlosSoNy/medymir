import { getSiteLayout } from "@/lib/api";
import { tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { CmsSlot } from "@/components/CmsSlot";
import { SmartLink } from "@/components/SmartLink";

export const metadata = { title: "Brands" };

// Brand directory: the brand links managed in the CMS "site-layout" page.
export default async function BrandsPage() {
  const layout = await getSiteLayout();
  const brands = (layout["footer-column"]?.items ?? []).filter((i: any) => /^\/brand\//.test(i.link ?? ""));
  return (
    <>
      <div className="container">
        <h1 className="page-title">{UI.brands}</h1>
        <ul className="directory">
          {brands.map((b: any, i: number) => (
            <li key={i}>
              <SmartLink to={b.link}>{tr(b.label)}</SmartLink>
            </li>
          ))}
        </ul>
      </div>
      <CmsSlot slug="brands" />
    </>
  );
}
