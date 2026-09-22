'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderTree, Plus, Trash2, Folder, CornerDownRight, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Category } from '@/types';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [parentId, setParentId] = React.useState<string>('');

  const { data: tree = [], isLoading } = useQuery({
    queryKey: ['categories-tree'],
    queryFn: () => api.getCategoriesTree(),
  });

  const { data: flatCategories = [] } = useQuery({
    queryKey: ['categories-flat'],
    queryFn: () => api.getCategoriesFlat(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createCategory(data),
    onSuccess: () => {
      toast.success('Category created');
      queryClient.invalidateQueries({ queryKey: ['categories-tree'] });
      queryClient.invalidateQueries({ queryKey: ['categories-flat'] });
      setIsCreateOpen(false);
      setName('');
      setSlug('');
      setDescription('');
      setParentId('');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['categories-tree'] });
      queryClient.invalidateQueries({ queryKey: ['categories-flat'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete category');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      slug: slug || undefined,
      description: description || undefined,
      parentId: parentId || null,
    });
  };

  return (
    <div className="space-y-8">
      <Header title="Hierarchical Furniture Categories" />

      <div className="px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Room & Type Categories Tree</h2>
            <p className="text-xs text-muted-foreground">
              Hierarchical nested structure tailored for furniture stores (e.g., Living Room → Sofas & Couches).
            </p>
          </div>

          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        {/* Categories Tree View */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading category tree...</p>
          ) : tree.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories found.</p>
          ) : (
            tree.map((root) => (
              <Card key={root.id} className="border-border/80 shadow-2xs">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-wood-100 flex items-center justify-center text-wood-800">
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground flex items-center gap-2">
                          <span>{root.name}</span>
                          <span className="font-mono text-xs text-muted-foreground font-normal">
                            /{root.slug}
                          </span>
                        </div>
                        {root.description && (
                          <div className="text-xs text-muted-foreground">{root.description}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {root._count?.products || 0} direct products
                      </Badge>
                      <button
                        onClick={() => deleteMutation.mutate(root.id)}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {root.children && root.children.length > 0 && (
                    <div className="mt-4 pl-6 border-l-2 border-wood-200/80 space-y-2.5 ml-4">
                      {root.children.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <CornerDownRight className="w-4 h-4 text-wood-600" />
                            <div>
                              <span className="text-xs font-semibold text-foreground">
                                {sub.name}
                              </span>
                              <span className="font-mono text-[11px] text-muted-foreground ml-2">
                                /{sub.slug}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-[11px]">
                              {sub._count?.products || 0} products
                            </Badge>
                            <button
                              onClick={() => deleteMutation.mutate(sub.id)}
                              className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                              title="Delete subcategory"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a top-level room category or a nested subcategory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Category Name *</label>
              <Input
                required
                placeholder="e.g., Bedroom, Coffee Tables"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Parent Category (Optional)</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">None (Top-Level Category)</option>
                {flatCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.parent ? `— ${c.name}` : c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Slug (Optional)</label>
              <Input
                placeholder="bedroom (auto-generated if empty)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Description</label>
              <Input
                placeholder="Short description for collection cards"
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
