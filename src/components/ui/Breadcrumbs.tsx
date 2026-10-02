import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="py-4 text-sm">
        <ol className="flex flex-wrap items-center gap-1 text-muted">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={`${c.label}-${i}`} className="flex items-center gap-1">
                {c.href && !last ? (
                  <Link href={c.href} className="rounded px-0.5 hover:text-forest-800 hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className={last ? "font-medium text-forest-900" : ""}>
                    {c.label}
                  </span>
                )}
                {!last && <Icon name="chevronRight" className="h-3.5 w-3.5" />}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: `${siteConfig.url}${c.href}` } : {}),
          })),
        }}
      />
    </>
  );
}
