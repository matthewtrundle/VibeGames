import fs from 'fs/promises';

/**
 * Create file ID from relative path
 */
export function createFileId(relativePath: string): string {
  // Base64 encode relative path for safe URL usage
  return Buffer.from(relativePath).toString('base64url');
}

/**
 * Decode file ID to relative path
 */
export function decodeFileId(id: string): string {
  return Buffer.from(id, 'base64url').toString('utf-8');
}

/**
 * Create preview from file content
 */
export async function createPreview(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Remove frontmatter for preview
    const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');

    // First 200 characters
    const preview = withoutFrontmatter.trim().slice(0, 200);

    return preview + (withoutFrontmatter.length > 200 ? '...' : '');
  } catch {
    return 'Preview unavailable 👻';
  }
}
