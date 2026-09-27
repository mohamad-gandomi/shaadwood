import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
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
    : 'استودیو درودگری شادوود';

  return (
    <footer className="space-y-12 pt-8 border-t border-border/70">
      {/* Share & Back Navigation Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground hover:text-shaad-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به همه مقالات</span>
        </Link>

        <BlogShareButton title={post.title} />
      </div>

      {/* Author Bio Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zen-100/70 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-shaad-900 text-white flex items-center justify-center font-serif text-xl font-bold shrink-0 shadow-xs">
          {post.author?.firstName ? post.author.firstName[0] : 'ش'}
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-serif font-bold text-base text-foreground">{authorName}</h4>
            <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-shaad-200/60 text-shaad-900">
              استادکار و درودگر ارشد
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            خلق سازه‌های ماندگار از دل چوب طبیعی و کهنسال در کارگاه شادوود. متعهد به پاسداری از طبیعت، اتصالات اصیل نجاری و زیبایی‌شناسی آرام و بی‌پیرایه سبک ژاپنی-اسکاندیناوی.
          </p>
        </div>
      </div>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section aria-label="مقالات مرتبط" className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <span className="text-[10px] font-sans tracking-wider text-shaad-800 font-semibold block">
                جستارهای مرتبط
              </span>
              <h3 className="font-serif font-bold text-xl text-foreground">خواندنی‌های بیشتر</h3>
            </div>
            <Link
              href="/blog"
              className="text-xs font-medium text-shaad-800 hover:text-shaad-900 flex items-center gap-1"
            >
              <span>مشاهده همه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
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
