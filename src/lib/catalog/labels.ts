import type {
  ExperienceLevel,
  FulfillmentType,
  GrowingSpace,
  IndoorOutdoor,
  InventoryStatus,
  PlantType,
  ProductTag,
  SunRequirement,
  VerifiedClaim,
} from "./types";

/** Human-readable labels for enum-like catalog values. */

export const tagLabels: Record<ProductTag, string> = {
  "beginner-friendly": "Beginner Friendly",
  indoor: "Indoor",
  outdoor: "Outdoor",
  "food-growing": "Food Growing",
  "pollinator-friendly": "Pollinator Friendly",
  "small-space": "Small Space",
  "kid-friendly": "Kid Friendly",
};

export const claimLabels: Record<VerifiedClaim, string> = {
  "made-in-usa": "Made in USA",
  "usda-organic": "USDA Organic",
  "omri-listed": "OMRI Listed",
  "non-gmo-project": "Non-GMO Project Verified",
};

export const availabilityLabels: Record<InventoryStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
  preorder: "Pre-order",
  external: "Sold by partner",
};

export const fulfillmentLabels: Record<FulfillmentType, string> = {
  affiliate: "Partner retailer",
  dropship: "Ships from supplier",
  wholesale: "Ships from Indy Mustard Seed",
  "house-brand": "Indy Mustard Seed brand",
};

export const indoorOutdoorLabels: Record<IndoorOutdoor, string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  both: "Indoor & outdoor",
};

export const experienceLabels: Record<ExperienceLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  experienced: "Experienced",
};

export const plantTypeLabels: Record<PlantType, string> = {
  vegetable: "Vegetables",
  herb: "Herbs",
  flower: "Flowers",
  fruit: "Fruit",
  houseplant: "Houseplants",
  succulent: "Succulents",
  pollinator: "Pollinator plants",
  microgreen: "Microgreens",
};

export const spaceLabels: Record<GrowingSpace, string> = {
  balcony: "Balcony",
  patio: "Patio",
  backyard: "Backyard",
  "raised-bed": "Raised bed",
  indoor: "Indoors",
  windowsill: "Windowsill",
};

export const sunLabels: Record<SunRequirement, string> = {
  "full-sun": "Full sun (6+ hrs)",
  "part-sun": "Part sun (3–6 hrs)",
  shade: "Shade",
  "low-light": "Low light",
  "grow-light": "Grow light",
};
