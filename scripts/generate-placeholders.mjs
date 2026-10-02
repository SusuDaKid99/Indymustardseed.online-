/**
 * Generates themed SVG placeholder images for the DEMO catalog.
 *
 *   npm run placeholders
 *
 * Reads product/kit slugs from the seed data files and writes:
 *   public/images/products/<slug>.svg and <slug>-2.svg
 *   public/images/kits/<slug>.svg
 *
 * Every image is clearly labelled "Demo image". Replace them with real
 * supplier photography when real products are imported.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const palettes = {
  seeds: { bg: ["#f6efdf", "#e9dcc0"], accent: "#3f7d3a", motif: "packet" },
  plants: { bg: ["#e8f2e3", "#cfe3c6"], accent: "#2f5d34", motif: "pot" },
  garden: { bg: ["#f3ece2", "#e2d3bf"], accent: "#7a5434", motif: "tool" },
  "indoor-growing": { bg: ["#eef3e8", "#d6e6cf"], accent: "#2c4f37", motif: "light" },
  composting: { bg: ["#efe6da", "#d9c6ad"], accent: "#5b3f28", motif: "bin" },
  kits: { bg: ["#f6efdf", "#dbe9d2"], accent: "#2f5d34", motif: "box" },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function wrap(text, max = 24) {
  const lines = [];
  let line = "";
  for (const w of text.split(/\s+/)) {
    if ((line + " " + w).trim().length > max && line) {
      lines.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

const motifs = {
  packet: (a) => `
    <rect x="290" y="150" width="220" height="300" rx="14" fill="#fffaf0" stroke="${a}" stroke-width="6"/>
    <path d="M290 210h220" stroke="${a}" stroke-width="6"/>
    <circle cx="400" cy="325" r="62" fill="${a}" opacity=".18"/>
    <path d="M400 375v-70c0-30-25-50-55-50 0 32 22 52 55 52m0 12c0-28 22-46 52-46 0 30-22 46-52 46" fill="none" stroke="${a}" stroke-width="7" stroke-linecap="round"/>`,
  pot: (a) => `
    <path d="M400 310c0-60-40-100-100-105 0 60 40 100 100 105Zm0 0c0-60 40-100 100-105 0 60-40 100-100 105Z" fill="${a}" opacity=".85"/>
    <path d="M400 310V180" stroke="${a}" stroke-width="8" stroke-linecap="round"/>
    <path d="M400 210c-25-40-15-70 0-90 15 20 25 50 0 90Z" fill="${a}"/>
    <path d="M300 310h200l-25 150h-150Z" fill="#b9825a"/>
    <rect x="290" y="300" width="220" height="30" rx="8" fill="#a06d47"/>`,
  tool: (a) => `
    <rect x="385" y="130" width="30" height="210" rx="15" fill="#a06d47"/>
    <path d="M340 340h120l-15 110c-5 30-85 30-90 0Z" fill="${a}"/>
    <rect x="370" y="325" width="60" height="25" rx="6" fill="${a}" opacity=".7"/>`,
  light: (a) => `
    <rect x="230" y="150" width="340" height="40" rx="20" fill="${a}"/>
    <path d="M260 195l-40 120M400 195v120M540 195l40 120" stroke="#e8b84a" stroke-width="10" stroke-linecap="round" opacity=".7"/>
    <rect x="270" y="360" width="260" height="80" rx="16" fill="#fffaf0" stroke="${a}" stroke-width="6"/>
    <path d="M320 360c0-40 20-60 40-70M400 360v-80M480 360c0-40-20-60-40-70" stroke="#4d8b45" stroke-width="8" stroke-linecap="round" fill="none"/>`,
  bin: (a) => `
    <rect x="290" y="190" width="220" height="250" rx="22" fill="${a}"/>
    <rect x="275" y="170" width="250" height="40" rx="14" fill="${a}" opacity=".8"/>
    <path d="M360 300l40-40 40 40M400 260v100" stroke="#fffaf0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  box: (a) => `
    <path d="M260 230l140-60 140 60v170l-140 60-140-60Z" fill="#d9b88f"/>
    <path d="M260 230l140 60 140-60M400 290v170" stroke="#a06d47" stroke-width="6" fill="none"/>
    <path d="M400 230c0-40-25-70-70-75 0 45 30 70 70 75Zm0 0c0-40 25-70 70-75 0 45-30 70-70 75Z" fill="${a}"/>`,
};

function svg({ name, category, variant = 1 }) {
  const p = palettes[category] ?? palettes.garden;
  const [c1, c2] = variant === 2 ? [p.bg[1], p.bg[0]] : p.bg;
  const text = wrap(name)
    .map((l, i) => `<text x="400" y="${570 + i * 46}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="38" font-weight="600" fill="#1f3a26">${esc(l)}</text>`)
    .join("");
  const transform = variant === 2 ? `transform="translate(400 330) scale(1.3) translate(-400 -330)"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="${esc(name)} (demo image)">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <circle cx="660" cy="130" r="170" fill="#ffffff" opacity=".35"/>
  <circle cx="120" cy="720" r="200" fill="#ffffff" opacity=".25"/>
  <g ${transform}>${motifs[p.motif](p.accent)}</g>
  ${variant === 1 ? text : ""}
  <rect x="604" y="728" width="172" height="44" rx="22" fill="#1f3a26" opacity=".85"/>
  <text x="690" y="757" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#ffffff">Demo image</text>
</svg>
`;
}

function parseProducts(source) {
  const entries = [];
  const re = /name:\s*"([^"]+)",\s*\n\s*slug:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(source))) {
    const cat = source.slice(m.index, m.index + 1500).match(/category:\s*"([^"]+)"/);
    entries.push({ name: m[1], slug: m[2], category: cat?.[1] });
  }
  return entries;
}

function parseKits(source) {
  const entries = [];
  const re = /slug:\s*"([^"]+)",\s*\n\s*name:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(source))) entries.push({ slug: m[1], name: m[2], category: "kits" });
  return entries;
}

const products = parseProducts(read("src/data/seed/products.ts"));
const kits = parseKits(read("src/data/seed/kits.ts"));

const productDir = join(root, "public/images/products");
const kitDir = join(root, "public/images/kits");
mkdirSync(productDir, { recursive: true });
mkdirSync(kitDir, { recursive: true });

for (const p of products) {
  writeFileSync(join(productDir, `${p.slug}.svg`), svg({ ...p, variant: 1 }));
  writeFileSync(join(productDir, `${p.slug}-2.svg`), svg({ ...p, variant: 2 }));
}
for (const k of kits) writeFileSync(join(kitDir, `${k.slug}.svg`), svg(k));

console.log(`Generated ${products.length * 2} product and ${kits.length} kit placeholder images.`);
