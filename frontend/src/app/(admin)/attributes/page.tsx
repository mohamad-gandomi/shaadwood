'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Palette,
  Plus,
  Trash2,
  Tag,
  Check,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Search,
  Filter,
  Sliders,
  AlertCircle,
  ExternalLink,
  Info,
  Pencil,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Attribute, AttributeValue, MediaItem } from '@/types';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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

const FURNITURE_COLOR_PRESETS = [
  { name: 'Walnut Stain', hex: '#5C4033' },
  { name: 'White Oak', hex: '#C8AD7F' },
  { name: 'Natural Ash', hex: '#D2B48C' },
  { name: 'Espresso', hex: '#2B1D0C' },
  { name: 'Charcoal Black', hex: '#262626' },
  { name: 'Warm Cream', hex: '#F5F2EB' },
  { name: 'Emerald Velvet', hex: '#1B4D3E' },
  { name: 'Terracotta', hex: '#C86D51' },
  { name: 'Navy Blue', hex: '#1B263B' },
  { name: 'Brushed Brass', hex: '#B5A642' },
];

export default function AttributesPage() {
  const queryClient = useQueryClient();

  // Search & Type Filter State
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<'ALL' | 'COLOR' | 'IMAGE' | 'TEXT'>('ALL');

  // Attribute Modal State (Create or Edit)
  const [attrDialog, setAttrDialog] = React.useState<{
    isOpen: boolean;
    mode: 'CREATE' | 'EDIT';
    attribute?: Attribute;
  }>({
    isOpen: false,
    mode: 'CREATE',
  });
  const [attrName, setAttrName] = React.useState('');
  const [attrSlug, setAttrSlug] = React.useState('');
  const [attrDisplayType, setAttrDisplayType] = React.useState<'COLOR' | 'IMAGE' | 'TEXT'>('TEXT');

  // Term / Option Modal State (Create or Edit)
  const [termDialog, setTermDialog] = React.useState<{
    isOpen: boolean;
    mode: 'CREATE' | 'EDIT';
    attribute: Attribute | null;
    term?: AttributeValue;
  }>({
    isOpen: false,
    mode: 'CREATE',
    attribute: null,
  });
  const [termMode, setTermMode] = React.useState<'TEXT' | 'COLOR' | 'IMAGE'>('TEXT');
  const [valueName, setValueName] = React.useState('');
  const [valueSlug, setValueSlug] = React.useState('');
  const [valueColorHex, setValueColorHex] = React.useState('#5C4033');
  const [valueImage, setValueImage] = React.useState('');

  // Warning & Confirmation Delete Modals
  const [deleteConfirmAttr, setDeleteConfirmAttr] = React.useState<Attribute | null>(null);
  const [deleteConfirmTerm, setDeleteConfirmTerm] = React.useState<{
    termId: string;
    termName: string;
    attributeName: string;
  } | null>(null);

  // Media Picker Dialog for Fabric/Texture Swatches
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);

  // Fetch Attributes
  const { data: attributes = [], isLoading } = useQuery({
    queryKey: ['attributes'],
    queryFn: () => api.getAttributes(),
  });

  // Calculate Metrics
  const stats = React.useMemo(() => {
    let totalSwatches = 0;
    let colorCount = 0;
    let imageCount = 0;
    let textCount = 0;

    attributes.forEach((attr) => {
      attr.values?.forEach((val) => {
        totalSwatches++;
        if (val.image) imageCount++;
        else if (val.colorHex) colorCount++;
        else textCount++;
      });
    });

    return { totalSwatches, colorCount, imageCount, textCount };
  }, [attributes]);

  // Filtered attributes
  const filteredAttributes = React.useMemo(() => {
    return attributes.filter((attr) => {
      const matchesSearch =
        search.trim() === '' ||
        attr.name.toLowerCase().includes(search.toLowerCase()) ||
        attr.slug.toLowerCase().includes(search.toLowerCase()) ||
        attr.values?.some((v) => v.name.toLowerCase().includes(search.toLowerCase()));

      const matchesType =
        typeFilter === 'ALL' ||
        (attr.displayType || 'TEXT').toUpperCase() === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [attributes, search, typeFilter]);

  // --- MUTATIONS ---

  // 1. Create Attribute
  const createAttrMutation = useMutation({
    mutationFn: (data: { name: string; slug?: string; displayType?: string }) =>
      api.createAttribute(data),
    onSuccess: () => {
      toast.success('Attribute created successfully');
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
      setAttrDialog({ isOpen: false, mode: 'CREATE' });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create attribute');
    },
  });

  // 2. Update Attribute
  const updateAttrMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; slug?: string; displayType?: string } }) =>
      api.updateAttribute(id, data),
    onSuccess: () => {
      toast.success('Attribute updated successfully');
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
      setAttrDialog({ isOpen: false, mode: 'CREATE' });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update attribute');
    },
  });

  // 3. Delete Attribute
  const deleteAttrMutation = useMutation({
    mutationFn: (id: string) => api.deleteAttribute(id),
    onSuccess: () => {
      toast.success('Attribute and associated terms deleted');
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
      setDeleteConfirmAttr(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete attribute');
    },
  });

  // 4. Add Option (Term)
  const addValueMutation = useMutation({
    mutationFn: ({
      attributeId,
      data,
    }: {
      attributeId: string;
      data: { name: string; value?: string; colorHex?: string; image?: string };
    }) => api.addAttributeValue(attributeId, data),
    onSuccess: () => {
      toast.success('Option added successfully');
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
      setTermDialog({ isOpen: false, mode: 'CREATE', attribute: null });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to add option');
    },
  });

  // 5. Update Option (Term)
  const updateValueMutation = useMutation({
    mutationFn: ({
      valueId,
      data,
    }: {
      valueId: string;
      data: { name?: string; value?: string; colorHex?: string; image?: string };
    }) => api.updateAttributeValue(valueId, data),
    onSuccess: () => {
      toast.success('Option updated successfully');
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
      setTermDialog({ isOpen: false, mode: 'CREATE', attribute: null });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update option');
    },
  });

  // 6. Delete Option (Term)
  const deleteValueMutation = useMutation({
    mutationFn: (valueId: string) => api.deleteAttributeValue(valueId),
    onSuccess: () => {
      toast.success('Option removed successfully');
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
      setDeleteConfirmTerm(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to remove option');
    },
  });

  // --- HANDLERS ---

  // Open Create Attribute Modal
  const handleOpenCreateAttr = () => {
    setAttrName('');
    setAttrSlug('');
    setAttrDisplayType('TEXT');
    setAttrDialog({ isOpen: true, mode: 'CREATE' });
  };

  // Open Edit Attribute Modal
  const handleOpenEditAttr = (attr: Attribute) => {
    setAttrName(attr.name);
    setAttrSlug(attr.slug);
    setAttrDisplayType(((attr.displayType || 'TEXT').toUpperCase()) as any);
    setAttrDialog({ isOpen: true, mode: 'EDIT', attribute: attr });
  };

  // Submit Attribute (Create or Edit)
  const handleAttrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attrName.trim()) return;

    if (attrDialog.mode === 'CREATE') {
      createAttrMutation.mutate({
        name: attrName.trim(),
        slug: attrSlug.trim() || undefined,
        displayType: attrDisplayType,
      });
    } else if (attrDialog.mode === 'EDIT' && attrDialog.attribute) {
      updateAttrMutation.mutate({
        id: attrDialog.attribute.id,
        data: {
          name: attrName.trim(),
          slug: attrSlug.trim() || undefined,
          displayType: attrDisplayType,
        },
      });
    }
  };

  // Open Add Term Modal
  const handleOpenAddTerm = (attr: Attribute) => {
    const defaultMode = (attr.displayType || 'TEXT').toUpperCase();
    if (defaultMode === 'IMAGE') setTermMode('IMAGE');
    else if (defaultMode === 'COLOR') setTermMode('COLOR');
    else setTermMode('TEXT');

    setValueName('');
    setValueSlug('');
    setValueImage('');
    setValueColorHex('#5C4033');

    setTermDialog({
      isOpen: true,
      mode: 'CREATE',
      attribute: attr,
    });
  };

  // Open Edit Term Modal
  const handleOpenEditTerm = (attr: Attribute, term: AttributeValue) => {
    setValueName(term.name);
    setValueSlug(term.value);
    setValueColorHex(term.colorHex || '#5C4033');
    setValueImage(term.image || '');

    if (term.image) {
      setTermMode('IMAGE');
    } else if (term.colorHex) {
      setTermMode('COLOR');
    } else {
      setTermMode('TEXT');
    }

    setTermDialog({
      isOpen: true,
      mode: 'EDIT',
      attribute: attr,
      term,
    });
  };

  // Submit Term (Create or Edit)
  const handleTermSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termDialog.attribute || !valueName.trim()) return;

    const payload = {
      name: valueName.trim(),
      value: valueSlug.trim() || undefined,
      colorHex: termMode === 'COLOR' ? valueColorHex : undefined,
      image: termMode === 'IMAGE' ? valueImage : undefined,
    };

    if (termDialog.mode === 'CREATE') {
      addValueMutation.mutate({
        attributeId: termDialog.attribute.id,
        data: payload,
      });
    } else if (termDialog.mode === 'EDIT' && termDialog.term) {
      updateValueMutation.mutate({
        valueId: termDialog.term.id,
        data: payload,
      });
    }
  };

  const handleMediaSelect = (media: MediaItem) => {
    setValueImage(media.url);
    setIsMediaPickerOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      <Header title="Global Attributes & Swatches" />

      <div className="px-6 sm:px-8 max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Global Attributes</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Click any attribute or swatch to modify its details. Manage wood finishes, fabric textures, dimensions, and specifications.
            </p>
          </div>

          <Button
            onClick={handleOpenCreateAttr}
            className="gap-2 font-semibold shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Attribute
          </Button>
        </div>

        {/* Metrics KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Attributes</p>
                <p className="text-xl font-bold text-foreground">{attributes.length}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Fabric & Textures</p>
                <p className="text-xl font-bold text-emerald-600">{stats.imageCount}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Color Swatches</p>
                <p className="text-xl font-bold text-amber-600">{stats.colorCount}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Specs & Sizes</p>
                <p className="text-xl font-bold text-foreground">{stats.textCount}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-muted text-foreground flex items-center justify-center">
                <Tag className="w-4 h-4" />
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
              placeholder="Search attributes or options..."
              className="pl-9 text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border bg-muted/40 text-xs overflow-x-auto">
            {[
              { label: 'All', val: 'ALL' },
              { label: '🎨 Colors', val: 'COLOR' },
              { label: '🖼️ Fabrics & Images', val: 'IMAGE' },
              { label: '🏷️ Specs & Text', val: 'TEXT' },
            ].map((tab) => (
              <button
                key={tab.val}
                type="button"
                onClick={() => setTypeFilter(tab.val as any)}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all text-xs whitespace-nowrap',
                  typeFilter === tab.val
                    ? 'bg-card text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {isLoading ? (
            <div className="col-span-2 py-20 text-center text-xs text-muted-foreground">
              Loading attributes and visual swatches...
            </div>
          ) : filteredAttributes.length === 0 ? (
            <Card className="col-span-2 py-16 text-center border-dashed">
              <CardContent className="space-y-3 max-w-sm mx-auto">
                <Sliders className="w-10 h-10 text-muted-foreground opacity-40 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">No attributes found</h3>
                  <p className="text-xs text-muted-foreground">
                    {search || typeFilter !== 'ALL'
                      ? 'No attributes match your filter criteria.'
                      : 'Create your first attribute to start generating product variations.'}
                  </p>
                </div>
                {search && (
                  <Button variant="outline" size="sm" onClick={() => setSearch('')} className="text-xs">
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredAttributes.map((attr) => {
              const displayType = (attr.displayType || 'TEXT').toUpperCase();

              return (
                <Card
                  key={attr.id}
                  className="shadow-xs border-border/80 flex flex-col justify-between hover:border-primary/40 transition-all duration-200"
                >
                  <div>
                    {/* Card Header with Edit on Click */}
                    <CardHeader className="flex flex-row items-start justify-between pb-3 space-y-0">
                      <div className="space-y-1.5 flex-1 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Attribute title: click to edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditAttr(attr)}
                            className="text-base font-bold text-foreground hover:text-primary transition-colors text-left flex items-center gap-1.5 group/title"
                            title="Click to edit attribute"
                          >
                            <span>{attr.name}</span>
                            <Pencil className="w-3.5 h-3.5 opacity-0 group-hover/title:opacity-100 text-muted-foreground transition-opacity" />
                          </button>

                          {/* Type Badge */}
                          {displayType === 'IMAGE' ? (
                            <Badge variant="outline" className="text-[10px] gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium">
                              <ImageIcon className="w-3 h-3" />
                              Fabric / Image
                            </Badge>
                          ) : displayType === 'COLOR' ? (
                            <Badge variant="outline" className="text-[10px] gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 font-medium">
                              <Palette className="w-3 h-3" />
                              Color Swatch
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] gap-1 bg-muted text-muted-foreground border-border font-medium">
                              <Tag className="w-3 h-3" />
                              Label / Spec
                            </Badge>
                          )}
                        </div>

                        <p className="font-mono text-xs text-muted-foreground">
                          slug: <span className="text-foreground/80">{attr.slug}</span>
                        </p>
                      </div>

                      {/* Header Actions: Edit, Add Term, Delete */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => handleOpenEditAttr(attr)}
                          title="Edit attribute details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 gap-1 font-semibold"
                          onClick={() => handleOpenAddTerm(attr)}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Term
                        </Button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmAttr(attr)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          title="Delete attribute"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-2 pb-4 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                        <span>Configured Terms ({attr.values?.length || 0})</span>
                        <span className="text-[10px] lowercase font-normal italic text-muted-foreground">
                          (click option to edit)
                        </span>
                      </div>

                      {/* Swatches Container */}
                      {attr.values && attr.values.length > 0 ? (
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {attr.values.map((val) => {
                            const hasImage = Boolean(val.image);
                            const hasColor = Boolean(val.colorHex);

                            return (
                              <div
                                key={val.id}
                                onClick={() => handleOpenEditTerm(attr, val)}
                                className={cn(
                                  'group relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all text-xs font-medium shadow-2xs cursor-pointer select-none',
                                  hasImage
                                    ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/70 hover:shadow-xs'
                                    : hasColor
                                    ? 'border-border/80 bg-card/80 hover:border-primary/60 hover:shadow-xs'
                                    : 'border-border bg-muted/40 hover:bg-muted hover:border-primary/50 hover:shadow-xs',
                                )}
                                title={`Click to edit "${val.name}"`}
                              >
                                {/* 1. Image Swatch */}
                                {hasImage && (
                                  <div className="relative w-6 h-6 rounded-md overflow-hidden ring-1 ring-black/10 shrink-0 shadow-2xs">
                                    <img
                                      src={val.image!}
                                      alt={val.name}
                                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    />
                                  </div>
                                )}

                                {/* 2. Color Swatch */}
                                {!hasImage && hasColor && (
                                  <span
                                    className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-2xs transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: val.colorHex! }}
                                  />
                                )}

                                {/* 3. Text label */}
                                <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                                  {val.name}
                                </span>

                                {/* Hex code indicator */}
                                {!hasImage && hasColor && (
                                  <span className="font-mono text-[10px] text-muted-foreground">
                                    {val.colorHex}
                                  </span>
                                )}

                                {/* Quick Edit Hint Icon */}
                                <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-70 transition-opacity ml-0.5" />

                                {/* Delete Term button with Confirmation Modal */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirmTerm({
                                      termId: val.id,
                                      termName: val.name,
                                      attributeName: attr.name,
                                    });
                                  }}
                                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity ml-1 p-0.5 rounded hover:bg-destructive/10"
                                  title="Delete option"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 border border-dashed rounded-lg text-center bg-muted/20">
                          <p className="text-xs text-muted-foreground">
                            No options defined yet. Click{' '}
                            <span
                              onClick={() => handleOpenAddTerm(attr)}
                              className="text-primary underline cursor-pointer font-medium"
                            >
                              Add Term
                            </span>{' '}
                            to configure choices.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* ATTRIBUTE DIALOG (CREATE & EDIT) */}
      <Dialog
        open={attrDialog.isOpen}
        onOpenChange={(open) => setAttrDialog((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)]">
          <DialogHeader className="pr-6">
            <DialogTitle>
              {attrDialog.mode === 'CREATE' ? 'Create New Attribute' : `Edit Attribute: ${attrDialog.attribute?.name}`}
            </DialogTitle>
            <DialogDescription>
              Attributes define customizable specs like Wood Finish, Fabric Material, or Dimensions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAttrSubmit} className="space-y-4 pt-2 w-full min-w-0">
            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">Attribute Name *</label>
              <Input
                required
                placeholder="e.g., Fabric Material, Wood Finish, Size"
                value={attrName}
                onChange={(e) => setAttrName(e.target.value)}
                className="text-xs w-full"
              />
            </div>

            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">Slug (Optional)</label>
              <Input
                placeholder="fabric-material (auto-generated if empty)"
                value={attrSlug}
                onChange={(e) => setAttrSlug(e.target.value)}
                className="text-xs font-mono w-full"
              />
            </div>

            {/* Display Type Choice */}
            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">Default Swatch Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full min-w-0">
                {[
                  {
                    type: 'TEXT',
                    title: 'Plain Spec',
                    desc: 'Text & size pills',
                    icon: Tag,
                  },
                  {
                    type: 'COLOR',
                    title: 'Color Swatch',
                    desc: 'Hex color dots',
                    icon: Palette,
                  },
                  {
                    type: 'IMAGE',
                    title: 'Fabric / Image',
                    desc: 'Texture swatches',
                    icon: ImageIcon,
                  },
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = attrDisplayType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setAttrDisplayType(item.type as any)}
                      className={cn(
                        'p-2.5 rounded-lg border text-left flex flex-row sm:flex-col items-center sm:items-start gap-2.5 sm:gap-1 transition-all min-w-0',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                          : 'border-border/80 hover:bg-muted/40 text-muted-foreground',
                      )}
                    >
                      <IconComponent
                        className={cn('w-4 h-4 shrink-0', isSelected ? 'text-primary' : 'text-muted-foreground')}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate">{item.title}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setAttrDialog((prev) => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAttrMutation.isPending || updateAttrMutation.isPending}
                className="w-full sm:w-auto font-semibold"
              >
                {createAttrMutation.isPending || updateAttrMutation.isPending
                  ? 'Saving...'
                  : attrDialog.mode === 'CREATE'
                  ? 'Create Attribute'
                  : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* TERM / OPTION DIALOG (CREATE & EDIT) */}
      <Dialog
        open={termDialog.isOpen}
        onOpenChange={(open) => setTermDialog((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="sm:max-w-xl w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain">
          <DialogHeader className="pr-6">
            <DialogTitle>
              {termDialog.mode === 'CREATE'
                ? `Add Option to "${termDialog.attribute?.name}"`
                : `Edit Option "${termDialog.term?.name}"`}
            </DialogTitle>
            <DialogDescription>
              Configure this option. Choose whether it is plain text, a color swatch, or a fabric/texture image.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTermSubmit} className="space-y-4 pt-1 w-full min-w-0 max-w-full">
            {/* Term Name & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Option Name *</label>
                <Input
                  required
                  placeholder="e.g., Bouclé Cream, Walnut, Large"
                  value={valueName}
                  onChange={(e) => setValueName(e.target.value)}
                  className="text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Slug (Optional)</label>
                <Input
                  placeholder="boucle-cream"
                  value={valueSlug}
                  onChange={(e) => setValueSlug(e.target.value)}
                  className="text-xs font-mono w-full"
                />
              </div>
            </div>

            {/* Swatch Mode Selector */}
            <div className="space-y-1.5 w-full min-w-0">
              <label className="text-xs font-semibold text-foreground">Option Visual Type</label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full min-w-0">
                <button
                  type="button"
                  onClick={() => setTermMode('TEXT')}
                  className={cn(
                    'p-2 rounded-lg border text-center text-[11px] sm:text-xs font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 min-w-0',
                    termMode === 'TEXT'
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Tag className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Spec / Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTermMode('COLOR')}
                  className={cn(
                    'p-2 rounded-lg border text-center text-[11px] sm:text-xs font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 min-w-0',
                    termMode === 'COLOR'
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Palette className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Color Swatch</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTermMode('IMAGE')}
                  className={cn(
                    'p-2 rounded-lg border text-center text-[11px] sm:text-xs font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 min-w-0',
                    termMode === 'IMAGE'
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Fabric / Image</span>
                </button>
              </div>
            </div>

            {/* 1. COLOR SWATCH CONTROLS */}
            {termMode === 'COLOR' && (
              <div className="p-3 sm:p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-3 w-full min-w-0 overflow-hidden">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <input
                      type="color"
                      className="w-10 h-10 rounded-lg cursor-pointer border border-border p-0.5 bg-transparent shrink-0"
                      value={valueColorHex}
                      onChange={(e) => setValueColorHex(e.target.value)}
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">Hex Color Code</span>
                    <Input
                      className="font-mono text-xs h-8 w-full"
                      placeholder="#5C4033"
                      value={valueColorHex}
                      onChange={(e) => setValueColorHex(e.target.value)}
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5 pt-1 min-w-0">
                  <span className="text-[11px] text-muted-foreground font-semibold">Furniture Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {FURNITURE_COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setValueColorHex(preset.hex)}
                        title={preset.name}
                        className={cn(
                          'w-6 h-6 rounded-full border border-black/20 transition-transform hover:scale-110 shadow-2xs shrink-0',
                          valueColorHex.toLowerCase() === preset.hex.toLowerCase() && 'ring-2 ring-primary ring-offset-2',
                        )}
                        style={{ backgroundColor: preset.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. IMAGE / FABRIC SWATCH CONTROLS */}
            {termMode === 'IMAGE' && (
              <div className="p-3 sm:p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-3 w-full min-w-0 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 shrink-0">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Fabric / Texture Image Swatch
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

                {valueImage ? (
                  <div className="flex items-center justify-between gap-2.5 p-2 rounded-lg border border-border bg-card w-full min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-border shrink-0 shadow-2xs">
                        <img src={valueImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">Selected Swatch Image</p>
                        <p className="text-[10px] font-mono text-muted-foreground truncate" title={valueImage}>
                          {valueImage}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setValueImage('')}
                      className="text-xs text-destructive hover:bg-destructive/10 h-7 shrink-0"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 w-full min-w-0">
                    <Input
                      placeholder="Paste image URL (or click 'Choose from Media Library')"
                      value={valueImage}
                      onChange={(e) => setValueImage(e.target.value)}
                      className="text-xs w-full"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Tip: You can select any optimized WebP image from your Media Library.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Live Customer Preview */}
            <div className="p-3 rounded-lg border border-border/60 bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs w-full min-w-0 overflow-hidden">
              <span className="text-muted-foreground font-medium shrink-0">Customer Store Preview:</span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background shadow-2xs self-start sm:self-auto min-w-0 max-w-full">
                {termMode === 'IMAGE' && valueImage && (
                  <img
                    src={valueImage}
                    alt="preview"
                    className="w-5 h-5 rounded-md object-cover ring-1 ring-border shrink-0"
                  />
                )}
                {termMode === 'COLOR' && (
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: valueColorHex }}
                  />
                )}
                <span className="font-semibold text-foreground truncate">
                  {valueName.trim() || 'Option Name'}
                </span>
              </div>
            </div>

            <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setTermDialog((prev) => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addValueMutation.isPending || updateValueMutation.isPending}
                className="w-full sm:w-auto font-semibold"
              >
                {addValueMutation.isPending || updateValueMutation.isPending
                  ? 'Saving...'
                  : termDialog.mode === 'CREATE'
                  ? 'Add Option'
                  : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* WARNING MODAL: DELETE OPTION / TERM */}
      <Dialog
        open={Boolean(deleteConfirmTerm)}
        onOpenChange={() => setDeleteConfirmTerm(null)}
      >
        <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)]">
          <DialogHeader className="pr-6">
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              Remove Option &quot;{deleteConfirmTerm?.termName}&quot;?
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-1 text-xs sm:text-sm">
              <p>
                Are you sure you want to remove the option{' '}
                <strong className="text-foreground">&quot;{deleteConfirmTerm?.termName}&quot;</strong> from{' '}
                <strong className="text-foreground">{deleteConfirmTerm?.attributeName}</strong>?
              </p>
              <p className="text-destructive/90 font-medium text-xs">
                Warning: Any product variants using this option may lose their assigned swatch or configuration.
              </p>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setDeleteConfirmTerm(null)}
              disabled={deleteValueMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto gap-1.5 font-semibold"
              onClick={() => deleteConfirmTerm && deleteValueMutation.mutate(deleteConfirmTerm.termId)}
              disabled={deleteValueMutation.isPending}
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              {deleteValueMutation.isPending ? 'Removing...' : 'Confirm Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WARNING MODAL: DELETE ATTRIBUTE */}
      <Dialog
        open={Boolean(deleteConfirmAttr)}
        onOpenChange={() => setDeleteConfirmAttr(null)}
      >
        <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)]">
          <DialogHeader className="pr-6">
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              Delete Attribute &quot;{deleteConfirmAttr?.name}&quot;?
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-1 text-xs sm:text-sm">
              <p>
                Are you sure you want to permanently delete the attribute{' '}
                <strong className="text-foreground">&quot;{deleteConfirmAttr?.name}&quot;</strong>?
              </p>
              <p className="text-destructive/90 font-medium text-xs">
                This will also permanently delete all{' '}
                <span className="underline">{deleteConfirmAttr?.values?.length || 0} configured swatch options</span>.
              </p>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setDeleteConfirmAttr(null)}
              disabled={deleteAttrMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto gap-1.5 font-semibold"
              onClick={() => deleteConfirmAttr && deleteAttrMutation.mutate(deleteConfirmAttr.id)}
              disabled={deleteAttrMutation.isPending}
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              {deleteAttrMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MEDIA PICKER DIALOG FOR FABRICS / TEXTURES */}
      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleMediaSelect}
        title="Select Fabric or Texture Swatch"
        description="Choose a high-resolution photo or fabric texture pattern from your media library."
      />
    </div>
  );
}
