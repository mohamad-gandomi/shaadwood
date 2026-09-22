'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Save,
  Plus,
  Info,
  DollarSign,
  Scale,
  Maximize2,
  Image as ImageIcon,
  Check,
  Link as LinkIcon,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { MediaItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = React.useState('overview');
  const [newImageUrl, setNewImageUrl] = React.useState('');
  const [newImageAlt, setNewImageAlt] = React.useState('');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = React.useState<'gallery' | 'cover'>('gallery');

  const [formData, setFormData] = React.useState({
    name: '',
    slug: '',
    sku: '',
    productType: 'SIMPLE' as 'SIMPLE' | 'VARIABLE',
    basePrice: '',
    salePrice: '',
    stockQuantity: 10,
    manageStock: true,
    description: '',
    shortDescription: '',
    dimensions: '',
    weight: '',
    featured: false,
    status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
    categoryId: '',
    images: [] as Array<{ url: string; altText?: string | null; isPrimary: boolean; displayOrder: number }>,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories-flat'],
    queryFn: () => api.getCategoriesFlat(),
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createProduct(data),
    onSuccess: (newProduct) => {
      toast.success('Product created successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (newProduct?.id) {
        router.push(`/products/${newProduct.id}`);
      } else {
        router.push('/products');
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create product');
    },
  });

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Product title is required');
      setActiveTab('overview');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Product description is required');
      setActiveTab('overview');
      return;
    }
    if (!formData.basePrice || parseFloat(formData.basePrice) < 0) {
      toast.error('Valid base price is required');
      setActiveTab('pricing');
      return;
    }

    createMutation.mutate({
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      sku: formData.sku || undefined,
      productType: formData.productType,
      basePrice: parseFloat(formData.basePrice) || 0,
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      stockQuantity: Number(formData.stockQuantity) || 0,
      manageStock: formData.manageStock,
      description: formData.description,
      shortDescription: formData.shortDescription || undefined,
      dimensions: formData.dimensions || undefined,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      featured: formData.featured,
      status: formData.status,
      categoryId: formData.categoryId || null,
      images: formData.images.length > 0 ? formData.images : undefined,
    });
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    const isFirst = formData.images.length === 0;
    const updatedImages = [
      ...formData.images,
      {
        url: newImageUrl.trim(),
        altText: newImageAlt.trim() || formData.name,
        isPrimary: isFirst,
        displayOrder: formData.images.length,
      },
    ];
    setFormData({ ...formData, images: updatedImages });
    setNewImageUrl('');
    setNewImageAlt('');
    toast.success('Image added to gallery');
  };

  const handleSetPrimaryImage = (index: number) => {
    const updated = formData.images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setFormData({ ...formData, images: updated });
  };

  const handleRemoveImage = (index: number) => {
    const updated = formData.images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setFormData({ ...formData, images: updated });
  };

  const handleSelectMedia = (media: MediaItem) => {
    if (mediaPickerTarget === 'gallery') {
      const isFirst = formData.images.length === 0;
      setFormData({
        ...formData,
        images: [
          ...formData.images,
          {
            url: media.url,
            altText: media.altText || formData.name,
            isPrimary: isFirst,
            displayOrder: formData.images.length,
          },
        ],
      });
      toast.success(`Attached "${media.originalName}" to product gallery`);
    } else if (mediaPickerTarget === 'cover') {
      const existingIdx = formData.images.findIndex((img) => img.url === media.url);
      if (existingIdx !== -1) {
        handleSetPrimaryImage(existingIdx);
      } else {
        const updated = formData.images.map((img) => ({ ...img, isPrimary: false }));
        setFormData({
          ...formData,
          images: [
            {
              url: media.url,
              altText: media.altText || formData.name,
              isPrimary: true,
              displayOrder: 0,
            },
            ...updated,
          ],
        });
      }
      toast.success(`Set "${media.originalName}" as primary cover image`);
    }
  };

  const primaryImage = formData.images.find((img) => img.isPrimary) || formData.images[0];

  return (
    <div className="space-y-6 pb-20">
      <Header title="Add New Product" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Streamlined Top Navigation & Identity Bar */}
        <div className="p-3.5 sm:p-5 rounded-xl border border-border bg-card shadow-xs space-y-3">
          {/* Top row: Back link + Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Products</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 sm:h-9 px-3"
                onClick={() => router.push('/products')}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={createMutation.isPending}
                className="gap-1.5 text-xs h-8 sm:h-9 px-3 sm:px-4 shadow-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5" />
                {createMutation.isPending ? 'Creating...' : 'Create & Open Product'}
              </Button>
            </div>
          </div>

          {/* Bottom row: Title & instructions */}
          <div className="pt-2.5 border-t border-border/50">
            <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight">
              {formData.name || 'New Furniture Product'}
            </h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Fill in product specifications, pricing, and media below. You can configure variations immediately after creation.
            </p>
          </div>
        </div>

        {/* Segmented Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto h-auto p-1.5 bg-muted/80 rounded-xl border border-border gap-1">
            <TabsTrigger value="overview" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Overview & Specs</span>
            </TabsTrigger>

            <TabsTrigger value="pricing" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <DollarSign className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>Pricing & Inventory</span>
            </TabsTrigger>

            <TabsTrigger value="media" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <ImageIcon className="w-3.5 h-3.5 shrink-0 text-blue-600" />
              <span>Media Gallery ({formData.images.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW & SPECS */}
          <TabsContent value="overview" className="space-y-6 m-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Product Identification & URL</CardTitle>
                    <CardDescription className="text-xs">
                      Core information, URL slug, category, and catalog publishing status.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Product Title *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            name: val,
                            slug: formData.slug ? formData.slug : generateSlug(val),
                          });
                        }}
                        placeholder="e.g. Copenhagen Walnut Sideboard"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>URL Slug (Unique Database Key) *</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, slug: generateSlug(formData.name) })}
                          className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Generate from Title
                        </button>
                      </div>
                      <Input
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                        placeholder="e.g. copenhagen-walnut-sideboard"
                        className="font-mono text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Base SKU</label>
                        <Input
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          placeholder="e.g. SW-SIDE-001"
                          className="font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Product Category</label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={formData.categoryId}
                          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                          <option value="">Uncategorized</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Product Type</label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={formData.productType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              productType: e.target.value as 'SIMPLE' | 'VARIABLE',
                            })
                          }
                        >
                          <option value="SIMPLE">SIMPLE (Standalone item)</option>
                          <option value="VARIABLE">VARIABLE (WooCommerce finishes/variants)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Publishing Status</label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
                            })
                          }
                        >
                          <option value="PUBLISHED">PUBLISHED (Live in catalog)</option>
                          <option value="DRAFT">DRAFT (Hidden from storefront)</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Short Summary / Excerpt</label>
                      <Input
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        placeholder="One-sentence highlight for card previews"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Full Product Story & Joinery Details *
                      </label>
                      <textarea
                        rows={5}
                        required
                        className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed description of mortise-and-tenon joints, wood grain, care guidelines..."
                      />
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                        <input
                          type="checkbox"
                          className="rounded border-border w-4 h-4 text-primary focus:ring-primary"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        />
                        <span>Highlight as Featured piece on the storefront homepage showcase</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Scale className="w-4 h-4 text-primary" />
                      Physical Specifications
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Dimensions, weight, and material composition.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
                        Dimensions (LxWxH)
                      </label>
                      <Input
                        value={formData.dimensions}
                        onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                        placeholder="e.g. 200x80x75 cm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-muted-foreground" />
                        Weight (kg)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        placeholder="e.g. 45.0"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      Primary Asset Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="aspect-video rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center relative">
                      {primaryImage?.url ? (
                        <img
                          src={primaryImage.url}
                          alt={primaryImage.altText || 'Cover'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                          <span className="text-xs">No cover image selected</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span className="truncate max-w-[140px]">{primaryImage?.altText || 'Default Cover'}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setMediaPickerTarget('cover');
                            setIsMediaPickerOpen(true);
                          }}
                          className="text-primary hover:underline font-medium text-xs flex items-center gap-1"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          Choose Cover
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('media')}
                          className="text-primary hover:underline font-medium text-xs"
                        >
                          Gallery ({formData.images.length})
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: PRICING & INVENTORY */}
          <TabsContent value="pricing" className="space-y-6 m-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Pricing Structure
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Standard catalog price and promotional sale price.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Regular / Base Price ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      required
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      placeholder="850.00"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-emerald-700">Sale / Discount Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      placeholder="Optional discount price"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    Inventory Management
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Stock quantity and automatic order deduction.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Initial Stock Quantity (Units)</label>
                    <Input
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                      <input
                        type="checkbox"
                        className="rounded border-border w-4 h-4 text-primary focus:ring-primary"
                        checked={formData.manageStock}
                        onChange={(e) => setFormData({ ...formData, manageStock: e.target.checked })}
                      />
                      <span>Manage stock automatically (deduct inventory on purchase)</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 3: MEDIA GALLERY */}
          <TabsContent value="media" className="space-y-6 m-0">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    Add Gallery Images
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Choose from your catalog media assets or upload new photography directly into storage.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setMediaPickerTarget('gallery');
                    setIsMediaPickerOpen(true);
                  }}
                  className="gap-2 shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                  Choose from Media Library
                </Button>
              </CardHeader>
              <CardContent>
                <div className="pt-2 border-t border-border/60">
                  <span className="text-xs text-muted-foreground block mb-2 font-medium">
                    Or attach an external photo via direct URL:
                  </span>
                  <form onSubmit={handleAddImage} className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="Image URL (e.g., https://images.unsplash.com/...)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Input
                      placeholder="Alt text / description"
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                      className="sm:w-64"
                    />
                    <Button type="submit" variant="secondary" className="gap-1.5 shrink-0 text-xs">
                      <Plus className="w-3.5 h-3.5" />
                      Attach URL
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Product Gallery ({formData.images.length} Assets)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.images.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-xs">
                    No images attached yet. Choose an image from the Media Library above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`group rounded-xl border p-2 bg-card overflow-hidden shadow-xs space-y-2 relative transition-all ${
                          img.isPrimary ? 'border-primary ring-1 ring-primary' : 'border-border'
                        }`}
                      >
                        <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
                          <img
                            src={img.url}
                            alt={img.altText || 'Asset'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {img.isPrimary && (
                            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" />
                              Primary Asset
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-border/60">
                          {!img.isPrimary ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="text-[11px] font-medium text-primary hover:underline"
                            >
                              Set as Primary
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-semibold">Primary Cover</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-[11px] text-red-600 hover:text-red-700 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Media Picker Dialog */}
      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleSelectMedia}
        title={
          mediaPickerTarget === 'cover'
            ? 'Select Primary Cover Image'
            : 'Add Asset to Product Gallery'
        }
      />
    </div>
  );
}
