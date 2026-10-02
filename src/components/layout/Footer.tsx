import Link from "next/link";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { NewsletterForm } from "../marketing/NewsletterForm";
import { Icon, SocialIcon } from "../ui/Icon";
import { Logo } from "./Logo";

interface EcosystemSite {
  url: string;
  label: string;
  description: string;
  title: string;
  icon: "sprout" | "bag" | "pin";
  current?: boolean;
}

const ecosystem: EcosystemSite[] = [
  { ...siteConfig.ecosystem.services, title: "Garden services", icon: "sprout" },
  { ...siteConfig.ecosystem.store, title: "Shop & learn", icon: "bag", current: true },
  { ...siteConfig.ecosystem.community, title: "Community gardens", icon: "pin" },
];

const socials = (Object.entries(siteConfig.social) as [keyof typeof siteConfig.social, string][]).filter(([, url]) => url);

export function Footer() {
  return (
    <footer className="mt-20 bg-forest-950 text-cream-100">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-6">
            <Logo inverted />
            <p className="max-w-sm text-cream-200">
              {siteConfig.tagline} Plants, seeds and growing supplies chosen to help ordinary people grow food and green up the spaces they have.
            </p>
            <NewsletterForm source="footer" variant="footer" />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((col) => (
              <nav key={col.title} aria-labelledby={`footer-${col.title}`}>
                <h2 id={`footer-${col.title}`} className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.16em] text-mustard-400">
                  {col.title}
                </h2>
                <ul className="space-y-1">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.external ? (
                        <a href={l.href} className="inline-flex min-h-9 items-center gap-1 text-sm text-cream-100 hover:text-white hover:underline">
                          {l.label}
                          <Icon name="external" className="h-3.5 w-3.5 opacity-70" />
                        </a>
                      ) : (
                        <Link href={l.href} className="inline-flex min-h-9 items-center text-sm text-cream-100 hover:text-white hover:underline">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <section aria-labelledby="ecosystem-title" className="mt-14 border-t border-white/10 pt-10">
          <h2 id="ecosystem-title" className="mb-5 font-display text-lg font-semibold text-white">
            The Indy Mustard Seed family
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {ecosystem.map((site) => (
              <li key={site.url}>
                <a
                  href={site.url}
                  aria-current={site.current ? "page" : undefined}
                  className="flex h-full gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition-colors hover:bg-white/10"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-leaf-700/40 text-leaf-200">
                    <Icon name={site.icon} className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-mustard-400">{site.title}</span>
                    <span className="block font-semibold text-white">
                      {site.label} {site.current && <span className="text-xs font-normal text-cream-200">(you are here)</span>}
                    </span>
                    <span className="mt-1 block text-sm text-cream-200">{site.description}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-cream-200 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.city}. Some products are sold by partner retailers —{" "}
            <Link href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-white">
              affiliate disclosure
            </Link>
            .
          </p>
          <ul className="flex items-center gap-2" aria-label="Social media">
            {socials.length > 0
              ? socials.map(([network, url]) => (
                  <li key={network}>
                    <a href={url} className="grid h-11 w-11 place-items-center rounded-full bg-white/5 hover:bg-white/15" aria-label={`${siteConfig.name} on ${network}`}>
                      <SocialIcon network={network} />
                    </a>
                  </li>
                ))
              : // Placeholders until real profiles are configured (NEXT_PUBLIC_SOCIAL_* env vars).
                (["instagram", "facebook", "youtube", "pinterest"] as const).map((network) => (
                  <li key={network}>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/5 opacity-60" title={`${network} – coming soon`}>
                      <SocialIcon network={network} />
                      <span className="sr-only">{network} (coming soon)</span>
                    </span>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
