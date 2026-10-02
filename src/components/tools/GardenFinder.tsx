"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { budgetBands, recommendFromFinder, type FinderAnswers } from "@/lib/recommend/rules";
import type { ResolvedKit } from "@/lib/catalog/types";
import { KitCard } from "../kits/KitCard";
import { Icon } from "../ui/Icon";
import { ChoiceGroup, type ChoiceOption } from "./ChoiceGroup";

type Q<K extends keyof FinderAnswers> = { key: K; legend: string; description?: string; options: ChoiceOption<FinderAnswers[K]>[] };

const questions: [
  Q<"location">,
  Q<"space">,
  Q<"setting">,
  Q<"sun">,
  Q<"goal">,
  Q<"experience">,
  Q<"budget">,
] = [
  {
    key: "location",
    legend: "Where are you growing?",
    options: [
      { value: "backyard", label: "Backyard or yard", emoji: "🏡" },
      { value: "balcony", label: "Balcony or patio", emoji: "🪟" },
      { value: "home", label: "Inside my home", emoji: "🛋️" },
      { value: "community", label: "Community garden plot", emoji: "🧑‍🤝‍🧑" },
      { value: "classroom", label: "School or classroom", emoji: "🏫" },
    ],
  },
  {
    key: "space",
    legend: "How much space do you have?",
    options: [
      { value: "tiny", label: "A windowsill or shelf", emoji: "🪴", hint: "A few pots" },
      { value: "small", label: "A few containers", emoji: "🧺", hint: "Up to ~20 sq ft" },
      { value: "medium", label: "One or two beds", emoji: "🟫", hint: "About 20–100 sq ft" },
      { value: "large", label: "A big plot", emoji: "🌾", hint: "100+ sq ft" },
    ],
  },
  {
    key: "setting",
    legend: "Indoor or outdoor?",
    options: [
      { value: "outdoor", label: "Outdoor", emoji: "☀️" },
      { value: "indoor", label: "Indoor", emoji: "🏠" },
      { value: "both", label: "A bit of both", emoji: "🔁" },
    ],
  },
  {
    key: "sun",
    legend: "How much sunlight?",
    description: "Direct sun on the spot during a typical summer day.",
    options: [
      { value: "full", label: "Full sun", emoji: "🌞", hint: "6+ hours of direct sun" },
      { value: "part", label: "Part sun", emoji: "⛅", hint: "3–6 hours" },
      { value: "shade", label: "Mostly shade", emoji: "🌥️", hint: "Under 3 hours" },
      { value: "unsure", label: "Not sure", emoji: "🤔", hint: "We'll help you figure it out" },
    ],
  },
  {
    key: "goal",
    legend: "What do you want to grow?",
    options: [
      { value: "vegetables", label: "Vegetables", emoji: "🥕" },
      { value: "herbs", label: "Herbs", emoji: "🌿" },
      { value: "fruit", label: "Fruit", emoji: "🍓" },
      { value: "pollinators", label: "Pollinator flowers", emoji: "🐝" },
      { value: "houseplants", label: "Houseplants", emoji: "🪴" },
      { value: "microgreens", label: "Microgreens", emoji: "🌱" },
    ],
  },
  {
    key: "experience",
    legend: "Beginner or experienced?",
    options: [
      { value: "beginner", label: "Beginner", emoji: "🌱", hint: "New to growing, or it's been a while" },
      { value: "intermediate", label: "Intermediate", emoji: "🌿", hint: "A few seasons under my belt" },
      { value: "experienced", label: "Experienced", emoji: "🌳", hint: "I start my own seeds" },
    ],
  },
  {
    key: "budget",
    legend: "What's your budget?",
    options: budgetBands.map((b) => ({ value: b.value, label: b.label })),
  },
];

/** "What Should I Grow?" – a seven-question wizard that recommends categories and kits. */
export function GardenFinder({ kits }: { kits: ResolvedKit[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<FinderAnswers>>({});
  const headingRef = useRef<HTMLDivElement>(null);
  const total = questions.length;
  const done = step >= total;

  const go = (n: number) => {
    setStep(n);
    // Move focus to the new question for keyboard and screen reader users.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  if (done) {
    const result = recommendFromFinder(kits, answers as FinderAnswers);
    return (
      <div ref={headingRef} tabIndex={-1} className="space-y-10 focus:outline-none">
        <div className="rounded-[2rem] bg-forest-900 p-8 text-white sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-mustard-400">Your recommendation</p>
          <h2 className="mt-2 text-3xl font-semibold capitalize text-white sm:text-4xl">{result.headline}</h2>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={result.buildLink} className="btn-mustard">
              Build my shopping list <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
            <button type="button" onClick={() => go(0)} className="btn border-2 border-white/70 text-white hover:bg-white/10">
              Start over
            </button>
          </div>
        </div>

        <section aria-labelledby="finder-cats">
          <h3 id="finder-cats" className="mb-4 text-2xl font-semibold">
            Shop these categories
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.categories.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="card flex h-full items-start justify-between gap-3 p-5 hover:shadow-[var(--shadow-lift)]">
                  <span>
                    <span className="block font-semibold text-forest-900">{c.label}</span>
                    <span className="mt-1 block text-sm text-muted">{c.reason}</span>
                  </span>
                  <Icon name="arrowRight" className="mt-1 h-5 w-5 shrink-0 text-forest-700" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {result.kits.length > 0 && (
          <section aria-labelledby="finder-kits">
            <h3 id="finder-kits" className="mb-4 text-2xl font-semibold">
              Kits that fit
            </h3>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.kits.map((k) => (
                <li key={k.id}>
                  <KitCard kit={k} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {result.tips.length > 0 && (
          <section aria-labelledby="finder-tips" className="rounded-2xl bg-leaf-50 p-6">
            <h3 id="finder-tips" className="mb-3 text-xl font-semibold">
              Tips for your garden
            </h3>
            <ul className="space-y-2">
              {result.tips.map((t) => (
                <li key={t} className="flex gap-2">
                  <Icon name="leaf" className="mt-0.5 h-5 w-5 shrink-0 text-leaf-700" /> {t}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  const q = questions[step];
  const current = answers[q.key] as string | undefined;

  return (
    <div className="card p-6 sm:p-10">
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm font-medium text-muted">
          <span>
            Question {step + 1} of {total}
          </span>
          <span>{Math.round((step / total) * 100)}% complete</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-cream-200" aria-hidden="true">
          <div className="h-full rounded-full bg-leaf-600 transition-[width]" style={{ width: `${(step / total) * 100}%` }} />
        </div>
      </div>

      <div ref={headingRef} tabIndex={-1} className="focus:outline-none">
        <ChoiceGroup
          legend={q.legend}
          description={q.description}
          options={q.options as ChoiceOption<string>[]}
          value={current ? [current] : []}
          columns={q.options.length === 3 ? 3 : 2}
          onChange={([v]) => setAnswers((a) => ({ ...a, [q.key]: v }))}
        />
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="btn-ghost">
          <Icon name="chevronLeft" className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={() => go(step + 1)} disabled={!current} className="btn-primary">
          {step === total - 1 ? "See my recommendations" : "Next"} <Icon name="chevronRight" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
