// Carousel (carousel): hero slider; one slide = a banner with real text + button.
import { tr } from "@/lib/format";
import { HeroSlider } from "../HeroSlider";
import { type P, url } from "./shared";

export function Carousel({ w }: P) {
  const raw: any[] = w.slides ?? w.images ?? [];
  const slides = raw
    .map((s) => {
      const desk = url(s.desk ?? s.imageUrl ?? s.image);
      return {
        desk,
        tab: url(s.tab ?? s.tabletImageUrl) || desk,
        mobile: url(s.mobile ?? s.mobileImageUrl) || desk,
        title: tr(s.title),
        subtitle: tr(s.subtitle),
        ctaText: tr(s.cta_text ?? s.ctaText),
        link: s.cta_link ?? s.ctaLink ?? s.link ?? "",
      };
    })
    .filter((s) => s.desk);
  if (!slides.length) return null;
  return <HeroSlider slides={slides} autoplay={w.autoplay !== false} interval={Number(w.interval) || 6} />;
}
