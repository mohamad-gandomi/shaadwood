'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Save,
  Trash2,
  Layers,
  Star,
  Sparkles,
  Package,
  DollarSign,
  Info,
  CheckCircle2,
  AlertCircle,
  Plus,
  Scale,
  Maximize2,
  Image as ImageIcon,
  Edit2,
  Link as LinkIcon,
  RefreshCw,
  Check,
  CheckSquare,
  Square,
  Wand2,
  TreePine,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Product, ProductVariant, Attribute, MediaItem } from '@/types';
import { Header } from '@/components/admin/header';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { ProductSpecificationsTab, SpecificationItem } from '@/components/admin/product-specifications-tab';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import { formatCurrency } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const productId = params.id as string;

  const [activeTab, setActiveTab] = React.useState('overview');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [editingVariant, setEditingVariant] = React.useState<ProductVariant | null>(null);
  const [isAddVariantOpen, setIsAddVariantOpen] = React.useState(false);

  // New Image URL input state
  const [newImageUrl, setNewImageUrl] = React.useState('');
  const [newImageAlt, setNewImageAlt] = React.useState('');

  // Media Library Picker state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = React.useState<
    'gallery' | 'cover' | 'newVariant' | 'editVariant'
  >('gallery');
  const [editVariantImage, setEditVariantImage] = React.useState('');

  // Selected attributes for this product (WooCommerce Step 1)
  const [selectedProductAttributeIds, setSelectedProductAttributeIds] = React.useState<string[]>([]);

  // Main product form state - NO material field (material is an attribute now)
  const [formData, setFormData] = React.useState({
    name: '',
    slug: '',
    sku: '',
    productType: 'SIMPLE' as 'SIMPLE' | 'VARIABLE',
    basePrice: '',
    salePrice: '',
    stockQuantity: 0,
    manageStock: true,
    description: '',
    shortDescription: '',
    dimensions: '',
    weight: '',
    featured: false,
    status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
    categoryId: '',
    images: [] as Array<{ url: string; altText?: string | null; isPrimary: boolean; displayOrder: number }>,
    specifications: [] as SpecificationItem[],
  });

  // State for adding a new variant (maps attributeId -> attributeValueId)
  const [newVariantForm, setNewVariantForm] = React.useState({
    sku: '',
    price: '',
    salePrice: '',
    stockQuantity: 10,
    dimensions: '',
    weight: '',
    image: '',
    isActive: true,
    selectedValues: {} as Record<string, string>, // attributeId -> attributeValueId
  });

  // State for editing variant (maps attributeId -> attributeValueId)
  const [editVariantValues, setEditVariantValues] = React.useState<Record<string, string>>({});

  // Query product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.getProduct(productId),
    enabled: !!productId,
  });

  // Query categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories-flat'],
    queryFn: () => api.getCategoriesFlat(),
  });

  // Query all attributes with their values (Wood Finish, Fabric Color, Material & Joinery, etc.)
  const { data: globalAttributes = [] } = useQuery({
    queryKey: ['attributes'],
    queryFn: () => api.getAttributes(),
  });

  // Sync form state when product data loads
  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        sku: product.sku || '',
        productType: product.productType || 'SIMPLE',
        basePrice: product.basePrice ? String(product.basePrice) : '0',
        salePrice: product.salePrice ? String(product.salePrice) : '',
        stockQuantity: product.stockQuantity ?? 0,
        manageStock: product.manageStock ?? true,
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        dimensions: product.dimensions || '',
        weight: product.weight ? String(product.weight) : '',
        featured: product.featured ?? false,
        status: product.status || 'PUBLISHED',
        categoryId: product.categoryId || '',
        images: product.images?.map((img) => ({
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder,
        })) || [],
        specifications: (product.specifications as SpecificationItem[]) || [],
      });

      // Sync active attributes for this product
      const activeAttrIds = product.attributes?.map((pa) => pa.attributeId) || [];
      setSelectedProductAttributeIds(activeAttrIds);
    }
  }, [product]);

  // When opening edit variant modal, initialize its selected attribute values
  React.useEffect(() => {
    if (editingVariant) {
      setEditVariantImage(editingVariant.image || '');
      const mapping: Record<string, string> = {};
      editingVariant.attributeValues?.forEach((av) => {
        const attrId = av.attributeValue?.attributeId;
        if (attrId) {
          mapping[attrId] = av.attributeValueId;
        }
      });
      setEditVariantValues(mapping);
    }
  }, [editingVariant]);

  // Handler for media selected from Media Library
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
    } else if (mediaPickerTarget === 'newVariant') {
      setNewVariantForm((prev) => ({ ...prev, image: media.url }));
      toast.success(`Set variant image to "${media.originalName}"`);
    } else if (mediaPickerTarget === 'editVariant') {
      setEditVariantImage(media.url);
      toast.success(`Set variant image to "${media.originalName}"`);
    }
  };

  // Helper to slugify a string
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateProduct(productId, data),
    onSuccess: (updated) => {
      toast.success('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (updated?.id && updated.id !== productId) {
        router.replace(`/products/${updated.id}`);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update product');
    },
  });

  // Save product attributes mutation (WooCommerce Step 1)
  const saveAttributesMutation = useMutation({
    mutationFn: (attributeIds: string[]) =>
      api.updateProduct(productId, {
        attributes: attributeIds.map((attrId) => ({
          attributeId: attrId,
          isVariation: true,
        })),
      }),
    onSuccess: () => {
      toast.success('Variation attributes updated for this product');
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update variation attributes');
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: () => api.deleteProduct(productId),
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/products');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete product');
    },
  });

  // Add variant mutation
  const addVariantMutation = useMutation({
    mutationFn: (data: any) => api.addVariant(productId, data),
    onSuccess: () => {
      toast.success('New variation created');
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setIsAddVariantOpen(false);
      setNewVariantForm({
        sku: '',
        price: formData.basePrice || '0',
        salePrice: '',
        stockQuantity: 10,
        dimensions: formData.dimensions || '',
        weight: formData.weight || '',
        image: '',
        isActive: true,
        selectedValues: {},
      });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create variation');
    },
  });

  // Update variant mutation
  const updateVariantMutation = useMutation({
    mutationFn: ({ variantId, data }: { variantId: string; data: any }) =>
      api.updateVariant(variantId, data),
    onSuccess: () => {
      toast.success('Variation updated successfully');
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setEditingVariant(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update variation');
    },
  });

  // Delete variant mutation
  const deleteVariantMutation = useMutation({
    mutationFn: (variantId: string) => api.deleteVariant(variantId),
    onSuccess: () => {
      toast.success('Variation deleted');
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete variation');
    },
  });

  const handleSaveProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateMutation.mutate({
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      sku: formData.sku || null,
      productType: formData.productType,
      basePrice: parseFloat(formData.basePrice) || 0,
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      stockQuantity: Number(formData.stockQuantity) || 0,
      manageStock: formData.manageStock,
      description: formData.description,
      shortDescription: formData.shortDescription || null,
      dimensions: formData.dimensions || null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      featured: formData.featured,
      status: formData.status,
      categoryId: formData.categoryId || null,
      images: formData.images,
      specifications: formData.specifications,
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
    toast.success("Image added to gallery. Click 'Save Changes' to apply.");
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

  // Active attributes for this product
  const productAttributes: Attribute[] = globalAttributes.filter((attr) =>
    selectedProductAttributeIds.includes(attr.id)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Header title="Product Details" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center text-muted-foreground">
          Loading product specifications...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <Header title="Product Not Found" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 text-center space-y-4">
          <p className="text-muted-foreground">The requested product could not be located.</p>
          <Button asChild variant="outline">
            <Link href="/products" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const primaryImage = formData.images.find((img) => img.isPrimary) || formData.images[0];
  const isOnSale = formData.salePrice && parseFloat(formData.salePrice) > 0;
  const regularNum = parseFloat(formData.basePrice) || 0;
  const saleNum = parseFloat(formData.salePrice) || 0;
  const discountPercent =
    isOnSale && regularNum > 0 ? Math.round(((regularNum - saleNum) / regularNum) * 100) : 0;

  // Variation metrics
  const variants = product.variants || [];
  const totalVariantStock = variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
  const variantPrices = variants.map((v) => Number(v.price)).filter((p) => !isNaN(p));
  const minVariantPrice = variantPrices.length ? Math.min(...variantPrices) : regularNum;
  const maxVariantPrice = variantPrices.length ? Math.max(...variantPrices) : regularNum;

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Global Header Component */}
      <Header title="Product Details" />

      {/* 2. Main Page Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Streamlined Product Header */}
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
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs h-8 sm:h-9 px-2.5 sm:px-3 gap-1.5"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete Product</span>
                <span className="sm:hidden">Delete</span>
              </Button>
              <Button
                size="sm"
                onClick={handleSaveProduct}
                disabled={updateMutation.isPending}
                className="gap-1.5 text-xs h-8 sm:h-9 px-3 sm:px-4 shadow-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Bottom row: Title, Badges, and SKU / Slug info */}
          <div className="pt-2.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight truncate max-w-[260px] sm:max-w-md">
                {formData.name || 'Untitled Product'}
              </h1>
              <Badge variant={formData.productType === 'VARIABLE' ? 'wood' : 'secondary'} className="text-[10px] px-2 py-0.5">
                {formData.productType}
              </Badge>
              <Badge variant={formData.status === 'PUBLISHED' ? 'default' : 'outline'} className="text-[10px] px-2 py-0.5">
                {formData.status}
              </Badge>
              {formData.featured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-full">
                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                  Featured
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-mono shrink-0">
              <span>SKU: <strong className="text-foreground">{formData.sku || 'None'}</strong></span>
              <span>•</span>
              <span className="truncate max-w-[150px] sm:max-w-xs">/{formData.slug || 'slug'}</span>
            </div>
          </div>
        </div>

        {/* Segmented Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full h-auto p-1.5 bg-muted/80 rounded-xl border border-border gap-1">
            <TabsTrigger value="overview" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Overview</span>
            </TabsTrigger>

            <TabsTrigger value="specifications" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <TreePine className="w-3.5 h-3.5 shrink-0 text-amber-700" />
              <span>Specifications</span>
              {formData.specifications && formData.specifications.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full font-bold">
                  {formData.specifications.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger value="pricing" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <DollarSign className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>Pricing & Inventory</span>
            </TabsTrigger>

            <TabsTrigger value="variations" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <Layers className="w-3.5 h-3.5 shrink-0 text-wood-700" />
              <span>Variations</span>
              {formData.productType === 'VARIABLE' && (
                <span className="text-[10px] px-1.5 py-0.2 bg-wood-200 text-wood-900 rounded-full font-bold">
                  {variants.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger value="media" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <ImageIcon className="w-3.5 h-3.5 shrink-0 text-blue-600" />
              <span>Media ({formData.images.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW & SPECIFICATIONS                          */}
          {/* ========================================================= */}
          <TabsContent value="overview" className="space-y-6 m-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Product Identification & URL</CardTitle>
                    <CardDescription className="text-xs">
                      Core database fields including URL slug, title, category, and catalog visibility.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Product Title *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setFormData({
                            ...formData,
                            name: newName,
                            slug: formData.slug ? formData.slug : generateSlug(newName),
                          });
                        }}
                        placeholder="e.g. Aalborg Solid White Oak Dining Table"
                        required
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
                          onClick={() => setFormData({ ...formData, slug: generateSlug(formData.name) })}
                          className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Reset from Title
                        </button>
                      </div>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                        placeholder="e.g. aalborg-solid-white-oak-dining-table"
                        className="font-mono text-xs"
                        required
                      />
                    </div>

                    {/* SKU & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Base SKU Code</label>
                        <Input
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          placeholder="e.g. SW-DT-001"
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

                    {/* Product Type & Status */}
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
                          <option value="VARIABLE">VARIABLE (WooCommerce attributes/variants)</option>
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
                          <option value="PUBLISHED">PUBLISHED (Visible in customer catalog)</option>
                          <option value="DRAFT">DRAFT (Hidden from storefront)</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                      </div>
                    </div>

                    {/* Short Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Short Summary / Excerpt</label>
                      <Input
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        placeholder="One-sentence highlight shown on search results and product cards"
                      />
                    </div>

                    {/* Full Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Full Product Story & Craftsmanship *
                      </label>
                      <textarea
                        rows={5}
                        required
                        className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide details regarding joinery, wood origins, finish treatment, care guidelines..."
                      />
                    </div>

                    {/* Featured Checkbox */}
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

              {/* Right Column: Physical Specs & Primary Asset */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Scale className="w-4 h-4 text-primary" />
                      Physical Specifications
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Dimensions and weight stored in the database. Materials can be configured as attributes.
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
                        placeholder="e.g. 240x100x76 cm"
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
                        placeholder="e.g. 72.0"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Primary Asset Preview Card */}
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
                          alt={primaryImage.altText || formData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                          <span className="text-xs">No images in gallery</span>
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

          {/* ========================================================= */}
          {/* TAB 2: PRICING & INVENTORY                                */}
          {/* ========================================================= */}
          <TabsContent value="pricing" className="space-y-6 m-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Pricing Structure
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Standard catalog price and optional promotional sale price.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Regular / Base Price ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      placeholder="1250.00"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-emerald-700">Sale / Discount Price ($)</label>
                      {isOnSale && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      placeholder="Leave empty if not currently discounted"
                    />
                  </div>

                  {isOnSale && (
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
                      <div className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Promotional Pricing Enabled
                      </div>
                      <p className="text-emerald-800">
                        Customers save <strong>{formatCurrency(regularNum - saleNum)}</strong> ({discountPercent}% discount). The catalog will present the regular price with a strikethrough.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    Inventory Management
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Track unit stock levels in warehouse and toggle auto-deduction.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      {formData.productType === 'VARIABLE'
                        ? 'Base Stock Fallback (Units)'
                        : 'Stock Quantity (Units)'}
                    </label>
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
                      <span>Manage stock automatically (deduct inventory upon customer purchase)</span>
                    </label>
                  </div>

                  {formData.productType === 'VARIABLE' && (
                    <div className="p-3.5 bg-wood-50 border border-wood-200 rounded-lg text-xs text-wood-900 space-y-1">
                      <strong>WooCommerce Variable Note:</strong> In variable products, each specific variation manages its own individual stock count in the <strong>Variations</strong> tab.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ========================================================= */}
          {/* TAB 3: VARIATIONS (WOOCOMMERCE: STEP 1 ATTRIBUTES, STEP 2 VARIANTS) */}
          {/* ========================================================= */}
          <TabsContent value="variations" className="space-y-6 m-0">
            {formData.productType !== 'VARIABLE' ? (
              <Card className="text-center py-12 px-6">
                <CardContent className="space-y-4 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-full bg-wood-100 text-wood-800 flex items-center justify-center mx-auto">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground text-base">Simple Standalone Product</h3>
                    <p className="text-xs text-muted-foreground">
                      This item is configured as a standalone simple product without variations. To configure wood finishes, upholstery swatches, or materials, convert this product to Variable.
                    </p>
                  </div>
                  <Button
                    className="text-xs font-semibold"
                    onClick={() => {
                      setFormData({ ...formData, productType: 'VARIABLE' });
                      toast.info("Product type set to Variable. Click 'Save Changes' to update the database.");
                    }}
                  >
                    Convert to Variable Product
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* STEP 1: SELECT ATTRIBUTES FOR THIS PRODUCT */}
                <Card className="border-primary/30 shadow-xs">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2 text-foreground">
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                            1
                          </span>
                          <span>Select Variation Attributes for this Product</span>
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Choose which attributes (e.g. Wood Finish, Fabric Color, Material) apply to this furniture piece.
                        </CardDescription>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => saveAttributesMutation.mutate(selectedProductAttributeIds)}
                        disabled={saveAttributesMutation.isPending}
                        className="text-xs h-8 gap-1.5 shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {saveAttributesMutation.isPending ? 'Updating...' : 'Save Product Attributes'}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {globalAttributes.map((attr) => {
                        const isSelected = selectedProductAttributeIds.includes(attr.id);
                        return (
                          <div
                            key={attr.id}
                            onClick={() => {
                              const updated = isSelected
                                ? selectedProductAttributeIds.filter((id) => id !== attr.id)
                                : [...selectedProductAttributeIds, attr.id];
                              setSelectedProductAttributeIds(updated);
                            }}
                            className={`p-3 rounded-lg border cursor-pointer transition-all space-y-2 select-none ${
                              isSelected
                                ? 'bg-wood-50/70 border-primary ring-1 ring-primary/40 shadow-xs'
                                : 'bg-card border-border hover:border-border/80 hover:bg-muted/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-foreground flex items-center gap-2">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-primary shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-muted-foreground shrink-0" />
                                )}
                                <span>{attr.name}</span>
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {attr.values?.length || 0} terms
                              </span>
                            </div>

                            {/* Terms preview */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {attr.values?.map((val) => (
                                <span
                                  key={val.id}
                                  className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-background border border-border/80 text-muted-foreground"
                                >
                                  {val.image ? (
                                    <img
                                      src={val.image}
                                      alt={val.name}
                                      className="w-2.5 h-2.5 rounded-full object-cover border border-black/10 shrink-0"
                                    />
                                  ) : val.colorHex ? (
                                    <span
                                      className="w-2 h-2 rounded-full shrink-0"
                                      style={{ backgroundColor: val.colorHex }}
                                    />
                                  ) : null}
                                  <span>{val.name}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* STEP 2: VARIATIONS MATRIX & ADD VARIATIONS */}
                {selectedProductAttributeIds.length === 0 ? (
                  <Card className="text-center py-10 px-6 border-dashed">
                    <CardContent className="space-y-2 max-w-sm mx-auto text-muted-foreground">
                      <AlertCircle className="w-8 h-8 mx-auto text-amber-500 opacity-80" />
                      <h4 className="font-semibold text-sm text-foreground">No Attributes Selected</h4>
                      <p className="text-xs">
                        Select at least one attribute above (e.g. Wood Finish or Fabric Color) and click <strong>&quot;Save Product Attributes&quot;</strong> to start generating variations.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Variation Metrics */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <Card className="bg-wood-50/60 border-wood-200">
                        <CardContent className="p-2.5 sm:p-4 space-y-0.5 sm:space-y-1">
                          <div className="text-[10px] sm:text-xs font-medium text-wood-800 truncate">Variations</div>
                          <div className="text-sm sm:text-2xl font-bold text-wood-950">{variants.length}</div>
                          <div className="text-[9px] sm:text-[11px] text-muted-foreground hidden sm:block">Configured in catalog</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-wood-50/60 border-wood-200">
                        <CardContent className="p-2.5 sm:p-4 space-y-0.5 sm:space-y-1">
                          <div className="text-[10px] sm:text-xs font-medium text-wood-800 truncate">Variant Stock</div>
                          <div className="text-sm sm:text-2xl font-bold text-wood-950">{totalVariantStock}</div>
                          <div className="text-[9px] sm:text-[11px] text-muted-foreground hidden sm:block">Combined inventory</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-wood-50/60 border-wood-200">
                        <CardContent className="p-2.5 sm:p-4 space-y-0.5 sm:space-y-1">
                          <div className="text-[10px] sm:text-xs font-medium text-wood-800 truncate">Price Range</div>
                          <div className="text-[11px] sm:text-xl font-bold text-emerald-800 truncate">
                            {formatCurrency(minVariantPrice)}–{formatCurrency(maxVariantPrice)}
                          </div>
                          <div className="text-[9px] sm:text-[11px] text-muted-foreground hidden sm:block">Active finishes</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Variations Matrix & Card List */}
                    <Card>
                      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 pb-3 sm:pb-4">
                        <div>
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                              2
                            </span>
                            <span>Variations Matrix ({variants.length})</span>
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            Active attributes for this piece:{' '}
                            <strong>{productAttributes.map((a) => a.name).join(', ')}</strong>
                          </CardDescription>
                        </div>

                        <Button
                          onClick={() => {
                            // Pre-fill initial selection with first value of each product attribute
                            const initialSelections: Record<string, string> = {};
                            productAttributes.forEach((attr) => {
                              if (attr.values && attr.values.length > 0) {
                                initialSelections[attr.id] = attr.values[0].id;
                              }
                            });

                            setNewVariantForm({
                              sku: `${formData.sku || 'SW'}-VAR-${variants.length + 1}`,
                              price: formData.basePrice || '0',
                              salePrice: '',
                              stockQuantity: 10,
                              dimensions: formData.dimensions || '',
                              weight: formData.weight || '',
                              image: '',
                              isActive: true,
                              selectedValues: initialSelections,
                            });
                            setIsAddVariantOpen(true);
                          }}
                          className="gap-1.5 text-xs h-8 sm:h-9 shrink-0 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add Variation
                        </Button>
                      </CardHeader>

                      <CardContent className="p-0">
                        {variants.length === 0 ? (
                          <div className="text-center py-12 px-4 text-muted-foreground text-xs">
                            No variations created yet. Click <strong>&quot;Add Variation&quot;</strong> to configure options from your selected attributes.
                          </div>
                        ) : (
                          <>
                            {/* Mobile Variations Card View (< md) */}
                            <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
                              {variants.map((v) => {
                                const isVariantSale = v.salePrice !== null && v.salePrice !== undefined;

                                return (
                                  <div
                                    key={v.id}
                                    className="p-3.5 rounded-xl border border-border bg-card shadow-2xs space-y-3"
                                  >
                                    {/* Header: SKU & Status Toggle */}
                                    <div className="flex items-center justify-between">
                                      <span className="font-mono text-xs font-bold text-foreground">
                                        {v.sku}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateVariantMutation.mutate({
                                            variantId: v.id,
                                            data: { isActive: !v.isActive },
                                          })
                                        }
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition-colors ${
                                          v.isActive
                                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                        title="Click to toggle active status"
                                      >
                                        {v.isActive ? 'Active' : 'Inactive'}
                                      </button>
                                    </div>

                                    {/* Swatches & Attributes */}
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {v.attributeValues && v.attributeValues.length > 0 ? (
                                        v.attributeValues.map((item) => (
                                          <div
                                            key={item.id}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-muted/40 text-xs font-medium text-foreground shadow-2xs"
                                          >
                                            {item.attributeValue.image ? (
                                              <img
                                                src={item.attributeValue.image}
                                                alt={item.attributeValue.name}
                                                className="w-4 h-4 rounded-md object-cover border border-black/10 shrink-0 shadow-2xs"
                                              />
                                            ) : item.attributeValue.colorHex ? (
                                              <span
                                                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-2xs"
                                                style={{
                                                  backgroundColor: item.attributeValue.colorHex,
                                                }}
                                              />
                                            ) : null}
                                            <span>{item.attributeValue.name}</span>
                                          </div>
                                        ))
                                      ) : (
                                        <span className="text-xs text-muted-foreground italic">No attributes linked</span>
                                      )}
                                    </div>

                                    {/* Pricing & Stock Row */}
                                    <div className="flex items-center justify-between pt-1 text-xs">
                                      <div className="flex items-baseline gap-1.5">
                                        {isVariantSale ? (
                                          <>
                                            <span className="text-emerald-700 font-bold text-sm">
                                              {formatCurrency(v.salePrice!)}
                                            </span>
                                            <span className="text-muted-foreground line-through text-[11px]">
                                              {formatCurrency(v.price)}
                                            </span>
                                          </>
                                        ) : (
                                          <span className="font-bold text-sm text-foreground">
                                            {formatCurrency(v.price)}
                                          </span>
                                        )}
                                      </div>

                                      {/* Stock Badge */}
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                                          v.stockQuantity > 5
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}
                                      >
                                        {v.stockQuantity} in stock
                                      </span>
                                    </div>

                                    {/* Dimensions & Weight info */}
                                    {(v.dimensions || formData.dimensions || v.weight || formData.weight) && (
                                      <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-2 pt-0.5">
                                        <span>Dim: {v.dimensions || formData.dimensions || '-'}</span>
                                        {(v.weight || formData.weight) && (
                                          <>
                                            <span>•</span>
                                            <span>Wt: {v.weight || formData.weight} kg</span>
                                          </>
                                        )}
                                      </div>
                                    )}

                                    {/* Actions: Edit & Delete buttons */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs gap-1.5 flex-1 font-medium"
                                        onClick={() => setEditingVariant(v)}
                                      >
                                        <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                        Edit Variation
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                        onClick={() => {
                                          if (confirm(`Delete variation ${v.sku}?`)) {
                                            deleteVariantMutation.mutate(v.id);
                                          }
                                        }}
                                        title="Delete variation"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Desktop Table View (>= md) */}
                            <div className="hidden md:block">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-36">SKU</TableHead>
                                    <TableHead>Selected Attributes & Swatches</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Sale Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Dimensions & Weight</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-24 text-right">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {variants.map((v) => {
                                    const isVariantSale = v.salePrice !== null && v.salePrice !== undefined;

                                    return (
                                      <TableRow key={v.id} className="hover:bg-muted/30">
                                        <TableCell className="font-mono text-xs font-semibold text-foreground">
                                          {v.sku}
                                        </TableCell>

                                        {/* Swatches & Attributes */}
                                        <TableCell>
                                          <div className="flex flex-wrap items-center gap-1.5">
                                            {v.attributeValues && v.attributeValues.length > 0 ? (
                                              v.attributeValues.map((item) => (
                                                <div
                                                  key={item.id}
                                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border bg-card text-[11px] font-medium shadow-2xs"
                                                >
                                                   {item.attributeValue.image ? (
                                                     <img
                                                       src={item.attributeValue.image}
                                                       alt={item.attributeValue.name}
                                                       className="w-3 h-3 rounded-full object-cover border border-black/10 shrink-0"
                                                     />
                                                   ) : item.attributeValue.colorHex ? (
                                                     <span
                                                       className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                                                       style={{
                                                         backgroundColor: item.attributeValue.colorHex,
                                                       }}
                                                     />
                                                   ) : null}
                                                  <span>{item.attributeValue.name}</span>
                                                </div>
                                              ))
                                            ) : (
                                              <span className="text-xs text-muted-foreground italic">No attributes linked</span>
                                            )}
                                          </div>
                                        </TableCell>

                                        <TableCell className="font-semibold text-xs">
                                          {formatCurrency(v.price)}
                                        </TableCell>

                                        <TableCell className="text-xs">
                                          {isVariantSale ? (
                                            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                              {formatCurrency(v.salePrice!)}
                                            </span>
                                          ) : (
                                            <span className="text-muted-foreground">-</span>
                                          )}
                                        </TableCell>

                                        <TableCell className="text-xs">
                                          <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                                              v.stockQuantity > 5
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}
                                          >
                                            {v.stockQuantity} units
                                          </span>
                                        </TableCell>

                                        <TableCell className="text-xs font-mono text-muted-foreground">
                                          <div>{v.dimensions || formData.dimensions || '-'}</div>
                                          {v.weight || formData.weight ? (
                                            <div className="text-[10px] text-muted-foreground">
                                              {v.weight || formData.weight} kg
                                            </div>
                                          ) : null}
                                        </TableCell>

                                        <TableCell>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              updateVariantMutation.mutate({
                                                variantId: v.id,
                                                data: { isActive: !v.isActive },
                                              })
                                            }
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition-colors ${
                                              v.isActive
                                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                            title="Click to toggle active status"
                                          >
                                            {v.isActive ? 'Active' : 'Inactive'}
                                          </button>
                                        </TableCell>

                                        <TableCell className="text-right">
                                          <div className="flex items-center justify-end gap-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0"
                                              onClick={() => setEditingVariant(v)}
                                              title="Edit variation"
                                            >
                                              <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                              onClick={() => {
                                                if (confirm(`Delete variation ${v.sku}?`)) {
                                                  deleteVariantMutation.mutate(v.id);
                                                }
                                              }}
                                              title="Delete variation"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* ========================================================= */}
          {/* TAB 4: MEDIA GALLERY                                      */}
          {/* ========================================================= */}
          <TabsContent value="media" className="space-y-6 m-0">
            {/* Add Image Form */}
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

            {/* Existing Images Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Product Gallery ({formData.images.length} Assets)
                </CardTitle>
                <CardDescription className="text-xs">
                  The primary asset is used as the catalog thumbnail and homepage showcase cover.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formData.images.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">No images attached. Add an image URL above.</p>
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
                            alt={img.altText || formData.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {img.isPrimary && (
                            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" />
                              Primary Asset
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 px-1">
                          <p className="font-semibold text-xs text-foreground truncate">
                            {img.altText || `Asset ${idx + 1}`}
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground truncate">{img.url}</p>
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

          {/* ========================================================= */}
          {/* TAB 5: ARTISANAL SPECIFICATIONS REPEATER                  */}
          {/* ========================================================= */}
          <TabsContent value="specifications" className="space-y-6 m-0">
            <ProductSpecificationsTab
              specifications={formData.specifications || []}
              onChange={(newSpecs) => setFormData({ ...formData, specifications: newSpecs })}
              productName={formData.name}
              defaultDimensions={formData.dimensions}
              defaultWeight={formData.weight}
              onNavigateToOverview={() => setActiveTab('overview')}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD NEW VARIATION (From Selected Attributes)      */}
      {/* ========================================================= */}
      <Dialog open={isAddVariantOpen} onOpenChange={setIsAddVariantOpen}>
        <DialogContent className="max-w-xl max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain">
          <DialogHeader>
            <DialogTitle>Add Variation</DialogTitle>
            <DialogDescription>
              Select the specific finish and swatch options for this variation from the product&apos;s active attributes.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const selectedValueIds = Object.values(newVariantForm.selectedValues).filter(Boolean);
              if (selectedValueIds.length === 0) {
                toast.error('Please select an option for each attribute');
                return;
              }
              addVariantMutation.mutate({
                sku: newVariantForm.sku,
                price: parseFloat(newVariantForm.price) || 0,
                salePrice: newVariantForm.salePrice ? parseFloat(newVariantForm.salePrice) : null,
                stockQuantity: parseInt(String(newVariantForm.stockQuantity), 10) || 0,
                dimensions: newVariantForm.dimensions || undefined,
                weight: newVariantForm.weight ? parseFloat(newVariantForm.weight) : undefined,
                image: newVariantForm.image || undefined,
                isActive: newVariantForm.isActive,
                attributeValueIds: selectedValueIds,
              });
            }}
            className="space-y-4 pt-2"
          >
            {/* Attribute Terms Selectors for Active Product Attributes */}
            <div className="space-y-3 p-4 bg-muted/40 border border-border rounded-xl">
              <span className="text-xs font-semibold text-foreground block">
                Choose Options for this Variation:
              </span>

              {productAttributes.map((attr) => (
                <div key={attr.id} className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">{attr.name} *</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={newVariantForm.selectedValues[attr.id] || ''}
                    onChange={(e) =>
                      setNewVariantForm({
                        ...newVariantForm,
                        selectedValues: {
                          ...newVariantForm.selectedValues,
                          [attr.id]: e.target.value,
                        },
                      })
                    }
                    required
                  >
                    <option value="">Select {attr.name}...</option>
                    {attr.values?.map((val) => (
                      <option key={val.id} value={val.id}>
                        {val.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Variant SKU *</label>
                <Input
                  required
                  placeholder="e.g., SW-ARM-WAL-FOR"
                  value={newVariantForm.sku}
                  onChange={(e) => setNewVariantForm({ ...newVariantForm, sku: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Stock Quantity (Units) *</label>
                <Input
                  type="number"
                  required
                  placeholder="10"
                  value={newVariantForm.stockQuantity}
                  onChange={(e) =>
                    setNewVariantForm({
                      ...newVariantForm,
                      stockQuantity: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Regular Price ($) *</label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  placeholder="530.00"
                  value={newVariantForm.price}
                  onChange={(e) => setNewVariantForm({ ...newVariantForm, price: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-emerald-700">Sale Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="490.00 (Optional)"
                  value={newVariantForm.salePrice}
                  onChange={(e) => setNewVariantForm({ ...newVariantForm, salePrice: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Dimensions (LxWxH)</label>
                <Input
                  placeholder="e.g., 82x86x78 cm"
                  value={newVariantForm.dimensions}
                  onChange={(e) => setNewVariantForm({ ...newVariantForm, dimensions: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Weight (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 18.5"
                  value={newVariantForm.weight}
                  onChange={(e) => setNewVariantForm({ ...newVariantForm, weight: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Variant Image</label>
              <div className="flex gap-2 items-center">
                {newVariantForm.image ? (
                  <img
                    src={newVariantForm.image}
                    alt="Variant"
                    className="w-10 h-10 rounded-md object-cover border border-border shrink-0 bg-muted"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md border border-dashed border-border flex items-center justify-center bg-muted/40 shrink-0">
                    <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                )}
                <Input
                  placeholder="Image URL or pick from library"
                  value={newVariantForm.image}
                  onChange={(e) => setNewVariantForm({ ...newVariantForm, image: e.target.value })}
                  className="flex-1 text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMediaPickerTarget('newVariant');
                    setIsMediaPickerOpen(true);
                  }}
                  className="gap-1.5 text-xs shrink-0"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-primary" />
                  Media Library
                </Button>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={newVariantForm.isActive}
                  onChange={(e) => setNewVariantForm({ ...newVariantForm, isActive: e.target.checked })}
                  className="rounded border-border w-4 h-4 text-primary focus:ring-primary"
                />
                <span>Active & Available for Purchase in Catalog</span>
              </label>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setIsAddVariantOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addVariantMutation.isPending}>
                {addVariantMutation.isPending ? 'Creating...' : 'Create Variation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 2: EDIT EXISTING VARIATION                          */}
      {/* ========================================================= */}
      {editingVariant && (
        <Dialog open={!!editingVariant} onOpenChange={() => setEditingVariant(null)}>
          <DialogContent className="max-w-xl max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain">
            <DialogHeader>
              <DialogTitle>Edit Variation: {editingVariant.sku}</DialogTitle>
              <DialogDescription>
                Fully update SKU, price, sale price, stock levels, physical specs, and swatches.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as any;
                const selectedValIds = Object.values(editVariantValues).filter(Boolean);

                updateVariantMutation.mutate({
                  variantId: editingVariant.id,
                  data: {
                    sku: target.sku.value,
                    price: parseFloat(target.price.value) || 0,
                    salePrice: target.salePrice.value ? parseFloat(target.salePrice.value) : null,
                    stockQuantity: parseInt(target.stockQuantity.value, 10) || 0,
                    dimensions: target.dimensions.value || undefined,
                    weight: target.weight.value ? parseFloat(target.weight.value) : undefined,
                    image: target.image.value || undefined,
                    isActive: target.isActive.checked,
                    attributeValueIds: selectedValIds.length > 0 ? selectedValIds : undefined,
                  },
                });
              }}
              className="space-y-4 pt-2"
            >
              {/* Attribute Values / Swatches Selector for Active Product Attributes */}
              <div className="space-y-3 p-4 bg-muted/40 border border-border rounded-xl">
                <span className="text-xs font-semibold text-foreground block">
                  Select Attributes for this Variation:
                </span>
                {productAttributes.map((attr) => (
                  <div key={attr.id} className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">{attr.name} *</label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={editVariantValues[attr.id] || ''}
                      onChange={(e) =>
                        setEditVariantValues({
                          ...editVariantValues,
                          [attr.id]: e.target.value,
                        })
                      }
                    >
                      <option value="">Select {attr.name}...</option>
                      {attr.values?.map((val) => (
                        <option key={val.id} value={val.id}>
                          {val.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Variant SKU *</label>
                  <Input name="sku" defaultValue={editingVariant.sku} required className="font-mono text-xs" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Stock Quantity (Units) *</label>
                  <Input
                    name="stockQuantity"
                    type="number"
                    defaultValue={String(editingVariant.stockQuantity)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Regular Price ($) *</label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={String(editingVariant.price)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-emerald-700">Sale Price ($)</label>
                  <Input
                    name="salePrice"
                    type="number"
                    step="0.01"
                    defaultValue={editingVariant.salePrice ? String(editingVariant.salePrice) : ''}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Dimensions (LxWxH)</label>
                  <Input name="dimensions" defaultValue={editingVariant.dimensions || ''} placeholder="e.g. 82x86x78 cm" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Weight (kg)</label>
                  <Input
                    name="weight"
                    type="number"
                    step="0.1"
                    defaultValue={editingVariant.weight ? String(editingVariant.weight) : ''}
                    placeholder="e.g. 18.5"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Variant-Specific Image</label>
                <div className="flex gap-2 items-center">
                  {editVariantImage ? (
                    <img
                      src={editVariantImage}
                      alt="Variant"
                      className="w-10 h-10 rounded-md object-cover border border-border shrink-0 bg-muted"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md border border-dashed border-border flex items-center justify-center bg-muted/40 shrink-0">
                      <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
                    </div>
                  )}
                  <Input
                    name="image"
                    value={editVariantImage}
                    onChange={(e) => setEditVariantImage(e.target.value)}
                    placeholder="https://... or choose from media library"
                    className="flex-1 text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMediaPickerTarget('editVariant');
                      setIsMediaPickerOpen(true);
                    }}
                    className="gap-1.5 text-xs shrink-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    Select Media
                  </Button>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editingVariant.isActive}
                    className="rounded border-border w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span>Active & Available for Purchase in Shop</span>
                </label>
              </div>

              <DialogFooter className="pt-3">
                <Button type="button" variant="outline" onClick={() => setEditingVariant(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateVariantMutation.isPending}>
                  {updateVariantMutation.isPending ? 'Saving...' : 'Update Variation'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DELETE PRODUCT CONFIRMATION                      */}
      {/* ========================================================= */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete &quot;{formData.name}&quot;? This action will remove all attached variations, attributes, and image gallery records from PostgreSQL.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <HoldToDeleteButton
              onTrigger={() => deleteMutation.mutate()}
              isPending={deleteMutation.isPending}
              label="Delete Product"
              pendingLabel="Deleting Product..."
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Picker Dialog */}
      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleSelectMedia}
        title={
          mediaPickerTarget === 'cover'
            ? 'Select Primary Cover Image'
            : mediaPickerTarget === 'gallery'
            ? 'Add Asset to Product Gallery'
            : 'Select Variant-Specific Image'
        }
      />
    </div>
  );
}
