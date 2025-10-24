/**
 * 📂 Vault Scanner - Async Recursive File Discovery
 *
 * Scans Obsidian vaults for markdown files with parallel processing,
 * error handling, and security validation.
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { MarkdownFile } from './types';
import { generateFileId } from './file-helpers';
import { createMarkdownPreview, FILE_SIZE_LIMITS } from './markdown';
import { validateVaultPath } from './security';

/**
 * Scan vault recursively for markdown files (async version)
 *
 * @param vaultPath - Absolute path to vault directory
 * @returns Array of markdown file metadata
 * @throws Error if validation fails
 */
export async function scanVaultAsync(
  vaultPath: string
): Promise<MarkdownFile[]> {
  // Validate path
  const validation = validateVaultPath(vaultPath);
  if (validation) {
    throw new Error(validation);
  }

  const files: MarkdownFile[] = [];

  /**
   * Recursively scan directory for markdown files
   */
  async function scanDir(dir: string, baseDir: string = '') {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (error) {
      console.error(`👻 [Scan Error] Failed to read ${dir}:`, error);
      return; // Skip directory on error
    }

    // Process entries in parallel for better performance
    await Promise.all(entries.map(async (entry) => {
      // Skip hidden files/directories (start with .)
      if (entry.name.startsWith('.')) return;

      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(baseDir, entry.name);

      if (entry.isDirectory()) {
        // Recurse into subdirectory
        await scanDir(fullPath, relativePath);
      } else if (isMarkdownFile(entry.name)) {
        // Process markdown file
        try {
          const file = await processMarkdownFile(fullPath, relativePath);
          files.push(file);
        } catch (error) {
          console.error(`👻 [File Error] Failed to process ${relativePath}:`, error);
          // Continue processing other files
        }
      }
    }));
  }

  await scanDir(vaultPath);
  return files;
}

/**
 * Process a single markdown file
 *
 * @param fullPath - Absolute path to file
 * @param relativePath - Relative path from vault root
 * @returns Markdown file metadata
 */
async function processMarkdownFile(
  fullPath: string,
  relativePath: string
): Promise<MarkdownFile> {
  // Get file stats
  const stats = await fs.stat(fullPath);

  // Check file size limits
  if (stats.size > FILE_SIZE_LIMITS.MAX_FULL_READ) {
    throw new Error(`File too large: ${stats.size} bytes`);
  }

  if (stats.size > FILE_SIZE_LIMITS.WARN_SIZE) {
    console.warn(`⚠️  Large file: ${relativePath} (${stats.size} bytes)`);
  }

  // Read file content
  const content = await fs.readFile(fullPath, 'utf-8');

  // Parse frontmatter
  const { data, content: markdown } = matter(content);

  // Generate preview (first 200 chars without markdown formatting)
  const preview = createMarkdownPreview(markdown, 200);

  // Extract folder name
  const folder = path.dirname(relativePath).split(path.sep)[0] || 'root';

  return {
    id: generateFileId(relativePath),
    filename: path.basename(relativePath, '.md'),
    relativePath,
    size: stats.size,
    modified: stats.mtime,
    created: stats.birthtime,
    preview,
    isOversized: stats.size > FILE_SIZE_LIMITS.MAX_PREVIEW,
    frontmatter: data
  };
}

/**
 * Check if file is markdown based on extension
 *
 * @param filename - File name with extension
 * @returns True if markdown file
 */
function isMarkdownFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  // Exclude README.md to avoid docs
  return (ext === '.md' || ext === '.markdown') && filename !== 'README.md';
}

/**
 * Read full content of a specific file
 *
 * @param vaultPath - Absolute path to vault directory
 * @param relativePath - Relative path from vault root
 * @returns Full file content with metadata
 */
export async function readFileContent(
  vaultPath: string,
  relativePath: string
): Promise<{
  id: string;
  filename: string;
  relativePath: string;
  content: string;
  frontmatter: Record<string, any>;
  size: number;
  modified: Date;
  created: Date;
}> {
  // Validate paths
  const validation = validateVaultPath(vaultPath, relativePath);
  if (validation) {
    throw new Error(validation);
  }

  const absolutePath = path.resolve(vaultPath, relativePath);

  // Check file exists
  let stats;
  try {
    stats = await fs.stat(absolutePath);
  } catch (error) {
    throw new Error(`File not found: ${relativePath}`);
  }

  // Check file size
  if (stats.size > FILE_SIZE_LIMITS.MAX_FULL_READ) {
    throw new Error(`File too large: ${stats.size} bytes`);
  }

  // Read file
  const content = await fs.readFile(absolutePath, 'utf-8');

  // Parse frontmatter
  const { data, content: markdown } = matter(content);

  return {
    id: generateFileId(relativePath),
    filename: path.basename(relativePath, '.md'),
    relativePath,
    content: markdown,
    frontmatter: data,
    size: stats.size,
    modified: stats.mtime,
    created: stats.birthtime
  };
}
