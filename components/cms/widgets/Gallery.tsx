// Image Gallery (gallery).
import { tr } from "@/lib/format";
import { SmartLink } from "../../SmartLink";
import { coverImg } from "../classes";
import { type P, url } from "./shared";

export function Gallery({ w }: P) {
  const imgs = (w.images ?? []).filter((i: any) => url(i.url));
  if (!imgs.length) return null;
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-[repeat(var(--cols),minmax(0,1fr))]" style={{ ["--cols" as any]: w.columns ?? 3 }}>
      {imgs.map((i: any, k: number) => (
        <SmartLink key={k} to={i.linkUrl ?? i.link} className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-surface-alt">
          <img src={i.url} alt={tr(i.caption)} loading="lazy" className={coverImg} />
        </SmartLink>
      ))}
    </div>
  );
}
