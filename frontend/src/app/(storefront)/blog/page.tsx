import type { Metadata } from 'next';
import { BlogPost, BlogCategory } from '@/types';
import { BlogMasthead } from '@/components/storefront/blog/blog-masthead';
import { BlogFeaturedCard } from '@/components/storefront/blog/blog-featured-card';
import { BlogCard } from '@/components/storefront/blog/blog-card';

export const metadata: Metadata = {
  title: 'Studio Journal & Essays | Shaadwood Handcrafted Living',
  description:
    'Essays on solid hardwood joinery, natural plant-oil preservation, and Japanese-Scandinavian interior aesthetics from Shaadwood Studio.',
  alternates: {
    canonical: 'https://shaadwood.com/blog',
  },
  openGraph: {
    title: 'Studio Journal & Woodcraft Essays | Shaadwood',
    description:
      'Explore craftsmanship essays, solid timber joinery guides, and slow-living interior aesthetics from Shaadwood Studio.',
    url: 'https://shaadwood.com/blog',
    siteName: 'Shaadwood Woodcraft Studio',
    type: 'website',
  },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function getBlogData(categorySlug?: string): Promise<{ posts: BlogPost[]; categories: BlogCategory[] }> {
  try {
    const postUrl = categorySlug
      ? `${API_BASE}/blog/posts?categorySlug=${encodeURIComponent(categorySlug)}`
      : `${API_BASE}/blog/posts`;

    const [postsRes, catsRes] = await Promise.all([
      fetch(postUrl, { cache: 'no-store' }),
      fetch(`${API_BASE}/blog/categories`, { cache: 'no-store' }),
    ]);

    const postsData = postsRes.ok ? await postsRes.json() : { data: [] };
    const catsData = catsRes.ok ? await catsRes.json() : { data: [] };

    return {
      posts: Array.isArray(postsData?.data) ? postsData.data : [],
      categories: Array.isArray(catsData?.data) ? catsData.data : [],
    };
  } catch (err) {
    console.error('Failed to load blog data:', err);
    return { posts: [], categories: [] };
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category;
  const { posts, categories } = await getBlogData(activeCategory);

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const gridPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-zen-50 pb-20">
      <BlogMasthead categories={categories} activeCategorySlug={activeCategory} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-12">
        {posts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <h3 className="font-serif text-xl font-bold text-foreground">No Essays Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There are currently no published essays in this category. Check back soon for new workshop dispatches.
            </p>
          </div>
        ) : (
          <>
            {/* Top Featured Essay */}
            {featuredPost && (
              <section aria-label="Featured Story">
                <BlogFeaturedCard post={featuredPost} />
              </section>
            )}

            {/* Remaining Articles Grid */}
            {gridPosts.length > 0 && (
              <section aria-label="Recent Articles" className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <h2 className="font-serif font-bold text-xl text-foreground">Recent Articles</h2>
                  <span className="text-xs font-mono text-muted-foreground">{gridPosts.length} Stories</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
