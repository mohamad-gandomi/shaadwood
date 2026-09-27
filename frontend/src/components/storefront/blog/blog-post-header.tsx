import Link from 'next/link';
import { ChevronLeft, Calendar, Clock } from 'lucide-react';
import { BlogPost } from '@/types';
import { calculateReadingTime, formatBlogDate } from '@/lib/reading-time';

interface BlogPostHeaderProps {
  post: BlogPost;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const readingTime = calculateReadingTime(post.content);
  const formattedDate = formatBlogDate(post.publishedAt || post.createdAt);
  const authorName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`.trim()
    : 'استودیو درودگری شادوود';

  return (
    <header className="space-y-6 sm:space-y-8">
      {/* Semantic Breadcrumbs */}
      <nav aria-label="مسیر راهنما" className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
        <Link href="/" className="hover:text-shaad-800 transition-colors">
          خانه
        </Link>
        <ChevronLeft className="w-3.5 h-3.5 opacity-40 shrink-0" />
        <Link href="/blog" className="hover:text-shaad-800 transition-colors">
          ژورنال
        </Link>
        {post.category && (
          <>
            <ChevronLeft className="w-3.5 h-3.5 opacity-40 shrink-0" />
            <Link
              href={`/blog?category=${post.category.slug}`}
              className="hover:text-shaad-800 transition-colors truncate max-w-[140px]"
            >
              {post.category.name}
            </Link>
          </>
        )}
      </nav>

      {/* Category Pill & Reading Time */}
      <div className="flex items-center gap-3">
        {post.category && (
          <Link
            href={`/blog?category=${post.category.slug}`}
            className="px-3 py-1 rounded-full text-xs font-sans font-semibold tracking-wider bg-shaad-800 text-white hover:bg-shaad-900 transition-colors"
          >
            {post.category.name}
          </Link>
        )}
        <span className="text-xs text-muted-foreground font-sans flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-shaad-700" />
          <span>{readingTime}</span>
        </span>
      </div>

      {/* Main Title */}
      <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight leading-[1.25]">
        {post.title}
      </h1>

      {/* Excerpt as Subtitle */}
      {post.excerpt && (
        <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-3xl">
          {post.excerpt}
        </p>
      )}

      {/* Author & Publication Timestamp Row */}
      <div className="flex items-center gap-4 pt-2 pb-4 border-b border-border/70 text-xs text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-shaad-100 border border-shaad-200 text-shaad-900 flex items-center justify-center font-bold text-[11px]">
            {post.author?.firstName ? post.author.firstName[0] : 'ش'}
          </div>
          <div>
            <span className="font-semibold text-foreground block">{authorName}</span>
            <span className="text-[11px] text-muted-foreground">استادکار و درودگر استودیو</span>
          </div>
        </div>

        <span>&middot;</span>

        <span className="flex items-center gap-1.5 font-sans">
          <Calendar className="w-3.5 h-3.5 text-shaad-700" />
          <time dateTime={post.publishedAt || post.createdAt}>{formattedDate}</time>
        </span>
      </div>

      {/* Hero Visual */}
      {post.featuredImage && (
        <figure className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-zen-100 shadow-sm border border-border/80">
          <img
            src={post.featuredImage}
            alt={post.title}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </figure>
      )}
    </header>
  );
}
