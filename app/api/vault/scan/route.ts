/**
 * POST /api/vault/scan
 *
 * Recursively scan vault directory for markdown files
 */

import { NextRequest } from 'next/server';
import { scanVaultAsync } from '@/lib/vault-scanner';
import { validateVaultPath, checkVaultExists, checkVaultReadable } from '@/lib/security';
import { ERROR_MESSAGES, ErrorCode } from '@/lib/types';

/**
 * Error response helper
 */
function errorResponse(statusCode: number, message: string) {
  return Response.json(
    {
      success: false,
      error: message,
      statusCode
    },
    { status: statusCode }
  );
}

/**
 * POST endpoint for vault scanning
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Parse request body
    const { vaultPath } = await req.json();

    // 2. Validate vault path is provided
    if (!vaultPath || typeof vaultPath !== 'string') {
      return errorResponse(400, 'Vault path is required');
    }

    if (vaultPath.length === 0) {
      return errorResponse(400, 'Vault path cannot be empty');
    }

    // 3. Validate vault path security
    const validation = validateVaultPath(vaultPath);
    if (validation) {
      return errorResponse(400, validation);
    }

    // 4. Check vault exists
    const exists = await checkVaultExists(vaultPath);
    if (!exists) {
      return errorResponse(404, ERROR_MESSAGES[ErrorCode.FILE_NOT_FOUND]);
    }

    // 5. Check vault is readable
    const readable = await checkVaultReadable(vaultPath);
    if (!readable) {
      return errorResponse(403, ERROR_MESSAGES[ErrorCode.PERMISSION_DENIED]);
    }

    // 6. Scan vault recursively
    const startTime = Date.now();
    const files = await scanVaultAsync(vaultPath);
    const scanTime = Date.now() - startTime;

    // 7. Sort files by modification date (newest first)
    files.sort((a, b) => b.modified.getTime() - a.modified.getTime());

    // 8. Log performance
    console.log(`👻 [Vault Scan] Found ${files.length} files in ${scanTime}ms`);

    // 9. Return results
    return Response.json({
      success: true,
      files,
      count: files.length,
      scanTime
    });

  } catch (error) {
    console.error('👻 [Vault Scan Error]', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        return errorResponse(404, ERROR_MESSAGES[ErrorCode.FILE_NOT_FOUND]);
      }

      if (error.message.includes('EACCES') || error.message.includes('Permission denied')) {
        return errorResponse(403, ERROR_MESSAGES[ErrorCode.PERMISSION_DENIED]);
      }

      if (error.message.includes('too large')) {
        return errorResponse(413, ERROR_MESSAGES[ErrorCode.FILE_TOO_LARGE]);
      }
    }

    // Generic error
    return errorResponse(500, ERROR_MESSAGES[ErrorCode.UNKNOWN]);
  }
}
