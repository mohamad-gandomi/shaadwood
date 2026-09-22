'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  FileText,
  FolderTree,
  Image as ImageIcon,
  User,
  Sliders,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { BlogPost, BlogCategory } from '@/types';
import { Header } from '@/components/admin/header';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';

export default function BlogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [deletePost, setDeletePost] = React.useState<BlogPost | null>(null);

  // Fetch all articles (including drafts)
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blog-posts'],
    queryFn: () => api.getBlogPosts(),
  });

  // Fetch blog categories for stats & labels
  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ['blog-categories'],
    queryFn: () => api.getBlogCategories(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteBlogPost(id),
    onSuccess: () => {
      toast.success('Article deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setDeletePost(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete article');
    },
  });

  // KPI Statistics
  const stats = React.useMemo(() => {
    let publishedCount = 0;
    let draftCount = 0;

    posts.forEach((p) => {
      if (p.status === 'PUBLISHED') publishedCount++;
      else draftCount++;
    });

    return {
      total: posts.length,
      published: publishedCount,
      draft: draftCount,
      categories: categories.length,
    };
  }, [posts, categories]);

  // Filtered Articles
  const filteredPosts = React.useMemo(() => {
    return posts.filter((p) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(searchLower) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(searchLower)) ||
        p.slug.toLowerCase().includes(searchLower) ||
        (p.category?.name && p.category.name.toLowerCase().includes(searchLower));

      const matchesStatus =
        statusFilter === 'ALL' ? true : p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, searchTerm, statusFilter]);

  return (
    <div className="space-y-8 pb-12">
      <Header title="Blog & Editorial Content" />

      <div className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Woodcraft Stories & Design Guides
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Educational stories, craftsmanship highlights, and SEO articles for furniture lovers.
          </p>
        </div>

        {/* Metrics KPI Cards (Matching Products & Users style) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Total Articles</p>
                <p className="text-xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Published</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.published}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Drafts</p>
                <p className="text-xl font-bold text-wood-700 dark:text-wood-300">
                  {stats.draft}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-wood-100 dark:bg-wood-950/40 text-wood-700 dark:text-wood-300 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Categories</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.categories}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 flex items-center justify-center">
                <FolderTree className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search articles by title, excerpt, slug..."
                className="pl-9 bg-card h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter Buttons - Matching Height (h-9) */}
            <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs shrink-0 h-9 box-border">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                  statusFilter === 'ALL'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('PUBLISHED')}
                className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                  statusFilter === 'PUBLISHED'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('DRAFT')}
                className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                  statusFilter === 'DRAFT'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Draft
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <Button
            onClick={() => router.push('/blog/new')}
            className="gap-2 shrink-0 h-9 font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Write Article</span>
          </Button>
        </div>

        {/* 1. MOBILE VIEW: Responsive Cards (No scroll tables) */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm bg-card border border-border rounded-xl">
              Loading articles...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm bg-card border border-border rounded-xl space-y-2 p-4">
              <Sliders className="w-8 h-8 text-muted-foreground opacity-40 mx-auto" />
              <p className="font-semibold text-foreground">No articles found</p>
              <p className="text-xs text-muted-foreground">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'No blog articles match your active search filters.'
                  : 'Start writing your first furniture editorial story.'}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              return (
                <div
                  key={post.id}
                  onClick={() => router.push(`/blog/${post.id}`)}
                  className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-primary/50 transition-all cursor-pointer space-y-3"
                >
                  {/* Card Header: Featured Image/Icon + Title + Category */}
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-lg bg-muted border border-border/70 overflow-hidden shrink-0 flex items-center justify-center relative">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-6 h-6 text-muted-foreground/50" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                        <span>{post.category?.name || 'General'}</span>
                        <span>•</span>
                        <span className="truncate">/{post.slug}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Middle: Excerpt Preview */}
                  {post.excerpt && (
                    <p className="text-xs text-muted-foreground line-clamp-2 pt-1">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Card Footer: Status & Actions */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            post.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-400'
                          }`}
                        />
                        <span className="font-medium text-foreground">{post.status}</span>
                      </div>
                      <span>•</span>
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/blog/${post.id}`);
                        }}
                        title="Edit article"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletePost(post);
                        }}
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 2. DESKTOP VIEW: Table with Actions */}
        <Card className="hidden md:block overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[380px]">Article</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      Loading articles...
                    </TableCell>
                  </TableRow>
                ) : filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No matching blog articles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow
                      key={post.id}
                      onClick={() => router.push(`/blog/${post.id}`)}
                      className="cursor-pointer hover:bg-muted/50 transition-colors group"
                    >
                      {/* Article Info: Thumbnail + Title + Excerpt + Slug */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted border border-border/70 overflow-hidden shrink-0 flex items-center justify-center group-hover:border-primary/40 transition-colors relative">
                            {post.featuredImage ? (
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BookOpen className="w-5 h-5 text-muted-foreground/50" />
                            )}
                          </div>

                          <div className="space-y-0.5 min-w-0">
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {post.title}
                            </div>
                            {post.excerpt && (
                              <div className="text-xs text-muted-foreground truncate max-w-sm">
                                {post.excerpt}
                              </div>
                            )}
                            <div className="text-[11px] font-mono text-muted-foreground">
                              /{post.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        {post.category?.name ? (
                          <Badge variant="wood">{post.category.name}</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">General</span>
                        )}
                      </TableCell>

                      {/* Author */}
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>
                            {post.author
                              ? `${post.author.firstName} ${post.author.lastName}`
                              : 'Editorial Team'}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={post.status === 'PUBLISHED' ? 'success' : 'secondary'}
                          className="text-xs"
                        >
                          {post.status}
                        </Badge>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/blog/${post.id}`);
                            }}
                            title="Edit article"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletePost(post);
                            }}
                            title="Delete article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deletePost)} onOpenChange={(open) => !open && setDeletePost(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{' '}
              <strong className="text-foreground">{deletePost?.title}</strong>? This action cannot be
              undone and will remove the article from the public website.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletePost(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <HoldToDeleteButton
              onTrigger={() => {
                if (deletePost) {
                  deleteMutation.mutate(deletePost.id);
                }
              }}
              isPending={deleteMutation.isPending}
              label="Delete Article"
              pendingLabel="Deleting Article..."
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
