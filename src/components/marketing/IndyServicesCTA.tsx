import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Icon } from "../ui/Icon";

/** "Need more than supplies?" – sends visitors to the services site (indymustardseed.com). */
export function IndyServicesCTA() {
  return (
    <section aria-labelledby="indy-cta" className="relative overflow-hidden rounded-[2rem] bg-forest-900 text-white">
      <div className="grid md:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center gap-4 p-8 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-mustard-400">Indy Mustard Seed services</p>
          <h2 id="indy-cta" className="text-3xl font-semibold text-white sm:text-4xl">
            Need more than supplies?
          </h2>
          <p className="text-lg text-cream-100">Let Indy Mustard Seed build your garden.</p>
          <p className="text-cream-200">
            Our Indianapolis team designs and installs raised beds, pollinator plantings and backyard food gardens.
          </p>
          <div>
            <a href={siteConfig.ecosystem.services.url} className="btn-mustard mt-2">
              VISIT INDYMUSTARDSEED.COM
              <Icon name="external" className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="relative min-h-64 md:min-h-full">
          <Image src="/images/photos/hands-soil.jpg" alt="Hands holding rich garden soil" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
