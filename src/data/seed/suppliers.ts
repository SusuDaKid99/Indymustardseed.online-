import "server-only";
import type { Supplier } from "@/server/suppliers/types";

/**
 * DEVELOPMENT SEED DATA – fictional placeholder suppliers.
 * These are NOT real companies or partnerships. Replace with real supplier
 * records (via the admin API / database) before launch.
 */
export const seedSuppliers: Supplier[] = [
  {
    id: "sup-demo-seeds",
    name: "Demo Seed Supplier",
    channels: ["dropship"],
    feed: { kind: "manual" },
    contactEmail: "supplier@example.com",
    notes: "Placeholder supplier for development only.",
    isDemo: true,
  },
  {
    id: "sup-demo-grow",
    name: "Demo Grow Supply Distributor",
    channels: ["dropship", "wholesale"],
    feed: { kind: "csv", url: "https://feeds.example.com/demo-grow.csv" },
    contactEmail: "supplier@example.com",
    notes: "Example of a CSV feed integration target. Not a real feed.",
    isDemo: true,
  },
  {
    id: "sup-demo-nursery",
    name: "Demo Nursery",
    channels: ["dropship"],
    feed: { kind: "manual" },
    contactEmail: "supplier@example.com",
    notes: "Live plants. Ships seasonally (placeholder).",
    isDemo: true,
  },
  {
    id: "sup-demo-tools",
    name: "Demo Tool Distributor",
    channels: ["dropship"],
    feed: { kind: "api", baseUrl: "https://api.example.com" },
    contactEmail: "supplier@example.com",
    notes: "Example of a REST API integration target. Not a real API.",
    isDemo: true,
  },
  {
    id: "sup-demo-affiliate",
    name: "Demo Affiliate Network",
    channels: ["affiliate"],
    feed: { kind: "manual" },
    contactEmail: "supplier@example.com",
    notes: "Placeholder affiliate program. Links point to example.com.",
    isDemo: true,
  },
];
