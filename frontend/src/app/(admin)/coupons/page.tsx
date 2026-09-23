'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Tag,
  Plus,
  Trash2,
  Check,
  Percent,
  DollarSign,
  AlertTriangle,
  Copy,
  Calendar,
  Pencil,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { formatCurrency, formatDate } from '@/lib/utils';
import { Coupon, DiscountType } from '@/types';

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<'ALL' | 'PERCENTAGE' | 'FIXED_AMOUNT'>('ALL');
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [editingCoupon, setEditingCoupon] = React.useState<Coupon | null>(null);
  const [deleteCoupon, setDeleteCoupon] = React.useState<Coupon | null>(null);

  // Form inputs
  const [code, setCode] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [discountType, setDiscountType] = React.useState<DiscountType>('PERCENTAGE');
  const [discountValue, setDiscountValue] = React.useState('');
  const [minOrderAmount, setMinOrderAmount] = React.useState('');
  const [maxDiscountAmount, setMaxDiscountAmount] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [usageLimit, setUsageLimit] = React.useState('');
  const [isActive, setIsActive] = React.useState(true);
  const [formError, setFormError] = React.useState('');

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => api.getCoupons(),
  });

  const createCouponMutation = useMutation({
    mutationFn: (data: any) => api.createCoupon(data),
    onSuccess: () => {
      toast.success('Coupon created successfully');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err.message || 'Failed to create coupon');
    },
  });

  const updateCouponMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateCoupon(id, data),
    onSuccess: () => {
      toast.success('Coupon updated successfully');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err.message || 'Failed to update coupon');
    },
  });

  const deleteCouponMutation = useMutation({
    mutationFn: (id: string) => api.deleteCoupon(id),
    onSuccess: () => {
      toast.success('Coupon deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setDeleteCoupon(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete coupon');
    },
  });

  const resetForm = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setDiscountType('PERCENTAGE');
    setDiscountValue('');
    setMinOrderAmount('');
    setMaxDiscountAmount('');
    setStartDate('');
    setEndDate('');
    setUsageLimit('');
    setIsActive(true);
    setFormError('');
  };

  const openCreateModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDescription(coupon.description || '');
    setDiscountType(coupon.discountType);
    setDiscountValue(String(coupon.discountValue));
    setMinOrderAmount(coupon.minOrderAmount ? String(coupon.minOrderAmount) : '');
    setMaxDiscountAmount(coupon.maxDiscountAmount ? String(coupon.maxDiscountAmount) : '');
    setStartDate(coupon.startDate ? coupon.startDate.substring(0, 10) : '');
    setEndDate(coupon.endDate ? coupon.endDate.substring(0, 10) : '');
    setUsageLimit(coupon.usageLimit ? String(coupon.usageLimit) : '');
    setIsActive(coupon.isActive);
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    toast.success(`Copied "${couponCode}" to clipboard`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = (coupon: Coupon) => {
    updateCouponMutation.mutate({
      id: coupon.id,
      data: { isActive: !coupon.isActive },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!code.trim()) {
      setFormError('Coupon code is required');
      return;
    }

    const val = parseFloat(discountValue);
    if (isNaN(val) || val <= 0) {
      setFormError('Please enter a valid positive discount value');
      return;
    }

    const payload: any = {
      code: code.trim().toUpperCase(),
      description: description.trim() || undefined,
      discountType,
      discountValue: val,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
      maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
      startDate: startDate ? new Date(startDate + 'T00:00:00.000Z').toISOString() : null,
      endDate: endDate ? new Date(endDate + 'T23:59:59.999Z').toISOString() : null,
      usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
      isActive,
    };

    if (editingCoupon) {
      updateCouponMutation.mutate({
        id: editingCoupon.id,
        data: payload,
      });
    } else {
      createCouponMutation.mutate(payload);
    }
  };

  const renderValidityDate = (start?: string | null, end?: string | null) => {
    const now = new Date();
    const isExpired = end && now > new Date(end);
    const isUpcoming = start && now < new Date(start);

    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
          <Clock className="w-3 h-3" />
          Expired: {formatDate(end!)}
        </span>
      );
    }

    if (isUpcoming) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
          <Clock className="w-3 h-3" />
          Starts: {formatDate(start!)}
        </span>
      );
    }

    if (end) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
          <Calendar className="w-3 h-3" />
          Expires: {formatDate(end)}
        </span>
      );
    }

    if (start) {
      return (
        <span className="text-[11px] text-muted-foreground">
          Since {formatDate(start)}
        </span>
      );
    }

    return (
      <span className="text-[11px] text-muted-foreground">
        Lifetime validity
      </span>
    );
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      selectedType === 'ALL' ? true : coupon.discountType === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <Header title="Promotional Coupons" />

      <div className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        {/* Controls & Search Toolbar (Matching Product List Style) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search coupons by code or description..."
                className="pl-9 bg-card h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Type Filter Buttons */}
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
                onClick={() => setSelectedType('PERCENTAGE')}
                className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                  selectedType === 'PERCENTAGE'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Percentage
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('FIXED_AMOUNT')}
                className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                  selectedType === 'FIXED_AMOUNT'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Fixed
              </button>
            </div>
          </div>

          {/* Top Actions: Add Coupon Button */}
          <Button onClick={openCreateModal} className="gap-2 shrink-0 h-9 font-semibold shadow-xs">
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </Button>
        </div>

        {/* 1. MOBILE VIEW: Responsive Cards (Matching Product List) */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Loading coupons...
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm bg-card border border-border rounded-xl">
              No matching coupons found.
            </div>
          ) : (
            filteredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3"
              >
                {/* Card Header: Code + Copy + Discount */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground text-sm bg-muted/70 px-2 py-1 rounded border border-border">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        title="Copy code"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      >
                        {copiedCode === coupon.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    {coupon.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {coupon.description}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 font-bold text-sm text-foreground">
                      {coupon.discountType === 'PERCENTAGE' ? (
                        <>
                          <Percent className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{coupon.discountValue}% OFF</span>
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                          <span>${Number(coupon.discountValue).toFixed(2)} OFF</span>
                        </>
                      )}
                    </div>
                    {coupon.maxDiscountAmount && coupon.discountType === 'PERCENTAGE' && (
                      <div className="text-[10px] text-muted-foreground">
                        Cap: ${Number(coupon.maxDiscountAmount).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Middle: Conditions, Validity Dates & Usage */}
                <div className="space-y-1.5 pt-2 border-t border-border/60 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <div>
                      {coupon.minOrderAmount ? (
                        <span>Min Cart: ${Number(coupon.minOrderAmount).toFixed(2)}</span>
                      ) : (
                        <span>No min cart</span>
                      )}
                    </div>
                    <div className="font-mono">
                      Redeemed: <strong className="text-foreground">{coupon.usageCount}</strong>
                      {coupon.usageLimit && <span> / {coupon.usageLimit}</span>}
                    </div>
                  </div>

                  <div>
                    {renderValidityDate(coupon.startDate, coupon.endDate)}
                  </div>
                </div>

                {/* Card Footer: Status Toggle & Action Buttons */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40">
                  <button
                    onClick={() => handleToggleActive(coupon)}
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
                      coupon.isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-zinc-100 text-zinc-500 border-zinc-300'
                    }`}
                  >
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </button>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => openEditModal(coupon)}
                      title="Edit coupon"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteCoupon(coupon)}
                      title="Delete coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. DESKTOP VIEW: Table With Actions */}
        <Card className="hidden md:block overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[280px]">Coupon Code</TableHead>
                  <TableHead>Discount Value</TableHead>
                  <TableHead>Order Conditions</TableHead>
                  <TableHead>Validity Dates</TableHead>
                  <TableHead className="text-center">Redemptions</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Loading coupons...
                    </TableCell>
                  </TableRow>
                ) : filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Tag className="w-8 h-8 text-muted-foreground/50" />
                        <p className="font-medium text-foreground">No coupons found</p>
                        <p className="text-xs text-muted-foreground">
                          Try searching for a different code or create a new coupon.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <TableRow
                      key={coupon.id}
                      className="hover:bg-muted/50 transition-colors group"
                    >
                      {/* Code & Description */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-foreground text-sm bg-muted/60 px-2 py-1 rounded border border-border group-hover:border-primary/40 transition-colors">
                              {coupon.code}
                            </span>
                            <button
                              onClick={() => handleCopy(coupon.code)}
                              title="Copy code"
                              className="text-muted-foreground hover:text-foreground transition-colors p-1"
                            >
                              {copiedCode === coupon.code ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          {coupon.description && (
                            <p className="text-xs text-muted-foreground max-w-xs truncate">
                              {coupon.description}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Discount Value */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                            {coupon.discountType === 'PERCENTAGE' ? (
                              <>
                                <Percent className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{coupon.discountValue}% OFF</span>
                              </>
                            ) : (
                              <>
                                <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                                <span>${Number(coupon.discountValue).toFixed(2)} OFF</span>
                              </>
                            )}
                          </div>
                          {coupon.maxDiscountAmount && coupon.discountType === 'PERCENTAGE' && (
                            <div className="text-[11px] text-muted-foreground">
                              Up to ${Number(coupon.maxDiscountAmount).toFixed(2)} cap
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Conditions */}
                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          {coupon.minOrderAmount ? (
                            <span>Min. Cart: <strong className="text-foreground">${Number(coupon.minOrderAmount).toFixed(2)}</strong></span>
                          ) : (
                            <span>No minimum purchase</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Validity Dates */}
                      <TableCell>
                        {renderValidityDate(coupon.startDate, coupon.endDate)}
                      </TableCell>

                      {/* Redemptions */}
                      <TableCell className="text-center font-mono text-xs">
                        <span className="font-bold text-foreground">{coupon.usageCount}</span>
                        {coupon.usageLimit ? (
                          <span className="text-muted-foreground"> / {coupon.usageLimit}</span>
                        ) : (
                          <span className="text-muted-foreground text-[10px] block">Unlimited</span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                            coupon.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-zinc-100 text-zinc-500 border-zinc-300 hover:bg-zinc-200'
                          }`}
                        >
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </TableCell>

                      {/* Actions: Edit & Remove */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => openEditModal(coupon)}
                            title="Edit coupon"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteCoupon(coupon)}
                            title="Delete coupon"
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

      {/* Create / Edit Coupon Modal */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              {editingCoupon ? (
                <>
                  <Pencil className="w-4 h-4 text-primary" />
                  Edit Coupon: {editingCoupon.code}
                </>
              ) : (
                <>
                  <Tag className="w-4 h-4 text-primary" />
                  Create New Coupon
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {editingCoupon
                ? 'Update discount rules, validity dates, minimum order caps, or usage restrictions.'
                : 'Configure a promotional discount code with optional start and expiry dates.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {formError && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
                {formError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Coupon Code *</label>
              <Input
                placeholder="e.g. WOODCRAFT15"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono uppercase font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description / Notes</label>
              <Input
                placeholder="e.g. 15% discount on handcrafted dining tables"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                  className="w-full text-xs font-medium h-9 rounded-md border border-border bg-background px-3 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {discountType === 'PERCENTAGE' ? 'Discount Percentage *' : 'Discount Amount ($) *'}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder={discountType === 'PERCENTAGE' ? '15' : '50.00'}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Min. Order ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Optional min total"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                />
              </div>

              {discountType === 'PERCENTAGE' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Max Cap ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Optional max discount"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Usage Limit</label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Unlimited if empty"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Validity Dates (Start & Expiry) */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/50">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Valid From (Start Date)</span>
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xs h-9 bg-background"
                />
                <span className="text-[10px] text-muted-foreground block">
                  Leave empty to start immediately
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Valid Until (Expiry Date)</span>
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-xs h-9 bg-background"
                />
                <span className="text-[10px] text-muted-foreground block">
                  Leave empty for lifetime validity
                </span>
              </div>
            </div>

            {discountType === 'PERCENTAGE' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Global Usage Limit</label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Optional total redemptions"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-border w-4 h-4 text-primary focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-xs font-medium text-foreground cursor-pointer">
                Coupon is immediately active for customer checkout
              </label>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormModalOpen(false)}
                disabled={createCouponMutation.isPending || updateCouponMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCouponMutation.isPending || updateCouponMutation.isPending}
                className="font-semibold shadow-xs"
              >
                {editingCoupon
                  ? updateCouponMutation.isPending
                    ? 'Saving...'
                    : 'Save Changes'
                  : createCouponMutation.isPending
                  ? 'Creating...'
                  : 'Create Coupon'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Coupon Confirmation Modal (Matching Product Delete Modal) */}
      <Dialog open={Boolean(deleteCoupon)} onOpenChange={(open) => !open && setDeleteCoupon(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete coupon{' '}
              <strong className="text-foreground font-mono">{deleteCoupon?.code}</strong>? Customers
              will no longer be able to redeem this promo code at checkout.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteCoupon(null)}
              disabled={deleteCouponMutation.isPending}
            >
              Cancel
            </Button>
            <HoldToDeleteButton
              onTrigger={() => {
                if (deleteCoupon) {
                  deleteCouponMutation.mutate(deleteCoupon.id);
                }
              }}
              isPending={deleteCouponMutation.isPending}
              label="Delete Coupon"
              pendingLabel="Deleting Coupon..."
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
