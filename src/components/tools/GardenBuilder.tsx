"use client";

import { useRef, useState } from "react";
import { formatPrice } from "@/lib/catalog/format";
import type { ExperienceLevel, ProductCardData } from "@/lib/catalog/types";
import { useSavedGardens } from "@/lib/client/saved";
import { budgetBands, buildGardenPlan, type BudgetBand, type BuildGoal, type BuildSpace } from "@/lib/recommend/rules";
import { ShoppingList } from "../kits/ShoppingList";
import { Icon } from "../ui/Icon";
import { ChoiceGroup, type ChoiceOption } from "./ChoiceGroup";

const spaceOptions: ChoiceOption<BuildSpace>[] = [
  { value: "balcony", label: "Balcony", emoji: "🪟" },
  { value: "patio", label: "Patio", emoji: "🪑" },
  { value: "backyard", label: "Backyard", emoji: "🏡" },
  { value: "raised-bed", label: "Raised Bed", emoji: "🟫" },
  { value: "indoor", label: "Indoor", emoji: "🏠" },
];
const goalOptions: ChoiceOption<BuildGoal>[] = [
  { value: "vegetables", label: "Vegetables", emoji: "🥕" },
  { value: "herbs", label: "Herbs", emoji: "🌿" },
  { value: "fruit", label: "Fruit", emoji: "🍓" },
  { value: "flowers", label: "Flowers", emoji: "🌸" },
  { value: "pollinators", label: "Pollinators", emoji: "🐝" },
];
const levelOptions: ChoiceOption<ExperienceLevel>[] = [
  { value: "beginner", label: "Beginner", emoji: "🌱" },
  { value: "intermediate", label: "Intermediate", emoji: "🌿" },
  { value: "experienced", label: "Experienced", emoji: "🌳" },
];
const budgetOptions: ChoiceOption<BudgetBand>[] = budgetBands.map((b) => ({ value: b.value, label: b.label }));

const stepTitles = ["Choose your space", "Choose what you want to grow", "Choose your experience", "Choose your budget", "Recommended setup"];

export interface BuildInitial {
  space?: BuildSpace;
  goals: BuildGoal[];
  experience?: ExperienceLevel;
  budget?: BudgetBand;
}

/** BUILD YOUR GARDEN – a five-step guided builder that turns answers into a store shopping list. */
export function GardenBuilder({ products, initial }: { products: ProductCardData[]; initial: BuildInitial }) {
  const complete = Boolean(initial.space && initial.goals.length && initial.experience && initial.budget);
  const [step, setStep] = useState(complete ? 4 : 0);
  const [space, setSpace] = useState<BuildSpace | undefined>(initial.space);
  const [goals, setGoals] = useState<BuildGoal[]>(initial.goals);
  const [experience, setExperience] = useState<ExperienceLevel | undefined>(initial.experience);
  const [budget, setBudget] = useState<BudgetBand | undefined>(initial.budget);
  const focusRef = useRef<HTMLDivElement>(null);
  const { save } = useSavedGardens();

  const go = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => focusRef.current?.focus());
  };
  const canNext = [Boolean(space), goals.length > 0, Boolean(experience), Boolean(budget)][step] ?? true;

  const plan = step === 4 && space && experience && budget ? buildGardenPlan(products, { space, goals, experience, budget }) : null;

  return (
    <div>
      <ol className="mb-8 grid grid-cols-5 gap-2" aria-label="Progress">
        {stepTitles.map((t, i) => (
          <li key={t} aria-current={i === step ? "step" : undefined}>
            <button
              type="button"
              onClick={() => i < step && go(i)}
              disabled={i > step}
              className="w-full text-left disabled:cursor-default"
              aria-label={`Step ${i + 1}: ${t}${i < step ? " (completed, go back)" : ""}`}
            >
              <span className={`block h-2 rounded-full ${i <= step ? "bg-leaf-600" : "bg-cream-200"}`} />
              <span className={`mt-2 hidden text-xs font-semibold sm:block ${i === step ? "text-forest-900" : "text-muted"}`}>
                Step {i + 1} — {t}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div ref={focusRef} tabIndex={-1} className="focus:outline-none">
        {step < 4 ? (
          <div className="card p-6 sm:p-10">
            <p className="eyebrow mb-2">Step {step + 1} of 5</p>
            {step === 0 && <ChoiceGroup legend="Choose your space" options={spaceOptions} value={space ? [space] : []} onChange={([v]) => setSpace(v)} columns={5} />}
            {step === 1 && (
              <ChoiceGroup legend="Choose what you want to grow" description="Pick as many as you like." options={goalOptions} value={goals} onChange={setGoals} multiple columns={5} />
            )}
            {step === 2 && (
              <ChoiceGroup legend="Choose your experience" options={levelOptions} value={experience ? [experience] : []} onChange={([v]) => setExperience(v)} columns={3} />
            )}
            {step === 3 && <ChoiceGroup legend="Choose your budget" options={budgetOptions} value={budget ? [budget] : []} onChange={([v]) => setBudget(v)} />}
            <div className="mt-8 flex items-center justify-between gap-3">
              <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="btn-ghost">
                <Icon name="chevronLeft" className="h-4 w-4" /> Back
              </button>
              <button type="button" onClick={() => go(step + 1)} disabled={!canNext} className="btn-primary">
                {step === 3 ? "Build my garden" : "Next"} <Icon name="chevronRight" className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          plan && (
            <section aria-labelledby="plan-title" className="space-y-6">
              <div className="flex flex-col gap-4 rounded-[2rem] bg-forest-900 p-6 text-white sm:flex-row sm:items-end sm:justify-between sm:p-10">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-mustard-400">Step 5 — Recommended setup</p>
                  <h2 id="plan-title" className="mt-2 text-3xl font-semibold text-white">
                    Your {spaceOptions.find((s) => s.value === space)?.label.toLowerCase()} garden
                  </h2>
                  <p className="mt-2 text-cream-100">
                    {goals.map((g) => goalOptions.find((o) => o.value === g)?.label).join(", ")} · {levelOptions.find((l) => l.value === experience)?.label} ·{" "}
                    {budgetOptions.find((b) => b.value === budget)?.label}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-cream-200">Estimated total</p>
                  <p className="text-3xl font-bold">{formatPrice(plan.total)}</p>
                </div>
              </div>

              {plan.items.length === 0 ? (
                <div className="rounded-3xl bg-cream-100 p-8 text-center">
                  <p className="font-semibold">We couldn&apos;t fit a setup into that budget yet.</p>
                  <button type="button" className="btn-primary mt-4" onClick={() => go(3)}>
                    Adjust budget
                  </button>
                </div>
              ) : (
                <ShoppingList
                  key={`${space}-${goals.join()}-${experience}-${budget}`}
                  items={plan.items.map((i) => ({ product: i.product, quantity: i.quantity, note: i.reason }))}
                  onSave={(ids) =>
                    save({
                      name: `${spaceOptions.find((s) => s.value === space)?.label} garden`,
                      summary: `${goals.join(", ")} · ${experience} · ${budgetOptions.find((b) => b.value === budget)?.label}`,
                      productIds: ids,
                    })
                  }
                />
              )}
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => go(0)} className="btn-secondary">
                  Start over
                </button>
                <button type="button" onClick={() => go(3)} className="btn-ghost">
                  Change budget
                </button>
              </div>
              <p className="text-sm text-muted">
                Recommendations use simple rules based on product attributes and only include items you can buy directly from Indy Mustard Seed, so &ldquo;Add all to
                cart&rdquo; works end to end. Saved gardens are stored on this device until accounts launch.
              </p>
            </section>
          )
        )}
      </div>
    </div>
  );
}
