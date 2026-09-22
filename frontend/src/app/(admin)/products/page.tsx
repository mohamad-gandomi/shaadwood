'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Layers,
  Star,
  Image as ImageIcon,
  Package,
  Box,
  CheckCircle2,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Product } from '@/types';
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
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<'ALL' | 'SIMPLE' | 'VARIABLE'>('ALL');
  const [deleteProduct, setDeleteProduct] = React.useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteProduct(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete product');
    },
  });

  const stats = React.useMemo(() => {
    let variableCount = 0;
    let simpleCount = 0;
    let publishedCount = 0;

    products.forEach((p) => {
      if (p.productType === 'VARIABLE') variableCount++;
      else simpleCount++;
      if (p.status === 'PUBLISHED') publishedCount++;
    });

    return {
      total: products.length,
      variable: variableCount,
      simple: simpleCount,
      published: publishedCount,
    };
  }, [products]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'ALL' ? true : p.productType === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <Header title="Products" />

      <div className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        {/* Metrics KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Total Products</p>
                <p className="text-xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Variable Items</p>
                <p className="text-xl font-bold text-wood-700 dark:text-wood-300">{stats.variable}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-wood-100 dark:bg-wood-950/40 text-wood-700 dark:text-wood-300 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Simple Items</p>
                <p className="text-xl font-bold text-foreground">{stats.simple}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 flex items-center justify-center">
                <Box className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Published</p>
                <p className="text-xl font-bold text-emerald-600">{stats.published}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
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
                placeholder="Search products by title, SKU, material..."
                className="pl-9 bg-card h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Type Filter Buttons - Matching Search Box Height (h-9) */}
            <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs shrink-0 h-9 box-border">
              <button
                type="button"
                onClick={() => setSelectedType('ALL')}
                className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                  selectedType === 'ALL'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('VARIABLE')}
                className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                  selectedType === 'VARIABLE'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Variable
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('SIMPLE')}
                className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                  selectedType === 'SIMPLE'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Simple
              </button>
            </div>
          </div>

          {/* Top Actions: Add Product Button */}
          <Button onClick={() => router.push('/products/new')} className="gap-2 shrink-0 h-9 font-semibold shadow-xs">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Button>
        </div>

        {/* 1. MOBILE VIEW: Responsive Cards (No scroll tables) */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm bg-card border border-border rounded-xl">
              No matching products found.
            </div>
          ) : (
            filteredProducts.map((product) => {
              const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
              const isOnSale = product.salePrice !== null && product.salePrice !== undefined;
              const variantCount = product.variants?.length || product._count?.variants || 0;

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-primary/50 transition-all cursor-pointer space-y-3"
                >
                  {/* Card Header: Thumbnail + Title + SKU */}
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-lg bg-muted border border-border/70 overflow-hidden shrink-0 flex items-center justify-center relative">
                      {primaryImage?.url ? (
                        <img
                          src={primaryImage.url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                      )}
                      {product.images && product.images.length > 0 && (
                        <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] font-bold px-1 rounded flex items-center gap-0.5 shadow-xs">
                          <ImageIcon className="w-2.5 h-2.5" />
                          {product.images.length}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {product.name}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                        <span>{product.sku || 'No SKU'}</span>
                        <span>•</span>
                        <span>{product.category?.name || 'Uncategorized'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Middle: Badges and Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant={product.productType === 'VARIABLE' ? 'wood' : 'secondary'} className="text-[10px]">
                        {product.productType}
                      </Badge>

                      {/* One-Line Stock or Variations Badge with Border */}
                      {product.productType === 'VARIABLE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-amber-50/80 text-amber-800 border border-amber-200 whitespace-nowrap">
                          <Layers className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>{variantCount} variations</span>
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                            product.stockQuantity > 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {product.stockQuantity} in stock
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      {isOnSale ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-emerald-700 text-sm">
                            {formatCurrency(product.salePrice)}
                          </span>
                          <span className="text-[11px] text-muted-foreground line-through">
                            {formatCurrency(product.basePrice)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-sm">
                          {formatCurrency(product.basePrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Status & Featured indicator + Action Buttons */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            product.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-400'
                          }`}
                        />
                        <span>{product.status}</span>
                      </div>

                      {product.featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-full">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/products/${product.id}`);
                        }}
                        title="Edit product"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteProduct(product);
                        }}
                        title="Delete product"
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

        {/* 2. DESKTOP VIEW: Table With Actions */}
        <Card className="hidden md:block overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[360px]">Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No matching products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
                    const isOnSale = product.salePrice !== null && product.salePrice !== undefined;
                    const variantCount = product.variants?.length || product._count?.variants || 0;

                    return (
                      <TableRow
                        key={product.id}
                        onClick={() => router.push(`/products/${product.id}`)}
                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
                      >
                        {/* Product info: Thumbnail, Name, SKU, Featured */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-muted border border-border/70 overflow-hidden shrink-0 flex items-center justify-center group-hover:border-primary/40 transition-colors relative">
                              {primaryImage?.url ? (
                                <img
                                  src={primaryImage.url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                              )}
                              {product.images && product.images.length > 0 && (
                                <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[9px] font-bold px-1 rounded flex items-center gap-0.5 shadow-xs">
                                  <ImageIcon className="w-2 h-2" />
                                  {product.images.length}
                                </span>
                              )}
                            </div>

                            <div className="space-y-0.5 min-w-0">
                              <div className="font-semibold text-foreground flex items-center gap-2 group-hover:text-primary transition-colors truncate">
                                <span className="truncate">{product.name}</span>
                                {product.featured && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-full shrink-0">
                                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                                    Featured
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-mono text-muted-foreground">
                                {product.sku || 'No SKU'}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Category */}
                        <TableCell className="text-sm text-muted-foreground">
                          {product.category?.name || 'Uncategorized'}
                        </TableCell>

                        {/* Type Badge */}
                        <TableCell>
                          <Badge variant={product.productType === 'VARIABLE' ? 'wood' : 'secondary'}>
                            {product.productType}
                          </Badge>
                        </TableCell>

                        {/* Regular & Sale Price */}
                        <TableCell>
                          <div className="space-y-0.5">
                            {isOnSale ? (
                              <div className="flex items-baseline gap-2">
                                <span className="font-bold text-emerald-700 text-sm">
                                  {formatCurrency(product.salePrice)}
                                </span>
                                <span className="text-xs text-muted-foreground line-through">
                                  {formatCurrency(product.basePrice)}
                                </span>
                              </div>
                            ) : (
                              <div className="font-semibold text-sm">
                                {formatCurrency(product.basePrice)}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* One-Line Stock or Variations Badge with Border */}
                        <TableCell>
                          {product.productType === 'VARIABLE' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-amber-50/80 text-amber-800 border border-amber-200 whitespace-nowrap">
                              <Layers className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>{variantCount} variations</span>
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                                product.stockQuantity > 0
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              {product.stockQuantity} in stock
                            </span>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                product.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-400'
                              }`}
                            />
                            <span>{product.status}</span>
                          </div>
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
                                router.push(`/products/${product.id}`);
                              }}
                              title="Edit product"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteProduct(product);
                              }}
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteProduct)} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{' '}
              <strong className="text-foreground">{deleteProduct?.name}</strong>? This action cannot be
              undone and will remove all variants, pricing, and associations.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteProduct(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <HoldToDeleteButton
              onTrigger={() => {
                if (deleteProduct) {
                  deleteMutation.mutate(deleteProduct.id);
                }
              }}
              isPending={deleteMutation.isPending}
              label="Delete Product"
              pendingLabel="Deleting Product..."
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
