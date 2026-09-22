'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Palette, Plus, Trash2, Tag, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Attribute } from '@/types';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function AttributesPage() {
  const queryClient = useQueryClient();
  const [isCreateAttrOpen, setIsCreateAttrOpen] = React.useState(false);
  const [isAddValueOpen, setIsAddValueOpen] = React.useState(false);
  const [selectedAttrId, setSelectedAttrId] = React.useState<string | null>(null);

  // New Attribute Form
  const [attrName, setAttrName] = React.useState('');
  const [attrSlug, setAttrSlug] = React.useState('');

  // New Term/Value Form
  const [valueName, setValueName] = React.useState('');
  const [valueSlug, setValueSlug] = React.useState('');
  const [valueColorHex, setValueColorHex] = React.useState('#8B5A2B');

  const { data: attributes = [], isLoading } = useQuery({
    queryKey: ['attributes'],
    queryFn: () => api.getAttributes(),
  });

  const createAttrMutation = useMutation({
    mutationFn: (data: { name: string; slug?: string }) => api.createAttribute(data),
    onSuccess: () => {
      toast.success('Attribute created successfully');
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
      setIsCreateAttrOpen(false);
      setAttrName('');
      setAttrSlug('');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create attribute');
    },
  });

  const addValueMutation = useMutation({
    mutationFn: ({
      attributeId,
      data,
    }: {
      attributeId: string;
      data: { name: string; value?: string; colorHex?: string };
    }) => api.addAttributeValue(attributeId, data),
    onSuccess: () => {
      toast.success('Term / swatch added');
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
      setIsAddValueOpen(false);
      setValueName('');
      setValueSlug('');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to add term');
    },
  });

  const deleteValueMutation = useMutation({
    mutationFn: (valueId: string) => api.deleteAttributeValue(valueId),
    onSuccess: () => {
      toast.success('Term removed');
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to remove term');
    },
  });

  const handleOpenAddValue = (attrId: string) => {
    setSelectedAttrId(attrId);
    setIsAddValueOpen(true);
  };

  const handleCreateAttrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAttrMutation.mutate({
      name: attrName,
      slug: attrSlug || undefined,
    });
  };

  const handleAddValueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttrId) return;

    addValueMutation.mutate({
      attributeId: selectedAttrId,
      data: {
        name: valueName,
        value: valueSlug || undefined,
        colorHex: valueColorHex || undefined,
      },
    });
  };

  return (
    <div className="space-y-8">
      <Header title="Attributes & Visual Swatches" />

      <div className="px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">WooCommerce Global Attributes</h2>
            <p className="text-xs text-muted-foreground">
              Define reusable product specs (e.g. Wood Stains, Fabrics, Sizes) with swatch colors for customer customization.
            </p>
          </div>

          <Button onClick={() => setIsCreateAttrOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Attribute
          </Button>
        </div>

        {/* Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground col-span-2">Loading attributes...</p>
          ) : attributes.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-2">No attributes found.</p>
          ) : (
            attributes.map((attr) => (
              <Card key={attr.id} className="shadow-xs border-border/80">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary" />
                      <span>{attr.name}</span>
                    </CardTitle>
                    <CardDescription className="font-mono text-xs text-muted-foreground">
                      slug: {attr.slug}
                    </CardDescription>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => handleOpenAddValue(attr.id)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Term
                  </Button>
                </CardHeader>

                <CardContent className="space-y-3 pt-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Configured Terms & Swatches ({attr.values?.length || 0})
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {attr.values?.map((val) => (
                      <div
                        key={val.id}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/70 text-xs font-medium shadow-2xs hover:border-wood-400 transition-colors"
                      >
                        {val.colorHex && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: val.colorHex }}
                          />
                        )}
                        <span className="text-foreground">{val.name}</span>
                        {val.colorHex && (
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {val.colorHex}
                          </span>
                        )}
                        <button
                          onClick={() => deleteValueMutation.mutate(val.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity ml-1"
                          title="Delete term"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create Attribute Dialog */}
      <Dialog open={isCreateAttrOpen} onOpenChange={setIsCreateAttrOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Attribute</DialogTitle>
            <DialogDescription>
              e.g., &quot;Wood Finish&quot;, &quot;Fabric Upholstery&quot;, &quot;Seating Capacity&quot;.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAttrSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Attribute Name *</label>
              <Input
                required
                placeholder="e.g., Wood Finish"
                value={attrName}
                onChange={(e) => setAttrName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Slug (Optional)</label>
              <Input
                placeholder="wood-finish (auto-generated if empty)"
                value={attrSlug}
                onChange={(e) => setAttrSlug(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateAttrOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createAttrMutation.isPending}>
                {createAttrMutation.isPending ? 'Saving...' : 'Create Attribute'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Term / Value Dialog */}
      <Dialog open={isAddValueOpen} onOpenChange={setIsAddValueOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attribute Term / Swatch</DialogTitle>
            <DialogDescription>
              Add a concrete option (e.g., &quot;Solid Walnut&quot;, &quot;Natural Oak&quot;) with swatch color.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddValueSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Term Name *</label>
              <Input
                required
                placeholder="e.g., Natural White Oak"
                value={valueName}
                onChange={(e) => setValueName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Slug (Optional)</label>
              <Input
                placeholder="natural-oak"
                value={valueSlug}
                onChange={(e) => setValueSlug(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Swatch Color (Hex)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-9 h-9 rounded cursor-pointer border border-border p-0.5 bg-transparent"
                  value={valueColorHex}
                  onChange={(e) => setValueColorHex(e.target.value)}
                />
                <Input
                  className="font-mono text-xs"
                  placeholder="#C8AD7F"
                  value={valueColorHex}
                  onChange={(e) => setValueColorHex(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddValueOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addValueMutation.isPending}>
                {addValueMutation.isPending ? 'Saving...' : 'Add Term'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
