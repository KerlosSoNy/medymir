// "Home › Page" trail above CMS pages (Figma About / FAQ / Contact); policies add a middle step
// ("Home › Policies & information › Shipping policy").
import Link from "next/link";
import { UI } from "@/lib/ui";
import { container, sectionX } from "@/lib/styles";
import { Icon } from "./SmartLink";

/** shop: align with the shop pages (container width) instead of the page-builder sections. */
export function Breadcrumbs({ current, parent, shop }: { current: string; parent?: string; shop?: boolean }) {
  return (
    <nav aria-label={UI.breadcrumb} className={shop ? container : sectionX}>
      <ol className="mx-auto flex max-w-[1176px] items-center gap-2.5 pt-7 text-[13px]">
        <li>
          <Link href="/" className="text-slate hover:underline">
            {UI.home}
          </Link>
        </li>
        <li aria-hidden>
          <Icon name="breadcrumb-sep" size={10} />
        </li>
        {parent && (
          <>
            <li className="shrink-0 text-slate">{parent}</li>
            <li aria-hidden>
              <Icon name="breadcrumb-sep" size={10} />
            </li>
          </>
        )}
        <li aria-current="page" className="min-w-0 truncate font-medium text-navy-deep">
          {current}
        </li>
      </ol>
    </nav>
  );
}
