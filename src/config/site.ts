/**
 * Public site configuration. Safe to import from client components.
 * Secrets NEVER go here – see src/config/server-env.ts (server-only).
 */

export const siteConfig = {
  name: "Indy Mustard Seed",
  domain: "indymustardseed.online",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://indymustardseed.online",
  tagline: "Start Small. Grow Something.",
  description:
    "Plants, seeds, tools and growing supplies selected to help you turn balconies, backyards and empty spaces into something productive. Rooted in Indianapolis, shipping nationwide.",
  locale: "en_US",
  contactEmail: "hello@indymustardseed.online",
  city: "Indianapolis, Indiana",

  /**
   * Demo mode labels development seed data (demo banner, "Demo" ratings, demo
   * images) and keeps search engines out (noindex + robots disallow).
   * It stays ON until NEXT_PUBLIC_DEMO_MODE=false is set – do that only after
   * the demo catalog has been replaced with real supplier products.
   */
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",

  freeShippingThreshold: 59,

  /** The Indy Mustard Seed family of sites. */
  ecosystem: {
    services: {
      url: "https://indymustardseed.com",
      label: "indymustardseed.com",
      description: "Garden installation, services and business information.",
    },
    store: {
      url: "https://indymustardseed.online",
      label: "indymustardseed.online",
      description: "Online store and growing guides.",
    },
    community: {
      url: "https://indymustardseed.space",
      label: "indymustardseed.space",
      description: "Community gardens, available spaces, sponsorships and volunteering.",
    },
  },

  /** Replace with real profile URLs once accounts exist. Empty strings are hidden. */
  social: {
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "",
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "",
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? "",
    pinterest: process.env.NEXT_PUBLIC_SOCIAL_PINTEREST ?? "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
