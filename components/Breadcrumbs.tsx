// "Home › Page" trail above CMS pages (Figma About / FAQ / Contact); policies add a middle step
// ("Home › Policies & information › Shipping policy").
import Link from "next/link";
import { UI } from "@/lib/ui";
import { sectionX } from "@/lib/styles";
import { Icon } from "./SmartLink";

export function Breadcrumbs({ current, parent }: { current: string; parent?: string }) {
  return (
    <nav aria-label={UI.breadcrumb} className={sectionX}>
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
