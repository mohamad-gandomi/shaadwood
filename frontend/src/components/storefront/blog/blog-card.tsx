import Link from 'next/link';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { BlogPost } from '@/types';
import { calculateReadingTime, formatBlogDate } from '@/lib/reading-time';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const readingTime = calculateReadingTime(post.content);
  const formattedDate = formatBlogDate(post.publishedAt || post.createdAt);
  const imageUrl = post.featuredImage || '/placeholder-wood.webp';

  return (
    <article className="group flex flex-col justify-between rounded-2xl bg-white border border-border/70 overflow-hidden shadow-2xs hover:shadow-sm hover:border-shaad-700/60 transition-all duration-300">
      <div>
        {/* Cover Photo */}
        <div className="relative aspect-[16/10] overflow-hidden bg-zen-100">
          <img
            src={imageUrl}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
          />
          {post.category && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-white/95 text-shaad-900 border border-white/80 shadow-2xs">
                {post.category.name}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-shaad-700" />
              <time dateTime={post.publishedAt || post.createdAt}>{formattedDate}</time>
            </span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-shaad-700" />
              <span>{readingTime}</span>
            </span>
          </div>

          <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-shaad-800 transition-colors leading-snug line-clamp-2">
            <Link href={`/blog/${post.slug}`} className="focus:outline-none">
              {post.title}
            </Link>
          </h3>

          {post.excerpt && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-light">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Footer Read Action */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-shaad-800 group-hover:text-shaad-900 transition-colors"
        >
          <span>Read Article</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
