/**
 * 📂 File Helper Utilities
 *
 * Format file sizes, dates, paths, and generate file IDs
 * for The Headless Horseman's Quest.
 */

import path from 'path';

/**
 * Format bytes to human-readable file size
 *
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format date as relative time (e.g., "2 days ago")
 *
 * @param date - Date object or timestamp
 * @returns Relative time string
 */
export function formatRelativeDate(date: Date | number): string {
  const now = new Date();
  const then = typeof date === 'number' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  } else if (diffWeek < 4) {
    return `${diffWeek} week${diffWeek === 1 ? '' : 's'} ago`;
  } else if (diffMonth < 12) {
    return `${diffMonth} month${diffMonth === 1 ? '' : 's'} ago`;
  } else {
    return `${diffYear} year${diffYear === 1 ? '' : 's'} ago`;
  }
}

/**
 * Format date as absolute timestamp
 *
 * @param date - Date object or timestamp
 * @returns Formatted date string (e.g., "Oct 23, 2025 at 2:30 PM")
 */
export function formatAbsoluteDate(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Extract folder name from file path
 *
 * @param filePath - Relative or absolute file path
 * @returns Folder name or root indicator
 */
export function extractFolder(filePath: string): string {
  const dir = path.dirname(filePath);

  if (dir === '.' || dir === '/') {
    return 'root';
  }

  return path.basename(dir);
}

/**
 * Generate file ID from relative path
 * Uses base64url encoding for safe URL usage
 *
 * @param relativePath - Relative file path
 * @returns Base64url-encoded file ID
 */
export function generateFileId(relativePath: string): string {
  return Buffer.from(relativePath).toString('base64url');
}

/**
 * Decode file ID back to relative path
 *
 * @param id - Base64url-encoded file ID
 * @returns Decoded relative path
 */
export function decodeFileId(id: string): string {
  try {
    return Buffer.from(id, 'base64url').toString('utf-8');
  } catch (error) {
    console.error('👻 Failed to decode file ID:', error);
    throw new Error('Invalid file ID - the spirits cannot decode this 👻');
  }
}

/**
 * Extract file extension from path
 *
 * @param filePath - File path
 * @returns Extension without dot (e.g., "md")
 */
export function getFileExtension(filePath: string): string {
  return path.extname(filePath).slice(1).toLowerCase();
}

/**
 * Check if file is markdown
 *
 * @param filePath - File path
 * @returns True if markdown file
 */
export function isMarkdownFile(filePath: string): boolean {
  const ext = getFileExtension(filePath);
  return ext === 'md' || ext === 'markdown';
}

/**
 * Normalize path separators for cross-platform compatibility
 *
 * @param filePath - File path with any separators
 * @returns Path with forward slashes
 */
export function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

/**
 * Get depth of file in directory structure
 *
 * @param relativePath - Relative file path
 * @returns Depth level (0 = root)
 */
export function getPathDepth(relativePath: string): number {
  const normalized = normalizePath(relativePath);
  return normalized.split('/').length - 1;
}

/**
 * Truncate filename if too long
 *
 * @param filename - Original filename
 * @param maxLength - Maximum length (default: 30)
 * @returns Truncated filename with extension preserved
 */
export function truncateFilename(filename: string, maxLength: number = 30): string {
  if (filename.length <= maxLength) {
    return filename;
  }

  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  const truncated = name.slice(0, maxLength - ext.length - 3);

  return `${truncated}...${ext}`;
}

/**
 * Sort files by various criteria
 */
export const FileSorters = {
  byNameAsc: (a: { filename: string }, b: { filename: string }) =>
    a.filename.localeCompare(b.filename),

  byNameDesc: (a: { filename: string }, b: { filename: string }) =>
    b.filename.localeCompare(a.filename),

  byModifiedDesc: (a: { modified: Date }, b: { modified: Date }) =>
    b.modified.getTime() - a.modified.getTime(),

  byModifiedAsc: (a: { modified: Date }, b: { modified: Date }) =>
    a.modified.getTime() - b.modified.getTime(),

  bySizeDesc: (a: { size: number }, b: { size: number }) =>
    b.size - a.size,

  bySizeAsc: (a: { size: number }, b: { size: number }) =>
    a.size - b.size,
};
