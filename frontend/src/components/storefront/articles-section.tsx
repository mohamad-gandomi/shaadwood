'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { BlogPost } from '@/types';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  date?: string;
}

const FALLBACK_ARTICLES: ArticleItem[] = [
  {
    id: 'mock-1',
    title: 'هنر نجاری اصیل: چرا چوب گردو و بلوط طبیعی دهه‌ها زنده می‌ماند؟',
    slug: 'the-art-of-hardwood-joinery-why-solid-oak-walnut-endure',
    excerpt: 'بررسی اتصالات کهن فاق و زبانه و چگونگی تنفس الوار چوب طبیعی در چهار فصل سال بدون نیاز به بست‌های فلزی.',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
    category: 'فنون نجاری',
    date: 'یادداشت کارگاه',
  },
  {
    id: 'mock-2',
    title: 'زندگی با چوب طبیعی: اصول نگهداری پوشش‌های روغن گیاهی و موم طبیعی',
    slug: 'living-with-natural-timber-caring-for-oil-finishes',
    excerpt: 'روش‌های ساده و ارگانیک برای حفظ درخشش گرم، لمس مخملین و مقاومت سطوح چوب گردو و راش در خانه.',
    image: '/images/material-craft-wood.webp',
    category: 'نگهداری چوب',
    date: 'راهنمای مراقبت',
  },
  {
    id: 'mock-3',
    title: 'تناسبات آرامش در سبک ژاپاندی: جستجوی سکوت در خطوط ساده مبلمان',
    slug: 'japandi-proportions-finding-calm-in-restrained-furniture-forms',
    excerpt: 'تلاقی ظرافت نجاری ژاپنی با سادگی مینیمال اسکاندیناوی در طراحی سازه‌های ماندگار و بدون تکلف.',
    image: '/images/showcase-lounge-duo.webp',
    category: 'فلسفه طراحی',
    date: 'جستار دیزاین',
  },
];

export function ArticlesSection() {
  const { data: remotePosts = [] } = useQuery({
    queryKey: ['storefront-articles'],
    queryFn: () => api.getPublicBlogPosts({ limit: 3 }),
  });

  const articles: ArticleItem[] = React.useMemo(() => {
    const formattedRemote: ArticleItem[] = (remotePosts || []).map((post: BlogPost, index: number) => ({
      id: post.id || `post-${index}`,
      title: post.title,
      slug: post.slug,
      excerpt:
        post.excerpt ||
        'دست‌نوشته‌ها و تجربیات کارگاه پیرامون چوب، معماری آرام و سبک زیستن با متریال‌های طبیعی.',
      image: post.featuredImage || FALLBACK_ARTICLES[index % FALLBACK_ARTICLES.length].image,
      category: post.category?.name || 'یادداشت کارگاه',
      date: post.publishedAt ? formatDate(post.publishedAt) : 'یادداشت کارگاه',
    }));

    const combined: ArticleItem[] = [...formattedRemote];
    for (const fb of FALLBACK_ARTICLES) {
      if (combined.length >= 3) break;
      if (!combined.some((item) => item.slug === fb.slug)) {
        combined.push(fb);
      }
    }

    return combined.slice(0, 3);
  }, [remotePosts]);

  return (
    <section id="articles" className="py-16 sm:py-24 bg-white border-b border-border/60 scroll-mt-24">
      <div id="journal" className="scroll-mt-24" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="space-y-1.5 text-right">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-shaad-800">
              یادداشت‌ها و جستارهای کارگاه
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground font-serif">
              هنر نجاری، اصالت چوب و سبک زیستن
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              جستارها و راهنماهای کاربردی پیرامون زندگی با متریال‌های طبیعی، فلسفه طراحی آرام و نگهداری چوب.
            </p>
          </div>

          <Link
            href="/blog"
            className="text-xs font-semibold tracking-wider text-shaad-800 hover:text-shaad-900 inline-flex items-center gap-1.5 group self-start sm:self-auto"
          >
            <span>مشاهده همه مقالات</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => {
            const fallbackImg = FALLBACK_ARTICLES[idx % FALLBACK_ARTICLES.length].image;

            return (
              <article
                key={article.id}
                className="group flex flex-col bg-zen-50 rounded-2xl border border-border/60 overflow-hidden hover:shadow-md transition-all duration-300 text-right"
              >
                {/* Image Stage */}
                <Link
                  href={`/blog/${article.slug}`}
                  className="relative aspect-[16/10] overflow-hidden bg-zen-100 block"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImg;
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-shaad-900 border border-black/5 shadow-2xs">
                      {article.category}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {article.date && (
                      <span className="text-[11px] text-muted-foreground font-sans block">
                        {article.date}
                      </span>
                    )}
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-foreground group-hover:text-shaad-800 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center text-xs font-semibold text-shaad-800 hover:text-shaad-900 group/link gap-1.5"
                    >
                      <span>مطالعه مقاله</span>
                      <ArrowLeft className="w-3.5 h-3.5 group-hover/link:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
