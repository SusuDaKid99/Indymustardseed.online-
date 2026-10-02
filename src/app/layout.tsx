import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { CartUIProvider } from "@/lib/cart/cart-ui";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap", axes: ["SOFT", "opsz"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Garden, Seeds & Growing Supplies | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: "/images/photos/hero-raised-beds.jpg", width: 1800, height: 1200, alt: "Raised garden beds full of vegetables" }],
  },
  twitter: { card: "summary_large_image" },
  // Keep demo/staging deployments out of search results.
  robots: siteConfig.demoMode ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#14301f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col bg-white font-sans text-ink">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-forest-900 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <CartUIProvider>
          <DemoBanner />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartUIProvider>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            logo: `${siteConfig.url}/icon.svg`,
            slogan: siteConfig.tagline,
            areaServed: "US",
            sameAs: [siteConfig.ecosystem.services.url, siteConfig.ecosystem.community.url],
          }}
        />
      </body>
    </html>
  );
}
