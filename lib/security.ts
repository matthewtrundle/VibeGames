import path from 'path';
import fs from 'fs/promises';
import { ERROR_MESSAGES, ErrorCode } from './types';

/**
 * Validate vault path and optional relative path
 * Returns null if valid, error message if invalid
 */
export function validateVaultPath(
  vaultPath: string,
  relativePath?: string
): string | null {
  try {
    // Check vault path is absolute
    if (!path.isAbsolute(vaultPath)) {
      return ERROR_MESSAGES[ErrorCode.INVALID_PATH];
    }

    // Check for null byte injection
    if (vaultPath.includes('\0')) {
      return ERROR_MESSAGES[ErrorCode.PATH_TRAVERSAL];
    }

    // Resolve to prevent path traversal
    const resolvedVaultPath = path.resolve(vaultPath);

    if (relativePath) {
      // Null byte injection check
      if (relativePath.includes('\0')) {
        return ERROR_MESSAGES[ErrorCode.PATH_TRAVERSAL];
      }

      // Check path doesn't contain suspicious patterns
      if (relativePath.includes('..') || relativePath.includes('~')) {
        return ERROR_MESSAGES[ErrorCode.PATH_TRAVERSAL];
      }

      // Check relative path doesn't escape vault
      const fullPath = path.resolve(vaultPath, relativePath);

      if (!fullPath.startsWith(resolvedVaultPath)) {
        return ERROR_MESSAGES[ErrorCode.PATH_TRAVERSAL];
      }
    }

    return null;  // Valid
  } catch (error) {
    return 'Path validation failed 👻';
  }
}

/**
 * Check if vault exists
 */
export async function checkVaultExists(vaultPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(vaultPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if vault is readable
 */
export async function checkVaultReadable(vaultPath: string): Promise<boolean> {
  try {
    await fs.access(vaultPath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check file size before reading
 *
 * @param filePath - Absolute path to file
 * @param maxSize - Maximum allowed size in bytes (default: 10MB)
 * @returns Validation result with size and error if any
 */
export async function checkFileSize(
  filePath: string,
  maxSize: number = 10_000_000
): Promise<{ valid: boolean; size?: number; error?: string }> {
  try {
    const stats = await fs.stat(filePath);

    if (stats.size > maxSize) {
      return {
        valid: false,
        size: stats.size,
        error: ERROR_MESSAGES[ErrorCode.FILE_TOO_LARGE]
      };
    }

    return { valid: true, size: stats.size };
  } catch (error) {
    return {
      valid: false,
      error: ERROR_MESSAGES[ErrorCode.FILE_NOT_FOUND]
    };
  }
}

/**
 * Sanitize error messages to prevent internal path leakage
 *
 * @param error - Error object
 * @param internalPath - Internal path to remove from message
 * @returns Sanitized error message
 */
export function sanitizeErrorMessage(
  error: Error,
  internalPath?: string
): string {
  let message = error.message;

  // Remove internal paths from error messages
  if (internalPath) {
    message = message.replace(new RegExp(internalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[vault]');
  }

  // Remove absolute paths (Unix and Windows)
  message = message.replace(/\/[^\s]+/g, '[path]');
  message = message.replace(/[A-Z]:\\[^\s]+/g, '[path]');

  return message;
}
