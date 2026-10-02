export const accountSections = [
  { id: "profile", label: "Profile" },
  { id: "orders", label: "Orders" },
  { id: "saved", label: "Saved products" },
  { id: "gardens", label: "Saved gardens" },
  { id: "addresses", label: "Addresses" },
  { id: "recently-viewed", label: "Recently viewed" },
  { id: "recommendations", label: "Garden recommendations" },
] as const;

export type AccountSection = (typeof accountSections)[number]["id"];
