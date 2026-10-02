import Image from "next/image";
import Link from "next/link";
import { getLearnCategory, type Article } from "@/data/content/articles";

export function ArticleCard({ article, priority = false }: { article: Article; priority?: boolean }) {
  const cat = getLearnCategory(article.category);
  return (
    <article className="group card relative flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-cream-100">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {cat && <p className="eyebrow">{cat.name}</p>}
        <h3 className="font-display text-xl font-semibold leading-snug text-forest-900">
          <Link href={`/learn/${article.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:underline">
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-muted">{article.excerpt}</p>
        <p className="mt-auto pt-2 text-xs font-medium text-muted">{article.readMinutes} min read</p>
      </div>
    </article>
  );
}
