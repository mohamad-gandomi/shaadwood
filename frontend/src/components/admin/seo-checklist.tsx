'use client';

import * as React from 'react';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Globe,
  Bot,
  FileText,
  AlertTriangle,
  Lightbulb,
  Layers,
  Check,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export interface SeoCheckItem {
  id: string;
  category: 'google' | 'structure' | 'geo';
  categoryLabel: string;
  title: string;
  passed: boolean;
  scoreWeight: number;
  currentValue: string;
  targetRequirement: string;
  recommendation: string;
  importance: 'critical' | 'recommended' | 'bonus';
}

interface SeoChecklistProps {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
}

export function SeoChecklist({
  title,
  slug,
  excerpt,
  content,
  featuredImage,
  categoryId,
  categoryName,
}: SeoChecklistProps) {
  const [filter, setFilter] = React.useState<'all' | 'failed' | 'passed'>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<'all' | 'google' | 'structure' | 'geo'>('all');

  // Compute text statistics
  const wordCount = React.useMemo(() => {
    if (!content) return 0;
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const excerptLength = (excerpt || '').trim().length;
  const titleLength = (title || '').trim().length;

  // Count Markdown H2 / H3 headings
  const headingCount = React.useMemo(() => {
    if (!content) return 0;
    const matches = content.match(/^#{2,3}\s+.+$/gm);
    return matches ? matches.length : 0;
  }, [content]);

  // Check if content has bulleted or numbered lists
  const hasListFormatting = React.useMemo(() => {
    if (!content) return false;
    return /^(\s*[-*]|\s*\d+\.)\s+.+$/m.test(content);
  }, [content]);

  // Check if content has bold entities or quotes
  const hasEmphasisFormatting = React.useMemo(() => {
    if (!content) return false;
    const hasBold = /\*\*[^*]+\*\*/.test(content);
    const hasBlockquote = /^>\s+.+$/m.test(content);
    const hasLinks = /\[.+\]\(.+\)/.test(content);
    return hasBold || hasBlockquote || hasLinks;
  }, [content]);

  // Check for direct-answer opening in excerpt or first paragraph
  const hasDirectAnswerOpening = React.useMemo(() => {
    if (excerptLength >= 50) return true;
    if (!content) return false;
    const firstParagraph = content.trim().split(/\n\n+/)[0] || '';
    const wordsInFirstPara = firstParagraph.trim().split(/\s+/).filter(Boolean).length;
    return wordsInFirstPara >= 15;
  }, [excerptLength, content]);

  // Check slug validity
  const isSlugValid = React.useMemo(() => {
    if (!slug) return false;
    const cleanSlug = slug.trim().toLowerCase();
    return cleanSlug.length >= 3 && cleanSlug.length <= 55 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug);
  }, [slug]);

  // Evaluate all 10 checklist rules
  const checklistItems = React.useMemo<SeoCheckItem[]>(() => {
    return [
      // 1. Google SEO: Title Length
      {
        id: 'title-length',
        category: 'google',
        categoryLabel: 'Google SERP',
        title: 'Title Length (SERP Display)',
        passed: titleLength >= 35 && titleLength <= 65,
        scoreWeight: 10,
        currentValue: `${titleLength} characters`,
        targetRequirement: '35 – 65 characters',
        recommendation:
          titleLength === 0
            ? 'Enter an engaging headline between 35 and 65 characters to maximize click-through rate without being cut off by Google.'
            : titleLength < 35
            ? `Headline is too short (${titleLength} chars). Add descriptive detail or primary keywords to reach 35–65 characters.`
            : titleLength > 65
            ? `Headline exceeds 65 characters (${titleLength} chars). Truncation will occur in Google search results.`
            : 'Optimal length! Title displays completely in desktop and mobile search snippets.',
        importance: 'critical',
      },

      // 2. Google SEO: URL Slug
      {
        id: 'clean-slug',
        category: 'google',
        categoryLabel: 'Google Indexing',
        title: 'Clean, Hyphenated URL Slug',
        passed: isSlugValid,
        scoreWeight: 10,
        currentValue: slug ? `/${slug}` : 'No slug defined',
        targetRequirement: 'Lowercase, 3–55 chars, hyphen-separated',
        recommendation: !slug
          ? 'Add a clean URL slug (or click Reset from Title) to create a human-readable permalink.'
          : slug.length < 3
          ? 'Slug is too short. Use at least 3 characters representing the topic.'
          : slug.length > 55
          ? 'Slug exceeds 55 characters. Keep permalinks concise for better link sharing and crawling.'
          : !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
          ? 'Slug contains invalid characters. Use only lowercase letters, numbers, and hyphens.'
          : 'Clean, indexable URL structure that is friendly to search bots and users.',
        importance: 'critical',
      },

      // 3. Google SEO: Excerpt / Meta Description
      {
        id: 'meta-excerpt',
        category: 'google',
        categoryLabel: 'Google SERP',
        title: 'Meta Excerpt / Snippet Length',
        passed: excerptLength >= 110 && excerptLength <= 160,
        scoreWeight: 10,
        currentValue: `${excerptLength} characters`,
        targetRequirement: '110 – 160 characters',
        recommendation:
          excerptLength === 0
            ? 'Write a 1-2 sentence lead summary (110–160 chars). Google and social media cards display this under the article headline.'
            : excerptLength < 110
            ? `Excerpt is too short (${excerptLength} chars). Add more context to reach at least 110 characters.`
            : excerptLength > 160
            ? `Excerpt is ${excerptLength} characters. It will likely be truncated with an ellipsis (...) in Google search listings.`
            : 'Ideal length! Provides high-relevance preview in search results and social previews.',
        importance: 'critical',
      },

      // 4. Google SEO: Featured Cover Image
      {
        id: 'featured-image',
        category: 'google',
        categoryLabel: 'Google Discover',
        title: 'Featured Cover Image',
        passed: !!featuredImage && featuredImage.trim().length > 0,
        scoreWeight: 10,
        currentValue: featuredImage ? 'Cover image attached' : 'No image set',
        targetRequirement: 'High-res image (1200×630px+ recommended)',
        recommendation: featuredImage
          ? 'Cover image is linked. Enables rich OpenGraph cards and Google Discover feed eligibility.'
          : 'Select a cover image from the Media Library. Posts with images receive 94% more engagement and appear in Google Discover.',
        importance: 'recommended',
      },

      // 5. Google SEO & Architecture: Category Assignment
      {
        id: 'topic-category',
        category: 'google',
        categoryLabel: 'Site Taxonomy',
        title: 'Topic Category Assignment',
        passed: !!categoryId && categoryId.trim().length > 0,
        scoreWeight: 10,
        currentValue: categoryName || (categoryId ? 'Category linked' : 'Unassigned (General)'),
        targetRequirement: 'Assigned to an editorial category',
        recommendation: categoryId
          ? 'Topic category linked! Establishes semantic topic clusters and internal breadcrumbs.'
          : 'Assign this article to a topic category (e.g., Craftsmanship, Wood Care) to build topical authority clusters.',
        importance: 'recommended',
      },

      // 6. Content Depth: Heading Hierarchy
      {
        id: 'heading-hierarchy',
        category: 'structure',
        categoryLabel: 'Content Depth',
        title: 'Section Headings (H2 / H3)',
        passed: headingCount >= 2,
        scoreWeight: 10,
        currentValue: `${headingCount} subheadings found`,
        targetRequirement: 'At least 2 section headings (## H2)',
        recommendation:
          headingCount >= 2
            ? `Great structure! ${headingCount} section headings break up text and help search engines index subtopics.`
            : 'Add at least 2 section headings (using markdown ## Section Title). Headings help readers scan and qualify your post for Google featured snippets.',
        importance: 'critical',
      },

      // 7. Content Depth: Word Count & E-E-A-T
      {
        id: 'word-count',
        category: 'structure',
        categoryLabel: 'Content Depth',
        title: 'Content Depth (Word Count)',
        passed: wordCount >= 300,
        scoreWeight: 10,
        currentValue: `${wordCount} words`,
        targetRequirement: '300+ words (600+ for deep guides)',
        recommendation:
          wordCount >= 600
            ? `Deep, authoritative article (${wordCount} words). High probability of ranking well in comprehensive searches.`
            : wordCount >= 300
            ? `Acceptable depth (${wordCount} words). Consider adding more examples or details to reach 600+ words for competitive keywords.`
            : `Content is thin (${wordCount} words). Google favors in-depth resources with at least 300 words. Expand with practical tips, wood species details, or care advice.`,
        importance: 'critical',
      },

      // 8. GEO & AI: Direct Answer Opening
      {
        id: 'geo-direct-answer',
        category: 'geo',
        categoryLabel: 'LLM & AI Answer Engines',
        title: 'Direct Answer Opening (Inverted Pyramid)',
        passed: hasDirectAnswerOpening,
        scoreWeight: 10,
        currentValue: hasDirectAnswerOpening ? 'Direct answer detected' : 'Introductory fluff detected',
        targetRequirement: 'Immediate concise answer in lead or first paragraph',
        recommendation: hasDirectAnswerOpening
          ? 'Strong direct opening! Perplexity, ChatGPT, and Google AI Overviews prioritize pages that answer queries directly in the first 2-3 sentences.'
          : 'Lead with the answer directly in your summary or first paragraph. Avoid rambling intros—AI engines extract answers from the very top of the text.',
        importance: 'recommended',
      },

      // 9. GEO & AI: Structured Lists & Steps
      {
        id: 'geo-structured-lists',
        category: 'geo',
        categoryLabel: 'LLM & AI Answer Engines',
        title: 'Machine-Readable Lists & Steps',
        passed: hasListFormatting,
        scoreWeight: 10,
        currentValue: hasListFormatting ? 'Lists detected' : 'No lists found',
        targetRequirement: 'At least one bulleted (- ) or numbered (1. ) list',
        recommendation: hasListFormatting
          ? 'Structured lists detected! AI models heavily extract bullet points and step-by-step guides for generated summaries.'
          : 'Add a bulleted list (- Key takeaway) or numbered steps (1. Step one). AI search engines (SearchGPT, Claude, Perplexity) frequently quote structured lists directly.',
        importance: 'recommended',
      },

      // 10. GEO & AI: Entity & Key Fact Emphasis
      {
        id: 'geo-entity-emphasis',
        category: 'geo',
        categoryLabel: 'LLM & AI Answer Engines',
        title: 'Entity & Key Fact Emphasis',
        passed: hasEmphasisFormatting,
        scoreWeight: 10,
        currentValue: hasEmphasisFormatting ? 'Formatting detected' : 'No emphasis formatting',
        targetRequirement: 'Bold terms (**wood species**), quotes (> ), or links',
        recommendation: hasEmphasisFormatting
          ? 'Entity emphasis found! Bold formatting and quotes help AI engines identify key terminology and knowledge relationships.'
          : 'Use **bold text** to highlight key wood species, dimensions, or core concepts, and add [links](url) to related products to strengthen semantic entity recognition.',
        importance: 'bonus',
      },
    ];
  }, [
    titleLength,
    isSlugValid,
    slug,
    excerptLength,
    featuredImage,
    categoryId,
    categoryName,
    headingCount,
    wordCount,
    hasDirectAnswerOpening,
    hasListFormatting,
    hasEmphasisFormatting,
  ]);

  // Overall Score Calculation (out of 100)
  const totalScore = React.useMemo(() => {
    return checklistItems.reduce((acc, item) => (item.passed ? acc + item.scoreWeight : acc), 0);
  }, [checklistItems]);

  const passedCount = checklistItems.filter((i) => i.passed).length;
  const failedCount = checklistItems.filter((i) => !i.passed).length;

  // Filtered Items
  const filteredItems = React.useMemo(() => {
    return checklistItems.filter((item) => {
      // Status filter
      if (filter === 'passed' && !item.passed) return false;
      if (filter === 'failed' && item.passed) return false;
      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      return true;
    });
  }, [checklistItems, filter, categoryFilter]);

  // Category counts
  const googleCount = checklistItems.filter((i) => i.category === 'google' && i.passed).length;
  const structureCount = checklistItems.filter((i) => i.category === 'structure' && i.passed).length;
  const geoCount = checklistItems.filter((i) => i.category === 'geo' && i.passed).length;

  // Color schemes based on score
  const scoreColor =
    totalScore >= 80
      ? 'text-emerald-600 dark:text-emerald-400'
      : totalScore >= 60
      ? 'text-amber-500 dark:text-amber-400'
      : 'text-rose-500 dark:text-rose-400';

  const progressBg =
    totalScore >= 80 ? 'bg-emerald-500' : totalScore >= 60 ? 'bg-amber-500' : 'bg-rose-500';

  const scoreBadgeVariant =
    totalScore >= 80
      ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
      : totalScore >= 60
      ? 'border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
      : 'border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300';

  const scoreLabel =
    totalScore >= 80
      ? 'Excellent — Fully Optimized for Google & AI Overviews'
      : totalScore >= 60
      ? 'Good — Minor improvements needed for top ranking'
      : 'Action Required — Content may struggle to rank in AI & Google';

  return (
    <div className="space-y-6">
      {/* Top Score Summary Banner */}
      <Card className="overflow-hidden border-border/80 shadow-xs">
        <div className="p-4 sm:p-6 bg-gradient-to-br from-card via-card to-muted/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  Content Quality & SEO / GEO Score
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Real-time recognition for Google Search indexing and AI Answer Engines (Perplexity, ChatGPT, Gemini).
              </p>
            </div>

            {/* Score Number Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${scoreColor}`}>
                  {totalScore}
                  <span className="text-base font-normal text-muted-foreground">/100</span>
                </div>
                <div className="text-[11px] font-medium text-muted-foreground">
                  {passedCount} of 10 checks passed
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${scoreBadgeVariant}`}>
                {totalScore >= 80 ? 'Grade A' : totalScore >= 60 ? 'Grade B' : 'Grade C'} • {scoreLabel}
              </span>
              <span className="font-mono text-xs font-semibold text-muted-foreground">{totalScore}%</span>
            </div>
            <div className="w-full bg-muted/80 rounded-full h-2.5 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressBg}`}
                style={{ width: `${Math.max(4, totalScore)}%` }}
              />
            </div>
          </div>

          {/* Subcategory Mini Counters */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 mt-2 border-t border-border/40 text-center">
            <button
              type="button"
              onClick={() => setCategoryFilter(categoryFilter === 'google' ? 'all' : 'google')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                categoryFilter === 'google'
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                  : 'border-border/60 hover:border-border bg-card/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Globe className="w-3 h-3 text-blue-500" />
                  <span>Google SEO</span>
                </span>
                <span className="font-mono text-xs font-bold text-foreground">{googleCount}/5</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategoryFilter(categoryFilter === 'structure' ? 'all' : 'structure')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                categoryFilter === 'structure'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-border/60 hover:border-border bg-card/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <FileText className="w-3 h-3 text-emerald-500" />
                  <span>Content Depth</span>
                </span>
                <span className="font-mono text-xs font-bold text-foreground">{structureCount}/2</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategoryFilter(categoryFilter === 'geo' ? 'all' : 'geo')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                categoryFilter === 'geo'
                  ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20'
                  : 'border-border/60 hover:border-border bg-card/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Bot className="w-3 h-3 text-purple-500" />
                  <span>AI / GEO</span>
                </span>
                <span className="font-mono text-xs font-bold text-foreground">{geoCount}/3</span>
              </div>
            </button>
          </div>
        </div>
      </Card>

      {/* Filter Tabs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border bg-muted/40 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Items ({checklistItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('failed')}
            className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              filter === 'failed'
                ? 'bg-card text-rose-600 dark:text-rose-400 shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Action Needed</span>
            {failedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono font-bold">
                {failedCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFilter('passed')}
            className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              filter === 'passed'
                ? 'bg-card text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Passed</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
              {passedCount}
            </span>
          </button>
        </div>

        {categoryFilter !== 'all' && (
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className="text-xs text-primary hover:underline self-end sm:self-center font-medium"
          >
            Clear category filter ({categoryFilter})
          </button>
        )}
      </div>

      {/* Checklist Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
              item.passed
                ? 'border-emerald-500/25 bg-emerald-50/20 dark:bg-emerald-950/10 hover:border-emerald-500/40'
                : 'border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 hover:border-rose-500/50'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Green Check or Red Cross Icon */}
              <div className="mt-0.5 shrink-0">
                {item.passed ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <XCircle className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="space-y-1.5 min-w-0 flex-1">
                {/* Title row with Category Badge & Status */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        item.category === 'google'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : item.category === 'structure'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {item.categoryLabel}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[11px] font-semibold ${
                      item.passed
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.currentValue}
                  </span>
                </div>

                {/* Recommendation & Instructions */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.recommendation}
                </p>

                {/* Target Requirement Footnote */}
                <div className="pt-1 flex items-center gap-2 text-[11px] text-muted-foreground/80 font-mono">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Target:
                  </span>
                  <span>{item.targetRequirement}</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span>+{item.scoreWeight} pts</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center border rounded-xl border-dashed border-border bg-card/40 space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 opacity-60" />
            <h4 className="text-sm font-medium text-foreground">No items match this filter</h4>
            <p className="text-xs text-muted-foreground">
              Try switching back to &apos;All Items&apos; to view all checklist metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
