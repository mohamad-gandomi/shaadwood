/**
 * Estimate reading time in minutes from markdown or plain text content.
 * Standard adult reading speed is approximately 200 words per minute.
 */
export function calculateReadingTime(content?: string | null): string {
  if (!content) return '1 min read';
  const cleanText = content.replace(/<\/?[^>]+(>|$)/g, '').replace(/[#*`_~\[\]]/g, '');
  const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Format ISO date string into editorial long date (e.g., September 26, 2026).
 */
export function formatBlogDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
