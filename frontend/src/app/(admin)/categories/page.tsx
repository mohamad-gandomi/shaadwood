'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FolderTree,
  Plus,
  Trash2,
  Folder,
  CornerDownRight,
  Tag,
  Pencil,
  Image as ImageIcon,
  AlertTriangle,
  Search,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Category, MediaItem } from '@/types';
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
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { cn } from '@/lib/utils';

export default function CategoriesPage() {
  const queryClient = useQueryClient();

  // Search filter
  const [search, setSearch] = React.useState('');

  // Category Create / Edit Dialog State
  const [catDialog, setCatDialog] = React.useState<{
    isOpen: boolean;
    mode: 'CREATE' | 'EDIT';
    category?: Category;
  }>({
    isOpen: false,
    mode: 'CREATE',
  });

  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('');
  const [parentId, setParentId] = React.useState<string>('');
  const [displayOrder, setDisplayOrder] = React.useState<number>(0);

  // Delete Warning Confirmation Dialog State
  const [deleteConfirmCat, setDeleteConfirmCat] = React.useState<Category | null>(null);

  // Media Picker Dialog State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);

  // Queries
  const { data: tree = [], isLoading } = useQuery({
    queryKey: ['categories-tree'],
    queryFn: () => api.getCategoriesTree(),
  });

  const { data: flatCategories = [] } = useQuery({
    queryKey: ['categories-flat'],
    queryFn: () => api.getCategoriesFlat(),
  });

  // Calculate Metrics
  const stats = React.useMemo(() => {
    let rootCount = tree.length;
    let subCount = 0;
    let withImageCount = 0;

    flatCategories.forEach((c) => {
      if (c.parentId) subCount++;
      if (c.image) withImageCount++;
    });

    return {
      total: flatCategories.length,
      roots: rootCount,
      subs: subCount,
      withImage: withImageCount,
    };
  }, [tree, flatCategories]);

  // Filter Categories Tree
  const filteredTree = React.useMemo(() => {
    if (!search.trim()) return tree;
    const q = search.toLowerCase();

    return tree
      .map((root) => {
        const rootMatches =
          root.name.toLowerCase().includes(q) ||
          root.slug.toLowerCase().includes(q) ||
          (root.description && root.description.toLowerCase().includes(q));

        const matchedChildren = (root.children || []).filter(
          (child) =>
            child.name.toLowerCase().includes(q) ||
            child.slug.toLowerCase().includes(q) ||
            (child.description && child.description.toLowerCase().includes(q)),
        );

        if (rootMatches || matchedChildren.length > 0) {
          return {
            ...root,
            children: matchedChildren,
          };
        }
        return null;
      })
      .filter(Boolean) as Category[];
  }, [tree, search]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => api.createCategory(data),
    onSuccess: (cat) => {
      toast.success(`Category "${cat.name}" created`);
      queryClient.invalidateQueries({ queryKey: ['categories-tree'] });
      queryClient.invalidateQueries({ queryKey: ['categories-flat'] });
      closeCatDialog();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create category');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateCategory(id, data),
    onSuccess: (cat) => {
      toast.success(`Category "${cat.name}" updated`);
      queryClient.invalidateQueries({ queryKey: ['categories-tree'] });
      queryClient.invalidateQueries({ queryKey: ['categories-flat'] });
      closeCatDialog();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category removed permanently');
      queryClient.invalidateQueries({ queryKey: ['categories-tree'] });
      queryClient.invalidateQueries({ queryKey: ['categories-flat'] });
      setDeleteConfirmCat(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete category');
    },
  });

  // Modal Handlers
  const handleOpenCreate = (defaultParentId?: string) => {
    setCatDialog({ isOpen: true, mode: 'CREATE' });
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setParentId(defaultParentId || '');
    setDisplayOrder(flatCategories.length);
  };

  const handleOpenEdit = (category: Category) => {
    setCatDialog({ isOpen: true, mode: 'EDIT', category });
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || '');
    setImage(category.image || '');
    setParentId(category.parentId || '');
    setDisplayOrder(category.displayOrder ?? 0);
  };

  const closeCatDialog = () => {
    setCatDialog((prev) => ({ ...prev, isOpen: false }));
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setParentId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      image: image.trim() || undefined,
      parentId: parentId || null,
      displayOrder: Number(displayOrder) || 0,
    };

    if (catDialog.mode === 'CREATE') {
      createMutation.mutate(payload);
    } else if (catDialog.mode === 'EDIT' && catDialog.category) {
      updateMutation.mutate({ id: catDialog.category.id, data: payload });
    }
  };

  const handleMediaSelect = (media: MediaItem) => {
    setImage(media.url);
    setIsMediaPickerOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      <Header title="Furniture Categories & Collections" />

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Room & Furniture Categories
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage room collections, catalog imagery, and hierarchical taxonomy for your store.
            </p>
          </div>

          <Button
            onClick={() => handleOpenCreate()}
            className="gap-2 font-semibold shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        {/* Metrics KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Total Categories</p>
                <p className="text-xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FolderTree className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Room Collections</p>
                <p className="text-xl font-bold text-wood-700 dark:text-wood-300">{stats.roots}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-wood-100 dark:bg-wood-950/40 text-wood-700 dark:text-wood-300 flex items-center justify-center">
                <Folder className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Subcategories</p>
                <p className="text-xl font-bold text-amber-600">{stats.subs}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">With Visual Cover</p>
                <p className="text-xl font-bold text-emerald-600">{stats.withImage}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories by name or slug..."
              className="pl-9 text-xs h-9 w-full"
            />
          </div>

          {search && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearch('')}
              className="text-xs h-9 self-start sm:self-auto"
            >
              Clear Search
            </Button>
          )}
        </div>

        {/* Categories Tree View */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center text-xs text-muted-foreground">
              Loading category taxonomy and image covers...
            </div>
          ) : filteredTree.length === 0 ? (
            <Card className="py-16 text-center border-dashed">
              <CardContent className="space-y-3 max-w-sm mx-auto">
                <Sliders className="w-10 h-10 text-muted-foreground opacity-40 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">No categories found</h3>
                  <p className="text-xs text-muted-foreground">
                    {search
                      ? 'No categories matched your search criteria.'
                      : 'Create your first room collection to organize products.'}
                  </p>
                </div>
                {search ? (
                  <Button variant="outline" size="sm" onClick={() => setSearch('')} className="text-xs">
                    Clear Search
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleOpenCreate()} className="text-xs gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Create First Category
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredTree.map((root) => {
              const hasRootImage = Boolean(root.image);
              const childrenList = root.children || [];

              return (
                <Card
                  key={root.id}
                  className="border-border/80 shadow-xs hover:border-primary/40 transition-all duration-200 overflow-hidden"
                >
                  <CardContent className="p-4 sm:p-5">
                    {/* Root Category Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Cover Thumbnail + Info */}
                      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                        {/* Image Thumbnail with zoom effect or Folder Icon */}
                        {hasRootImage ? (
                          <div
                            onClick={() => handleOpenEdit(root)}
                            className="relative w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0 shadow-2xs cursor-pointer group/thumb"
                            title="Click to edit category image"
                          >
                            <img
                              src={root.image!}
                              alt={root.name}
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover/thumb:bg-black/0 transition-colors" />
                          </div>
                        ) : (
                          <div
                            onClick={() => handleOpenEdit(root)}
                            className="w-12 h-12 rounded-xl bg-wood-100 dark:bg-wood-950/50 flex items-center justify-center text-wood-800 dark:text-wood-200 border border-wood-200/80 dark:border-wood-900/60 shrink-0 cursor-pointer shadow-2xs hover:bg-wood-200/60 transition-colors"
                            title="Click to set image"
                          >
                            <Folder className="w-5 h-5" />
                          </div>
                        )}

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(root)}
                              className="font-bold text-base text-foreground hover:text-primary transition-colors text-left flex items-center gap-1.5 group/name"
                              title="Click to edit category details"
                            >
                              <span>{root.name}</span>
                              <Pencil className="w-3.5 h-3.5 opacity-0 group-hover/name:opacity-100 text-muted-foreground transition-opacity" />
                            </button>

                            <span className="font-mono text-xs text-muted-foreground">
                              /{root.slug}
                            </span>
                          </div>

                          {root.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {root.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Badges & Action Buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
                        <Badge variant="outline" className="text-[11px] font-medium">
                          {root._count?.products || 0} products
                        </Badge>

                        {childrenList.length > 0 && (
                          <Badge variant="secondary" className="text-[11px] font-medium hidden sm:inline-flex">
                            {childrenList.length} subcategories
                          </Badge>
                        )}

                        {/* Add Subcategory Quick Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs gap-1 font-medium"
                          onClick={() => handleOpenCreate(root.id)}
                          title={`Add subcategory to ${root.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span className="hidden xs:inline">Add Sub</span>
                        </Button>

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => handleOpenEdit(root)}
                          title="Edit category"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>

                        {/* Delete Button with Warning Modal */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteConfirmCat(root)}
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Subcategories Container */}
                    {childrenList.length > 0 && (
                      <div className="mt-4 pl-3 sm:pl-6 border-l-2 border-wood-300 dark:border-wood-800 space-y-2 ml-2 sm:ml-4">
                        {childrenList.map((sub) => {
                          const hasSubImage = Boolean(sub.image);

                          return (
                            <div
                              key={sub.id}
                              className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors border border-border/40"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <CornerDownRight className="w-3.5 h-3.5 text-wood-600 dark:text-wood-400 shrink-0" />

                                {hasSubImage ? (
                                  <div
                                    onClick={() => handleOpenEdit(sub)}
                                    className="w-7 h-7 rounded-md overflow-hidden border border-border shrink-0 shadow-2xs cursor-pointer group/subthumb"
                                    title="Click to edit subcategory image"
                                  >
                                    <img
                                      src={sub.image!}
                                      alt={sub.name}
                                      className="w-full h-full object-cover group-hover/subthumb:scale-115 transition-transform"
                                      loading="lazy"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded bg-wood-100/80 dark:bg-wood-950/40 flex items-center justify-center text-wood-700 dark:text-wood-300 shrink-0 text-[10px]">
                                    <Tag className="w-3 h-3" />
                                  </div>
                                )}

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(sub)}
                                      className="text-xs font-semibold text-foreground hover:text-primary transition-colors text-left flex items-center gap-1 group/subname"
                                      title="Click to edit subcategory"
                                    >
                                      <span className="truncate">{sub.name}</span>
                                      <Pencil className="w-3 h-3 opacity-0 group-hover/subname:opacity-100 text-muted-foreground transition-opacity" />
                                    </button>
                                    <span className="font-mono text-[10px] text-muted-foreground truncate">
                                      /{sub.slug}
                                    </span>
                                  </div>
                                  {sub.description && (
                                    <p className="text-[11px] text-muted-foreground truncate">
                                      {sub.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end xs:self-center shrink-0">
                                <Badge variant="secondary" className="text-[10px] h-5">
                                  {sub._count?.products || 0} products
                                </Badge>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                  onClick={() => handleOpenEdit(sub)}
                                  title="Edit subcategory"
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => setDeleteConfirmCat(sub)}
                                  title="Delete subcategory"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* CREATE / EDIT CATEGORY DIALOG */}
      <Dialog open={catDialog.isOpen} onOpenChange={closeCatDialog}>
        <DialogContent className="sm:max-w-xl w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain">
          <DialogHeader className="pr-6">
            <DialogTitle>
              {catDialog.mode === 'CREATE' ? 'Add New Category' : `Edit Category: ${catDialog.category?.name}`}
            </DialogTitle>
            <DialogDescription>
              {catDialog.mode === 'CREATE'
                ? 'Create a top-level room collection or a nested subcategory.'
                : 'Modify category name, slug, parent collection, and visual cover image.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-1 w-full min-w-0 max-w-full">
            {/* Name & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Category Name *</label>
                <Input
                  required
                  placeholder="e.g., Living Room, Dining Chairs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Slug (Optional)</label>
                <Input
                  placeholder="living-room (auto-generated if empty)"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="text-xs font-mono w-full"
                />
              </div>
            </div>

            {/* Parent Category & Display Order */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full min-w-0">
              <div className="space-y-1.5 sm:col-span-2 min-w-0">
                <label className="text-xs font-semibold text-foreground">Parent Room Collection</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus:outline-none focus:ring-1 focus:ring-ring"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                >
                  <option value="">None (Top-Level Room Collection)</option>
                  {flatCategories
                    .filter((c) => catDialog.mode !== 'EDIT' || c.id !== catDialog.category?.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.parent ? `— ${c.name}` : c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Display Order</label>
                <Input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  className="text-xs w-full"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">Description (Optional)</label>
              <Input
                placeholder="Short description for collection cards and SEO"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs w-full"
              />
            </div>

            {/* Visual Cover Image Field Section */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-3 w-full min-w-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 shrink-0">
                  <ImageIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                  Category Cover Image
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 sm:h-7 gap-1 w-full sm:w-auto shrink-0"
                  onClick={() => setIsMediaPickerOpen(true)}
                >
                  <Plus className="w-3 h-3 shrink-0" />
                  Choose from Media Library
                </Button>
              </div>

              {image ? (
                <div className="flex items-center justify-between gap-2.5 p-2 rounded-lg border border-border bg-card w-full min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0 shadow-2xs">
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate">Selected Cover Image</p>
                      <p className="text-[10px] font-mono text-muted-foreground truncate" title={image}>
                        {image}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setImage('')}
                    className="text-xs text-destructive hover:bg-destructive/10 h-7 shrink-0"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 w-full min-w-0">
                  <Input
                    placeholder="Paste image URL (or click 'Choose from Media Library')"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="text-xs w-full"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Tip: Optimized WebP banner images enhance storefront room navigation.
                  </p>
                </div>
              )}
            </div>

            {/* Live Card Preview */}
            <div className="p-3 rounded-lg border border-border/60 bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs w-full min-w-0 overflow-hidden">
              <span className="text-muted-foreground font-medium shrink-0">Storefront Preview:</span>
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-border bg-background shadow-2xs self-start sm:self-auto min-w-0 max-w-full">
                {image ? (
                  <img
                    src={image}
                    alt="preview"
                    className="w-6 h-6 rounded-md object-cover ring-1 ring-border shrink-0"
                  />
                ) : (
                  <Folder className="w-4 h-4 text-wood-700 dark:text-wood-300 shrink-0" />
                )}
                <span className="font-semibold text-foreground truncate">
                  {name.trim() || 'Category Name'}
                </span>
                {parentId && (
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 shrink-0">
                    Subcategory
                  </Badge>
                )}
              </div>
            </div>

            <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={closeCatDialog}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full sm:w-auto font-semibold"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : catDialog.mode === 'CREATE'
                  ? 'Create Category'
                  : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* WARNING MODAL: DELETE CATEGORY */}
      <Dialog
        open={Boolean(deleteConfirmCat)}
        onOpenChange={() => setDeleteConfirmCat(null)}
      >
        <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)]">
          <DialogHeader className="pr-6">
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              Delete Category &quot;{deleteConfirmCat?.name}&quot;?
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-1 text-xs sm:text-sm">
              <p>
                Are you sure you want to permanently delete the category{' '}
                <strong className="text-foreground">&quot;{deleteConfirmCat?.name}&quot;</strong>?
              </p>

              {deleteConfirmCat?.children && deleteConfirmCat.children.length > 0 && (
                <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive space-y-1">
                  <p className="font-semibold text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Cascading Deletion Warning:
                  </p>
                  <p className="text-xs">
                    This category contains{' '}
                    <strong>{deleteConfirmCat.children.length} subcategories</strong> (
                    {deleteConfirmCat.children.map((c) => c.name).join(', ')}). They will also be
                    permanently deleted from your catalog!
                  </p>
                </div>
              )}

              {(deleteConfirmCat?._count?.products || 0) > 0 && (
                <p className="text-destructive/90 font-medium text-xs">
                  Warning: There are {deleteConfirmCat?._count?.products} products currently associated
                  with this category.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setDeleteConfirmCat(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto gap-1.5 font-semibold"
              onClick={() => deleteConfirmCat && deleteMutation.mutate(deleteConfirmCat.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              {deleteMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MEDIA PICKER DIALOG FOR CATEGORY COVERS */}
      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleMediaSelect}
        title="Select Category Cover Image"
        description="Choose a high-resolution WebP photograph from your media library for this category."
      />
    </div>
  );
}
