'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Truck,
  Plus,
  Pencil,
  Trash2,
  Clock,
  Store,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { ShippingMethodOption } from '@/types';

export default function ShippingAdminPage() {
  const queryClient = useQueryClient();

  // Dialog State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingMethod, setEditingMethod] = React.useState<ShippingMethodOption | null>(null);

  // Form State
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('50');
  const [carrier, setCarrier] = React.useState('');
  const [estimatedDays, setEstimatedDays] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [type, setType] = React.useState('FIXED');
  const [isDefault, setIsDefault] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);

  // Fetch Shipping Methods
  const { data: methods = [], isLoading } = useQuery({
    queryKey: ['admin-shipping-methods'],
    queryFn: () => api.getAdminShippingMethods(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => api.createShippingMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping-methods'] });
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
      toast.success('Shipping method created successfully');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create shipping method');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateShippingMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping-methods'] });
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
      toast.success('Shipping method updated successfully');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update shipping method');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteShippingMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping-methods'] });
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
      toast.success('Shipping method deleted');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete shipping method');
    },
  });

  const resetForm = () => {
    setEditingMethod(null);
    setName('');
    setPrice('50');
    setCarrier('');
    setEstimatedDays('');
    setDescription('');
    setType('FIXED');
    setIsDefault(false);
    setIsActive(true);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (method: ShippingMethodOption) => {
    setEditingMethod(method);
    setName(method.name);
    setPrice(String(method.price));
    setCarrier(method.carrier || '');
    setEstimatedDays(method.estimatedDays || '');
    setDescription(method.description || '');
    setType(method.type || 'FIXED');
    setIsDefault(method.isDefault || false);
    setIsActive(method.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a method name');
      return;
    }

    const payload = {
      name: name.trim(),
      price: parseFloat(price) || 0,
      carrier: carrier.trim(),
      estimatedDays: estimatedDays.trim(),
      description: description.trim(),
      type,
      isDefault,
      isActive,
    };

    if (editingMethod) {
      updateMutation.mutate({ id: editingMethod.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <Header title="Shipping & Delivery Rates" />

      {/* Centered Desktop Layout Container (matching other admin pages) */}
      <div className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        {/* Action Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Configured Shipping Methods</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Define fixed delivery rates, regional couriers, and pickup options.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="h-9 text-xs gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add Shipping Method</span>
          </Button>
        </div>

        {/* Methods Table Box */}
        <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">Method & Carrier</TableHead>
                <TableHead className="text-xs font-semibold">Type</TableHead>
                <TableHead className="text-xs font-semibold">Delivery Fee</TableHead>
                <TableHead className="text-xs font-semibold">Timeline</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading shipping configurations...
                  </TableCell>
                </TableRow>
              ) : methods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                    No shipping methods configured. Click Add Shipping Method to create one.
                  </TableCell>
                </TableRow>
              ) : (
                methods.map((method) => (
                  <TableRow key={method.id} className="hover:bg-muted/30">
                    <TableCell className="py-3">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-muted text-muted-foreground mt-0.5">
                          {method.type === 'LOCAL_PICKUP' ? (
                            <Store className="w-4 h-4" />
                          ) : (
                            <Truck className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">{method.name}</span>
                            {method.isDefault && (
                              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                                Default
                              </Badge>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground block mt-0.5">
                            {method.carrier || 'Standard Logistics'}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {method.type || 'FIXED'}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-mono font-bold text-foreground">
                        {method.price === 0 ? 'Free' : formatCurrency(method.price)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {method.estimatedDays || '3-5 days'}
                      </span>
                    </TableCell>

                    <TableCell>
                      <button
                        type="button"
                        onClick={() =>
                          updateMutation.mutate({
                            id: method.id,
                            data: { isActive: !method.isActive },
                          })
                        }
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        {method.isActive !== false ? (
                          <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20 text-[10px]">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            Disabled
                          </Badge>
                        )}
                      </button>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!method.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateMutation.mutate({
                                id: method.id,
                                data: { isDefault: true },
                              })
                            }
                            className="h-8 text-[11px] text-muted-foreground hover:text-foreground"
                            title="Set as Default"
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(method)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Edit Method"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm(`Delete shipping method "${method.name}"?`)) {
                              deleteMutation.mutate(method.id);
                            }
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Delete Method"
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
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? 'Edit Shipping Method' : 'Add New Shipping Method'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Method Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Standard Fixed-Rate Freight"
                className="h-10 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Fixed Price ($) *</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="50.00"
                  className="h-10 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs"
                >
                  <option value="FIXED">Fixed Rate</option>
                  <option value="LOCAL_PICKUP">Local Studio Pickup</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Logistics Carrier</label>
              <Input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g. Chapar / Tipax / FedEx Freight"
                className="h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Estimated Delivery Time</label>
              <Input
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                placeholder="e.g. 3-5 business days"
                className="h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short customer-facing delivery notes"
                rows={2}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <span>Set as Default Method</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <span>Active</span>
              </label>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="h-9 text-xs"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingMethod ? (
                  'Save Changes'
                ) : (
                  'Create Method'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
