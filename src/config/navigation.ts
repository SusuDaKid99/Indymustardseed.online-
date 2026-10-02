import { categories } from "@/lib/catalog/categories";

export interface NavLink {
  label: string;
  href: string;
}

/** Primary navigation (after the "Shop" mega menu trigger). */
export const mainNav: NavLink[] = [
  { label: "Plants", href: "/shop/plants" },
  { label: "Seeds", href: "/shop/seeds" },
  { label: "Garden", href: "/shop/garden" },
  { label: "Indoor Growing", href: "/shop/indoor-growing" },
  { label: "Composting", href: "/shop/composting" },
  { label: "Kits", href: "/kits" },
  { label: "Learn", href: "/learn" },
  { label: "About", href: "/about" },
];

/** Mega menu is derived from the category tree so it never drifts from the catalog. */
export const megaMenu = categories.map((c) => ({
  label: c.name,
  emoji: c.emoji,
  href: `/shop/${c.slug}`,
  children: c.subcategories.map((s) => ({ label: s.name, href: `/shop/${c.slug}/${s.slug}` })),
}));

export const megaMenuExtras: NavLink[] = [
  { label: "Garden Kits", href: "/kits" },
  { label: "What Should I Grow?", href: "/garden-finder" },
  { label: "Build Your Garden", href: "/build-your-garden" },
  { label: "Start Growing for Under $25", href: "/shop?price=under-25" },
];

export const footerNav: { title: string; links: (NavLink & { external?: boolean })[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Plants", href: "/shop/plants" },
      { label: "Seeds", href: "/shop/seeds" },
      { label: "Garden Supplies", href: "/shop/garden" },
      { label: "Indoor Growing", href: "/shop/indoor-growing" },
      { label: "Composting", href: "/shop/composting" },
      { label: "Garden Kits", href: "/kits" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Indy Mustard Seed", href: "https://indymustardseed.com", external: true },
      { label: "Community", href: "https://indymustardseed.space", external: true },
      { label: "Growing in Indianapolis", href: "/growing-in-indianapolis" },
      { label: "Become a Supplier", href: "/suppliers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
      { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];
