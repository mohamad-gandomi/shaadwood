'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Image as ImageIcon,
  UploadCloud,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Eye,
  Edit2,
  HardDrive,
  LayoutGrid,
  List,
  Filter,
  RefreshCw,
  Plus,
  AlertCircle,
  FileText,
  Sparkles,
  ChevronDown,
  Sliders,
} from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api, MediaSettings } from '@/lib/api';
import { MediaItem } from '@/types';
import { cn } from '@/lib/utils';

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function MediaLibraryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedMime, setSelectedMime] = React.useState<string>('all');
  const [inspectItem, setInspectItem] = React.useState<MediaItem | null>(null);
  const [editAltText, setEditAltText] = React.useState('');
  const [editCaption, setEditCaption] = React.useState('');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Persistent System Settings from PostgreSQL
  const { data: mediaSettings, isLoading: isLoadingSettings } = useQuery<MediaSettings>({
    queryKey: ['system-setting', 'media'],
    queryFn: () => api.getSetting<MediaSettings>('media'),
    staleTime: 1000 * 60 * 5,
  });

  // WebP Image Optimization Controls
  const [convertToWebp, setConvertToWebp] = React.useState(true);
  const [qualityPreset, setQualityPreset] = React.useState<number>(80);
  const [maxWidthOption, setMaxWidthOption] = React.useState<number>(2048);
  const [showOptimizationOptions, setShowOptimizationOptions] = React.useState(false);

  // Sync state once persistent settings are fetched from DB
  React.useEffect(() => {
    if (mediaSettings) {
      if (typeof mediaSettings.convertToWebp === 'boolean') {
        setConvertToWebp(mediaSettings.convertToWebp);
      }
      if (typeof mediaSettings.qualityPreset === 'number') {
        setQualityPreset(mediaSettings.qualityPreset);
      }
      if (typeof mediaSettings.maxWidthOption === 'number') {
        setMaxWidthOption(mediaSettings.maxWidthOption);
      }
      if (typeof mediaSettings.showOptimizationOptions === 'boolean') {
        setShowOptimizationOptions(mediaSettings.showOptimizationOptions);
      }
    }
  }, [mediaSettings]);

  // Mutation to persist setting changes to database
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<MediaSettings>) =>
      api.updateSetting<MediaSettings>('media', newSettings),
    onSuccess: (updated) => {
      queryClient.setQueryData(['system-setting', 'media'], updated);
      toast.success('Media optimization settings saved', { duration: 1800 });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to save settings');
    },
  });

  const handleToggleWebp = (checked: boolean) => {
    setConvertToWebp(checked);
    updateSettingsMutation.mutate({ convertToWebp: checked });
  };

  const handleChangeQuality = (val: number) => {
    setQualityPreset(val);
    updateSettingsMutation.mutate({ qualityPreset: val });
  };

  const handleChangeMaxWidth = (val: number) => {
    setMaxWidthOption(val);
    updateSettingsMutation.mutate({ maxWidthOption: val });
  };

  const handleToggleShowOptions = () => {
    const nextVal = !showOptimizationOptions;
    setShowOptimizationOptions(nextVal);
    updateSettingsMutation.mutate({ showOptimizationOptions: nextVal });
  };


  // Fetch media from database
  const {
    data: mediaList = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['media', search],
    queryFn: () => api.getMedia(search.trim() || undefined),
  });

  // Storage stats query from NestJS backend
  const { data: storageStats } = useQuery({
    queryKey: ['media-storage-stats'],
    queryFn: () => api.getStorageStats(),
    staleTime: 5000,
  });

  // When inspecting an item, populate edit fields
  React.useEffect(() => {
    if (inspectItem) {
      setEditAltText(inspectItem.altText || '');
      setEditCaption(inspectItem.caption || '');
    }
  }, [inspectItem]);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ file, altText }: { file: File; altText?: string }) => {
      return api.uploadMedia(file, {
        altText,
        convertToWebp,
        quality: qualityPreset,
        maxWidth: maxWidthOption,
      });
    },
    onSuccess: (uploaded) => {
      toast.success(`Uploaded "${uploaded.originalName}" successfully`);
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media-count'] });
      queryClient.invalidateQueries({ queryKey: ['media-storage-stats'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Upload failed');
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  // Update metadata mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { altText?: string; caption?: string } }) => {
      return api.updateMedia(id, data);
    },
    onSuccess: (updated) => {
      toast.success('Media metadata updated');
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media-storage-stats'] });
      setInspectItem(updated);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update media details');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteMedia(id),
    onSuccess: () => {
      toast.success('Media asset removed from database and disk');
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media-count'] });
      queryClient.invalidateQueries({ queryKey: ['media-storage-stats'] });
      setInspectItem(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete media asset');
    },
  });

  // Handle files chosen or dropped
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await uploadMutation.mutateAsync({ file });
      } catch {
        // Handled in onError
      }
    }
  };

  // Copy URL to clipboard helper
  const handleCopyUrl = (url: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('Asset URL copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      toast.info(`URL: ${url}`);
    }
  };

  // Filter list by selected mime type
  const filteredList = React.useMemo(() => {
    if (selectedMime === 'all') return mediaList;
    return mediaList.filter((m) => m.mimeType.toLowerCase().includes(selectedMime));
  }, [mediaList, selectedMime]);

  // Aggregate stats
  const totalBytes = mediaList.reduce((acc, m) => acc + (m.size || 0), 0);

  return (
    <div className="space-y-6 pb-20">
      <Header title="Media & Asset Library" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Top Stats & Actions Banner */}
        <div className="p-4 sm:p-5 rounded-xl border border-border bg-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Media Library
              </h1>
              <Badge variant="wood" className="text-xs">
                PostgreSQL Media
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <ImageIcon className="w-3.5 h-3.5 text-primary" />
                {mediaList.length} catalog assets
              </span>
              <span>•</span>
              <span className="flex items-center gap-1" title="Aggregate size of all assets recorded in the catalog database">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                {formatBytes(storageStats?.catalogSize ?? totalBytes)} catalog footprint
              </span>
              <span>•</span>
              <span className="flex items-center gap-1" title="Physical file storage on local server hard drive in ./uploads">
                <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                {formatBytes(storageStats?.diskSize ?? 0)} on local disk
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="text-xs h-9 gap-1.5"
              title="Refresh media list"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', isRefetching && 'animate-spin')} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-xs h-9 gap-1.5 font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload Media'}</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Persistent WebP Optimization Settings Banner */}
        <div className="p-3 sm:p-4 rounded-xl border border-border/80 bg-card shadow-xs space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={convertToWebp}
                  onChange={(e) => handleToggleWebp(e.target.checked)}
                  className="rounded border-border w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Auto-Convert to WebP Format (Recommended)
                </span>
              </label>
              {updateSettingsMutation.isPending ? (
                <span className="text-[11px] text-primary font-medium animate-pulse">
                  Saving to database...
                </span>
              ) : (
                <span className="hidden md:inline text-[11px] text-muted-foreground">
                  • 70%–85% smaller file size, stored in database & applied store-wide
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleShowOptions}
              className="text-xs text-primary hover:underline font-medium flex items-center gap-1 self-start sm:self-auto"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showOptimizationOptions ? 'Hide Settings' : 'Tune Quality & Dimensions'}</span>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showOptimizationOptions && 'rotate-180')} />
            </button>
          </div>

          {showOptimizationOptions && (
            <div className="pt-2.5 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-[11px]">WebP Compression Quality</span>
                  <span className="font-mono text-muted-foreground text-[11px]">{qualityPreset}%</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Compact (70%)', val: 70 },
                    { label: 'Balanced (80%)', val: 80 },
                    { label: 'Maximum (90%)', val: 90 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => handleChangeQuality(preset.val)}
                      className={cn(
                        'py-1 px-2 rounded-md text-[11px] font-medium border transition-colors',
                        qualityPreset === preset.val
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border',
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-[11px]">Maximum Pixel Width</span>
                  <span className="font-mono text-muted-foreground text-[11px]">
                    {maxWidthOption === 0 ? 'Original (No Resize)' : `${maxWidthOption}px`}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Full HD (1920px)', val: 1920 },
                    { label: '2K QHD (2048px)', val: 2048 },
                    { label: 'Original Size', val: 0 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => handleChangeMaxWidth(opt.val)}
                      className={cn(
                        'py-1 px-2 rounded-md text-[11px] font-medium border transition-colors',
                        maxWidthOption === opt.val
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border',
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all',
            isDragging
              ? 'border-primary bg-primary/5 scale-[0.99]'
              : 'border-border/80 hover:border-primary/50 hover:bg-muted/30 bg-card/40',
          )}
        >
          <div className="max-w-md mx-auto space-y-2 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-2xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Drag & drop media files here, or <span className="text-primary underline">browse</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, WEBP, SVG, and GIF up to 10MB each. Assets are recorded directly into PostgreSQL and served statically.
              </p>
            </div>
          </div>
        </div>

        {/* Search, Filter, and View Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by filename or alt text..."
              className="pl-9 text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Format filter pills */}
            <div className="flex items-center p-1 rounded-lg border border-border bg-muted/60 text-xs">
              {(['all', 'jpeg', 'png', 'webp'] as const).map((ext) => (
                <button
                  key={ext}
                  type="button"
                  onClick={() => setSelectedMime(ext)}
                  className={cn(
                    'px-2.5 py-1 rounded-md capitalize font-medium transition-all text-xs',
                    selectedMime === ext
                      ? 'bg-card text-foreground shadow-2xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {ext}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-lg border border-border bg-muted/60 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded-md transition-all',
                  viewMode === 'grid'
                    ? 'bg-card text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded-md transition-all',
                  viewMode === 'list'
                    ? 'bg-card text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Media Catalog Rendering */}
        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground text-xs">
            Loading media catalog from database...
          </div>
        ) : filteredList.length === 0 ? (
          <Card className="text-center py-16 border-dashed">
            <CardContent className="space-y-3 max-w-sm mx-auto">
              <ImageIcon className="w-10 h-10 text-muted-foreground opacity-40 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">No media assets found</h3>
                <p className="text-xs text-muted-foreground">
                  {search
                    ? `No media matches "${search}". Try clearing your search query.`
                    : 'Upload your first photography asset using the dropzone above.'}
                </p>
              </div>
              {search && (
                <Button variant="outline" size="sm" onClick={() => setSearch('')} className="text-xs">
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          /* ======================================================== */
          /* GRID VIEW                                               */
          /* ======================================================== */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filteredList.map((item) => {
              const isCopied = copiedId === item.id;
              const ext = item.filename.split('.').pop()?.toUpperCase() || 'FILE';

              return (
                <div
                  key={item.id}
                  className="group rounded-xl border border-border bg-card overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Image Thumbnail Preview */}
                  <div
                    onClick={() => setInspectItem(item)}
                    className="aspect-square bg-muted/60 relative overflow-hidden cursor-pointer flex items-center justify-center"
                  >
                    <img
                      src={item.url}
                      alt={item.altText || item.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Format Badge */}
                    {ext === 'WEBP' ? (
                      <span className="absolute top-2 left-2 text-[10px] font-mono font-bold bg-emerald-700/90 text-white px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-0.5 backdrop-blur-xs">
                        <Sparkles className="w-2.5 h-2.5" />
                        WEBP
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 text-[10px] font-mono font-bold bg-black/60 backdrop-blur-xs text-white px-1.5 py-0.5 rounded shadow-2xs">
                        {ext}
                      </span>
                    )}

                    {/* Dimensions Pill */}
                    {item.width && item.height ? (
                      <span className="absolute bottom-2 left-2 text-[9px] font-mono font-semibold bg-black/60 backdrop-blur-xs text-white/90 px-1 rounded shadow-2xs">
                        {item.width}×{item.height}
                      </span>
                    ) : null}

                    {/* Hover Overlay with Inspect hint */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                      <Eye className="w-4 h-4 drop-shadow" />
                      <span className="text-xs font-medium drop-shadow">Inspect</span>
                    </div>
                  </div>

                  {/* Card Info & Quick Actions */}
                  <div className="p-2.5 space-y-2">
                    <div className="space-y-0.5">
                      <p
                        className="text-xs font-semibold text-foreground truncate cursor-pointer hover:underline"
                        onClick={() => setInspectItem(item)}
                        title={item.originalName}
                      >
                        {item.originalName}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                        <span>{formatBytes(item.size)}</span>
                        {item.altText && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded font-sans truncate max-w-[80px]">
                            Alt text
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Button Row */}
                    <div className="flex items-center gap-1 pt-1 border-t border-border/50">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(item.url, item.id);
                        }}
                        className="h-7 px-2 text-[11px] gap-1 flex-1 text-muted-foreground hover:text-foreground"
                        title="Copy direct asset URL"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete asset "${item.originalName}" permanently?`)) {
                            deleteMutation.mutate(item.id);
                          }
                        }}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ======================================================== */
          /* LIST VIEW                                               */
          /* ======================================================== */
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Preview</TableHead>
                  <TableHead>Filename & Title</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Alt Text</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right w-36">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredList.map((item) => {
                  const isCopied = copiedId === item.id;
                  const dateStr = new Date(item.createdAt).toLocaleDateString();

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="p-2">
                        <div
                          onClick={() => setInspectItem(item)}
                          className="w-12 h-12 rounded-lg bg-muted overflow-hidden cursor-pointer border border-border/80 flex items-center justify-center"
                        >
                          <img
                            src={item.url}
                            alt={item.altText || item.originalName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        <div
                          onClick={() => setInspectItem(item)}
                          className="font-medium text-xs text-foreground cursor-pointer hover:underline truncate max-w-xs"
                        >
                          {item.originalName}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono truncate max-w-xs">
                          {item.filename}
                        </div>
                      </TableCell>

                      <TableCell className="text-xs font-mono">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.mimeType.includes('webp') ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              WEBP
                            </span>
                          ) : (
                            <span className="inline-block bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded text-[10px] font-medium">
                              {item.filename.split('.').pop()?.toUpperCase() || 'FILE'}
                            </span>
                          )}
                          {item.width && item.height ? (
                            <span className="text-[10px] text-muted-foreground">{item.width}×{item.height}</span>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell className="text-xs font-mono text-foreground font-semibold">
                        {formatBytes(item.size)}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {item.altText || <span className="italic opacity-50">None</span>}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {dateStr}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyUrl(item.url, item.id)}
                            className="h-8 text-xs gap-1"
                            title="Copy direct asset URL"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden sm:inline">
                              {isCopied ? 'Copied' : 'Copy'}
                            </span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setInspectItem(item)}
                            className="h-8 w-8 p-0"
                            title="Inspect details"
                          >
                            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Delete asset "${item.originalName}" permanently?`)) {
                                deleteMutation.mutate(item.id);
                              }
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete asset"
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
          </Card>
        )}
      </div>

      {/* ======================================================== */}
      {/* MEDIA INSPECTOR & METADATA EDITOR DIALOG                 */}
      {/* ======================================================== */}
      <Dialog open={!!inspectItem} onOpenChange={(open) => !open && setInspectItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span>Asset Inspector & Metadata</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Inspect file specifications, edit accessibility alt text, and copy public URL.
            </DialogDescription>
          </DialogHeader>

          {inspectItem && (
            <div className="space-y-4 pt-2">
              {/* Asset Preview */}
              <div className="aspect-video w-full rounded-xl bg-muted border border-border overflow-hidden flex items-center justify-center relative">
                <img
                  src={inspectItem.url}
                  alt={inspectItem.altText || inspectItem.originalName}
                  className="w-full h-full object-contain"
                />
                <a
                  href={inspectItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-md text-xs inline-flex items-center gap-1 backdrop-blur-xs transition-colors shadow-2xs"
                  title="Open original in new tab"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Full Size</span>
                </a>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/80 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-mono">Size</span>
                  <span className="font-semibold text-foreground font-mono">{formatBytes(inspectItem.size)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-mono">Format</span>
                  <span className="font-semibold text-foreground font-mono truncate block">{inspectItem.mimeType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-mono">Dimensions</span>
                  <span className="font-semibold text-foreground font-mono">
                    {inspectItem.width && inspectItem.height
                      ? `${inspectItem.width}×${inspectItem.height}`
                      : 'Auto'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-mono">Added</span>
                  <span className="font-semibold text-foreground font-mono">
                    {new Date(inspectItem.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Public URL Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Direct Asset URL</label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={inspectItem.url} className="text-xs font-mono bg-muted/30" />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyUrl(inspectItem.url, inspectItem.id)}
                    className="shrink-0 text-xs h-9 gap-1.5"
                  >
                    {copiedId === inspectItem.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Alt Text & Caption Form */}
              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Alternative Text (Alt Text)</span>
                    <span className="text-[10px] text-muted-foreground">Recommended for SEO & Accessibility</span>
                  </label>
                  <Input
                    value={editAltText}
                    onChange={(e) => setEditAltText(e.target.value)}
                    placeholder="e.g. Nordic minimalist armchair in walnut wood"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Caption / Subtitle</label>
                  <Input
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="e.g. Living room showcase table"
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            {inspectItem && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm(`Delete asset "${inspectItem.originalName}" permanently?`)) {
                    deleteMutation.mutate(inspectItem.id);
                  }
                }}
                disabled={deleteMutation.isPending}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs h-9 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Asset</span>
              </Button>
            )}

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInspectItem(null)}
                className="text-xs h-9"
              >
                Close
              </Button>
              {inspectItem && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    updateMutation.mutate({
                      id: inspectItem.id,
                      data: { altText: editAltText, caption: editCaption },
                    })
                  }
                  disabled={updateMutation.isPending}
                  className="text-xs h-9 font-semibold gap-1.5 shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{updateMutation.isPending ? 'Saving...' : 'Save Details'}</span>
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
