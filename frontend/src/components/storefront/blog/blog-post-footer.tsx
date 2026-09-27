import Link from 'next/link';
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { BlogPost } from '@/types';
import { BlogShareButton } from './blog-share-button';
import { BlogCard } from './blog-card';

interface BlogPostFooterProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogPostFooter({ post, relatedPosts }: BlogPostFooterProps) {
  const authorName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`.trim()
    : 'Shaadwood Artisan Studio';

  return (
    <footer className="space-y-12 pt-8 border-t border-border/70">
      {/* Share & Back Navigation Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-shaad-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Stories</span>
        </Link>

        <BlogShareButton title={post.title} />
      </div>

      {/* Author Bio Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zen-100/70 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-shaad-900 text-white flex items-center justify-center font-serif text-xl font-bold shrink-0 shadow-xs">
          {post.author?.firstName ? post.author.firstName[0] : 'S'}
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-serif font-bold text-base text-foreground">{authorName}</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-shaad-200/60 text-shaad-900">
              Master Craftsman
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Crafting solid wood heirloom furniture at the Shaadwood workshop. Dedicated to sustainable hardwood
            forestry, traditional joinery resilience, and Japanese-Scandinavian quiet aesthetics.
          </p>
        </div>
      </div>

      {/* Related Articles Section for SEO Depth and Internal Linking */}
      {relatedPosts.length > 0 && (
        <section aria-label="Related Articles" className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-shaad-800 font-semibold block">
                Explore More
              </span>
              <h3 className="font-serif font-bold text-xl text-foreground">Continue Reading</h3>
            </div>
            <Link
              href="/blog"
              className="text-xs font-medium text-shaad-800 hover:text-shaad-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((relPost) => (
              <BlogCard key={relPost.id} post={relPost} />
            ))}
          </div>
        </section>
      )}
    </footer>
  );
}
