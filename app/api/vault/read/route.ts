/**
 * GET /api/vault/read
 *
 * Read full content of a specific file
 */

import { NextRequest } from 'next/server';
import { readFileContent } from '@/lib/vault-scanner';
import { validateVaultPath } from '@/lib/security';
import { decodeFileId } from '@/lib/file-helpers';
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
 * GET endpoint for reading a single file
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Parse query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const vaultPath = searchParams.get('vaultPath');

    // 2. Validate required parameters
    if (!id || !vaultPath) {
      return errorResponse(400, 'Missing required parameters: id and vaultPath');
    }

    if (typeof id !== 'string' || typeof vaultPath !== 'string') {
      return errorResponse(400, 'Invalid parameter types');
    }

    // 3. Decode file ID to relative path
    let relativePath: string;
    try {
      relativePath = decodeFileId(id);
    } catch (error) {
      return errorResponse(400, 'Invalid file ID - the spirits cannot decode this 👻');
    }

    // 4. Validate path security
    const validation = validateVaultPath(vaultPath, relativePath);
    if (validation) {
      return errorResponse(400, validation);
    }

    // 5. Read file content
    const fileContent = await readFileContent(vaultPath, relativePath);

    // 6. Return file data (excluding absolutePath for security)
    return Response.json({
      success: true,
      file: {
        id: fileContent.id,
        filename: fileContent.filename,
        relativePath: fileContent.relativePath,
        content: fileContent.content,
        frontmatter: fileContent.frontmatter,
        size: fileContent.size,
        modified: fileContent.modified,
        created: fileContent.created
      }
    });

  } catch (error) {
    console.error('👻 [Vault Read Error]', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('File not found')) {
        return errorResponse(404, ERROR_MESSAGES[ErrorCode.FILE_NOT_FOUND]);
      }

      if (error.message.includes('ENOENT')) {
        return errorResponse(404, ERROR_MESSAGES[ErrorCode.FILE_NOT_FOUND]);
      }

      if (error.message.includes('EACCES') || error.message.includes('Permission denied')) {
        return errorResponse(403, ERROR_MESSAGES[ErrorCode.PERMISSION_DENIED]);
      }

      if (error.message.includes('too large')) {
        return errorResponse(413, ERROR_MESSAGES[ErrorCode.FILE_TOO_LARGE]);
      }

      if (error.message.includes('Path traversal') || error.message.includes('Invalid path')) {
        return errorResponse(400, error.message);
      }
    }

    // Generic error
    return errorResponse(500, ERROR_MESSAGES[ErrorCode.UNKNOWN]);
  }
}
