import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: { label: string; href: string };
  id?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 id={id} className="text-2xl font-semibold sm:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="inline-flex items-center gap-1 text-sm font-semibold text-forest-700 hover:text-forest-900 hover:underline">
          {action.label}
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
