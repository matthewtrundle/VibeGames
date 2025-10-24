import matter from 'gray-matter';

/**
 * Parse markdown with frontmatter
 */
export function parseMarkdown(content: string): {
  frontmatter: object;
  rawContent: string;
  excerpt?: string;
} {
  try {
    const { data, content: rawContent, excerpt } = matter(content, {
      excerpt: true,
      excerpt_separator: '<!-- more -->'
    });

    return {
      frontmatter: data,
      rawContent,
      excerpt
    };
  } catch (error) {
    console.error('Frontmatter parsing error:', error);

    // Return raw content if parsing fails
    return {
      frontmatter: {},
      rawContent: content,
      excerpt: undefined
    };
  }
}

/**
 * Create markdown preview
 */
export function createMarkdownPreview(
  content: string,
  maxLength: number = 200
): string {
  const { rawContent } = parseMarkdown(content);

  // Remove markdown formatting for cleaner preview
  const plainText = rawContent
    .replace(/#{1,6}\s/g, '')     // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove bold
    .replace(/\*(.+?)\*/g, '$1')      // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')  // Remove links
    .replace(/`(.+?)`/g, '$1')         // Remove inline code
    .replace(/```[\s\S]*?```/g, '')    // Remove code blocks
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Truncate at word boundary
  const truncated = plainText.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return truncated.slice(0, lastSpace) + '...';
}

/**
 * File size limits
 */
export const FILE_SIZE_LIMITS = {
  MAX_PREVIEW: 1_000_000,     // 1MB - preview only
  MAX_FULL_READ: 10_000_000,  // 10MB - absolute max
  WARN_SIZE: 500_000          // 500KB - log warning
};
