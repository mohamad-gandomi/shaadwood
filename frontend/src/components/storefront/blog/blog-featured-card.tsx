import Link from 'next/link';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { BlogPost } from '@/types';
import { calculateReadingTime, formatBlogDate } from '@/lib/reading-time';

interface BlogFeaturedCardProps {
  post: BlogPost;
}

export function BlogFeaturedCard({ post }: BlogFeaturedCardProps) {
  const readingTime = calculateReadingTime(post.content);
  const formattedDate = formatBlogDate(post.publishedAt || post.createdAt);
  const imageUrl = post.featuredImage || '/placeholder-wood.webp';

  return (
    <article className="group relative rounded-3xl bg-white border border-border/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
        {/* Visual Cover */}
        <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden bg-zen-100">
          <img
            src={imageUrl}
            alt={post.title}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          />
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-sans tracking-wider uppercase font-semibold bg-white/90 backdrop-blur-xs text-shaad-900 border border-white/80 shadow-2xs">
              {post.category?.name || 'مقاله برگزیده'}
            </span>
          </div>
        </div>

        {/* Narrative Content */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            {/* Meta Tags */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-sans">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-shaad-700" />
                <time dateTime={post.publishedAt || post.createdAt}>{formattedDate}</time>
              </span>
              <span>&middot;</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-shaad-700" />
                <span>{readingTime}</span>
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground group-hover:text-shaad-800 transition-colors leading-tight">
              <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                {post.title}
              </Link>
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 font-light">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Action Link */}
          <div className="pt-2">
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-shaad-800 group-hover:text-shaad-900 transition-colors"
            >
              <span>مطالعه مقاله کامل</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
