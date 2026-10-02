import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { accountSections, type AccountSection } from "@/components/account/sections";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = { title: "My Account", robots: { index: false } };

export function generateStaticParams() {
  return [{ section: [] }, ...accountSections.map((s) => ({ section: [s.id] }))];
}

export default async function AccountPage({ params }: { params: Promise<{ section?: string[] }> }) {
  const { section: parts } = await params;
  if (parts && parts.length > 1) notFound();
  const id = (parts?.[0] ?? "profile") as AccountSection;
  const current = accountSections.find((s) => s.id === id);
  if (!current) notFound();

  return (
    <div className="container-page">
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, ...(id === "profile" ? [] : [{ label: current.label }])]} />
      <h1 className="mb-8 text-4xl font-semibold">My Account</h1>
      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <nav aria-label="Account sections" className="-mx-4 overflow-x-auto px-4 no-scrollbar lg:mx-0 lg:px-0">
          <ul className="flex gap-2 lg:flex-col">
            {accountSections.map((s) => (
              <li key={s.id}>
                <Link
                  href={s.id === "profile" ? "/account" : `/account/${s.id}`}
                  aria-current={s.id === id ? "page" : undefined}
                  className={`flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold lg:rounded-xl ${
                    s.id === id ? "bg-forest-800 text-white" : "bg-cream-100 text-forest-900 hover:bg-cream-200"
                  }`}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <section aria-labelledby="account-heading">
          <h2 id="account-heading" className="mb-5 text-2xl font-semibold">
            {current.label}
          </h2>
          <AccountDashboard section={id} />
        </section>
      </div>
    </div>
  );
}
