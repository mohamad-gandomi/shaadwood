'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkCheck, Plus, BookOpen, ArrowLeft, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
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

export default function BlogCategoriesPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [description, setDescription] = React.useState('');

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => api.getBlogCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createBlogCategory(data),
    onSuccess: () => {
      toast.success('Blog category created');
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      setIsCreateOpen(false);
      setName('');
      setSlug('');
      setDescription('');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create blog category');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      slug: slug || undefined,
      description: description || undefined,
    });
  };

  return (
    <div className="space-y-8">
      <Header title="Blog Categories" />

      <div className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/blog"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Articles
              </Link>
            </div>
            <h2 className="text-lg font-bold text-foreground">Editorial Topic Categories</h2>
            <p className="text-xs text-muted-foreground">
              Categorize woodcraft guides, interior styling tips, and furniture care articles.
            </p>
          </div>

          <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            Add Blog Category
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Articles Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Loading blog categories...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No blog categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                          <span>{cat.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        /{cat.slug}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-md truncate">
                        {cat.description || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="wood" className="text-xs">
                          {cat._count?.posts || 0} articles
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Blog Category</DialogTitle>
            <DialogDescription>
              e.g. &quot;Hardwood Maintenance&quot;, &quot;Scandinavian Styling&quot;, &quot;Workshop Stories&quot;.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Category Name *</label>
              <Input
                required
                placeholder="e.g., Woodcraft & Joinery Guides"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Slug (Optional)</label>
              <Input
                placeholder="woodcraft-joinery-guides"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Description</label>
              <Input
                placeholder="Topic overview for visitors and readers"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Saving...' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
