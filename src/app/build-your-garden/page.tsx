import type { Metadata } from "next";
import { GardenBuilder, type BuildInitial } from "@/components/tools/GardenBuilder";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { ExperienceLevel } from "@/lib/catalog/types";
import { budgetBands, type BudgetBand, type BuildGoal, type BuildSpace } from "@/lib/recommend/rules";
import { getAllCards } from "@/server/catalog/repository";

export const metadata: Metadata = {
  title: "Build Your Garden",
  description: "Choose your space, what you want to grow, your experience and budget—get a complete garden shopping list in seconds.",
  alternates: { canonical: "/build-your-garden" },
};

const SPACES: BuildSpace[] = ["balcony", "patio", "backyard", "raised-bed", "indoor"];
const GOALS: BuildGoal[] = ["vegetables", "herbs", "fruit", "flowers", "pollinators"];
const LEVELS: ExperienceLevel[] = ["beginner", "intermediate", "experienced"];

const pick = <T extends string>(allowed: T[], v: string | string[] | undefined) => {
  const s = Array.isArray(v) ? v[0] : v;
  return allowed.find((a) => a === s);
};

export default async function BuildYourGardenPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const growRaw = (Array.isArray(sp.grow) ? sp.grow[0] : sp.grow) ?? "";
  const initial: BuildInitial = {
    space: pick(SPACES, sp.space),
    goals: growRaw.split(",").filter((g): g is BuildGoal => GOALS.includes(g as BuildGoal)),
    experience: pick(LEVELS, sp.level),
    budget: pick(budgetBands.map((b) => b.value) as BudgetBand[], sp.budget),
  };
  // Only items that can go through store checkout are offered by the builder.
  const products = (await getAllCards()).filter((p) => p.purchasable && !p.isAffiliate);

  return (
    <div className="container-page max-w-5xl">
      <Breadcrumbs items={[{ label: "Build Your Garden" }]} />
      <header className="mb-8">
        <p className="eyebrow mb-2">Garden planner</p>
        <h1 className="text-4xl font-semibold uppercase tracking-tight sm:text-5xl">Build Your Garden</h1>
        <p className="mt-3 text-lg text-muted">Five quick steps to a shopping list made for your space. Remove anything you already have, then add the rest to your cart.</p>
      </header>
      <GardenBuilder key={JSON.stringify(initial)} products={products} initial={initial} />
    </div>
  );
}
