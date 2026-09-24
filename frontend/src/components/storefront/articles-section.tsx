'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
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
    title: 'The Art of Hardwood Joinery: Why Solid Oak & Walnut Endure for Decades',
    slug: 'the-art-of-hardwood-joinery-why-solid-oak-walnut-endure',
    excerpt:
      'Explore how traditional mortise and tenon joinery allows natural timber to breathe through seasons without mechanical fasteners.',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
    category: 'Joinery & Technique',
    date: 'Studio Journal',
  },
  {
    id: 'mock-2',
    title: 'Living with Natural Timber: Caring for Plant-Oil & Beeswax Finishes',
    slug: 'living-with-natural-timber-caring-for-oil-finishes',
    excerpt:
      'Simple, organic practices to preserve the warm tactile luster of raw solid wood surfaces in everyday home life.',
    image: '/images/material-craft-wood.webp',
    category: 'Timber Care',
    date: 'Care Guide',
  },
  {
    id: 'mock-3',
    title: 'Japandi Proportions: Finding Calm in Restrained Furniture Forms',
    slug: 'japandi-proportions-finding-calm-in-restrained-furniture-forms',
    excerpt:
      'How the quiet balance between Japanese joinery and Scandinavian modernism guides our handcrafted designs.',
    image: '/images/showcase-lounge-duo.webp',
    category: 'Design Philosophy',
    date: 'Design Essays',
  },
];

export function ArticlesSection() {
  const { data: remotePosts = [] } = useQuery({
    queryKey: ['storefront-articles'],
    queryFn: () => api.getPublicBlogPosts({ limit: 3 }),
  });

  // Exactly 3 articles: take backend posts first, complement with fallback articles
  const articles: ArticleItem[] = React.useMemo(() => {
    const formattedRemote: ArticleItem[] = (remotePosts || []).map((post: BlogPost, index: number) => ({
      id: post.id || `post-${index}`,
      title: post.title,
      slug: post.slug,
      excerpt:
        post.excerpt ||
        'Handcrafted perspectives on architectural furniture, sustainable forestry, and slow living.',
      image: post.featuredImage || FALLBACK_ARTICLES[index % FALLBACK_ARTICLES.length].image,
      category: post.category?.name || 'Studio Journal',
      date: post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Studio Journal',
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
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-shaad-800">
              Studio Journal
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground font-serif">
              Craft, Timber & Living Spaces
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg">
              Essays and guides from our workshop on slow living, natural woodcraft, and design philosophy.
            </p>
          </div>

          <Link
            href="/blog"
            className="text-xs font-semibold uppercase tracking-wider text-shaad-800 hover:text-shaad-900 inline-flex items-center gap-1.5 group self-start sm:self-auto"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3-Column Responsive Grid (desktop: 3 cols, mobile: 1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => {
            const fallbackImg = FALLBACK_ARTICLES[idx % FALLBACK_ARTICLES.length].image;

            return (
              <article
                key={article.id}
                className="group flex flex-col bg-zen-50 rounded-2xl border border-border/60 overflow-hidden hover:shadow-md transition-all duration-300"
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
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-shaad-900 border border-black/5 shadow-2xs">
                      {article.category}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {article.date && (
                      <span className="text-[11px] font-mono text-muted-foreground">
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
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
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
