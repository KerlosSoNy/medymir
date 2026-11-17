import Link from "next/link";
import { isExternal } from "@/lib/format";

/** Renders a CMS link: internal -> next/link, external -> new tab, empty/"#" -> plain element. */
export function SmartLink({
  to,
  className,
  children,
  ariaLabel,
}: {
  to?: string | null;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  if (!to || to === "#") return <span className={className}>{children}</span>;
  if (to.startsWith("#")) {
    return (
      <a href={to} className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  if (isExternal(to))
    return (
      <a href={to} className={className} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
        {children}
      </a>
    );
  return (
    <Link href={to.startsWith("/") ? to : `/${to}`} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

/** Figma icons live in /public/icons; keeps their native size. */
export function Icon({ name, size, alt = "" }: { name: string; size: number; alt?: string }) {
  return <img src={`/icons/${name}.svg`} width={size} height={size} alt={alt} className="icon" />;
}
