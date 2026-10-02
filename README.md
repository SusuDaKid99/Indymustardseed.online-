# Indy Mustard Seed — indymustardseed.online

**Start Small. Grow Something.**

This is the online garden store and learning site for Indy Mustard Seed, an Indianapolis garden business that ships nationwide. It is built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

> ⚠️ **The catalog is development seed data.** All products, brands, suppliers, prices, SKUs and ratings in `src/data/seed` are made up. Demo mode, which is on by default, does three things:
> - shows a "Development preview" banner
> - labels ratings and images as "Demo"
> - blocks search engines (`noindex` and `Disallow: /`)
>
> Turn it off only after the demo catalog has been replaced (see below).

## Getting started

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks |
| `npm run placeholders` | Regenerate the demo SVG product and kit images |

## Architecture

```
src/
  app/                    Routes (pages, route handlers, sitemap, robots)
  components/             UI only: layout, product, cart, shop, kits, tools, learn, forms, account, checkout, ui
  config/
    site.ts               Public config (safe in the browser)
    navigation.ts         Header, mega menu and footer links
    server-env.ts         Secrets (server-only)
  data/
    seed/                 DEMO products, kits and suppliers (replace these)
    content/articles.ts   Learn articles, as structured blocks
  lib/                    Shared, framework-light logic
    catalog/              Types, categories, labels, filters/sort, formatting
    cart/                 Cart store (localStorage) and drawer UI context
    checkout/shipping.ts  Shipping rules, shared by the cart estimate and server checkout
    recommend/rules.ts    Garden Finder and Build-a-Garden rules
    client/               Favorites, recently viewed, saved gardens
  server/                 Server-only code, never bundled for the browser
    catalog/              Repository (the single data access point) and search
    checkout/             Server-side pricing, orders, payment provider registry
    suppliers/            Supplier registry, feed adapter interface, CSV adapter
    auth/session.ts       Customer auth integration point
    admin/auth.ts         Admin API token check
    actions/              Server actions: checkout, newsletter, supplier and contact forms
```

### Product data and privacy

- `Product` in `src/lib/catalog/types.ts` is the full internal record. It covers ID, SKU, slug, descriptions, images, category and subcategory, brand, supplier, supplier SKU and URL, supplier cost, retail and sale price, fulfillment type, affiliate URL, inventory, shipping, tags, specs, related products, and SEO fields.
- `PublicProduct` and `ProductCardData` are what customers receive. `toPublicProduct()` in `src/server/catalog/repository.ts` removes the private fields, so none of these reach the browser:
  - supplier cost and margin
  - supplier SKU and URL
  - affiliate URLs
  - internal notes
- Only `src/server/**` touches internal fields. Those modules import `server-only`, so the build fails if one is imported into client code.
- Claims such as "Made in USA" come only from `verifiedClaims`. Supplier adapters set that field only when the supplier provides documentation.

### Fulfillment types (stages 1–5)

| `fulfillmentType` | Customer experience | Stage |
| --- | --- | --- |
| `affiliate` | A **Buy from partner** button goes through `/go/<slug>` (a server-side redirect with `rel="sponsored"`) and shows a disclosure. These products can never be added to the cart or checkout. | 1 |
| `dropship` | Normal flow: cart → checkout → payment → confirmation. After payment, orders are routed to the supplier adapter. | 2 |
| `wholesale` | Same customer flow, fulfilled from our own inventory. | 3 |
| `house-brand` | Indy Mustard Seed products. | 4 |

Stage 5, the multi-supplier marketplace, is already supported by the data model:
- Every product carries a `supplierId`.
- Kits can mix suppliers and fulfillment types.
- Orders keep supplier details on each line.

### Replacing the demo catalog

1. Load real products into a database, using the admin API or supplier feeds (`src/server/suppliers`). The full schema is in `src/lib/catalog/types.ts`.
2. Add a `CatalogSource` in `src/server/catalog/repository.ts`, for example `database`, and set `CATALOG_SOURCE` to use it. **No UI code changes are needed**, because every page reads through the repository.
3. Replace the images in `public/images/products`, or point to a CDN and add `images.remotePatterns` in `next.config.ts`.
4. Delete `src/data/seed/*` and set `NEXT_PUBLIC_DEMO_MODE=false`.

Ratings show only when they exist. JSON-LD `aggregateRating` is emitted only for verified reviews (`source: "verified"`).

## Integration points (TODO)

Search the code for `TODO(` to find them all.

| Area | Where | Notes |
| --- | --- | --- |
| Payments: Stripe, Apple Pay, Google Pay | `src/server/checkout/payments.ts` | Each method appears at checkout only when its env vars are set. Card data is collected only by the provider's hosted UI. |
| Payments: PayPal | same file | Orders v2 API. |
| Payment webhooks | `/api/webhooks/stripe` (to add) | Mark orders `paid`, then submit dropship lines to suppliers. |
| Orders database | `src/server/checkout/orders.ts` | Orders are currently in memory, so they are lost on restart. |
| Customer accounts | `src/server/auth/session.ts` | Auth.js, Clerk, Supabase, etc. Guest checkout always works. Saved data is kept in localStorage until sign-in. |
| Supplier feeds and APIs | `src/server/suppliers/` | Implement `SupplierFeedAdapter` (a CSV example is included). |
| Admin dashboard | `src/app/api/admin/products/route.ts` | Uses Bearer `ADMIN_API_TOKEN`. GET returns internal records with margin. POST is a stub. |
| Newsletter, supplier and contact forms | `src/server/actions/forms.ts` | Connect an email or CRM provider. |
| Search | `src/server/catalog/search.ts` | In-memory search with intent synonyms ("small apartment", "under $25"). Can be swapped for Algolia, Meilisearch or Postgres FTS. |
| Recommendations | `src/lib/recommend/rules.ts`, `/api/recommendations` | Rule-based for now. |
| Tax | `src/server/checkout/pricing.ts` | Add Stripe Tax or TaxJar. |

## Features

- **Navigation:** header with a mega menu, a mobile drawer and prominent search.
- **Shopping:** category and subcategory pages with SEO URLs (`/shop/seeds/vegetables`).
- **Filters:** category, price, brand, indoor/outdoor, experience, plant type, space, sun, product type and availability.
  - Sort by Featured, Newest, Price low–high, Price high–low or Most popular.
  - Filters sync to the URL and open as a drawer on mobile.
- **Product pages** include:
  - gallery, price and sale price, availability, quantity, Add to Cart and Buy Now
  - delivery estimate, description, specs, what's included, instructions and FAQ
  - frequently bought together, related products, and a sticky mobile add-to-cart bar
  - Product and Breadcrumb JSON-LD
- **Kits:** 8 garden kits that can mix suppliers, with an Add All to Cart button that leaves partner items out of the cart.
- **Garden tools:**
  - Garden Finder (`/garden-finder`): 7 questions.
  - Build Your Garden (`/build-your-garden`): 5 steps ending in an editable shopping list.
- **Cart and checkout:** a slide-out cart and a `/cart` page, both with "You may also need" suggestions. Guest checkout leads to an order confirmation, and orders can be tracked at `/track-order`.
- **Accounts:** `/account` with sections for profile, orders, saved products, saved gardens, addresses, recently viewed, and recommendations.
- **Learn:** 8 categories and articles with product recommendations woven in.
- **Local and partners:** a Growing in Indianapolis page and a supplier page (`/suppliers`).
- **Site-wide:** a newsletter sign-up, policy pages, and footer links to the indymustardseed.com and .space sites.
- **SEO:** sitemap, robots, metadata, and Open Graph tags.

## Before launch checklist

- [ ] Replace the demo catalog and set `NEXT_PUBLIC_DEMO_MODE=false`
- [ ] Have the policy pages reviewed (they currently show a draft notice)
- [ ] Connect payments, the orders database, email, and payment webhooks
- [ ] Set `NEXT_PUBLIC_SITE_URL` and the social profile URLs
- [ ] Confirm photo licenses and credits. The lifestyle photos in `public/images/photos` were sourced from Unsplash (Unsplash License); record photographer credits before launch.
