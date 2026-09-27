import { marked } from 'marked';

interface BlogPostContentProps {
  content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  // Parse markdown into HTML on the server
  const htmlContent = marked.parse(content || '', {
    breaks: true,
    gfm: true,
  });

  return (
    <div
      className="prose prose-stone max-w-none 
        prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
        prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/60
        prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-sm sm:prose-p:base prose-p:leading-loose prose-p:text-foreground/90 prose-p:font-light prose-p:mb-5
        prose-ul:list-disc prose-ul:pr-6 prose-ul:pl-0 prose-ul:space-y-2 prose-ul:my-4 prose-li:text-xs sm:prose-li:text-sm prose-li:text-foreground/80
        prose-ol:list-decimal prose-ol:pr-6 prose-ol:pl-0 prose-ol:space-y-2 prose-ol:my-4 prose-li:text-xs sm:prose-li:text-sm prose-li:text-foreground/80
        prose-blockquote:border-r-4 prose-blockquote:border-l-0 prose-blockquote:border-shaad-800 prose-blockquote:pr-5 prose-blockquote:pl-0 prose-blockquote:py-2.5 prose-blockquote:my-6 prose-blockquote:bg-zen-100/60 prose-blockquote:rounded-l-2xl prose-blockquote:rounded-r-none prose-blockquote:italic prose-blockquote:text-foreground/80
        prose-img:rounded-2xl prose-img:shadow-sm prose-img:my-6 prose-img:w-full prose-img:border prose-img:border-border/70
        prose-strong:font-semibold prose-strong:text-foreground
        prose-a:text-shaad-800 prose-a:underline hover:prose-a:text-shaad-900
        prose-hr:border-border/70 prose-hr:my-8"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
