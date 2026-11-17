import Link from "next/link";
import { UI } from "@/lib/ui";
import { btn, container } from "@/lib/styles";
import { cn } from "@/lib/cn";

export default function NotFound() {
  return (
    <div className={cn(container, "flex flex-col items-center gap-2.5 pt-14 pb-18 text-center")}>
      <h1 className="font-head text-[56px] font-bold leading-tight">404</h1>
      <p>{UI.notFound}</p>
      <Link href="/" className={btn("dark")}>
        {UI.backHome}
      </Link>
    </div>
  );
}
