import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPost } from '@/types';
import { BlogPostHeader } from '@/components/storefront/blog/blog-post-header';
import { BlogPostContent } from '@/components/storefront/blog/blog-post-content';
import { BlogPostFooter } from '@/components/storefront/blog/blog-post-footer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_BASE}/blog/posts/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

async function getRelatedPosts(currentId: string, categorySlug?: string | null): Promise<BlogPost[]> {
  try {
    let list: BlogPost[] = [];
    if (categorySlug) {
      const res = await fetch(`${API_BASE}/blog/posts?categorySlug=${encodeURIComponent(categorySlug)}&limit=3`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        list = (Array.isArray(json.data) ? json.data : []).filter((p) => p.id !== currentId);
      }
    }

    // If fewer than 2 posts in the same category, supplement with latest stories
    if (list.length < 2) {
      const res = await fetch(`${API_BASE}/blog/posts?limit=4`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const fallback = (Array.isArray(json.data) ? json.data : []).filter((p) => p.id !== currentId);
        const seen = new Set(list.map((p) => p.id));
        for (const p of fallback) {
          if (!seen.has(p.id)) {
            list.push(p);
            seen.add(p.id);
          }
        }
      }
    }
    return list.slice(0, 2);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) {
    return { title: 'Essay Not Found | Shaadwood Studio Journal' };
  }

  const canonicalUrl = `https://shaadwood.com/blog/${post.slug}`;
  const authorName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`.trim()
    : 'Shaadwood Artisan Studio';

  return {
    title: `${post.title} | Shaadwood Studio Journal`,
    description: post.excerpt || 'Handcrafted furniture guides and woodwork essays from Shaadwood Studio.',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || undefined,
      url: canonicalUrl,
      siteName: 'Shaadwood Woodcraft Studio',
      publishedTime: post.publishedAt || post.createdAt,
      authors: [authorName],
      section: post.category?.name || 'Woodcraft',
      images: post.featuredImage ? [{ url: post.featuredImage, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category?.slug);
  const authorName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`.trim()
    : 'Shaadwood Artisan Studio';

  // Structured Data (schema.org/BlogPosting)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Shaadwood Woodcraft Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://shaadwood.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://shaadwood.com/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-zen-50 pb-20">
      {/* Injected JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        <BlogPostHeader post={post} />
        <BlogPostContent content={post.content} />
        <BlogPostFooter post={post} relatedPosts={relatedPosts} />
      </main>
    </div>
  );
}
