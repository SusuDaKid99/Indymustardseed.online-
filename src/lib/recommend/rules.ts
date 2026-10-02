import type { ExperienceLevel, GrowingSpace, PlantType, ProductCardData, ResolvedKit } from "@/lib/catalog/types";

/**
 * Rule-based recommendations for the Garden Finder and Build Your Garden tools.
 *
 * Rules select products by ATTRIBUTES (category, subcategory, tags, growing
 * space…) instead of hard-coded IDs, so they keep working as the catalog is
 * replaced with real supplier products. Swap this module for a smarter
 * recommender later without changing the UI.
 */

/* ------------------------------ Build Your Garden ------------------------------ */

export type BuildSpace = "balcony" | "patio" | "backyard" | "raised-bed" | "indoor";
export type BuildGoal = "vegetables" | "herbs" | "fruit" | "flowers" | "pollinators";
export type BudgetBand = "under-50" | "50-100" | "100-250" | "250-plus";

export const budgetBands: { value: BudgetBand; label: string; max: number }[] = [
  { value: "under-50", label: "Under $50", max: 50 },
  { value: "50-100", label: "$50–$100", max: 100 },
  { value: "100-250", label: "$100–$250", max: 250 },
  { value: "250-plus", label: "$250+", max: 600 },
];

interface Slot {
  key: string;
  reason: string;
  priority: number;
  match: (p: ProductCardData) => boolean;
}

const sub = (category: string, subcategory: string) => (p: ProductCardData) =>
  (p.category === category && p.subcategory === subcategory) ||
  p.alsoIn.some((a) => a.category === category && a.subcategory === subcategory);

function spaceSlots(space: BuildSpace): Slot[] {
  switch (space) {
    case "balcony":
    case "patio":
      return [
        { key: "container", reason: "Lightweight containers sized for a balcony or patio.", priority: 100, match: sub("garden", "grow-bags") },
        { key: "soil", reason: "Containers need a loose mix—not garden soil.", priority: 95, match: sub("composting", "soil-amendments") },
        { key: "water", reason: "Containers dry out quickly; a can makes daily watering easy.", priority: 60, match: sub("garden", "watering") },
      ];
    case "backyard":
      return [
        { key: "bed", reason: "A raised bed gives you great soil without digging up the lawn.", priority: 100, match: sub("garden", "raised-beds") },
        { key: "soil", reason: "Fill your bed with a compost-rich blend.", priority: 95, match: sub("composting", "soil-amendments") },
        { key: "tools", reason: "Every outdoor garden needs a good trowel.", priority: 55, match: sub("garden", "hand-tools") },
      ];
    case "raised-bed":
      return [
        { key: "soil", reason: "Top up or fill your bed with a compost-rich blend.", priority: 100, match: sub("composting", "soil-amendments") },
        { key: "trellis", reason: "Grow vertically to double your bed's harvest.", priority: 70, match: sub("garden", "trellises") },
        { key: "tools", reason: "A trowel for planting and weeding.", priority: 55, match: sub("garden", "hand-tools") },
      ];
    case "indoor":
      return [
        { key: "light", reason: "Indoor food plants need more light than most windows provide.", priority: 100, match: (p) => sub("indoor-growing", "grow-lights")(p) },
        { key: "tray", reason: "Trays keep indoor growing tidy.", priority: 70, match: (p) => sub("indoor-growing", "grow-trays")(p) },
      ];
  }
}

function goalSlots(goal: BuildGoal, indoor: boolean): Slot[] {
  switch (goal) {
    case "vegetables":
      return indoor
        ? [{ key: "veg-indoor", reason: "Microgreens are the easiest vegetables to grow indoors.", priority: 90, match: sub("indoor-growing", "microgreens") }]
        : [
            { key: "veg-seeds", reason: "Easy, productive vegetable seeds.", priority: 90, match: (p) => sub("seeds", "vegetables")(p) && !p.isAffiliate },
            { key: "veg-start", reason: "A head start with ready-to-plant vegetables.", priority: 75, match: sub("plants", "vegetable-starts") },
            { key: "support", reason: "Support keeps tomatoes and vines healthy and off the ground.", priority: 65, match: sub("garden", "plant-supports") },
            { key: "fertilizer", reason: "Vegetables are hungry—feed them through the season.", priority: 50, match: sub("composting", "fertilizers") },
          ];
    case "herbs":
      return indoor
        ? [{ key: "herb-kit", reason: "A complete herb kit for a sunny window.", priority: 90, match: sub("indoor-growing", "herb-kits") }]
        : [
            { key: "herb-seeds", reason: "Five easy kitchen herbs from seed.", priority: 90, match: sub("seeds", "herbs") },
            { key: "herb-plant", reason: "An established herb for instant harvests.", priority: 70, match: sub("plants", "herbs") },
          ];
    case "fruit":
      return [
        { key: "fruit", reason: "Compact fruit that suits containers and small yards.", priority: 90, match: sub("plants", "fruit-plants") },
        { key: "soil-test", reason: "Fruit like blueberries need the right soil pH—test first.", priority: 60, match: sub("composting", "soil-testing") },
      ];
    case "flowers":
      return [{ key: "flowers", reason: "Fast, colorful flowers for cutting.", priority: 85, match: sub("seeds", "flowers") }];
    case "pollinators":
      return [
        { key: "pollinator-plant", reason: "Native perennials pollinators love.", priority: 88, match: sub("plants", "pollinator-plants") },
        { key: "pollinator-seed", reason: "Annual blooms to feed pollinators all summer.", priority: 80, match: (p) => sub("seeds", "pollinators")(p) && !p.isAffiliate },
      ];
  }
}

function experienceSlots(level: ExperienceLevel, indoor: boolean): Slot[] {
  if (level === "beginner") {
    return indoor ? [] : [{ key: "water", reason: "Consistent watering is the #1 beginner win.", priority: 58, match: sub("garden", "watering") }];
  }
  if (level === "intermediate") {
    return [
      { key: "soil-test", reason: "Test before you amend to grow smarter.", priority: 52, match: sub("composting", "soil-testing") },
      { key: "castings", reason: "Build soil biology with worm castings.", priority: 45, match: (p) => sub("composting", "soil-amendments")(p) && /castings/i.test(p.name) },
    ];
  }
  return [
    { key: "seed-tray", reason: "Start your own varieties from seed.", priority: 62, match: sub("seeds", "seed-trays") },
    { key: "heat", reason: "Bottom heat for reliable germination.", priority: 50, match: sub("seeds", "heat-mats") },
    { key: "blocker", reason: "Soil blocks mean stronger, plastic-free transplants.", priority: 40, match: sub("seeds", "soil-blockers") },
  ];
}

export interface BuildAnswers {
  space: BuildSpace;
  goals: BuildGoal[];
  experience: ExperienceLevel;
  budget: BudgetBand;
}

export interface PlanItem {
  product: ProductCardData;
  quantity: number;
  reason: string;
}

export function buildGardenPlan(cards: ProductCardData[], answers: BuildAnswers) {
  const indoor = answers.space === "indoor";
  const budget = budgetBands.find((b) => b.value === answers.budget)!;
  const slots = [
    ...spaceSlots(answers.space),
    ...answers.goals.flatMap((g) => goalSlots(g, indoor)),
    ...experienceSlots(answers.experience, indoor),
  ].sort((a, b) => b.priority - a.priority);

  // Only products that can go through store checkout – so "Add all to cart" is honest.
  const pool = cards
    .filter((p) => p.purchasable && !p.isAffiliate)
    .sort((a, b) => b.popularity - a.popularity);

  const chosen: PlanItem[] = [];
  const seenKeys = new Set<string>();
  let total = 0;
  for (const slot of slots) {
    if (seenKeys.has(slot.key)) continue;
    const candidates = pool.filter((p) => slot.match(p) && !chosen.some((c) => c.product.id === p.id));
    // Prefer items suited to the chosen space when the attribute is present.
    const product =
      candidates.find((p) => p.attributes.growingSpaces.length === 0 || p.attributes.growingSpaces.includes(answers.space as GrowingSpace)) ??
      candidates[0];
    if (!product) continue;
    const quantity = slot.key === "soil" && (answers.space === "backyard" || answers.space === "raised-bed") ? 3 : 1;
    const lineTotal = product.price * quantity;
    if (total + lineTotal > budget.max) continue;
    seenKeys.add(slot.key);
    chosen.push({ product, quantity, reason: slot.reason });
    total += lineTotal;
  }
  return { items: chosen, total: Math.round(total * 100) / 100, budgetMax: budget.max };
}

/* ------------------------------- Garden Finder ------------------------------- */

export interface FinderAnswers {
  location: "backyard" | "balcony" | "home" | "community" | "classroom";
  space: "tiny" | "small" | "medium" | "large";
  setting: "indoor" | "outdoor" | "both";
  sun: "full" | "part" | "shade" | "unsure";
  goal: "vegetables" | "herbs" | "fruit" | "pollinators" | "houseplants" | "microgreens";
  experience: ExperienceLevel;
  budget: BudgetBand;
}

export interface FinderResult {
  headline: string;
  categories: { label: string; href: string; reason: string }[];
  kits: ResolvedKit[];
  tips: string[];
  buildLink: string;
}

const goalToPlantType: Record<FinderAnswers["goal"], PlantType> = {
  vegetables: "vegetable",
  herbs: "herb",
  fruit: "fruit",
  pollinators: "pollinator",
  houseplants: "houseplant",
  microgreens: "microgreen",
};

export function recommendFromFinder(kits: ResolvedKit[], a: FinderAnswers): FinderResult {
  const indoor = a.setting === "indoor" || a.location === "home" || a.location === "classroom";
  const lowLight = a.sun === "shade" || (indoor && a.sun !== "full");
  const categories: FinderResult["categories"] = [];
  const tips: string[] = [];

  const add = (label: string, href: string, reason: string) => {
    if (!categories.some((c) => c.href === href)) categories.push({ label, href, reason });
  };

  // Goal-driven categories
  switch (a.goal) {
    case "vegetables":
      if (indoor) add("Microgreen Supplies", "/shop/indoor-growing/microgreens", "The fastest, most reliable indoor vegetables.");
      else add("Vegetable Seeds", "/shop/seeds/vegetables", "Start with easy crops like cherry tomatoes and lettuce.");
      if (!indoor) add("Vegetable Starts", "/shop/plants/vegetable-starts", "Skip seed starting with healthy transplants.");
      break;
    case "herbs":
      add(indoor ? "Herb-Growing Kits" : "Herb Seeds", indoor ? "/shop/indoor-growing/herb-kits" : "/shop/seeds/herbs", "Herbs are the most useful first crop for any cook.");
      break;
    case "fruit":
      add("Fruit Plants", "/shop/plants/fruit-plants", "Compact berries suit patios and small yards.");
      add("Soil Testing", "/shop/composting/soil-testing", "Fruit is picky about soil pH—test first.");
      break;
    case "pollinators":
      add("Pollinator Plants", "/shop/plants/pollinator-plants", "Native perennials come back year after year.");
      add("Pollinator Seeds", "/shop/seeds/pollinators", "Seed mixes cover more ground for less money.");
      break;
    case "houseplants":
      add("Houseplants", "/shop/plants/houseplants", lowLight ? "Pothos and snake plants tolerate lower light." : "Choose plants that match your window light.");
      if (a.sun === "full") add("Succulents", "/shop/plants/succulents", "Succulents love bright, sunny windows.");
      break;
    case "microgreens":
      add("Microgreen Supplies", "/shop/indoor-growing/microgreens", "Harvest in 7–14 days.");
      add("Grow Trays", "/shop/indoor-growing/grow-trays", "Shallow trays make watering clean and easy.");
      break;
  }

  // Space-driven categories
  if (!indoor) {
    if (a.location === "balcony" || a.space === "tiny" || a.space === "small") {
      add("Grow Bags", "/shop/garden/grow-bags", "Containers turn any sunny spot into a garden.");
    } else {
      add("Raised-Bed Supplies", "/shop/garden/raised-beds", "Beds give great soil without digging up the lawn.");
    }
    add("Soil Amendments", "/shop/composting/soil-amendments", "Good soil is the foundation of every garden.");
  }
  if (indoor || lowLight) add("Grow Lights", "/shop/indoor-growing/grow-lights", "Supplement low light so plants stay compact and productive.");
  if (a.experience === "experienced") add("Seed Trays", "/shop/seeds/seed-trays", "Grow unusual varieties from seed.");

  // Tips
  if (a.sun === "unsure") tips.push("Track sunlight for a day: check every two hours and note when the spot is in direct sun.");
  if (a.sun === "shade" && a.goal === "vegetables") tips.push("Fruiting crops like tomatoes need 6+ hours of sun. In shade, focus on leafy greens—or grow indoors under lights.");
  if (a.location === "balcony") tips.push("Check weight limits on balconies—wet soil is heavy. Fabric grow bags are lighter than ceramic pots.");
  if (a.experience === "beginner") tips.push("Start smaller than you think. Three containers you love beat a big bed you can't keep up with.");
  if (a.budget === "under-50") tips.push("On a tight budget, seeds stretch furthest—one packet can grow dozens of plants.");
  if (a.location === "community") tips.push("Ask your community garden about shared tools and compost before buying your own.");

  // Score kits
  const plantType = goalToPlantType[a.goal];
  const budgetMax = budgetBands.find((b) => b.value === a.budget)!.max;
  const scored = kits
    .map((k) => {
      let s = 0;
      if (k.goals.includes(plantType)) s += 5;
      if (indoor && k.spaces.some((sp) => sp === "indoor" || sp === "windowsill")) s += 3;
      if (!indoor && k.spaces.some((sp) => sp !== "indoor" && sp !== "windowsill")) s += 2;
      if (a.location === "balcony" && k.spaces.includes("balcony")) s += 2;
      if (k.experience === a.experience) s += 1;
      if (k.total <= budgetMax) s += 2;
      else s -= 2;
      return { k, s };
    })
    .filter((x) => x.s >= 4)
    .sort((x, y) => y.s - x.s)
    .slice(0, 3)
    .map((x) => x.k);

  const where = indoor ? "indoors" : a.location === "balcony" ? "on your balcony or patio" : "outside";
  const headline = `Grow ${a.goal === "pollinators" ? "a pollinator garden" : a.goal} ${where}`;

  const buildSpace: BuildSpace = indoor ? "indoor" : a.location === "balcony" ? "balcony" : a.space === "medium" || a.space === "large" ? "backyard" : "patio";
  const buildGoal: BuildGoal | undefined =
    a.goal === "vegetables" || a.goal === "microgreens" ? "vegetables" : a.goal === "herbs" ? "herbs" : a.goal === "fruit" ? "fruit" : a.goal === "pollinators" ? "pollinators" : undefined;
  const params = new URLSearchParams({ space: buildSpace, level: a.experience, budget: a.budget });
  if (buildGoal) params.set("grow", buildGoal);

  return { headline, categories: categories.slice(0, 5), kits: scored, tips, buildLink: `/build-your-garden?${params}` };
}
