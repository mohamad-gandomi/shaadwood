import Link from 'next/link';
import { BlogCategory } from '@/types';

interface BlogMastheadProps {
  categories: BlogCategory[];
  activeCategorySlug?: string;
}

export function BlogMasthead({ categories, activeCategorySlug }: BlogMastheadProps) {
  return (
    <div className="pt-10 pb-8 sm:pt-16 sm:pb-12 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Editorial Subtitle & Main Title */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-shaad-800 font-semibold block">
            Studio Journal & Essays
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight leading-[1.15]">
            Woodcraft, Material Philosophy &amp; Slow Living
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Essays on heirloom timber joinery, organic plant-oil preservation, and Japanese-Scandinavian
            interior balance from the craftsmen at Shaadwood Atelier.
          </p>
        </div>

        {/* Category Navigation Pills - Crawler Friendly Links */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 border ${
              !activeCategorySlug
                ? 'bg-shaad-800 text-white border-shaad-800 shadow-xs'
                : 'bg-white text-muted-foreground border-border/80 hover:border-shaad-700 hover:text-foreground'
            }`}
          >
            All Stories
          </Link>
          {categories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 border ${
                  isActive
                    ? 'bg-shaad-800 text-white border-shaad-800 shadow-xs'
                    : 'bg-white text-muted-foreground border-border/80 hover:border-shaad-700 hover:text-foreground'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
