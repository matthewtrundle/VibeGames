import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { ErrorCode, ERROR_MESSAGES, MarkdownFile, MarkdownFileContent } from '@/lib/types';
import { validateVaultPath } from '@/lib/security';
import { selectRelevantFiles, extractKeywords } from '@/lib/context-selector';
import { FILE_SIZE_LIMITS } from '@/lib/markdown';
import {
  createOpenRouterClient,
  callOpenRouterWithRetry,
  formatContextForAI,
  getSystemPrompt,
  getUserPrompt,
  truncateContext
} from '@/lib/openrouter-client';
import { supabaseAdmin } from '@/lib/supabase-client';

/**
 * Validate chat request
 */
function validateChatRequest(req: {
  message?: string;
  vaultPath?: string;
  allFiles?: any;
}): string | null {
  if (!req.message || typeof req.message !== 'string') {
    return 'Message is required';
  }

  if (req.message.length === 0) {
    return 'Message cannot be empty';
  }

  if (req.message.length > 1000) {
    return 'Message too long (max 1000 characters)';
  }

  if (!req.vaultPath || typeof req.vaultPath !== 'string') {
    return 'Vault path is required';
  }

  if (!Array.isArray(req.allFiles)) {
    return 'Files must be an array';
  }

  return null;
}

/**
 * Read full content of a specific file
 */
async function readFileContent(
  vaultPath: string,
  relativePath: string
): Promise<MarkdownFileContent> {
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
  const fileContent = await fs.readFile(absolutePath, 'utf-8');

  // Parse frontmatter
  const { data, content: markdown } = matter(fileContent);

  // Generate ID (base64url encode)
  const id = Buffer.from(relativePath).toString('base64url');

  return {
    id,
    filename: path.basename(relativePath, '.md'),
    relativePath,
    absolutePath,
    content: markdown,
    frontmatter: data,
    size: stats.size,
    modified: stats.mtime,
    created: stats.birthtime,
    preview: markdown.substring(0, 200).trim() + '...',
    isOversized: stats.size > FILE_SIZE_LIMITS.MAX_PREVIEW
  };
}

/**
 * Create error response
 */
function errorResponse(statusCode: number, message: string): Response {
  console.error(`👻 [Chat API Error ${statusCode}]`, message);

  return Response.json({
    success: false,
    error: message,
    statusCode
  }, { status: statusCode });
}

/**
 * Log error with context
 */
function logError(context: string, error: unknown, metadata?: Record<string, any>): void {
  const timestamp = new Date().toISOString();

  console.error(`👻 [ERROR] ${context}`, {
    timestamp,
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack
    } : error,
    ...metadata
  });
}

/**
 * Scan vault and return file metadata
 * Fallback for when files are not provided by client
 */
async function scanVaultForFiles(vaultPath: string): Promise<MarkdownFile[]> {
  const files: MarkdownFile[] = [];

  async function scanDir(dir: string, baseDir: string = '') {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (error) {
      console.error(`👻 [Scan Error] Failed to read ${dir}:`, error);
      return;
    }

    await Promise.all(entries.map(async (entry) => {
      if (entry.name.startsWith('.')) return;

      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(baseDir, entry.name);

      if (entry.isDirectory()) {
        await scanDir(fullPath, relativePath);
      } else if ((entry.name.endsWith('.md') || entry.name.endsWith('.markdown')) && entry.name !== 'README.md') {
        try {
          const stats = await fs.stat(fullPath);

          if (stats.size > FILE_SIZE_LIMITS.MAX_FULL_READ) {
            return; // Skip files that are too large
          }

          const content = await fs.readFile(fullPath, 'utf-8');
          const { data } = matter(content);

          const id = Buffer.from(relativePath).toString('base64url');
          const preview = content.substring(0, 200).trim() + '...';

          files.push({
            id,
            filename: path.basename(relativePath, '.md'),
            relativePath,
            size: stats.size,
            modified: stats.mtime,
            created: stats.birthtime,
            preview,
            isOversized: stats.size > FILE_SIZE_LIMITS.MAX_PREVIEW,
            frontmatter: data
          });
        } catch (error) {
          console.error(`👻 [File Error] Failed to process ${relativePath}:`, error);
        }
      }
    }));
  }

  await scanDir(vaultPath);
  return files;
}

/**
 * POST /api/chat
 * Enhanced AI chat with smart context selection
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Parse request
    const body = await req.json();
    const { message, vaultPath, allFiles, fileIds } = body;

    // 2. Basic message validation
    if (!message || typeof message !== 'string') {
      return errorResponse(400, 'Message is required');
    }

    if (message.length === 0) {
      return errorResponse(400, 'Message cannot be empty');
    }

    if (message.length > 1000) {
      return errorResponse(400, 'Message too long (max 1000 characters)');
    }

    // 3. Determine vault path and get files
    const defaultVaultPath = path.join(process.cwd(), 'demo-vault');
    const actualVaultPath = vaultPath || defaultVaultPath;

    // 4. Validate vault path
    const pathError = validateVaultPath(actualVaultPath);
    if (pathError) {
      return errorResponse(400, pathError);
    }

    // 5. Get files - either from request or scan vault
    let files: MarkdownFile[];

    if (allFiles && Array.isArray(allFiles) && allFiles.length > 0) {
      // Use provided files
      files = allFiles.map((f: any) => ({
        ...f,
        modified: new Date(f.modified),
        created: new Date(f.created)
      }));
      console.log(`👻 [Context] Using ${files.length} provided files`);
    } else {
      // Scan vault for files
      console.log(`👻 [Context] Scanning vault: ${actualVaultPath}`);
      files = await scanVaultForFiles(actualVaultPath);
      console.log(`👻 [Context] Found ${files.length} files in vault`);
    }

    if (files.length === 0) {
      return errorResponse(400, 'No files found in vault 👻');
    }

    // 6. RAG-powered semantic search for context
    let context: string;

    if (fileIds && fileIds.length > 0) {
      // Manual selection by user - use traditional file reading
      const selectedFiles = files.filter(f => fileIds.includes(f.id) && !f.isOversized);
      console.log(`👻 [Context] User selected ${selectedFiles.length} files`);

      if (selectedFiles.length === 0) {
        return errorResponse(400, 'No suitable files found for context 👻');
      }

      // Read full content for selected files
      let filesWithContent: MarkdownFileContent[];
      try {
        filesWithContent = await Promise.all(
          selectedFiles.map(f => readFileContent(actualVaultPath, f.relativePath))
        );
      } catch (error) {
        logError('File reading failed', error, { vaultPath: actualVaultPath });
        return errorResponse(500, ERROR_MESSAGES[ErrorCode.FILE_NOT_FOUND]);
      }

      // Truncate and format
      filesWithContent = truncateContext(filesWithContent, 50_000);
      context = formatContextForAI(filesWithContent);

      console.log(`👻 [Context] Using ${filesWithContent.length} files, ` +
        `total size: ${filesWithContent.reduce((sum, f) => sum + f.size, 0)} bytes`);
    } else {
      // Use RAG semantic search for automatic context selection
      console.log(`👻 [RAG] Using semantic search for context`);

      try {
        // Import RAG function to avoid HTTP fetch (which doesn't work on Vercel)
        const { POST: ragPost } = await import('@/app/api/rag/route');

        // Call RAG function directly
        const ragRequest = new Request('http://localhost/api/rag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: message,
            matchCount: 10
          })
        });

        const ragResponse = await ragPost(ragRequest as any);
        const ragResult = await ragResponse.json();

        if (!ragResult.success || !ragResult.chunks || ragResult.chunks.length === 0) {
          return errorResponse(400, 'No relevant content found in vault 👻');
        }

        console.log(`👻 [RAG] Found ${ragResult.count} semantically similar chunks`);

        // Format RAG chunks as context
        context = '# 🔮 Relevant Context from Your Vault\n\n';
        context += `Found ${ragResult.count} relevant sections:\n\n`;

        ragResult.chunks.forEach((chunk: any, idx: number) => {
          const heading = chunk.metadata?.heading || 'Content';
          const similarity = (chunk.similarity * 100).toFixed(1);

          context += `## [${idx + 1}] ${chunk.file_path}\n`;
          context += `**Section:** ${heading} (${similarity}% relevant)\n\n`;
          context += `${chunk.chunk_text}\n\n`;
          context += `---\n\n`;
        });

        console.log(`👻 [RAG] Context size: ${context.length} characters`);
      } catch (error) {
        logError('RAG search failed', error);
        // Fall back to empty context rather than failing
        console.warn(`👻 [RAG] Falling back to no context due to error`);
        context = '# 🔮 Your Vault\n\nNo relevant context found, but I can still help!';
      }
    }

    // 7. Build AI prompt
    const systemPrompt = getSystemPrompt();
    const userPrompt = getUserPrompt(context, message);

    // 8. Create OpenRouter client
    const client = createOpenRouterClient();

    // 9. Call AI with retry logic
    let stream;
    try {
      stream = await callOpenRouterWithRetry(
        client,
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        2  // Max 2 retries
      );
    } catch (error: any) {
      logError('OpenRouter call failed', error);

      // Handle specific error types
      if (error.status === 401 || error.status === 403) {
        return errorResponse(401, ERROR_MESSAGES[ErrorCode.API_KEY_MISSING]);
      }

      if (error.status === 429) {
        return errorResponse(429, ERROR_MESSAGES[ErrorCode.RATE_LIMIT]);
      }

      return errorResponse(500, ERROR_MESSAGES[ErrorCode.AI_ERROR]);
    }

    // 10. Setup streaming with error recovery
    const encoder = new TextEncoder();
    let chunkCount = 0;

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(encoder.encode(text));
              chunkCount++;
            }
          }

          const duration = Date.now() - startTime;
          console.log(`👻 [Success] Streamed ${chunkCount} chunks in ${duration}ms`);

          controller.close();
        } catch (error) {
          logError('Streaming error', error, { chunkCount });

          // Send error message to client
          const errorMsg = '\n\n[The spirits have gone silent... 👻]';
          try {
            controller.enqueue(encoder.encode(errorMsg));
          } catch {
            // Ignore if controller already closed
          }

          controller.close();
        }
      },
      cancel() {
        console.log(`👻 [Cancelled] Stream cancelled by client after ${chunkCount} chunks`);
      }
    });

    // 11. Return streaming response
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff'
      }
    });

  } catch (error) {
    logError('Chat API error', error);

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

    return errorResponse(500, ERROR_MESSAGES[ErrorCode.UNKNOWN]);
  }
}
