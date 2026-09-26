'use client';

import * as React from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  TreePine,
  CheckCircle2,
  RotateCcw,
  Maximize2,
  Scale,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export interface SpecificationItem {
  label: string;
  value: string;
}

interface ProductSpecificationsTabProps {
  specifications: SpecificationItem[];
  onChange: (specifications: SpecificationItem[]) => void;
  productName?: string;
  defaultDimensions?: string;
  defaultWeight?: string;
  onNavigateToOverview?: () => void;
}

const COMMON_LABEL_SUGGESTIONS = [
  'Timber Origin',
  'Joinery Technique',
  'Surface Finish',
  'Craft Dimensions',
  'Net Weight',
  'Hardware',
  'Environmental Standard',
  'Warranty & Care',
  'Seating Capacity',
  'Assembly',
];

export function ProductSpecificationsTab({
  specifications = [],
  onChange,
  productName = 'Product',
  defaultDimensions = '',
  defaultWeight = '',
  onNavigateToOverview,
}: ProductSpecificationsTabProps) {
  const handleAddRow = () => {
    onChange([...specifications, { label: '', value: '' }]);
  };

  const handleUpdateRow = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleDeleteRow = (index: number) => {
    const updated = specifications.filter((_, i) => i !== index);
    onChange(updated);
    toast.info('Specification row removed');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...specifications];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === specifications.length - 1) return;
    const updated = [...specifications];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  // Sync Dimensions & Weight from default form fields into repeater rows
  const handleSyncFromDefaultFields = () => {
    let updated = [...specifications];
    let syncedCount = 0;

    // 1. Sync Dimensions
    if (defaultDimensions) {
      const dimIdx = updated.findIndex((i) => /dimension/i.test(i.label));
      if (dimIdx >= 0) {
        updated[dimIdx] = { ...updated[dimIdx], value: defaultDimensions };
      } else {
        updated.unshift({ label: 'Craft Dimensions', value: defaultDimensions });
      }
      syncedCount++;
    }

    // 2. Sync Weight
    if (defaultWeight) {
      const formattedWeight = `${defaultWeight} kg`;
      const weightIdx = updated.findIndex((i) => /weight/i.test(i.label));
      if (weightIdx >= 0) {
        updated[weightIdx] = { ...updated[weightIdx], value: formattedWeight };
      } else {
        const dimPos = updated.findIndex((i) => /dimension/i.test(i.label));
        const insertPos = dimPos >= 0 ? dimPos + 1 : 0;
        updated.splice(insertPos, 0, { label: 'Net Weight', value: formattedWeight });
      }
      syncedCount++;
    }

    if (syncedCount > 0) {
      onChange(updated);
      toast.success('Dimensions & weight populated directly from Overview form fields');
    } else {
      toast.info('No dimensions or weight entered in Overview tab yet');
    }
  };

  // Quick insertion chip handler
  const handleQuickInsert = (tag: string) => {
    let val = '';
    if (/dimension/i.test(tag) && defaultDimensions) {
      val = defaultDimensions;
    } else if (/weight/i.test(tag) && defaultWeight) {
      val = `${defaultWeight} kg`;
    }
    onChange([...specifications, { label: tag, value: val }]);
    toast.info(`Added row "${tag}"${val ? ` (value auto-filled from default fields: "${val}")` : ''}`);
  };

  const handleClearAll = () => {
    onChange([]);
    toast.info('All specifications cleared');
  };

  return (
    <div className="space-y-6">
      {/* Main Repeater Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
                <TreePine className="w-3.5 h-3.5" />
                <span>Repeater List Field</span>
              </div>
              <CardTitle className="text-lg font-serif">Artisanal Specifications & Metadata</CardTitle>
              <CardDescription className="text-xs">
                Manage the repeater table of craftsmanship details shown on the customer storefront for this piece.
              </CardDescription>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRow}
                className="gap-1 text-xs h-8 border-border hover:border-shaad-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSyncFromDefaultFields}
                className="gap-1.5 text-xs h-8 border-border hover:border-shaad-800"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Sync Dimensions & Weight</span>
              </Button>

              {specifications.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Quick Suggestion Chips */}
          <div className="space-y-1.5 pb-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Quick Label Insert Chips (Dimensions & Weight pull from Overview):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_LABEL_SUGGESTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickInsert(tag)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-muted hover:bg-shaad-50 hover:text-shaad-900 border border-border/80 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Repeater Rows */}
          {specifications.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border/80 p-8 text-center space-y-3 bg-muted/20">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
                <TreePine className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-sm text-foreground">
                No Specifications Added Yet
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Add custom specification rows to define timber species, joinery, surface treatment, hardware, and craftsmanship details.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSyncFromDefaultFields}
                  className="gap-1.5 text-xs bg-shaad-800 hover:bg-shaad-900 text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sync Dimensions & Weight</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddRow}
                  className="gap-1 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Blank Row</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {specifications.map((item, idx) => {
                const isDimensionRow = /dimension/i.test(item.label);
                const isWeightRow = /weight/i.test(item.label);

                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 p-3 rounded-xl border border-border/70 bg-card hover:border-shaad-300 transition-colors"
                  >
                    {/* Row Index Badge & Move Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="w-6 h-6 rounded-md bg-muted text-[11px] font-mono font-bold flex items-center justify-center text-muted-foreground">
                        {idx + 1}
                      </span>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-20 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === specifications.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Label Input with Field Source Indicator */}
                    <div className="w-full sm:w-1/3 space-y-1">
                      <Input
                        value={item.label}
                        onChange={(e) => handleUpdateRow(idx, 'label', e.target.value)}
                        placeholder="e.g. Timber Origin"
                        className="h-9 text-xs font-semibold bg-white border-border/70"
                      />
                      {(isDimensionRow || isWeightRow) && (
                        <span className="text-[10px] text-amber-800 font-medium flex items-center gap-1 pl-1">
                          {isDimensionRow ? <Maximize2 className="w-3 h-3" /> : <Scale className="w-3 h-3" />}
                          <span>Default form field</span>
                        </span>
                      )}
                    </div>

                    {/* Value Input */}
                    <div className="w-full sm:flex-1 space-y-1">
                      <Input
                        value={item.value}
                        onChange={(e) => handleUpdateRow(idx, 'value', e.target.value)}
                        placeholder="e.g. Sustainably Harvested Solid European White Oak"
                        className="h-9 text-xs bg-white border-border/70"
                      />
                      {isDimensionRow && defaultDimensions && item.value !== defaultDimensions && (
                        <button
                          type="button"
                          onClick={() => handleUpdateRow(idx, 'value', defaultDimensions)}
                          className="text-[10px] text-primary hover:underline pl-1 block"
                        >
                          Use Overview value: &quot;{defaultDimensions}&quot;
                        </button>
                      )}
                      {isWeightRow && defaultWeight && item.value !== `${defaultWeight} kg` && (
                        <button
                          type="button"
                          onClick={() => handleUpdateRow(idx, 'value', `${defaultWeight} kg`)}
                          className="text-[10px] text-primary hover:underline pl-1 block"
                        >
                          Use Overview value: &quot;{defaultWeight} kg&quot;
                        </button>
                      )}
                    </div>

                    {/* Delete Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRow(idx)}
                      className="shrink-0 h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Remove Row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                );
              })}

              <div className="pt-2 flex-col md:flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddRow}
                  className="gap-1.5 text-xs h-8"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Specification Row</span>
                </Button>
                <span className="text-[11px] font-mono text-muted-foreground block pt-1 md:text-left">
                  {specifications.length} specification {specifications.length === 1 ? 'row' : 'rows'} defined
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Live Storefront Preview */}
      <Card className="border-border bg-zen-50/50">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex-col md:flex items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-shaad-800" />
              <span>Storefront Customer View Preview</span>
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-mono">
              Live Preview
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="bg-white rounded-2xl border border-border/70 overflow-hidden shadow-2xs divide-y divide-border/60">
            {/* Show Default Dimensions & Weight in Preview if not in repeater */}
            {defaultDimensions && !specifications.some((i) => /dimension/i.test(i.label)) && (
              <div className="grid grid-cols-1 md:grid-cols-12 p-3 sm:p-4 gap-1.5 md:gap-4 items-baseline bg-amber-50/30">
                <div className="md:col-span-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-shaad-700 shrink-0" />
                  <span>Craft Dimensions</span>
                  <span className="text-[10px] text-amber-700 font-mono">(From Overview)</span>
                </div>
                <div className="md:col-span-8 text-xs font-medium text-foreground">
                  {defaultDimensions}
                </div>
              </div>
            )}

            {defaultWeight && !specifications.some((i) => /weight/i.test(i.label)) && (
              <div className="grid grid-cols-1 md:grid-cols-12 p-3 sm:p-4 gap-1.5 md:gap-4 items-baseline bg-amber-50/30">
                <div className="md:col-span-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-shaad-700 shrink-0" />
                  <span>Net Weight</span>
                  <span className="text-[10px] text-amber-700 font-mono">(From Overview)</span>
                </div>
                <div className="md:col-span-8 text-xs font-medium text-foreground">
                  {defaultWeight} kg
                </div>
              </div>
            )}

            {specifications.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-3 sm:p-4 gap-1.5 md:gap-4 items-baseline"
              >
                <div className="md:col-span-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-shaad-700 shrink-0" />
                  <span>{item.label || '(Empty Label)'}</span>
                </div>
                <div className="md:col-span-8 text-xs font-medium text-foreground">
                  {item.value || '(Empty Value)'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
