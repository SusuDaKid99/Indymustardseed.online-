import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "../ui/Breadcrumbs";

/** Simple layout for policy, help and company pages. */
export function ContentPage({
  title,
  intro,
  crumbs,
  updated,
  children,
  wide = false,
}: {
  title: string;
  intro?: ReactNode;
  crumbs?: Crumb[];
  updated?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`container-page ${wide ? "" : "max-w-4xl"}`}>
      <Breadcrumbs items={crumbs ?? [{ label: title }]} />
      <header className="mb-8">
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
        {updated && <p className="mt-2 text-sm text-muted">Last updated {updated}</p>}
      </header>
      {children}
    </div>
  );
}

/** Visible reminder that legal copy is a template awaiting professional review. */
export function DraftNotice() {
  return (
    <p className="mb-8 rounded-2xl bg-mustard-100 p-4 text-sm text-earth-900">
      <strong>Draft template.</strong> This policy is a starting point for development and must be reviewed by a qualified professional before launch.
    </p>
  );
}
