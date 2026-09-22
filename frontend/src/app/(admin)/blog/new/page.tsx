'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Save,
  Plus,
  BookOpen,
  Sparkles,
  Edit3,
  Eye,
  Globe,
  Image as ImageIcon,
  ExternalLink,
  FolderTree,
  Trash2,
  Link as LinkIcon,
  RefreshCw,
  Bot,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { BlogCategory, PostStatus } from '@/types';
import { Header } from '@/components/admin/header';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { MarkdownPreview } from '@/components/admin/markdown-preview';
import { SeoChecklist } from '@/components/admin/seo-checklist';
import { MediaItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function NewBlogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = React.useState('content');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [editorMode, setEditorMode] = React.useState<'write' | 'preview'>('write');

  // Form State
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [isCustomSlug, setIsCustomSlug] = React.useState(false);
  const [excerpt, setExcerpt] = React.useState('');
  const [content, setContent] = React.useState('');
  const [featuredImage, setFeaturedImage] = React.useState('');
  const [status, setStatus] = React.useState<PostStatus>('PUBLISHED');
  const [categoryId, setCategoryId] = React.useState('');

  // Helper to slugify a string
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Fetch categories
  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ['blog-categories'],
    queryFn: () => api.getBlogCategories(),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => api.createBlogPost(data),
    onSuccess: (newPost) => {
      toast.success(status === 'PUBLISHED' ? 'Article published successfully' : 'Draft saved successfully');
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      if (newPost?.id) {
        router.push(`/blog/${newPost.id}`);
      } else {
        router.push('/blog');
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to publish article');
    },
  });

  const handlePublish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      toast.error('Article title is required');
      return;
    }
    if (!content.trim()) {
      toast.error('Article content body is required');
      return;
    }

    const finalSlug = slug.trim() || generateSlug(title.trim()) || undefined;

    createMutation.mutate({
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim() || undefined,
      content,
      featuredImage: featuredImage.trim() || null,
      status,
      categoryId: categoryId || null,
    });
  };

  const handleMediaSelect = (media: MediaItem) => {
    setFeaturedImage(media.url);
    setIsMediaPickerOpen(false);
    toast.success('Cover image selected from media library');
  };

  // Word count and reading time statistics
  const wordCount = React.useMemo(() => {
    if (!content) return 0;
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="space-y-8 pb-16">
      <Header title="Write New Article" />

      <div className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        {/* Streamlined Product-Style Header (NO IMAGE) */}
        <div className="p-3.5 sm:p-5 rounded-xl border border-border bg-card shadow-xs space-y-3">
          {/* Top row: Back link + Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Articles</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push('/blog')}
                className="text-xs h-8 sm:h-9 font-medium"
              >
                Cancel
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => handlePublish()}
                disabled={createMutation.isPending}
                className="gap-1.5 text-xs h-8 sm:h-9 px-3 sm:px-4 shadow-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{createMutation.isPending ? 'Publishing...' : 'Publish Article'}</span>
              </Button>
            </div>
          </div>

          {/* Bottom row: Title, Badges, and Slug / Hint info - NO IMAGE HERE */}
          <div className="pt-2.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight truncate max-w-[260px] sm:max-w-md">
                {title || 'New Editorial Story'}
              </h1>
              <Badge variant={status === 'PUBLISHED' ? 'default' : 'outline'} className="text-[10px] px-2 py-0.5">
                {status}
              </Badge>
            </div>

            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-mono shrink-0">
              <span>/{slug || 'auto-generated-slug'}</span>
              <span>•</span>
              <span>Draft Mode Available</span>
            </div>
          </div>
        </div>

        {/* Tabs System */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/80 p-1 rounded-xl">
            <TabsTrigger value="content" className="gap-2 text-xs font-semibold rounded-lg">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Content & Media</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-2 text-xs font-semibold rounded-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publishing & SEO</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CONTENT & MEDIA */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Article Title & Summary</CardTitle>
                    <CardDescription className="text-xs">
                      The headline title and preview text for article listings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Headline Title *
                      </label>
                      <Input
                        required
                        placeholder="e.g. The Warmth of Solid Walnut in Contemporary Spaces"
                        value={title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTitle(val);
                          if (!isCustomSlug) {
                            setSlug(generateSlug(val));
                          }
                        }}
                        className="bg-background font-medium"
                      />
                    </div>

                    {/* URL Slug Field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>URL Slug (Unique Database Key) *</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomSlug(false);
                            setSlug(generateSlug(title));
                          }}
                          className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Reset from Title
                        </button>
                      </div>
                      <Input
                        value={slug}
                        onChange={(e) => {
                          setIsCustomSlug(true);
                          setSlug(generateSlug(e.target.value));
                        }}
                        placeholder="e.g. the-warmth-of-solid-walnut"
                        className="font-mono text-xs bg-background"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Excerpt / Summary
                      </label>
                      <textarea
                        rows={3}
                        className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="A brief 1-2 sentence lead summary shown on home cards and search results..."
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Body Content Editor Card with Write/Preview Toggle */}
                <Card className="overflow-hidden">
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2 border-b border-border/60">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-foreground whitespace-nowrap">
                        Article Body <span className="text-destructive">*</span>
                      </h3>
                      <span className="hidden sm:inline text-xs text-muted-foreground font-normal">
                        — Rich editorial markdown story
                      </span>
                    </div>

                    {/* Write vs Preview Toggle - Compact on mobile, guaranteed one line */}
                    <div className="flex items-center rounded-lg border border-border bg-muted/60 p-0.5 sm:p-1 text-xs shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditorMode('write')}
                        className={`px-2 sm:px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 sm:gap-1.5 ${
                          editorMode === 'write'
                            ? 'bg-card text-foreground shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>Write</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorMode('preview')}
                        className={`px-2 sm:px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 sm:gap-1.5 ${
                          editorMode === 'preview'
                            ? 'bg-card text-foreground shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>

                  <CardContent className="p-3.5 sm:p-5">
                    {editorMode === 'write' ? (
                      <div className="space-y-2">
                        <textarea
                          required
                          rows={16}
                          className="w-full rounded-md border border-input bg-background p-4 text-sm font-mono leading-relaxed shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          placeholder="# Introduction&#10;&#10;Write your craftsmanship story here in markdown..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono px-1 gap-2 pt-1">
                          <span className="truncate">
                            <span className="hidden sm:inline">Markdown: # H1, ## H2, **bold**, *italic*, - lists</span>
                            <span className="sm:hidden">Markdown enabled</span>
                          </span>
                          <span className="shrink-0 font-medium text-foreground/80">
                            {wordCount} words • ~{readingTime}m read
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="min-h-[380px] p-4 sm:p-6 rounded-xl border border-border/70 bg-card/60 overflow-x-auto">
                        <MarkdownPreview content={content} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Featured Image, Category, Status Sidebar (1 col) */}
              <div className="space-y-6">
                {/* Featured Cover Image Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      <span>Featured Image</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      The hero cover image displayed on article banners.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {featuredImage ? (
                      <div className="space-y-3">
                        <div className="w-full aspect-video rounded-xl bg-muted border border-border overflow-hidden relative group">
                          <img
                            src={featuredImage}
                            alt="Featured Cover"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsMediaPickerOpen(true)}
                            className="flex-1 text-xs gap-1.5 h-8"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Change Image</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFeaturedImage('')}
                            className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/60 bg-muted/20 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center space-y-2 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">Select Cover Image</p>
                          <p className="text-[11px] text-muted-foreground">
                            Choose from Media Library or upload a photo
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1 pt-1">
                      <label className="text-[11px] font-medium text-muted-foreground">
                        Or enter direct Image URL
                      </label>
                      <Input
                        placeholder="https://..."
                        className="text-xs h-8 bg-background font-mono"
                        value={featuredImage}
                        onChange={(e) => setFeaturedImage(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Category & Topic Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-wood-600 dark:text-wood-400" />
                      <span>Category & Topic</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Assign this story to an editorial topic.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Topic Category</label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                      >
                        <option value="">No category (General)</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-1 text-[11px] text-muted-foreground flex items-center justify-between">
                      <span>Need new topics?</span>
                      <Link
                        href="/blog/categories"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <span>Manage Categories</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Status & Visibility Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Publishing Status</CardTitle>
                    <CardDescription className="text-xs">
                      Control visibility on the public website.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setStatus('PUBLISHED')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          status === 'PUBLISHED'
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                            : 'border-border hover:border-muted-foreground/30 bg-card'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold text-foreground">Published</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Visible immediately to visitors
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStatus('DRAFT')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          status === 'DRAFT'
                            ? 'border-wood-500 bg-wood-50/50 dark:bg-wood-950/20 shadow-xs'
                            : 'border-border hover:border-muted-foreground/30 bg-card'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="text-xs font-bold text-foreground">Draft</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Only visible to admin team
                        </p>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: PUBLISHING & SEO */}
          <TabsContent value="seo" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Real-Time SEO & GEO Checklist (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <SeoChecklist
                  title={title}
                  slug={slug}
                  excerpt={excerpt}
                  content={content}
                  featuredImage={featuredImage}
                  categoryId={categoryId}
                  categoryName={categories.find((c) => c.id === categoryId)?.name}
                />
              </div>

              {/* Right Column: Previews & Metrics (1 col) */}
              <div className="space-y-6">
                {/* Search Engine Snippet Preview Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span>Google SERP Preview</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Live search listing preview on Google Desktop & Mobile.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-muted/20 space-y-1.5">
                      <div className="text-[11px] text-muted-foreground truncate font-mono">
                        https://shaadwood.com › blog › <span className="text-foreground font-semibold">{slug || 'article-slug'}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                        {title || 'New Editorial Story'} | Shaadwood
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {excerpt ||
                          'Explore our craftsmanship guides, solid wood care tips, and sustainable interior design inspirations from Shaadwood.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Answer Engine / GEO Preview Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-500" />
                      <span>AI Answer Citation (GEO)</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Simulated citation in Perplexity, ChatGPT & Gemini.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-50/20 dark:bg-purple-950/10 space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Synthesized AI Overview</span>
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed italic">
                        &ldquo;{excerpt || (content ? content.slice(0, 150) + '...' : 'Shaadwood produces handcrafted solid wood furniture with Nordic heritage.')}&rdquo;
                      </p>
                      <div className="pt-2 border-t border-border/50 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Citations:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-background border border-border font-medium text-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-wood-500" />
                          [1] shaadwood.com/blog/{slug || 'article-slug'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Article Metrics */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Article Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <span className="text-muted-foreground">Word Count</span>
                      <span className="font-mono font-medium text-foreground">{wordCount} words</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Estimated Read</span>
                      <span className="font-medium text-foreground">~{readingTime} minutes</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Media Picker Dialog */}
      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleMediaSelect}
        title="Select Article Cover Image"
      />
    </div>
  );
}
