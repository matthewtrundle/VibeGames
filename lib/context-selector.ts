/**
 * 🔮 Context Selector Utilities
 *
 * Smart file selection algorithm for AI context building.
 * Scores files based on relevance to user queries.
 */

/**
 * Markdown file metadata interface
 */
export interface MarkdownFile {
  id: string;
  filename: string;
  relativePath: string;
  size: number;
  modified: Date;
  created: Date;
  preview: string;
  isOversized: boolean;
  frontmatter?: Record<string, any>;
}

/**
 * Extract keywords from query string
 * Removes common stop words and normalizes
 *
 * @param query - User's question
 * @returns Array of keywords
 */
export function extractKeywords(query: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'can', 'may', 'might', 'must', 'what', 'which', 'who', 'when',
    'where', 'why', 'how', 'this', 'that', 'these', 'those'
  ]);

  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')  // Remove punctuation
    .split(/\s+/)               // Split on whitespace
    .filter(word => word.length > 2 && !stopWords.has(word));  // Filter short words and stop words
}

/**
 * Score a single file for relevance to query
 *
 * Scoring system:
 * - Filename match: 3 points per keyword
 * - Path match: 2 points per keyword
 * - Preview match: 1 point per keyword
 * - Tag match: 2 points per keyword
 * - Recent modification: +1 point if < 7 days
 *
 * @param file - Markdown file metadata
 * @param keywords - Extracted query keywords
 * @returns Relevance score (higher = more relevant)
 */
export function scoreFileRelevance(
  file: MarkdownFile,
  keywords: string[]
): number {
  let score = 0;

  const filenameLower = file.filename.toLowerCase();
  const pathLower = file.relativePath.toLowerCase();
  const previewLower = file.preview.toLowerCase();

  // Score filename matches (3 points each)
  keywords.forEach(keyword => {
    if (filenameLower.includes(keyword)) {
      score += 3;
    }
  });

  // Score path matches (2 points each)
  keywords.forEach(keyword => {
    if (pathLower.includes(keyword)) {
      score += 2;
    }
  });

  // Score preview matches (1 point each)
  keywords.forEach(keyword => {
    if (previewLower.includes(keyword)) {
      score += 1;
    }
  });

  // Score tag matches (2 points each)
  if (file.frontmatter?.tags) {
    const tags = Array.isArray(file.frontmatter.tags)
      ? file.frontmatter.tags
      : [file.frontmatter.tags];

    tags.forEach(tag => {
      const tagLower = String(tag).toLowerCase();
      keywords.forEach(keyword => {
        if (tagLower.includes(keyword)) {
          score += 2;
        }
      });
    });
  }

  // Bonus point for recently modified files (< 7 days)
  const daysSinceModified = (Date.now() - file.modified.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceModified < 7) {
    score += 1;
  }

  return score;
}

/**
 * Select most relevant files for query
 *
 * @param query - User's question
 * @param files - All available files
 * @param maxFiles - Maximum files to select (default: 5)
 * @returns Top N most relevant files
 */
export function selectRelevantFiles(
  query: string,
  files: MarkdownFile[],
  maxFiles: number = 5
): MarkdownFile[] {
  // Extract keywords from query
  const keywords = extractKeywords(query);

  // If no keywords, return most recently modified files
  if (keywords.length === 0) {
    return files
      .sort((a, b) => b.modified.getTime() - a.modified.getTime())
      .slice(0, maxFiles);
  }

  // Score all files
  const scored = files.map(file => ({
    file,
    score: scoreFileRelevance(file, keywords)
  }));

  // Sort by score (descending) and take top N
  return scored
    .filter(item => item.score > 0)  // Only include files with matches
    .sort((a, b) => b.score - a.score)
    .slice(0, maxFiles)
    .map(item => item.file);
}

/**
 * Filter files by specific criteria
 *
 * @param files - All available files
 * @param options - Filter options
 * @returns Filtered files
 */
export function filterFiles(
  files: MarkdownFile[],
  options: {
    tags?: string[];
    folder?: string;
    modifiedAfter?: Date;
    maxSize?: number;
  }
): MarkdownFile[] {
  let filtered = files;

  // Filter by tags
  if (options.tags && options.tags.length > 0) {
    filtered = filtered.filter(file => {
      if (!file.frontmatter?.tags) return false;

      const fileTags = Array.isArray(file.frontmatter.tags)
        ? file.frontmatter.tags
        : [file.frontmatter.tags];

      return options.tags!.some(tag =>
        fileTags.some(fileTag => String(fileTag).toLowerCase() === tag.toLowerCase())
      );
    });
  }

  // Filter by folder
  if (options.folder) {
    filtered = filtered.filter(file =>
      file.relativePath.startsWith(options.folder!)
    );
  }

  // Filter by modification date
  if (options.modifiedAfter) {
    filtered = filtered.filter(file =>
      file.modified.getTime() > options.modifiedAfter!.getTime()
    );
  }

  // Filter by max size
  if (options.maxSize) {
    filtered = filtered.filter(file =>
      file.size <= options.maxSize!
    );
  }

  return filtered;
}

/**
 * Group files by folder
 *
 * @param files - All available files
 * @returns Map of folder -> files
 */
export function groupFilesByFolder(
  files: MarkdownFile[]
): Map<string, MarkdownFile[]> {
  const groups = new Map<string, MarkdownFile[]>();

  files.forEach(file => {
    const folder = file.relativePath.includes('/')
      ? file.relativePath.split('/')[0]
      : 'root';

    if (!groups.has(folder)) {
      groups.set(folder, []);
    }

    groups.get(folder)!.push(file);
  });

  return groups;
}

/**
 * Get file statistics for a set of files
 *
 * @param files - Files to analyze
 * @returns Statistics object
 */
export function getFileStats(files: MarkdownFile[]): {
  totalFiles: number;
  totalSize: number;
  averageSize: number;
  oldestFile: MarkdownFile | null;
  newestFile: MarkdownFile | null;
  oversizedCount: number;
} {
  if (files.length === 0) {
    return {
      totalFiles: 0,
      totalSize: 0,
      averageSize: 0,
      oldestFile: null,
      newestFile: null,
      oversizedCount: 0
    };
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const oversizedCount = files.filter(file => file.isOversized).length;

  const sorted = [...files].sort((a, b) =>
    a.modified.getTime() - b.modified.getTime()
  );

  return {
    totalFiles: files.length,
    totalSize,
    averageSize: Math.round(totalSize / files.length),
    oldestFile: sorted[0],
    newestFile: sorted[sorted.length - 1],
    oversizedCount
  };
}
