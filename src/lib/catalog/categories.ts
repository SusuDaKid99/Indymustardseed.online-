import type { Category } from "./types";

/**
 * Store category tree. URL structure: /shop/[category]/[subcategory]
 * Adding a category here automatically adds it to the mega menu, sitemap and shop routes.
 */
export const categories: Category[] = [
  {
    slug: "seeds",
    name: "Seeds & Starting",
    shortName: "Seeds",
    emoji: "🌱",
    description: "Seeds, trays, domes, heat mats and lights to get your garden going from day one.",
    image: { src: "/images/photos/seed-starting.jpg", alt: "Hand planting seedlings in a black seed-starting tray" },
    subcategories: [
      { slug: "vegetables", name: "Vegetable Seeds", description: "Tomatoes, lettuce, peppers, beans and more." },
      { slug: "herbs", name: "Herb Seeds", description: "Basil, cilantro, parsley, dill and other kitchen herbs." },
      { slug: "flowers", name: "Flower Seeds", description: "Cut flowers and color for beds and borders." },
      { slug: "pollinators", name: "Pollinator Seeds", description: "Seed mixes that feed bees, butterflies and other pollinators." },
      { slug: "seed-trays", name: "Seed Trays", description: "Cell trays and flats for starting seeds indoors." },
      { slug: "humidity-domes", name: "Humidity Domes", description: "Keep moisture in while seeds germinate." },
      { slug: "seedling-pots", name: "Seedling Pots", description: "Pots for transplanting and potting up." },
      { slug: "soil-blockers", name: "Soil Blockers", description: "Make plastic-free soil blocks for seedlings." },
      { slug: "heat-mats", name: "Heat Mats", description: "Gentle bottom heat for faster germination." },
      { slug: "grow-lights", name: "Grow Lights", description: "Light for strong, stocky seedlings." },
    ],
  },
  {
    slug: "plants",
    name: "Plants",
    shortName: "Plants",
    emoji: "🪴",
    description: "Live houseplants, herbs, vegetable starts and pollinator plants shipped ready to grow.",
    image: { src: "/images/photos/houseplants.jpg", alt: "A collection of leafy houseplants in white pots" },
    subcategories: [
      { slug: "houseplants", name: "Houseplants", description: "Easy-care plants for every room." },
      { slug: "herbs", name: "Herb Plants", description: "Established herbs ready for the kitchen garden." },
      { slug: "vegetable-starts", name: "Vegetable Starts", description: "Skip the seed stage with healthy transplants." },
      { slug: "succulents", name: "Succulents", description: "Low-water plants for sunny windows." },
      { slug: "fruit-plants", name: "Fruit Plants", description: "Berries and small fruit for yards and patios." },
      { slug: "pollinator-plants", name: "Pollinator Plants", description: "Perennials that support pollinators." },
    ],
  },
  {
    slug: "garden",
    name: "Garden Supplies",
    shortName: "Garden",
    emoji: "🥕",
    description: "Grow bags, raised beds, supports, watering and tools for productive outdoor gardens.",
    image: { src: "/images/photos/vegetable-garden.jpg", alt: "Hand harvesting leafy greens in a vegetable garden" },
    subcategories: [
      { slug: "grow-bags", name: "Grow Bags", description: "Breathable fabric containers for any space." },
      { slug: "raised-beds", name: "Raised-Bed Supplies", description: "Beds, kits and accessories." },
      { slug: "trellises", name: "Trellises", description: "Grow vertically and save space." },
      { slug: "plant-supports", name: "Plant Supports", description: "Cages, stakes and ties." },
      { slug: "watering", name: "Watering Supplies", description: "Cans, hoses and irrigation." },
      { slug: "pruning-tools", name: "Pruning Tools", description: "Shears and snips for clean cuts." },
      { slug: "hand-tools", name: "Hand Tools", description: "Trowels, weeders and more." },
      { slug: "accessories", name: "Garden Accessories", description: "Kneelers, labels, gloves and helpful extras." },
    ],
  },
  {
    slug: "indoor-growing",
    name: "Indoor Growing",
    shortName: "Indoor Growing",
    emoji: "💡",
    description: "Microgreens, grow lights, hydroponics and countertop gardens for year-round harvests.",
    image: { src: "/images/photos/seedling-pots.jpg", alt: "Overhead view of young seedlings in round pots" },
    subcategories: [
      { slug: "microgreens", name: "Microgreen Supplies", description: "Seeds and media for fast indoor harvests." },
      { slug: "grow-trays", name: "Grow Trays", description: "Durable trays for microgreens and seedlings." },
      { slug: "grow-lights", name: "Grow Lights", description: "LED lighting for plants indoors." },
      { slug: "hydroponics", name: "Hydroponic Supplies", description: "Nutrients and parts for soil-free growing." },
      { slug: "herb-kits", name: "Herb-Growing Kits", description: "Everything to grow herbs on a windowsill." },
      { slug: "indoor-systems", name: "Indoor Garden Systems", description: "All-in-one countertop gardens." },
    ],
  },
  {
    slug: "composting",
    name: "Soil & Compost",
    shortName: "Composting",
    emoji: "♻️",
    description: "Turn scraps into soil. Composters, worm bins, amendments, fertilizers and soil tests.",
    image: { src: "/images/photos/soil-trowel.jpg", alt: "Garden trowel resting in dark compost-rich soil" },
    subcategories: [
      { slug: "composting-equipment", name: "Composting Equipment", description: "Bins, tumblers and kitchen caddies." },
      { slug: "worm-composting", name: "Worm Composting", description: "Vermicomposting bins and supplies." },
      { slug: "soil-amendments", name: "Soil Amendments", description: "Build healthier soil." },
      { slug: "fertilizers", name: "Fertilizers", description: "Feed plants through the season." },
      { slug: "soil-testing", name: "Soil Testing", description: "Know your soil before you amend it." },
    ],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getSubcategory(categorySlug: string, subSlug: string) {
  return getCategory(categorySlug)?.subcategories.find((s) => s.slug === subSlug);
}

export function categoryHref(category: string, subcategory?: string) {
  return subcategory ? `/shop/${category}/${subcategory}` : `/shop/${category}`;
}
