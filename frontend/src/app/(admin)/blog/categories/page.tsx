'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookmarkCheck,
  Plus,
  Trash2,
  Pencil,
  Image as ImageIcon,
  AlertTriangle,
  Search,
  Layers,
  ExternalLink,
  Sliders,
  ArrowLeft,
  BookOpen,
  FolderTree,
  Folder,
  CornerDownRight,
  Tag,
  Link as LinkIcon,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { BlogCategory, MediaItem } from '@/types';
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
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { cn } from '@/lib/utils';

export default function BlogCategoriesPage() {
  const queryClient = useQueryClient();

  // Search filter
  const [search, setSearch] = React.useState('');

  // Category Create / Edit Dialog State
  const [catDialog, setCatDialog] = React.useState<{
    isOpen: boolean;
    mode: 'CREATE' | 'EDIT';
    category?: BlogCategory;
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
  const [isCustomSlug, setIsCustomSlug] = React.useState(false);

  // Delete Warning Confirmation Dialog State
  const [deleteConfirmCat, setDeleteConfirmCat] = React.useState<BlogCategory | null>(null);

  // Media Picker Dialog State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);

  // Helper to generate a slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Queries
  const { data: tree = [], isLoading } = useQuery({
    queryKey: ['blog-categories-tree'],
    queryFn: () => api.getBlogCategoriesTree(),
  });

  const { data: flatCategories = [] } = useQuery({
    queryKey: ['blog-categories-flat'],
    queryFn: () => api.getBlogCategories(),
  });

  // Calculate Metrics KPI
  const stats = React.useMemo(() => {
    const rootCount = tree.length;
    let subCount = 0;
    let withImageCount = 0;
    let totalPosts = 0;

    flatCategories.forEach((c) => {
      if (c.parentId) subCount++;
      if (c.image) withImageCount++;
      totalPosts += c._count?.posts || 0;
    });

    return {
      total: flatCategories.length,
      roots: rootCount,
      subs: subCount,
      withImage: withImageCount,
      totalPosts,
    };
  }, [tree, flatCategories]);

  // Filter Categories Tree by search term
  const filteredTree = React.useMemo(() => {
    if (!search.trim()) return tree;
    const q = search.toLowerCase().trim();

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
      .filter(Boolean) as BlogCategory[];
  }, [tree, search]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => api.createBlogCategory(data),
    onSuccess: (cat) => {
      toast.success(`Blog category "${cat.name}" created`);
      queryClient.invalidateQueries({ queryKey: ['blog-categories-tree'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories-flat'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      closeCatDialog();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create blog category');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateBlogCategory(id, data),
    onSuccess: (cat) => {
      toast.success(`Blog category "${cat.name}" updated`);
      queryClient.invalidateQueries({ queryKey: ['blog-categories-tree'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories-flat'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      closeCatDialog();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update blog category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteBlogCategory(id),
    onSuccess: () => {
      toast.success('Category removed permanently');
      queryClient.invalidateQueries({ queryKey: ['blog-categories-tree'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories-flat'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
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
    setIsCustomSlug(false);
  };

  const handleOpenEdit = (category: BlogCategory) => {
    setCatDialog({ isOpen: true, mode: 'EDIT', category });
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || '');
    setImage(category.image || '');
    setParentId(category.parentId || '');
    setDisplayOrder(category.displayOrder ?? 0);
    setIsCustomSlug(true);
  };

  const closeCatDialog = () => {
    setCatDialog((prev) => ({ ...prev, isOpen: false }));
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setParentId('');
    setDisplayOrder(0);
    setIsCustomSlug(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const finalSlug = slug.trim() || generateSlug(name);

    const payload = {
      name: name.trim(),
      slug: finalSlug,
      description: description.trim() || undefined,
      image: image.trim() || null,
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
    toast.success('Category cover image selected');
  };

  return (
    <div className="space-y-8 pb-16">
      <Header title="Blog Categories" />

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/blog"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back to Articles</span>
              </Link>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Editorial Topic Categories
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage hierarchical topic collections, cover photography, and display order for your stories.
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

        {/* Metrics KPI Cards (Product Category Pattern) */}
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
                <p className="text-xs font-medium text-muted-foreground">Root Collections</p>
                <p className="text-xl font-bold text-wood-700 dark:text-wood-300">
                  {stats.roots}
                </p>
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

        {/* Categories Tree View (Matches Product Categories Tree Pattern) */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center text-xs text-muted-foreground">
              Loading editorial category taxonomy and sub-topics...
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
                      : 'Create your first topic collection to organize your editorial articles.'}
                  </p>
                </div>
                {search ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearch('')}
                    className="text-xs"
                  >
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
                            <Folder className="w-5 h-5 text-wood-700 dark:text-wood-300" />
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

                            {root.displayOrder !== undefined && root.displayOrder > 0 && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                #{root.displayOrder}
                              </span>
                            )}
                          </div>

                          {root.description ? (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {root.description}
                            </p>
                          ) : (
                            <p className="text-[11px] text-muted-foreground/60 italic">
                              No description provided
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Badges & Action Buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
                        <Link
                          href={`/blog?categoryId=${root.id}`}
                          className="hover:opacity-80 transition-opacity"
                          title="View articles in this topic"
                        >
                          <Badge variant="outline" className="text-[11px] font-medium gap-1 hover:bg-muted/60">
                            <span>{root._count?.posts || 0} articles</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </Badge>
                        </Link>

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
                                    {sub.displayOrder !== undefined && sub.displayOrder > 0 && (
                                      <span className="text-[9px] font-mono px-1 rounded bg-background border text-muted-foreground">
                                        #{sub.displayOrder}
                                      </span>
                                    )}
                                  </div>
                                  {sub.description && (
                                    <p className="text-[11px] text-muted-foreground truncate">
                                      {sub.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end xs:self-center shrink-0">
                                <Link
                                  href={`/blog?categoryId=${sub.id}`}
                                  className="hover:opacity-80 transition-opacity"
                                  title="View articles in this topic"
                                >
                                  <Badge variant="secondary" className="text-[10px] h-5 gap-1 hover:bg-muted/80">
                                    <span>{sub._count?.posts || 0} articles</span>
                                    <ExternalLink className="w-2 h-2 opacity-60" />
                                  </Badge>
                                </Link>

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

      {/* CREATE / EDIT CATEGORY MODAL (Matches Product Categories Pattern) */}
      <Dialog open={catDialog.isOpen} onOpenChange={closeCatDialog}>
        <DialogContent className="sm:max-w-xl w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain">
          <DialogHeader>
            <DialogTitle>
              {catDialog.mode === 'CREATE' ? 'Create Blog Category' : `Edit Category: ${catDialog.category?.name}`}
            </DialogTitle>
            <DialogDescription>
              Topic categories organize your woodworking stories, design tips, and SEO topic clusters.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Category Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Category Name *</label>
              <Input
                required
                placeholder="e.g. Woodcraft & Joinery Guides"
                value={name}
                onChange={(e) => {
                  const val = e.target.value;
                  setName(val);
                  if (!isCustomSlug && catDialog.mode === 'CREATE') {
                    setSlug(generateSlug(val));
                  }
                }}
              />
            </div>

            {/* URL Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>URL Slug *</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomSlug(false);
                    setSlug(generateSlug(name));
                  }}
                  className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset from Name
                </button>
              </div>
              <Input
                required
                placeholder="e.g. woodcraft-joinery-guides"
                className="font-mono text-xs"
                value={slug}
                onChange={(e) => {
                  setIsCustomSlug(true);
                  setSlug(generateSlug(e.target.value));
                }}
              />
            </div>

            {/* Parent Category & Display Order (Product Category Pattern) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full min-w-0">
              <div className="space-y-1.5 sm:col-span-2 min-w-0">
                <label className="text-xs font-semibold text-foreground">Parent Topic Category</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus:outline-none focus:ring-1 focus:ring-ring"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                >
                  <option value="">None (Top-Level Topic Collection)</option>
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
                  className="text-xs w-full font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">Description (Optional)</label>
              <textarea
                rows={2}
                className="w-full rounded-md border border-input bg-background p-3 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Brief summary of what readers will learn in this topic collection..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Cover Image Section (Mobile Friendly + Media Picker) */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-3 w-full min-w-0 overflow-hidden">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Category Cover Image (Optional)</span>
              </label>

              {/* Image Preview & Actions */}
              <div className="flex items-center gap-3">
                {image ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border shrink-0 shadow-2xs">
                    <img
                      src={image}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium"
                      title="Remove image"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-muted/60 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground shrink-0 gap-1">
                    <ImageIcon className="w-5 h-5 opacity-40" />
                    <span className="text-[9px] uppercase font-bold tracking-wider">No Image</span>
                  </div>
                )}

                <div className="space-y-1.5 flex-1 min-w-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="gap-1.5 text-xs h-8 w-full sm:w-auto"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Select from Media Library</span>
                  </Button>
                  <p className="text-[11px] text-muted-foreground">
                    Recommended: 1200×630px or square ratio for topic cards and social share previews.
                  </p>
                </div>
              </div>

              {/* Direct URL Input fallback */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Or enter direct Image URL
                </label>
                <Input
                  placeholder="https://..."
                  className="text-xs h-8 font-mono bg-background"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={closeCatDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="font-semibold shadow-xs"
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

      {/* DELETE CONFIRMATION WARNING DIALOG */}
      <Dialog
        open={Boolean(deleteConfirmCat)}
        onOpenChange={(open) => !open && setDeleteConfirmCat(null)}
      >
        <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogDescription>
                  This will permanently remove the category from the database.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {deleteConfirmCat && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5 space-y-1 text-destructive">
                <p className="font-semibold text-foreground">
                  Are you sure you want to delete &ldquo;{deleteConfirmCat.name}&rdquo;?
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Any articles currently assigned to this topic will become uncategorized. Subcategories under this topic will also be detached. No articles will be deleted.
                </p>
              </div>

              <div className="flex items-center justify-between text-muted-foreground px-1 font-mono">
                <span>Slug: /{deleteConfirmCat.slug}</span>
                <span>{deleteConfirmCat._count?.posts || 0} articles affected</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmCat(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <HoldToDeleteButton
              size="sm"
              onTrigger={() => deleteConfirmCat && deleteMutation.mutate(deleteConfirmCat.id)}
              isPending={deleteMutation.isPending}
              label="Delete Category"
              pendingLabel="Deleting..."
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MEDIA PICKER DIALOG */}
      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleMediaSelect}
        title="Select Category Cover Image"
      />
    </div>
  );
}
