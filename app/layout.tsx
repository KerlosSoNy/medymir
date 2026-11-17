import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { getBrands, getCategories, getCategoryBrands, getSiteLayout, getTenant } from "@/lib/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuoteListProvider } from "@/components/QuoteListProvider";
import { PixelLoader } from "@/components/PixelLoader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTenant();
  return {
    title: { default: t?.name ?? "", template: `%s | ${t?.name ?? ""}` },
    description: t?.branding.tagline ?? undefined,
    icons: t?.branding.logo_url ? [{ url: t.branding.logo_url }] : undefined,
  };
}

/** Brand colours from TheCoins become CSS variables; the stylesheet only references variables. */
function themeVars(t: Awaited<ReturnType<typeof getTenant>>): React.CSSProperties {
  const v: Record<string, string> = {};
  if (t?.branding.primary_color) v["--brand"] = t.branding.primary_color;
  if (t?.branding.secondary_color) v["--gold"] = t.branding.secondary_color;
  return v as React.CSSProperties;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [tenant, layout, categories, brands, categoryBrands] = await Promise.all([
    getTenant(),
    getSiteLayout(),
    getCategories(),
    getBrands(),
    getCategoryBrands(),
  ]);
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} style={themeVars(tenant)}>
      <body>
        <PixelLoader />
        <QuoteListProvider>
          <Header tenant={tenant} layout={layout} categories={categories} brands={brands} categoryBrands={categoryBrands} />
          <main>{children}</main>
          <Footer tenant={tenant} layout={layout} categories={categories} />
        </QuoteListProvider>
      </body>
    </html>
  );
}
