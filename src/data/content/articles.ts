/**
 * Learn section content.
 *
 * Articles are structured data (not hard-coded JSX) so they can later move to a
 * CMS (Sanity, Contentful, MDX files, etc.) without changing page templates.
 * `products` blocks reference product IDs; the page resolves them through the
 * catalog repository, so recommendations stay in sync with the live catalog.
 */

export interface LearnCategory {
  slug: string;
  name: string;
  description: string;
  emoji: string;
}

export const learnCategories: LearnCategory[] = [
  { slug: "beginner-gardening", name: "Beginner Gardening", emoji: "🌱", description: "Start here: the fundamentals of growing anything." },
  { slug: "seed-starting", name: "Seed Starting", emoji: "🫘", description: "Grow your own transplants indoors." },
  { slug: "vegetable-growing", name: "Vegetable Growing", emoji: "🥕", description: "Plant, tend and harvest your own food." },
  { slug: "composting", name: "Composting", emoji: "♻️", description: "Turn scraps into rich soil." },
  { slug: "indoor-growing", name: "Indoor Growing", emoji: "💡", description: "Microgreens, herbs and houseplants inside." },
  { slug: "pollinators", name: "Pollinators", emoji: "🐝", description: "Gardens that feed bees and butterflies." },
  { slug: "small-space-gardening", name: "Small-Space Gardening", emoji: "🏙️", description: "Balconies, patios and windowsills." },
  { slug: "seasonal-gardening", name: "Seasonal Gardening", emoji: "🍂", description: "What to do in the garden, season by season." },
];

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "tip"; title: string; text: string }
  | { type: "products"; title: string; productIds: string[] };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  publishedAt: string;
  image: { src: string; alt: string };
  keywords: string[];
  body: ArticleBlock[];
  relatedKitSlugs: string[];
}

export const articles: Article[] = [
  {
    slug: "how-to-start-a-garden",
    title: "How to Start Your First Vegetable Garden",
    excerpt: "A no-stress plan for choosing a spot, building healthy soil and picking easy crops for your first season.",
    category: "beginner-gardening",
    readMinutes: 7,
    publishedAt: "2026-03-02",
    image: { src: "/images/photos/hero-raised-beds.jpg", alt: "Raised garden beds full of leafy vegetables" },
    keywords: ["beginner", "vegetable garden", "raised bed", "first garden", "start"],
    relatedKitSlugs: ["beginner-vegetable-garden", "apartment-garden-kit"],
    body: [
      { type: "p", text: "The best first garden is a small one. A single raised bed or a few containers that you can water and weed in ten minutes a day will teach you more—and feed you more—than a huge plot that gets away from you by July." },
      { type: "h2", text: "1. Find your sunniest spot" },
      { type: "p", text: "Most fruiting vegetables (tomatoes, peppers, squash, beans) need at least 6–8 hours of direct sun. Leafy greens and herbs can get by with 4–6. Spend a day checking your yard, patio or balcony every couple of hours to see where the sun actually falls." },
      { type: "h2", text: "2. Choose a growing method" },
      { type: "list", items: [
        "Raised beds warm up faster in spring, drain well and keep you from walking on (and compacting) the soil.",
        "Fabric grow bags are inexpensive, portable and perfect for balconies and driveways.",
        "In-ground beds are the cheapest per square foot but need more soil preparation.",
      ] },
      { type: "products", title: "Good places to start", productIds: ["p-raised-bed-metal", "p-grow-bags-10gal", "p-raised-bed-soil"] },
      { type: "h2", text: "3. Start with healthy soil" },
      { type: "p", text: "Fill raised beds and containers with a loose, compost-rich mix instead of heavy native soil. In the ground, loosen the top 8–12 inches and work in a few inches of compost. If you're unsure about your soil, a simple test tells you the pH and major nutrients before you buy amendments." },
      { type: "h2", text: "4. Pick five easy crops" },
      { type: "p", text: "Cherry tomatoes, lettuce, bush beans, zucchini and basil are forgiving and productive. Grow what you actually like to eat." },
      { type: "tip", title: "Know your frost dates", text: "Cool-season crops like lettuce and peas go in a few weeks before your last spring frost. Warm-season crops like tomatoes and basil wait until after it. In Central Indiana, the average last frost typically falls in mid-to-late April—check your local extension office for your exact area." },
      { type: "h2", text: "5. Water deeply, not daily" },
      { type: "p", text: "In beds, a deep soak 1–2 times a week encourages deep roots. Containers dry out faster and may need water daily in summer. Water the soil, not the leaves, and mulch to hold moisture." },
      { type: "products", title: "Helpful for week one", productIds: ["p-cherry-tomato-seeds", "p-watering-can", "p-trowel-set"] },
    ],
  },
  {
    slug: "vegetables-beginners-can-grow",
    title: "10 Vegetables Beginners Can Grow",
    excerpt: "Reliable, productive crops that forgive a missed watering or two.",
    category: "vegetable-growing",
    readMinutes: 6,
    publishedAt: "2026-03-10",
    image: { src: "/images/photos/vegetable-garden.jpg", alt: "Hand harvesting leafy greens" },
    keywords: ["easy vegetables", "beginner", "tomatoes", "lettuce", "beans", "zucchini"],
    relatedKitSlugs: ["beginner-vegetable-garden", "tomato-growing-kit"],
    body: [
      { type: "p", text: "These ten crops are popular with first-time gardeners because they germinate easily, grow quickly and produce a lot from a small space." },
      { type: "list", ordered: true, items: [
        "Cherry tomatoes – more forgiving than large slicers and wildly productive.",
        "Lettuce – harvest leaves in about a month; best in spring and fall.",
        "Bush beans – sow directly after frost; no trellis needed.",
        "Zucchini – one or two plants is plenty for a family.",
        "Radishes – ready in about four weeks; great for kids.",
        "Kale – handles cold and keeps producing into late fall.",
        "Peppers – love heat; great in containers.",
        "Cucumbers – grow them up a trellis to save space.",
        "Swiss chard – colorful, heat-tolerant greens all season.",
        "Basil – technically an herb, but you'll grow it next to your tomatoes anyway.",
      ] },
      { type: "products", title: "Seeds and supports for easy crops", productIds: ["p-cherry-tomato-seeds", "p-lettuce-mix-seeds", "p-basil-seeds", "p-cucumber-trellis"] },
      { type: "tip", title: "Start with transplants", text: "For tomatoes and peppers, buying healthy starts skips 6–8 weeks of indoor seed starting and gets you harvesting sooner." },
    ],
  },
  {
    slug: "how-to-start-seeds-indoors",
    title: "How to Start Seeds Indoors",
    excerpt: "Trays, light, warmth and timing—everything you need to grow stocky, healthy transplants.",
    category: "seed-starting",
    readMinutes: 8,
    publishedAt: "2026-02-01",
    image: { src: "/images/photos/seed-starting.jpg", alt: "Hand planting seedlings into a tray" },
    keywords: ["seed starting", "grow light", "heat mat", "seedlings", "indoors", "leggy"],
    relatedKitSlugs: ["seed-starting-kit"],
    body: [
      { type: "p", text: "Starting seeds indoors gives you a head start on the season, access to far more varieties than garden centers carry, and a lot of plants for very little money." },
      { type: "h2", text: "What you need" },
      { type: "list", items: [
        "A tray with cells or small pots, and a humidity dome.",
        "Fresh, fine-textured seed-starting mix (not garden soil).",
        "Light: a south window is rarely enough—an LED grow light prevents tall, floppy seedlings.",
        "Optional warmth: a heat mat speeds germination of tomatoes, peppers and basil.",
      ] },
      { type: "products", title: "A simple seed-starting setup", productIds: ["p-72-cell-tray", "p-heat-mat", "p-led-grow-light"] },
      { type: "h2", text: "Step by step" },
      { type: "list", ordered: true, items: [
        "Count back from your last frost date—most crops start 6–8 weeks before.",
        "Moisten the mix until it feels like a wrung-out sponge, then fill cells.",
        "Sow seeds about twice as deep as they are wide. Label everything.",
        "Cover with the dome and add bottom heat if using.",
        "When most seeds sprout, remove the dome and heat and turn on lights 14–16 hours a day, a few inches above the plants.",
        "Bottom water so the surface stays slightly dry, which helps prevent damping off.",
        "Pot up into larger containers when seedlings have their first true leaves.",
        "Harden off for 7–10 days by gradually increasing outdoor time before transplanting.",
      ] },
      { type: "tip", title: "Leggy seedlings?", text: "Tall, pale, stretched seedlings are almost always a sign of too little light. Lower your light or add a second fixture." },
    ],
  },
  {
    slug: "how-much-sun-does-a-vegetable-garden-need",
    title: "How Much Sun Does a Vegetable Garden Need?",
    excerpt: "Full sun, part sun, shade—what the labels mean and what you can grow in each.",
    category: "beginner-gardening",
    readMinutes: 5,
    publishedAt: "2026-03-18",
    image: { src: "/images/photos/sprout.jpg", alt: "A single seedling growing in sunlight" },
    keywords: ["sun", "shade", "light", "full sun", "part sun"],
    relatedKitSlugs: ["apartment-garden-kit", "indoor-herb-garden"],
    body: [
      { type: "p", text: "Sunlight is the one thing you can't add to a garden with a shopping cart—so it's worth understanding before you plant." },
      { type: "list", items: [
        "Full sun (6–8+ hours): tomatoes, peppers, squash, cucumbers, beans, corn, most herbs.",
        "Part sun (4–6 hours): lettuce, kale, chard, peas, beets, parsley, cilantro.",
        "Shade (under 4 hours): very limited for vegetables; try mint, some greens, or move food growing indoors under lights.",
      ] },
      { type: "tip", title: "Balcony gardeners", text: "South- and west-facing balconies usually get the most light. North-facing spaces are better for leafy greens and herbs than for fruiting crops." },
      { type: "products", title: "Grow where the sun doesn't reach", productIds: ["p-led-grow-light", "p-windowsill-herb-kit", "p-microgreen-seeds"] },
    ],
  },
  {
    slug: "raised-beds-vs-grow-bags",
    title: "Raised Beds vs Grow Bags",
    excerpt: "Cost, space, soil and lifespan compared—so you can choose the right container for your garden.",
    category: "small-space-gardening",
    readMinutes: 6,
    publishedAt: "2026-04-01",
    image: { src: "/images/photos/hands-soil.jpg", alt: "Hands planting a seedling in dark soil" },
    keywords: ["raised bed", "grow bag", "container", "small space", "apartment", "patio"],
    relatedKitSlugs: ["beginner-vegetable-garden", "apartment-garden-kit"],
    body: [
      { type: "p", text: "Both raised beds and fabric grow bags solve the same problems—poor native soil, drainage and back strain—but they suit different spaces and budgets." },
      { type: "h2", text: "Choose a raised bed if…" },
      { type: "list", items: ["You have a yard and plan to garden in the same spot for years.", "You want to grow sprawling crops or many plants together.", "You like a tidy, permanent look."] },
      { type: "h2", text: "Choose grow bags if…" },
      { type: "list", items: ["You rent or might move.", "You garden on a balcony, patio or driveway.", "You want the lowest start-up cost.", "You want to chase the sun by moving containers."] },
      { type: "tip", title: "Soil is the real cost", text: "A 4×2×1 ft bed holds about 8 cubic feet of soil. Bagged soil is heavy to ship, so for big beds it's often cheapest to buy compost or soil in bulk locally." },
      { type: "products", title: "Compare for yourself", productIds: ["p-raised-bed-metal", "p-grow-bags-10gal", "p-raised-bed-soil"] },
    ],
  },
  {
    slug: "composting-for-beginners",
    title: "Composting for Beginners",
    excerpt: "Greens, browns, air and water: the simple recipe for turning scraps into garden gold.",
    category: "composting",
    readMinutes: 6,
    publishedAt: "2026-04-15",
    image: { src: "/images/photos/soil-trowel.jpg", alt: "Trowel in rich dark compost" },
    keywords: ["compost", "worm", "scraps", "tumbler", "soil"],
    relatedKitSlugs: [],
    body: [
      { type: "p", text: "Compost is decomposed organic matter that improves almost any soil. Making it is mostly about balance." },
      { type: "list", items: [
        "Greens (nitrogen): fruit and vegetable scraps, coffee grounds, fresh grass clippings.",
        "Browns (carbon): dry leaves, shredded cardboard, straw.",
        "Aim for roughly two to three parts browns to one part greens by volume.",
        "Keep it as moist as a wrung-out sponge and turn it to add air.",
      ] },
      { type: "tip", title: "Leave these out", text: "Avoid meat, dairy, oily foods and pet waste in a home compost pile—they attract pests and can carry pathogens." },
      { type: "h2", text: "No yard? Try worms." },
      { type: "p", text: "A worm bin can live under a sink or in a closet and turns food scraps into worm castings, one of the best amendments for houseplants and containers." },
      { type: "products", title: "Composting tools", productIds: ["p-countertop-compost", "p-tumbler-composter", "p-worm-bin"] },
    ],
  },
  {
    slug: "growing-microgreens-indoors",
    title: "Growing Microgreens Indoors",
    excerpt: "The fastest way to grow your own food—harvest in 7–14 days on your kitchen counter.",
    category: "indoor-growing",
    readMinutes: 5,
    publishedAt: "2026-01-12",
    image: { src: "/images/photos/seedling-pots.jpg", alt: "Young seedlings growing in pots" },
    keywords: ["microgreens", "indoor", "winter", "apartment", "kids"],
    relatedKitSlugs: ["microgreens-starter-kit", "kids-garden-kit"],
    body: [
      { type: "p", text: "Microgreens are young vegetable and herb seedlings harvested just after their first leaves open. They're flavorful, fast and perfect for winter or apartments." },
      { type: "list", ordered: true, items: [
        "Fill a shallow tray with 1 inch of moist potting mix or a growing mat.",
        "Scatter seeds thickly and evenly; press them in.",
        "Cover with another tray for 2–3 days to keep them dark and moist.",
        "Uncover and give them bright light 12–16 hours a day.",
        "Bottom water and harvest with scissors when 2–3 inches tall.",
      ] },
      { type: "products", title: "Microgreen essentials", productIds: ["p-microgreen-seeds", "p-shallow-trays", "p-led-grow-light"] },
    ],
  },
  {
    slug: "planting-for-pollinators-in-the-midwest",
    title: "Planting for Pollinators in the Midwest",
    excerpt: "How to add blooms, shelter and native plants that support bees and butterflies.",
    category: "pollinators",
    readMinutes: 6,
    publishedAt: "2026-05-01",
    image: { src: "/images/photos/flower-garden.jpg", alt: "Garden path lined with blooming flowers" },
    keywords: ["pollinators", "bees", "butterflies", "native plants", "wildflowers", "coneflower"],
    relatedKitSlugs: ["pollinator-garden-kit"],
    body: [
      { type: "p", text: "A pollinator garden doesn't need to be big. Even a sunny 4×8 ft patch of flowering plants can make a difference." },
      { type: "list", items: [
        "Plant in groups of three or more of the same flower so pollinators can find them.",
        "Aim for something blooming from spring through fall.",
        "Include native plants such as coneflower, black-eyed Susan, bee balm and milkweed.",
        "Skip pesticides, and leave some stems and leaves standing in fall for overwintering insects.",
      ] },
      { type: "products", title: "Start your pollinator patch", productIds: ["p-coneflower-plant", "p-zinnia-seeds", "p-pollinator-seed-mix"] },
    ],
  },
  {
    slug: "fall-garden-checklist",
    title: "Fall Garden Checklist for Central Indiana",
    excerpt: "Plant garlic, protect soil and set yourself up for an easier spring.",
    category: "seasonal-gardening",
    readMinutes: 4,
    publishedAt: "2026-09-15",
    image: { src: "/images/photos/soil-trowel.jpg", alt: "Trowel in dark soil" },
    keywords: ["fall", "autumn", "garlic", "seasonal", "indianapolis", "cover crop"],
    relatedKitSlugs: [],
    body: [
      { type: "list", items: [
        "Harvest remaining warm-season crops before the first frost (often mid-to-late October around Indianapolis).",
        "Plant garlic about 2–4 weeks after your first frost for next summer's harvest.",
        "Spread compost or shredded leaves over empty beds to protect soil over winter.",
        "Clean and sharpen tools before storing them.",
        "Bring tender herbs like rosemary indoors to a bright window.",
        "Start a compost pile with all those fallen leaves.",
      ] },
      { type: "products", title: "Fall helpers", productIds: ["p-tumbler-composter", "p-pruning-shears", "p-soil-test-kit"] },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getLearnCategory(slug: string) {
  return learnCategories.find((c) => c.slug === slug);
}
