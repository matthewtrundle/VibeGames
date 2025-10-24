# The Headless Horseman's Quest - Backend Implementation Plan

**Version:** 1.0
**Created:** 2025-10-24
**Project:** Next.js + OpenRouter Backend Implementation
**Focus:** Server-side file operations, streaming AI, efficient scanning, and security

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [API Routes Architecture](#api-routes-architecture)
3. [Server Actions Design](#server-actions-design)
4. [File Scanning Implementation](#file-scanning-implementation)
5. [OpenRouter Integration](#openrouter-integration)
6. [Streaming Response Implementation](#streaming-response-implementation)
7. [Security Implementation](#security-implementation)
8. [Error Handling Strategy](#error-handling-strategy)
9. [Performance Optimization](#performance-optimization)
10. [Testing Strategy](#testing-strategy)
11. [Implementation Task Breakdown](#implementation-task-breakdown)

---

## Executive Summary

### Current State
- ✅ **Working**: `/api/chat` route with OpenRouter streaming
- ✅ **Working**: Basic file scanning in server components
- ✅ **Working**: Markdown parsing with gray-matter
- ✅ **Working**: Security validation (path traversal prevention)
- ✅ **Working**: File size limits and type validation

### Implementation Gaps
- ❌ **Missing**: Separate `/api/vault/scan` endpoint
- ❌ **Missing**: `/api/vault/read` endpoint for individual files
- ❌ **Missing**: Enhanced context selection in chat API
- ❌ **Missing**: Citation extraction from AI responses
- ❌ **Missing**: Async file operations optimization
- ❌ **Missing**: Comprehensive error handling
- ❌ **Missing**: Input validation middleware
- ❌ **Missing**: Performance monitoring

### Implementation Approach
**Strategy**: Incremental enhancement of existing backend while maintaining MVP scope and spooky theme.

**Priorities**:
1. **API Routes** - Extract vault operations to dedicated endpoints
2. **Security** - Enhance validation and sanitization
3. **Performance** - Async operations and caching
4. **Error Handling** - Structured errors with themed messages
5. **Testing** - Unit tests for critical paths

---

## API Routes Architecture

### Route Structure

```
app/api/
├── chat/
│   └── route.ts           # POST - AI chat (existing, enhance)
├── vault/
│   ├── scan/
│   │   └── route.ts       # POST - Scan vault directory
│   ├── read/
│   │   └── route.ts       # GET - Read specific file
│   └── validate/
│       └── route.ts       # POST - Validate vault path
└── health/
    └── route.ts           # GET - Health check
```

### Route Specifications

#### 1. POST `/api/vault/scan`

**Purpose**: Recursively scan vault directory for markdown files

**Request Body**:
```typescript
{
  vaultPath: string;  // Absolute path to vault
}
```

**Response**:
```typescript
{
  success: true;
  files: MarkdownFile[];  // Array of file metadata
  count: number;          // Total files found
  scanTime: number;       // Milliseconds
}
```

**Security**:
- Validate absolute path
- Check path traversal attempts
- Verify directory exists and is readable
- Enforce file size limits
- Rate limit to prevent abuse

**Implementation File**: `app/api/vault/scan/route.ts`

**Pseudo-code**:
```typescript
export async function POST(req: NextRequest) {
  // 1. Parse request body
  const { vaultPath } = await req.json()

  // 2. Validate vault path
  const validation = validateVaultPath(vaultPath)
  if (validation) return errorResponse(400, validation)

  // 3. Check vault exists and is readable
  const exists = await checkVaultExists(vaultPath)
  if (!exists) return errorResponse(404, 'Vault not found')

  const readable = await checkVaultReadable(vaultPath)
  if (!readable) return errorResponse(403, 'Permission denied')

  // 4. Scan vault recursively
  const startTime = Date.now()
  const files = await scanVaultAsync(vaultPath)
  const scanTime = Date.now() - startTime

  // 5. Sort files by modification date (newest first)
  files.sort((a, b) => b.modified.getTime() - a.modified.getTime())

  // 6. Return results
  return Response.json({
    success: true,
    files,
    count: files.length,
    scanTime
  })
}
```

---

#### 2. GET `/api/vault/read`

**Purpose**: Read full content of a specific file

**Query Parameters**:
```typescript
{
  id: string;         // Base64url-encoded relative path
  vaultPath: string;  // Absolute vault path
}
```

**Response**:
```typescript
{
  success: true;
  file: {
    id: string;
    filename: string;
    relativePath: string;
    content: string;       // Full markdown content
    frontmatter: object;
    size: number;
    modified: Date;
    created: Date;
  }
}
```

**Security**:
- Decode file ID safely
- Validate decoded path
- Check file exists within vault
- Enforce file size limits (reject > 10MB)
- Never expose absolute paths to client

**Implementation File**: `app/api/vault/read/route.ts`

**Pseudo-code**:
```typescript
export async function GET(req: NextRequest) {
  // 1. Parse query parameters
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const vaultPath = searchParams.get('vaultPath')

  // 2. Validate inputs
  if (!id || !vaultPath) {
    return errorResponse(400, 'Missing required parameters')
  }

  // 3. Decode file ID to relative path
  const relativePath = decodeFileId(id)

  // 4. Validate path security
  const validation = validateVaultPath(vaultPath, relativePath)
  if (validation) return errorResponse(400, validation)

  // 5. Read file content
  const fileContent = await readFileContent(vaultPath, relativePath)

  // 6. Return file data (no absolutePath)
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
  })
}
```

---

#### 3. POST `/api/chat` (Enhanced)

**Purpose**: AI chat with smart context selection and streaming

**Current State**: ✅ Working, but needs enhancements

**Request Body**:
```typescript
{
  message: string;           // User query
  vaultPath: string;         // Vault location
  allFiles: MarkdownFile[];  // All file metadata (for context selection)
  fileIds?: string[];        // Optional: pre-selected files
}
```

**Response**: Streaming text (existing works well)

**Enhancements Needed**:
1. Smart context selection (top 5 files by relevance)
2. Exclude oversized files (> 1MB)
3. Limit total context size (~50KB)
4. Extract and return citations
5. Better error handling

**Implementation File**: `app/api/chat/route.ts` (enhance existing)

**Pseudo-code**:
```typescript
export async function POST(req: NextRequest) {
  try {
    // 1. Parse request
    const { message, vaultPath, allFiles, fileIds } = await req.json()

    // 2. Validate inputs
    const validation = validateChatRequest({ message, vaultPath, allFiles })
    if (validation) return errorResponse(400, validation)

    // 3. Select relevant files (smart or manual)
    let selectedFiles: MarkdownFile[]
    if (fileIds && fileIds.length > 0) {
      // Manual selection
      selectedFiles = allFiles.filter(f => fileIds.includes(f.id))
    } else {
      // Smart selection (top 5 by relevance)
      selectedFiles = selectRelevantFiles(message, allFiles, 5)
        .filter(f => !f.isOversized)  // Exclude large files
    }

    // 4. Read full content for selected files
    const filesWithContent = await Promise.all(
      selectedFiles.map(f => readFileContent(vaultPath, f.relativePath))
    )

    // 5. Format context for AI
    const context = formatContextForAI(filesWithContent)

    // 6. Build AI prompt
    const systemPrompt = getSystemPrompt()
    const userPrompt = getUserPrompt(context, message)

    // 7. Stream AI response (existing works)
    const stream = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      max_tokens: 2000,
      temperature: 0.7,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })

    // 8. Return streaming response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
          controller.close()
        } catch (error) {
          console.error('👻 [Streaming Error]', error)
          controller.error(error)
        }
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked'
      }
    })

  } catch (error) {
    console.error('👻 [Chat API Error]', error)
    return errorResponse(500, ERROR_MESSAGES[ErrorCode.AI_ERROR])
  }
}
```

---

#### 4. POST `/api/vault/validate`

**Purpose**: Validate vault path before scanning

**Request Body**:
```typescript
{
  vaultPath: string;
}
```

**Response**:
```typescript
{
  success: true;
  valid: boolean;
  error?: string;
  stats?: {
    exists: boolean;
    isDirectory: boolean;
    readable: boolean;
  }
}
```

**Implementation File**: `app/api/vault/validate/route.ts`

**Pseudo-code**:
```typescript
export async function POST(req: NextRequest) {
  const { vaultPath } = await req.json()

  // Validate path format
  const pathError = validateVaultPath(vaultPath)
  if (pathError) {
    return Response.json({
      success: true,
      valid: false,
      error: pathError
    })
  }

  // Check existence
  const exists = await checkVaultExists(vaultPath)
  if (!exists) {
    return Response.json({
      success: true,
      valid: false,
      error: 'Vault does not exist',
      stats: { exists: false, isDirectory: false, readable: false }
    })
  }

  // Check readable
  const readable = await checkVaultReadable(vaultPath)

  return Response.json({
    success: true,
    valid: readable,
    error: readable ? undefined : 'Permission denied',
    stats: {
      exists: true,
      isDirectory: true,
      readable
    }
  })
}
```

---

#### 5. GET `/api/health`

**Purpose**: Health check for monitoring

**Response**:
```typescript
{
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  checks: {
    openrouter: boolean;
    filesystem: boolean;
  }
}
```

**Implementation File**: `app/api/health/route.ts`

---

## Server Actions Design

### Decision: Minimal Server Actions for MVP

**Rationale**:
- API routes sufficient for read-only operations
- Server Actions better for mutations (which MVP doesn't have)
- Simpler architecture with consistent API route pattern

**Future Use Cases** (post-MVP):
- File uploads
- Vault configuration persistence
- User preferences

### Server Actions Structure (Future)

```typescript
// app/actions/vault.ts
'use server'

export async function saveVaultConfig(
  userId: string,
  vaultPath: string
): Promise<{ success: boolean; error?: string }> {
  // Save to database (Supabase)
  // Not needed for MVP
}
```

**Current Decision**: Skip Server Actions, use API routes only.

---

## File Scanning Implementation

### Current Implementation Review

**Existing Code** (`app/page.tsx`):
```typescript
function getMarkdownFiles(): MarkdownFile[] {
  const vaultPath = path.join(process.cwd(), 'demo-vault')
  // ... synchronous scanning
}
```

**Issues**:
1. ✅ Hardcoded to demo-vault (OK for MVP)
2. ⚠️ Synchronous operations (should be async for API routes)
3. ✅ Recursive scanning (good)
4. ⚠️ No error handling for large vaults
5. ✅ Frontmatter parsing (working)

### Enhanced Async Implementation

**New File**: `lib/vault-scanner.ts`

```typescript
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { MarkdownFile } from './types'
import { generateFileId } from './file-helpers'
import { createMarkdownPreview, FILE_SIZE_LIMITS } from './markdown'
import { validateVaultPath } from './security'

/**
 * Scan vault recursively for markdown files (async version)
 */
export async function scanVaultAsync(
  vaultPath: string
): Promise<MarkdownFile[]> {
  // Validate path
  const validation = validateVaultPath(vaultPath)
  if (validation) {
    throw new Error(validation)
  }

  const files: MarkdownFile[] = []

  async function scanDir(dir: string, baseDir: string = '') {
    let entries
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch (error) {
      console.error(`👻 [Scan Error] Failed to read ${dir}:`, error)
      return  // Skip directory on error
    }

    // Process entries in parallel
    await Promise.all(entries.map(async (entry) => {
      // Skip hidden files/directories
      if (entry.name.startsWith('.')) return

      const fullPath = path.join(dir, entry.name)
      const relativePath = path.join(baseDir, entry.name)

      if (entry.isDirectory()) {
        // Recurse into subdirectory
        await scanDir(fullPath, relativePath)
      } else if (isMarkdownFile(entry.name)) {
        // Process markdown file
        try {
          const file = await processMarkdownFile(fullPath, relativePath)
          files.push(file)
        } catch (error) {
          console.error(`👻 [File Error] Failed to process ${relativePath}:`, error)
          // Continue processing other files
        }
      }
    }))
  }

  await scanDir(vaultPath)
  return files
}

/**
 * Process a single markdown file
 */
async function processMarkdownFile(
  fullPath: string,
  relativePath: string
): Promise<MarkdownFile> {
  // Get file stats
  const stats = await fs.stat(fullPath)

  // Check file size
  if (stats.size > FILE_SIZE_LIMITS.MAX_FULL_READ) {
    throw new Error(`File too large: ${stats.size} bytes`)
  }

  if (stats.size > FILE_SIZE_LIMITS.WARN_SIZE) {
    console.warn(`⚠️  Large file: ${relativePath} (${stats.size} bytes)`)
  }

  // Read file content
  const content = await fs.readFile(fullPath, 'utf-8')

  // Parse frontmatter
  const { data, content: markdown } = matter(content)

  // Generate preview
  const preview = createMarkdownPreview(markdown, 200)

  // Extract folder
  const folder = path.dirname(relativePath).split(path.sep)[0] || 'root'

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
  }
}

/**
 * Check if file is markdown
 */
function isMarkdownFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return (ext === '.md' || ext === '.markdown') && filename !== 'README.md'
}
```

**Key Improvements**:
1. ✅ Async operations (non-blocking)
2. ✅ Parallel processing (Promise.all)
3. ✅ Error handling (skip problematic files)
4. ✅ File size checks
5. ✅ Performance warnings
6. ✅ Proper typing

---

### Read Single File Implementation

**New File**: `lib/vault-reader.ts`

```typescript
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { MarkdownFileContent } from './types'
import { validateVaultPath } from './security'
import { generateFileId } from './file-helpers'
import { FILE_SIZE_LIMITS } from './markdown'

/**
 * Read full content of a specific file
 */
export async function readFileContent(
  vaultPath: string,
  relativePath: string
): Promise<MarkdownFileContent> {
  // Validate paths
  const validation = validateVaultPath(vaultPath, relativePath)
  if (validation) {
    throw new Error(validation)
  }

  const absolutePath = path.resolve(vaultPath, relativePath)

  // Check file exists
  let stats
  try {
    stats = await fs.stat(absolutePath)
  } catch (error) {
    throw new Error(`File not found: ${relativePath}`)
  }

  // Check file size
  if (stats.size > FILE_SIZE_LIMITS.MAX_FULL_READ) {
    throw new Error(`File too large: ${stats.size} bytes`)
  }

  // Read file
  const content = await fs.readFile(absolutePath, 'utf-8')

  // Parse frontmatter
  const { data, content: markdown } = matter(content)

  // Extract folder
  const folder = path.dirname(relativePath).split(path.sep)[0] || 'root'

  return {
    id: generateFileId(relativePath),
    filename: path.basename(relativePath, '.md'),
    relativePath,
    absolutePath,  // Only used server-side, never sent to client
    content: markdown,
    frontmatter: data,
    size: stats.size,
    modified: stats.mtime,
    created: stats.birthtime,
    preview: markdown.substring(0, 200).trim() + '...',
    isOversized: stats.size > FILE_SIZE_LIMITS.MAX_PREVIEW
  }
}
```

---

## OpenRouter Integration

### Current Implementation Review

**Existing** (`app/api/chat/route.ts`):
```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'The Headless Horseman\'s Quest'
  }
})
```

**Issues**:
1. ✅ Configuration correct
2. ⚠️ Hardcoded referer (should use env var)
3. ✅ Streaming working
4. ⚠️ No retry logic
5. ⚠️ No rate limit handling

### Enhanced OpenRouter Client

**New File**: `lib/openrouter-client.ts`

```typescript
import OpenAI from 'openai'
import { ErrorCode, ERROR_MESSAGES } from './types'

/**
 * Validate OpenRouter API key
 */
export function validateOpenRouterKey(): void {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(ERROR_MESSAGES[ErrorCode.API_KEY_MISSING])
  }
}

/**
 * Create OpenRouter client
 */
export function createOpenRouterClient(): OpenAI {
  validateOpenRouterKey()

  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'The Headless Horseman\'s Quest'
    }
  })
}

/**
 * Call OpenRouter with retry logic
 */
export async function callOpenRouterWithRetry(
  client: OpenAI,
  messages: { role: string; content: string }[],
  maxRetries: number = 2
): Promise<AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const stream = await client.chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        max_tokens: 2000,
        temperature: 0.7,
        stream: true,
        messages: messages as any
      })

      return stream
    } catch (error: any) {
      lastError = error

      // Don't retry on auth errors
      if (error.status === 401 || error.status === 403) {
        throw error
      }

      // Don't retry on client errors (except rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000  // 1s, 2s, 4s
        console.log(`👻 [Retry] Attempt ${attempt + 1} failed, waiting ${waitTime}ms...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  // All retries failed
  throw lastError || new Error('Unknown OpenRouter error')
}

/**
 * Format files for AI context
 */
export function formatContextForAI(files: Array<{
  relativePath: string;
  content: string;
  frontmatter?: Record<string, any>;
  modified: Date;
}>): string {
  return files.map(file => {
    const tags = file.frontmatter?.tags
    const tagsStr = Array.isArray(tags) ? tags.join(', ') : (tags || 'none')

    return `
## File: ${file.relativePath}
**Modified:** ${file.modified.toISOString()}
**Tags:** ${tagsStr}

${file.content}

---
    `.trim()
  }).join('\n\n')
}

/**
 * System prompt for Headless Horseman AI
 */
export function getSystemPrompt(): string {
  return `You are the Headless Horseman's loyal spirit guide, helping mortals reunite scattered information across their Obsidian vault.

Your cursed mission:
1. Read and understand markdown files scattered across the digital graveyard
2. Find connections between different notes that humans might miss
3. Answer questions about the collected information with haunting accuracy
4. Organize chaos into coherent insights

Be mysterious yet helpful, use spooky metaphors when appropriate, but always deliver clear, actionable insights.

Key guidelines:
- Treat all markdown files equally - product logs, feedback notes, random thoughts
- When answering questions, cite which markdown files you're referencing
- Use frontmatter metadata when available (tags, dates, etc.)
- If information seems incomplete across files, acknowledge the gaps
- Be concise - no one wants to read a novel in a haunted house

Spooky flair is encouraged, but clarity is paramount. You're here to help, not to haunt!`
}

/**
 * User prompt template
 */
export function getUserPrompt(context: string, query: string): string {
  return `Here are the relevant markdown files from the vault:

${context}

User question: ${query}

Please answer the user's question based on the markdown files above. When referencing information, cite the specific file(s) you're pulling from. Be conversational and helpful, and maintain the spooky theme. If you can't find relevant information, say so honestly.`
}
```

---

## Streaming Response Implementation

### Current State

**Existing implementation is solid**. Keep the streaming pattern:

```typescript
const encoder = new TextEncoder()
const readable = new ReadableStream({
  async start(controller) {
    try {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || ''
        if (text) {
          controller.enqueue(encoder.encode(text))
        }
      }
      controller.close()
    } catch (error) {
      controller.error(error)
    }
  }
})

return new Response(readable, {
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked'
  }
})
```

**Enhancement**: Add error recovery

```typescript
const readable = new ReadableStream({
  async start(controller) {
    try {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || ''
        if (text) {
          controller.enqueue(encoder.encode(text))
        }
      }
      controller.close()
    } catch (error) {
      console.error('👻 [Streaming Error]', error)

      // Send error message to client
      const errorMsg = '\n\n[The spirits have gone silent... 👻]'
      controller.enqueue(encoder.encode(errorMsg))
      controller.close()
    }
  }
})
```

---

## Security Implementation

### Path Validation Enhancement

**Current** (`lib/security.ts`): ✅ Good foundation

**Enhancements**:

```typescript
import path from 'path'
import fs from 'fs/promises'
import { ErrorCode, ERROR_MESSAGES } from './types'

/**
 * Enhanced path validation with null byte check
 */
export function validateVaultPath(
  vaultPath: string,
  relativePath?: string
): string | null {
  try {
    // Check absolute path
    if (!path.isAbsolute(vaultPath)) {
      return ERROR_MESSAGES[ErrorCode.INVALID_PATH]
    }

    // Resolve path
    const resolvedVault = path.resolve(vaultPath)

    // Check relative path if provided
    if (relativePath) {
      // Null byte injection check
      if (relativePath.includes('\0')) {
        return ERROR_MESSAGES[ErrorCode.PATH_TRAVERSAL]
      }

      // Path traversal patterns
      if (relativePath.includes('..') || relativePath.includes('~')) {
        return ERROR_MESSAGES[ErrorCode.PATH_TRAVERSAL]
      }

      // Verify stays within vault
      const fullPath = path.resolve(vaultPath, relativePath)
      if (!fullPath.startsWith(resolvedVault)) {
        return ERROR_MESSAGES[ErrorCode.PATH_TRAVERSAL]
      }
    }

    return null  // Valid
  } catch (error) {
    return 'Path validation failed 👻'
  }
}

/**
 * Check file size before reading
 */
export async function checkFileSize(
  filePath: string,
  maxSize: number = 10_000_000
): Promise<{ valid: boolean; size?: number; error?: string }> {
  try {
    const stats = await fs.stat(filePath)

    if (stats.size > maxSize) {
      return {
        valid: false,
        size: stats.size,
        error: ERROR_MESSAGES[ErrorCode.FILE_TOO_LARGE]
      }
    }

    return { valid: true, size: stats.size }
  } catch (error) {
    return {
      valid: false,
      error: ERROR_MESSAGES[ErrorCode.FILE_NOT_FOUND]
    }
  }
}

/**
 * Sanitize error messages (never leak internal paths)
 */
export function sanitizeErrorMessage(
  error: Error,
  internalPath?: string
): string {
  let message = error.message

  // Remove internal paths from error messages
  if (internalPath) {
    message = message.replace(new RegExp(internalPath, 'g'), '[vault]')
  }

  // Remove absolute paths
  message = message.replace(/\/[^\s]+/g, '[path]')

  return message
}
```

---

### Input Validation

**New File**: `lib/validation.ts`

```typescript
import { ErrorCode, ERROR_MESSAGES, ChatRequest } from './types'

/**
 * Validate chat request
 */
export function validateChatRequest(
  req: Partial<ChatRequest>
): string | null {
  // Validate message
  if (!req.message || typeof req.message !== 'string') {
    return 'Message is required'
  }

  if (req.message.length === 0) {
    return 'Message cannot be empty'
  }

  if (req.message.length > 1000) {
    return 'Message too long (max 1000 characters)'
  }

  // Validate vault path
  if (!req.vaultPath || typeof req.vaultPath !== 'string') {
    return 'Vault path is required'
  }

  // Validate files array
  if (!Array.isArray(req.allFiles)) {
    return 'Files must be an array'
  }

  return null  // Valid
}

/**
 * Validate scan request
 */
export function validateScanRequest(req: {
  vaultPath?: string
}): string | null {
  if (!req.vaultPath || typeof req.vaultPath !== 'string') {
    return 'Vault path is required'
  }

  if (req.vaultPath.length === 0) {
    return 'Vault path cannot be empty'
  }

  return null
}

/**
 * Validate read request
 */
export function validateReadRequest(req: {
  id?: string;
  vaultPath?: string;
}): string | null {
  if (!req.id || typeof req.id !== 'string') {
    return 'File ID is required'
  }

  if (!req.vaultPath || typeof req.vaultPath !== 'string') {
    return 'Vault path is required'
  }

  return null
}
```

---

## Error Handling Strategy

### Structured Error Responses

**New File**: `lib/error-handler.ts`

```typescript
import { ErrorCode, ERROR_MESSAGES, StructuredError } from './types'

/**
 * Create error response
 */
export function errorResponse(
  statusCode: number,
  message: string,
  code?: ErrorCode
): Response {
  return Response.json({
    success: false,
    error: message,
    statusCode,
    code
  }, { status: statusCode })
}

/**
 * Handle API error
 */
export function handleAPIError(error: unknown): Response {
  console.error('👻 [API Error]', error)

  // Known error codes
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('ENOENT')) {
      return errorResponse(
        404,
        ERROR_MESSAGES[ErrorCode.FILE_NOT_FOUND],
        ErrorCode.FILE_NOT_FOUND
      )
    }

    if (error.message.includes('EACCES') || error.message.includes('Permission denied')) {
      return errorResponse(
        403,
        ERROR_MESSAGES[ErrorCode.PERMISSION_DENIED],
        ErrorCode.PERMISSION_DENIED
      )
    }

    if (error.message.includes('too large')) {
      return errorResponse(
        413,
        ERROR_MESSAGES[ErrorCode.FILE_TOO_LARGE],
        ErrorCode.FILE_TOO_LARGE
      )
    }
  }

  // Generic error
  return errorResponse(
    500,
    ERROR_MESSAGES[ErrorCode.UNKNOWN],
    ErrorCode.UNKNOWN
  )
}

/**
 * Try-catch wrapper for API routes
 */
export async function tryAPIRoute<T>(
  handler: () => Promise<T>
): Promise<T | Response> {
  try {
    return await handler()
  } catch (error) {
    return handleAPIError(error)
  }
}
```

### Error Logging

**Enhancement**: Structured logging

```typescript
/**
 * Log error with context
 */
export function logError(
  context: string,
  error: unknown,
  metadata?: Record<string, any>
): void {
  const timestamp = new Date().toISOString()

  console.error(`👻 [ERROR] ${context}`, {
    timestamp,
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack
    } : error,
    ...metadata
  })
}

// Usage example
logError('File scan failed', error, {
  vaultPath: sanitizedPath,
  fileCount: files.length
})
```

---

## Performance Optimization

### 1. Async Operations

**Strategy**: Use Promise.all for parallel operations

```typescript
// ✅ Good - parallel reads
const filesWithContent = await Promise.all(
  selectedFiles.map(f => readFileContent(vaultPath, f.relativePath))
)

// ❌ Bad - sequential reads
const filesWithContent = []
for (const file of selectedFiles) {
  const content = await readFileContent(vaultPath, file.relativePath)
  filesWithContent.push(content)
}
```

### 2. Context Size Limiting

```typescript
/**
 * Truncate context if too large
 */
export function truncateContext(
  files: MarkdownFileContent[],
  maxSize: number = 50_000  // ~50KB
): MarkdownFileContent[] {
  let totalSize = 0
  const result: MarkdownFileContent[] = []

  for (const file of files) {
    const fileSize = file.content.length + file.relativePath.length + 100

    if (totalSize + fileSize > maxSize) {
      break  // Stop adding files
    }

    result.push(file)
    totalSize += fileSize
  }

  return result
}
```

### 3. Caching Strategy (Future)

```typescript
// In-memory cache for file list
let fileCache: {
  vaultPath: string;
  files: MarkdownFile[];
  timestamp: number;
} | null = null

const CACHE_TTL = 60_000  // 1 minute

export function getCachedFiles(vaultPath: string): MarkdownFile[] | null {
  if (!fileCache || fileCache.vaultPath !== vaultPath) {
    return null
  }

  const age = Date.now() - fileCache.timestamp
  if (age > CACHE_TTL) {
    return null  // Expired
  }

  return fileCache.files
}

export function setCachedFiles(vaultPath: string, files: MarkdownFile[]): void {
  fileCache = { vaultPath, files, timestamp: Date.now() }
}
```

### 4. Performance Monitoring

```typescript
/**
 * Measure operation duration
 */
export async function measureOperation<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = Date.now()

  try {
    const result = await operation()
    const duration = Date.now() - startTime

    console.log(`⚡ [Performance] ${name}: ${duration}ms`)

    return result
  } catch (error) {
    const duration = Date.now() - startTime
    console.log(`⚡ [Performance] ${name} (failed): ${duration}ms`)
    throw error
  }
}

// Usage
const files = await measureOperation('Vault scan', () =>
  scanVaultAsync(vaultPath)
)
```

---

## Testing Strategy

### Unit Tests

**Test Files Structure**:
```
__tests__/
├── lib/
│   ├── security.test.ts
│   ├── context-selector.test.ts
│   ├── file-helpers.test.ts
│   ├── markdown.test.ts
│   └── validation.test.ts
└── api/
    ├── vault-scan.test.ts
    ├── vault-read.test.ts
    └── chat.test.ts
```

### Critical Test Cases

**1. Security Tests** (`security.test.ts`)

```typescript
import { validateVaultPath } from '@/lib/security'

describe('validateVaultPath', () => {
  it('should reject relative paths', () => {
    const error = validateVaultPath('./vault')
    expect(error).toBeTruthy()
  })

  it('should reject path traversal attempts', () => {
    const error = validateVaultPath('/vault', '../etc/passwd')
    expect(error).toBeTruthy()
  })

  it('should reject tilde expansion', () => {
    const error = validateVaultPath('/vault', '~/secrets')
    expect(error).toBeTruthy()
  })

  it('should accept valid paths', () => {
    const error = validateVaultPath('/vault', 'notes/file.md')
    expect(error).toBeNull()
  })
})
```

**2. Context Selection Tests** (`context-selector.test.ts`)

```typescript
import { selectRelevantFiles, extractKeywords } from '@/lib/context-selector'

describe('extractKeywords', () => {
  it('should remove stop words', () => {
    const keywords = extractKeywords('what are the bugs?')
    expect(keywords).toEqual(['bugs'])
  })

  it('should remove short words', () => {
    const keywords = extractKeywords('a bug is here')
    expect(keywords).toEqual(['bug', 'here'])
  })
})

describe('selectRelevantFiles', () => {
  it('should select most relevant files', () => {
    const files = [
      { filename: 'bug-report', preview: 'bug details', /* ... */ },
      { filename: 'feature-request', preview: 'new feature', /* ... */ }
    ]

    const selected = selectRelevantFiles('what bugs exist?', files, 5)
    expect(selected[0].filename).toBe('bug-report')
  })
})
```

**3. API Route Tests** (`vault-scan.test.ts`)

```typescript
import { POST } from '@/app/api/vault/scan/route'
import { NextRequest } from 'next/server'

describe('POST /api/vault/scan', () => {
  it('should reject invalid paths', async () => {
    const req = new NextRequest('http://localhost:3000/api/vault/scan', {
      method: 'POST',
      body: JSON.stringify({ vaultPath: './invalid' })
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('should scan demo vault', async () => {
    const req = new NextRequest('http://localhost:3000/api/vault/scan', {
      method: 'POST',
      body: JSON.stringify({ vaultPath: '/path/to/demo-vault' })
    })

    const res = await POST(req)
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(data.files.length).toBeGreaterThan(0)
  })
})
```

### Integration Tests

**Test Scenarios**:
1. Full vault scan → file read → AI chat flow
2. Large vault handling (1000+ files)
3. Oversized file exclusion
4. Error recovery (permission denied, file not found)
5. Streaming response integrity

### Manual Testing Checklist

- [ ] Demo vault scan works
- [ ] Custom vault scan works
- [ ] File reading respects security
- [ ] AI chat returns relevant answers
- [ ] Streaming responses work
- [ ] Error messages are user-friendly
- [ ] Large files are excluded
- [ ] Path traversal attempts blocked
- [ ] Citations extracted correctly
- [ ] Performance acceptable (<2s scan for demo vault)

---

## Implementation Task Breakdown

### Phase 1: Core Infrastructure (Priority 1)

**Task 1.1: Extract Vault Scanner**
- **File**: `lib/vault-scanner.ts`
- **Subtasks**:
  1. Create async vault scanner function
  2. Add parallel directory processing
  3. Add error handling for problematic files
  4. Add file size validation
  5. Add performance logging
- **Dependencies**: None
- **Testing**: Unit tests for scanner
- **Estimated Time**: 2 hours

**Task 1.2: Create Vault Reader**
- **File**: `lib/vault-reader.ts`
- **Subtasks**:
  1. Implement `readFileContent()` function
  2. Add path validation
  3. Add file size checks
  4. Add error handling
- **Dependencies**: Task 1.1
- **Testing**: Unit tests for reader
- **Estimated Time**: 1 hour

**Task 1.3: Enhance Security Module**
- **File**: `lib/security.ts`
- **Subtasks**:
  1. Add null byte injection check
  2. Add `checkFileSize()` function
  3. Add `sanitizeErrorMessage()` function
  4. Add comprehensive validation
- **Dependencies**: None
- **Testing**: Security unit tests
- **Estimated Time**: 1 hour

**Task 1.4: Create Validation Module**
- **File**: `lib/validation.ts`
- **Subtasks**:
  1. Add `validateChatRequest()`
  2. Add `validateScanRequest()`
  3. Add `validateReadRequest()`
  4. Add input sanitization
- **Dependencies**: None
- **Testing**: Validation unit tests
- **Estimated Time**: 1 hour

**Task 1.5: Create Error Handler**
- **File**: `lib/error-handler.ts`
- **Subtasks**:
  1. Create `errorResponse()` function
  2. Create `handleAPIError()` function
  3. Add structured error logging
  4. Create `tryAPIRoute()` wrapper
- **Dependencies**: None
- **Testing**: Error handling tests
- **Estimated Time**: 1 hour

---

### Phase 2: API Routes (Priority 2)

**Task 2.1: Create Vault Scan Route**
- **File**: `app/api/vault/scan/route.ts`
- **Subtasks**:
  1. Implement POST handler
  2. Add request validation
  3. Add vault path validation
  4. Call async scanner
  5. Return formatted response
  6. Add error handling
- **Dependencies**: Tasks 1.1, 1.3, 1.4, 1.5
- **Testing**: API route tests
- **Estimated Time**: 2 hours

**Task 2.2: Create Vault Read Route**
- **File**: `app/api/vault/read/route.ts`
- **Subtasks**:
  1. Implement GET handler
  2. Parse query parameters
  3. Decode file ID
  4. Validate paths
  5. Read file content
  6. Return response (no absolutePath)
  7. Add error handling
- **Dependencies**: Tasks 1.2, 1.3, 1.4, 1.5
- **Testing**: API route tests
- **Estimated Time**: 1.5 hours

**Task 2.3: Create Vault Validate Route**
- **File**: `app/api/vault/validate/route.ts`
- **Subtasks**:
  1. Implement POST handler
  2. Validate vault path format
  3. Check existence and permissions
  4. Return validation result
- **Dependencies**: Task 1.3
- **Testing**: API route tests
- **Estimated Time**: 1 hour

**Task 2.4: Create Health Check Route**
- **File**: `app/api/health/route.ts`
- **Subtasks**:
  1. Implement GET handler
  2. Check OpenRouter availability
  3. Check filesystem access
  4. Return health status
- **Dependencies**: None
- **Testing**: API route tests
- **Estimated Time**: 0.5 hours

---

### Phase 3: Enhanced Chat API (Priority 3)

**Task 3.1: Create OpenRouter Client Module**
- **File**: `lib/openrouter-client.ts`
- **Subtasks**:
  1. Extract client creation
  2. Add retry logic
  3. Add rate limit handling
  4. Add context formatting
  5. Extract prompt templates
- **Dependencies**: None
- **Testing**: OpenRouter client tests
- **Estimated Time**: 2 hours

**Task 3.2: Enhance Chat Route**
- **File**: `app/api/chat/route.ts` (modify existing)
- **Subtasks**:
  1. Add smart context selection
  2. Exclude oversized files
  3. Limit total context size
  4. Add retry logic
  5. Improve error handling
  6. Add performance logging
- **Dependencies**: Task 3.1, Phase 1 complete
- **Testing**: Chat API tests
- **Estimated Time**: 3 hours

---

### Phase 4: Performance & Polish (Priority 4)

**Task 4.1: Add Performance Monitoring**
- **File**: `lib/performance.ts`
- **Subtasks**:
  1. Create `measureOperation()` function
  2. Add operation timing logs
  3. Add slow operation warnings
- **Dependencies**: None
- **Testing**: Performance tests
- **Estimated Time**: 1 hour

**Task 4.2: Implement Context Truncation**
- **File**: `lib/context-optimizer.ts`
- **Subtasks**:
  1. Create `truncateContext()` function
  2. Implement smart file selection
  3. Add size estimation
- **Dependencies**: None
- **Testing**: Context optimization tests
- **Estimated Time**: 1 hour

**Task 4.3: Add Comprehensive Error Messages**
- **Subtasks**:
  1. Review all error paths
  2. Add themed error messages
  3. Ensure no internal data leaks
  4. Test all error scenarios
- **Dependencies**: Phase 3 complete
- **Testing**: Manual error testing
- **Estimated Time**: 1 hour

---

### Phase 5: Testing & Documentation (Priority 5)

**Task 5.1: Write Unit Tests**
- **Files**: `__tests__/lib/*.test.ts`
- **Subtasks**:
  1. Security tests
  2. Context selector tests
  3. File helper tests
  4. Markdown tests
  5. Validation tests
- **Dependencies**: All lib files complete
- **Testing**: Run test suite
- **Estimated Time**: 4 hours

**Task 5.2: Write API Route Tests**
- **Files**: `__tests__/api/*.test.ts`
- **Subtasks**:
  1. Vault scan tests
  2. Vault read tests
  3. Vault validate tests
  4. Chat API tests
  5. Health check tests
- **Dependencies**: All API routes complete
- **Testing**: Run test suite
- **Estimated Time**: 3 hours

**Task 5.3: Manual Testing**
- **Subtasks**:
  1. Test with demo vault
  2. Test with custom vaults
  3. Test error scenarios
  4. Test edge cases (large files, empty vaults)
  5. Performance testing
- **Dependencies**: All implementation complete
- **Testing**: Manual QA
- **Estimated Time**: 2 hours

**Task 5.4: Update Documentation**
- **Subtasks**:
  1. Document API endpoints
  2. Add code comments
  3. Create usage examples
  4. Update README
- **Dependencies**: All implementation complete
- **Testing**: Review documentation
- **Estimated Time**: 2 hours

---

## Summary

### Total Implementation Estimate
- **Phase 1 (Infrastructure)**: 6 hours
- **Phase 2 (API Routes)**: 5 hours
- **Phase 3 (Enhanced Chat)**: 5 hours
- **Phase 4 (Performance)**: 3 hours
- **Phase 5 (Testing & Docs)**: 11 hours
- **Total**: ~30 hours of development

### Implementation Order
1. ✅ Start with Phase 1 (foundation)
2. ✅ Build Phase 2 (API routes)
3. ✅ Enhance Phase 3 (chat improvements)
4. ✅ Optimize Phase 4 (performance)
5. ✅ Validate Phase 5 (testing)

### Key Success Metrics
- [ ] All API routes return correct responses
- [ ] Security validation prevents path traversal
- [ ] Large files (>1MB) excluded from AI context
- [ ] Streaming responses work smoothly
- [ ] Error messages are user-friendly and themed
- [ ] Vault scan completes in <2s for demo vault
- [ ] AI responses cite correct files
- [ ] No crashes or data leaks
- [ ] Test coverage >80%

### MVP Scope Adherence
✅ **In Scope**:
- Server-side file operations
- OpenRouter streaming
- Efficient vault scanning
- Security validation
- Error handling

❌ **Out of Scope** (per MVP boundaries):
- Database caching
- File system watching
- Vector search
- File editing
- User authentication

---

## Next Steps

**To begin implementation:**

1. **Create lib files first** (Phase 1)
   - `lib/vault-scanner.ts`
   - `lib/vault-reader.ts`
   - Enhanced `lib/security.ts`
   - `lib/validation.ts`
   - `lib/error-handler.ts`

2. **Build API routes** (Phase 2)
   - `app/api/vault/scan/route.ts`
   - `app/api/vault/read/route.ts`
   - `app/api/vault/validate/route.ts`
   - `app/api/health/route.ts`

3. **Enhance existing** (Phase 3)
   - Extract OpenRouter client logic
   - Improve `app/api/chat/route.ts`

4. **Optimize and test** (Phases 4-5)
   - Performance monitoring
   - Comprehensive testing
   - Documentation

**Ready to execute!** 🎃👻

---

**May the spirits guide your implementation! 🪦**
