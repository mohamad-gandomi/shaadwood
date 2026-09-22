'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, Calendar, User, Eye, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { BlogPost } from '@/types';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [excerpt, setExcerpt] = React.useState('');
  const [content, setContent] = React.useState('');
  const [status, setStatus] = React.useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [categoryId, setCategoryId] = React.useState('');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => api.getBlogPosts(),
  });

  const { data: blogCategories = [] } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => api.getBlogCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createBlogPost(data),
    onSuccess: () => {
      toast.success('Article published');
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setIsCreateOpen(false);
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setCategoryId('');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create article');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      slug: slug || undefined,
      excerpt: excerpt || undefined,
      content,
      status,
      categoryId: categoryId || null,
    });
  };

  return (
    <div className="space-y-8">
      <Header title="Blog & Editorial Content" />

      <div className="px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Woodcraft Guides & Interior Articles</h2>
            <p className="text-xs text-muted-foreground">
              Educational stories, craftsmanship highlights, and SEO articles for furniture lovers.
            </p>
          </div>

          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Write Article
          </Button>
        </div>

        {/* Posts Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading articles...
                    </TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No blog articles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="font-semibold text-foreground">{post.title}</div>
                        {post.excerpt && (
                          <div className="text-xs text-muted-foreground max-w-md truncate">
                            {post.excerpt}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {post.category?.name ? (
                          <Badge variant="wood">{post.category.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">General</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Editorial Staff'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Write Article Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Write New Article</DialogTitle>
            <DialogDescription>Publish design insights or furniture care guides.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Article Title *</label>
              <Input
                required
                placeholder="e.g., The Warmth of Walnut in Contemporary Spaces"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Category</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select category...</option>
                  {blogCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Status</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'DRAFT')}
                >
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Excerpt / Summary</label>
              <Input
                placeholder="Short lead paragraph for search previews and cards"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Article Body (Markdown) *</label>
              <textarea
                required
                rows={6}
                className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono text-xs"
                placeholder="# Introduction..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Publishing...' : 'Publish Article'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
