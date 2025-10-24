# The Headless Horseman's Quest - Business Rules & MVP Logic Specification

**Version:** 1.0
**Last Updated:** 2025-10-24
**Status:** MVP Specification
**Project:** Haunted Information Aggregator for Obsidian Vaults

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [File Processing Rules](#file-processing-rules)
3. [Vault Configuration Logic](#vault-configuration-logic)
4. [Search and Filtering Rules](#search-and-filtering-rules)
5. [AI Chat Logic](#ai-chat-logic)
6. [Data Integrity Rules](#data-integrity-rules)
7. [Demo Vault Requirements](#demo-vault-requirements)
8. [Security Rules](#security-rules)
9. [Performance Limits](#performance-limits)
10. [Error Handling](#error-handling)
11. [MVP Scope Boundaries](#mvp-scope-boundaries)

---

## Executive Summary

The Headless Horseman's Quest is a haunted information aggregator that helps users reunite scattered Markdown files from their Obsidian vault. The MVP focuses on three core features:

1. **Vault Configuration** - Point app at Obsidian vault
2. **Graveyard Dashboard** - View all scattered markdown files
3. **Spirit Medium (AI Chat)** - Ask questions about markdown files

This specification defines comprehensive business rules, validation logic, data processing rules, AI context selection algorithms, security constraints, and MVP scope boundaries.

---

## 1. File Processing Rules

### 1.1 File Type Acceptance

**MVP Scope: Only .md files**

```typescript
// File Extension Rules
ALLOWED_EXTENSIONS = ['.md', '.markdown']
EXCLUDED_FILES = ['README.md']  // Only in vault root

// File Identification
isValidFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase()
  const filename = path.basename(filePath)

  return (
    ALLOWED_EXTENSIONS.includes(ext) &&
    filename !== 'README.md'  // Exclude only root README
  )
}
```

**Business Rules:**
- **BR-FP-001**: Only files with `.md` or `.markdown` extensions are processed
- **BR-FP-002**: Root-level `README.md` is excluded from scans (documentation file)
- **BR-FP-003**: Nested `README.md` files in subdirectories ARE included
- **BR-FP-004**: Hidden files (starting with `.`) are excluded
- **BR-FP-005**: Files in hidden directories (starting with `.`) are excluded
- **BR-FP-006**: Empty files (0 bytes) are included but flagged as empty

### 1.2 File Size Limits

```typescript
// File Size Constants (bytes)
FILE_SIZE_LIMITS = {
  MAX_PREVIEW: 1_000_000,      // 1MB - preview only, no AI context
  MAX_FULL_READ: 10_000_000,   // 10MB - absolute maximum
  WARN_SIZE: 500_000,          // 500KB - log performance warning
  OPTIMAL_SIZE: 100_000        // 100KB - optimal for AI context
}

// File Categorization
categorizeFileSize(size: number): FileSizeCategory {
  if (size === 0) return 'empty'
  if (size > MAX_FULL_READ) return 'too_large'
  if (size > MAX_PREVIEW) return 'oversized'
  if (size > WARN_SIZE) return 'large'
  if (size < OPTIMAL_SIZE) return 'optimal'
  return 'normal'
}
```

**Business Rules:**
- **BR-FP-007**: Files > 10MB are rejected with error message
- **BR-FP-008**: Files > 1MB are marked as `isOversized: true`
- **BR-FP-009**: Oversized files excluded from AI context selection
- **BR-FP-010**: Oversized files show preview only (first 200 chars)
- **BR-FP-011**: Files > 500KB trigger performance warning in logs
- **BR-FP-012**: Empty files (0 bytes) are included but display "Empty file" message

### 1.3 File Metadata Extraction

```typescript
interface MarkdownFile {
  id: string              // base64url(relativePath)
  filename: string        // "bug-report-001.md"
  relativePath: string    // "product-logs/bug-report-001.md"
  size: number           // bytes
  modified: Date         // Last modified timestamp
  created: Date          // File creation timestamp
  preview: string        // First 200 chars (no frontmatter)
  isOversized: boolean   // size > 1MB
  frontmatter?: object   // Parsed YAML frontmatter
}
```

**Business Rules:**
- **BR-FP-013**: File ID is base64url encoding of relative path (URL-safe)
- **BR-FP-014**: `filename` contains only the file name without path
- **BR-FP-015**: `relativePath` is relative to vault root, forward-slash separated
- **BR-FP-016**: Timestamps use filesystem metadata (mtime, birthtime)
- **BR-FP-017**: Preview is first 200 characters of content AFTER frontmatter removal
- **BR-FP-018**: Preview strips markdown formatting (headings, bold, links)
- **BR-FP-019**: Frontmatter is parsed using `gray-matter` library
- **BR-FP-020**: Invalid frontmatter results in empty object, not parse error

### 1.4 Frontmatter Parsing

```typescript
// Frontmatter Format
---
tags: [bug, ui, urgent]
date: 2024-10-20
severity: high
custom_field: value
---

// Parsing Logic
parseFrontmatter(content: string): object {
  try {
    const { data } = matter(content, {
      excerpt: true,
      excerpt_separator: '<!-- more -->'
    })
    return data
  } catch (error) {
    console.error('Frontmatter parsing failed:', error)
    return {}  // Return empty object, never fail
  }
}
```

**Business Rules:**
- **BR-FP-021**: Frontmatter must be valid YAML wrapped in `---` delimiters
- **BR-FP-022**: Frontmatter must be at the very start of file (first line)
- **BR-FP-023**: Invalid frontmatter results in empty object `{}`
- **BR-FP-024**: Tags can be array `[tag1, tag2]` or single value `tag`
- **BR-FP-025**: All frontmatter fields are optional
- **BR-FP-026**: Frontmatter parsing never blocks file processing

### 1.5 Directory Traversal

```typescript
// Recursive Directory Scan
async function scanVaultRecursive(
  vaultPath: string,
  currentPath: string = '',
  files: MarkdownFile[] = []
): Promise<MarkdownFile[]> {
  const entries = await fs.readdir(
    path.join(vaultPath, currentPath),
    { withFileTypes: true }
  )

  for (const entry of entries) {
    // Skip hidden files/dirs
    if (entry.name.startsWith('.')) continue

    const relativePath = path.join(currentPath, entry.name)

    if (entry.isDirectory()) {
      // Recurse into subdirectories
      await scanVaultRecursive(vaultPath, relativePath, files)
    } else if (isValidFile(entry.name)) {
      // Process markdown file
      files.push(await processFile(vaultPath, relativePath))
    }
  }

  return files
}
```

**Business Rules:**
- **BR-FP-027**: Vault scan is recursive (includes all subdirectories)
- **BR-FP-028**: Maximum directory depth: unlimited (follow all subdirs)
- **BR-FP-029**: Symbolic links are followed (potential security consideration)
- **BR-FP-030**: Hidden directories (`.obsidian`, `.git`) are skipped
- **BR-FP-031**: Scan stops on permission denied (logs error, continues)
- **BR-FP-032**: Empty directories are ignored (no placeholder files)

### 1.6 File Content Reading

```typescript
// Server-side only (NEVER expose to client)
interface MarkdownFileContent extends MarkdownFile {
  absolutePath: string    // Full filesystem path
  content: string         // Full markdown content
}

async function readFileContent(
  vaultPath: string,
  relativePath: string
): Promise<MarkdownFileContent> {
  // Validate path security
  const error = validateVaultPath(vaultPath, relativePath)
  if (error) throw new SecurityError(error)

  const absolutePath = path.resolve(vaultPath, relativePath)
  const content = await fs.readFile(absolutePath, 'utf-8')

  // Parse frontmatter
  const { data, content: rawContent } = matter(content)

  return {
    ...metadata,
    absolutePath,  // NEVER send to client
    content: rawContent
  }
}
```

**Business Rules:**
- **BR-FP-033**: File content reading is server-side only (API routes)
- **BR-FP-034**: Absolute paths are NEVER sent to client
- **BR-FP-035**: Content is read as UTF-8 encoding
- **BR-FP-036**: Binary files cause read error (expected behavior)
- **BR-FP-037**: File content includes raw markdown (frontmatter removed)
- **BR-FP-038**: Reading non-existent file returns 404 error
- **BR-FP-039**: Permission denied returns 403 error
- **BR-FP-040**: File read errors are logged with file path

---

## 2. Vault Configuration Logic

### 2.1 Vault Path Validation

```typescript
// Path Validation Rules
function validateVaultPath(
  vaultPath: string,
  relativePath?: string
): string | null {
  // Rule 1: Must be absolute path
  if (!path.isAbsolute(vaultPath)) {
    return 'Invalid vault path (must be absolute)'
  }

  // Rule 2: Resolve to prevent traversal
  const resolvedVault = path.resolve(vaultPath)

  // Rule 3: Check relative path if provided
  if (relativePath) {
    const fullPath = path.resolve(vaultPath, relativePath)

    // Must stay within vault
    if (!fullPath.startsWith(resolvedVault)) {
      return 'Path traversal detected'
    }

    // Reject suspicious patterns
    if (relativePath.includes('..') || relativePath.includes('~')) {
      return 'Path traversal detected'
    }
  }

  return null  // Valid
}
```

**Business Rules:**
- **BR-VC-001**: Vault path must be absolute filesystem path
- **BR-VC-002**: Relative paths are resolved against vault root
- **BR-VC-003**: Path traversal (`..`, `~`) is strictly forbidden
- **BR-VC-004**: All paths are normalized to prevent bypasses
- **BR-VC-005**: Symlinks are followed but validated
- **BR-VC-006**: Windows and Unix paths are both supported
- **BR-VC-007**: Path validation happens before ANY filesystem operation

### 2.2 Vault Existence Checks

```typescript
// Vault Validation Pipeline
async function validateVault(vaultPath: string): Promise<{
  valid: boolean
  error?: string
  stats?: {
    exists: boolean
    isDirectory: boolean
    readable: boolean
    writable: boolean
  }
}> {
  try {
    const stats = await fs.stat(vaultPath)

    if (!stats.isDirectory()) {
      return { valid: false, error: 'Path is not a directory' }
    }

    // Check read permission
    await fs.access(vaultPath, fs.constants.R_OK)

    return {
      valid: true,
      stats: {
        exists: true,
        isDirectory: true,
        readable: true,
        writable: false  // Not needed for MVP
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { valid: false, error: 'Vault does not exist' }
    }
    if (error.code === 'EACCES') {
      return { valid: false, error: 'Permission denied' }
    }
    return { valid: false, error: 'Vault validation failed' }
  }
}
```

**Business Rules:**
- **BR-VC-008**: Vault must exist on filesystem
- **BR-VC-009**: Vault must be a directory (not a file)
- **BR-VC-010**: Vault must be readable by process
- **BR-VC-011**: Write permission is NOT required (read-only)
- **BR-VC-012**: Non-existent vault shows clear error message
- **BR-VC-013**: Permission errors show "locked graveyard" theme message

### 2.3 Vault Path Storage

```typescript
// Client-side Storage (localStorage)
interface VaultConfig {
  path: string           // Absolute vault path
  lastScanned?: Date     // Last successful scan
  fileCount?: number     // Files found in last scan
  isDemoVault: boolean   // Using built-in demo vault
}

// Storage Keys
const STORAGE_KEY = 'headless-horseman-vault-config'

// Save vault config
function saveVaultConfig(config: VaultConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

// Load vault config
function loadVaultConfig(): VaultConfig | null {
  try {
    const json = localStorage.getItem(STORAGE_KEY)
    if (!json) return null

    const config = JSON.parse(json)

    // Deserialize dates
    if (config.lastScanned) {
      config.lastScanned = new Date(config.lastScanned)
    }

    return config
  } catch (error) {
    console.error('Failed to load vault config:', error)
    return null
  }
}
```

**Business Rules:**
- **BR-VC-014**: Vault path stored in browser localStorage
- **BR-VC-015**: Only ONE vault path stored at a time
- **BR-VC-016**: Changing vault path replaces existing config
- **BR-VC-017**: Vault config includes scan metadata
- **BR-VC-018**: Demo vault mode is boolean flag
- **BR-VC-019**: Invalid localStorage data is cleared silently
- **BR-VC-020**: No server-side vault path persistence (stateless)

### 2.4 Demo Vault Mode

```typescript
// Demo Vault Detection
const DEMO_VAULT_PATH = path.join(process.cwd(), 'demo-vault')

function isDemoVault(vaultPath: string): boolean {
  const normalized = path.resolve(vaultPath)
  return normalized === path.resolve(DEMO_VAULT_PATH)
}

// Auto-configuration
function getDefaultVaultPath(): string {
  // Use demo vault if no custom vault configured
  return DEMO_VAULT_PATH
}
```

**Business Rules:**
- **BR-VC-021**: Demo vault is located at `./demo-vault` in project root
- **BR-VC-022**: Demo vault is default if no vault configured
- **BR-VC-023**: Demo vault path is auto-detected (no manual entry)
- **BR-VC-024**: Users can switch between demo and custom vault
- **BR-VC-025**: Demo vault always available (packaged with app)
- **BR-VC-026**: Demo vault contains exactly 15 sample files

### 2.5 Vault Scanning

```typescript
// Scan Vault Endpoint: GET /api/vault/scan?path=...
interface VaultScanResult {
  success: true
  files: MarkdownFile[]
  count: number
  scanTime: number  // milliseconds
}

async function scanVault(vaultPath: string): Promise<VaultScanResult> {
  const startTime = Date.now()

  // Validate vault
  const validation = await validateVault(vaultPath)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Scan recursively
  const files = await scanVaultRecursive(vaultPath)

  // Sort by modification date (newest first)
  files.sort((a, b) => b.modified.getTime() - a.modified.getTime())

  const scanTime = Date.now() - startTime

  return {
    success: true,
    files,
    count: files.length,
    scanTime
  }
}
```

**Business Rules:**
- **BR-VC-027**: Vault scan is manual (user clicks "Scan Vault")
- **BR-VC-028**: No automatic re-scanning on file changes
- **BR-VC-029**: Scan results cached in memory (client-side)
- **BR-VC-030**: Scan time is measured and reported
- **BR-VC-031**: Files sorted by modification date (newest first)
- **BR-VC-032**: Scan errors return clear error messages
- **BR-VC-033**: Empty vaults return zero files (not an error)

---

## 3. Search and Filtering Rules

### 3.1 Search Scope

**MVP: Client-side filtering only**

```typescript
// Search operates on cached file list
interface SearchOptions {
  query?: string          // Keyword search
  folder?: string         // Filter by folder
  tags?: string[]         // Filter by tags
  modifiedAfter?: Date    // Date filter
  maxSize?: number        // Size filter
}

function searchFiles(
  files: MarkdownFile[],
  options: SearchOptions
): MarkdownFile[] {
  let results = [...files]

  // Keyword search (filename, path, preview)
  if (options.query) {
    const keywords = options.query.toLowerCase().split(/\s+/)
    results = results.filter(file => {
      const searchText = `
        ${file.filename}
        ${file.relativePath}
        ${file.preview}
      `.toLowerCase()

      return keywords.every(kw => searchText.includes(kw))
    })
  }

  // Folder filter
  if (options.folder) {
    results = results.filter(file =>
      file.relativePath.startsWith(options.folder!)
    )
  }

  // Tag filter
  if (options.tags && options.tags.length > 0) {
    results = results.filter(file => {
      if (!file.frontmatter?.tags) return false

      const fileTags = Array.isArray(file.frontmatter.tags)
        ? file.frontmatter.tags
        : [file.frontmatter.tags]

      return options.tags!.some(tag =>
        fileTags.some(fileTag =>
          String(fileTag).toLowerCase() === tag.toLowerCase()
        )
      )
    })
  }

  // Date filter
  if (options.modifiedAfter) {
    results = results.filter(file =>
      file.modified.getTime() > options.modifiedAfter!.getTime()
    )
  }

  // Size filter
  if (options.maxSize) {
    results = results.filter(file => file.size <= options.maxSize!)
  }

  return results
}
```

**Business Rules:**
- **BR-SF-001**: Search operates on cached file metadata (no filesystem access)
- **BR-SF-002**: Search is case-insensitive
- **BR-SF-003**: Multiple keywords use AND logic (all must match)
- **BR-SF-004**: Search targets: filename, relative path, preview
- **BR-SF-005**: Folder filter uses prefix matching
- **BR-SF-006**: Tag filter uses exact match (case-insensitive)
- **BR-SF-007**: Multiple filters combine with AND logic
- **BR-SF-008**: Empty search returns all files

### 3.2 Match Types

**Business Rules:**
- **BR-SF-009**: Filename match: Exact substring in filename
- **BR-SF-010**: Path match: Substring in full relative path
- **BR-SF-011**: Content match: Substring in preview (first 200 chars)
- **BR-SF-012**: Tag match: Exact tag value (case-insensitive)
- **BR-SF-013**: No fuzzy matching in MVP
- **BR-SF-014**: No regex support in MVP
- **BR-SF-015**: No full-text search in MVP

### 3.3 Filter Combinations

```typescript
// Example: Complex filter
const results = searchFiles(allFiles, {
  query: 'bug report',       // AND
  folder: 'product-logs',    // AND
  tags: ['urgent', 'ui'],    // OR within tags
  modifiedAfter: new Date('2024-10-01')  // AND
})

// Result: Files that:
// - Contain "bug" AND "report" in filename/path/preview
// - Are in "product-logs" folder
// - Have tag "urgent" OR "ui"
// - Modified after Oct 1, 2024
```

**Business Rules:**
- **BR-SF-016**: Filters combine with AND logic
- **BR-SF-017**: Multiple tags within tag filter use OR logic
- **BR-SF-018**: Multiple keywords within query use AND logic
- **BR-SF-019**: Empty filter returns all files
- **BR-SF-020**: No results shows "No files found" message

### 3.4 Sort Options

```typescript
type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'modified-desc'
  | 'modified-asc'
  | 'size-desc'
  | 'size-asc'

function sortFiles(
  files: MarkdownFile[],
  sortBy: SortOption
): MarkdownFile[] {
  const sorted = [...files]

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) =>
        a.filename.localeCompare(b.filename)
      )
    case 'name-desc':
      return sorted.sort((a, b) =>
        b.filename.localeCompare(a.filename)
      )
    case 'modified-desc':
      return sorted.sort((a, b) =>
        b.modified.getTime() - a.modified.getTime()
      )
    case 'modified-asc':
      return sorted.sort((a, b) =>
        a.modified.getTime() - b.modified.getTime()
      )
    case 'size-desc':
      return sorted.sort((a, b) => b.size - a.size)
    case 'size-asc':
      return sorted.sort((a, b) => a.size - b.size)
  }
}
```

**Business Rules:**
- **BR-SF-021**: Default sort: modified date descending (newest first)
- **BR-SF-022**: Sort is client-side (instant)
- **BR-SF-023**: Name sort uses locale-aware comparison
- **BR-SF-024**: Modified sort uses timestamp comparison
- **BR-SF-025**: Size sort uses byte comparison
- **BR-SF-026**: Sort is stable (maintains relative order)

---

## 4. AI Chat Logic

### 4.1 Context Selection Algorithm

**Maximum: 5 files per query (MVP scope)**

```typescript
/**
 * Smart File Selection Algorithm
 *
 * Scoring System:
 * - Filename match: 3 points per keyword
 * - Path match: 2 points per keyword
 * - Preview match: 1 point per keyword
 * - Tag match: 2 points per keyword
 * - Recently modified (<7 days): +1 bonus point
 *
 * Selection:
 * 1. Extract keywords from query
 * 2. Score all files
 * 3. Sort by score descending
 * 4. Take top 5 files with score > 0
 * 5. If no matches, take 5 most recent files
 */

interface ScoredFile {
  file: MarkdownFile
  score: number
}

function selectFilesForAI(
  query: string,
  allFiles: MarkdownFile[],
  maxFiles: number = 5
): MarkdownFile[] {
  // Extract keywords
  const keywords = extractKeywords(query)

  // No keywords? Return recent files
  if (keywords.length === 0) {
    return allFiles
      .sort((a, b) => b.modified.getTime() - a.modified.getTime())
      .slice(0, maxFiles)
  }

  // Score all files
  const scored: ScoredFile[] = allFiles.map(file => ({
    file,
    score: scoreFileRelevance(file, keywords)
  }))

  // Filter, sort, and take top N
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxFiles)
    .map(item => item.file)
}

// Keyword Extraction
function extractKeywords(query: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at',
    'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is',
    'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'should', 'could',
    'can', 'may', 'might', 'must', 'what', 'which', 'who',
    'when', 'where', 'why', 'how', 'this', 'that', 'these', 'those'
  ])

  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
}

// File Scoring
function scoreFileRelevance(
  file: MarkdownFile,
  keywords: string[]
): number {
  let score = 0

  const filenameLower = file.filename.toLowerCase()
  const pathLower = file.relativePath.toLowerCase()
  const previewLower = file.preview.toLowerCase()

  // Filename matches (3 points each)
  keywords.forEach(kw => {
    if (filenameLower.includes(kw)) score += 3
  })

  // Path matches (2 points each)
  keywords.forEach(kw => {
    if (pathLower.includes(kw)) score += 2
  })

  // Preview matches (1 point each)
  keywords.forEach(kw => {
    if (previewLower.includes(kw)) score += 1
  })

  // Tag matches (2 points each)
  if (file.frontmatter?.tags) {
    const tags = Array.isArray(file.frontmatter.tags)
      ? file.frontmatter.tags
      : [file.frontmatter.tags]

    tags.forEach(tag => {
      const tagLower = String(tag).toLowerCase()
      keywords.forEach(kw => {
        if (tagLower.includes(kw)) score += 2
      })
    })
  }

  // Recency bonus (<7 days)
  const daysSince = (Date.now() - file.modified.getTime()) / 86400000
  if (daysSince < 7) score += 1

  return score
}
```

**Business Rules:**
- **BR-AI-001**: Maximum 5 files sent to AI per query
- **BR-AI-002**: Files selected by relevance score
- **BR-AI-003**: Filename matches weighted highest (3 points)
- **BR-AI-004**: Path matches weighted medium (2 points)
- **BR-AI-005**: Preview matches weighted lowest (1 point)
- **BR-AI-006**: Tag matches weighted medium (2 points)
- **BR-AI-007**: Recent files get +1 bonus point
- **BR-AI-008**: Stop words filtered from keywords
- **BR-AI-009**: Minimum keyword length: 3 characters
- **BR-AI-010**: Zero-score files excluded
- **BR-AI-011**: If no matches, use 5 most recent files
- **BR-AI-012**: Oversized files (>1MB) excluded from selection

### 4.2 Context Formatting

```typescript
// Format files for AI prompt
function formatContextForAI(files: MarkdownFile[]): string {
  return files.map(file => `
## File: ${file.relativePath}
**Modified:** ${file.modified.toISOString()}
**Tags:** ${file.frontmatter?.tags?.join(', ') || 'none'}

${file.content}

---
  `.trim()).join('\n\n')
}

// Full AI prompt structure
const systemPrompt = `You are the Headless Horseman's loyal spirit guide, helping mortals reunite scattered information across their Obsidian vault.

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

const userPrompt = `Here are the relevant markdown files from the vault:

${formatContextForAI(selectedFiles)}

User question: ${query}

Please answer the user's question based on the markdown files above. When referencing information, cite the specific file(s) you're pulling from. Be conversational and helpful, and maintain the spooky theme. If you can't find relevant information, say so honestly.`
```

**Business Rules:**
- **BR-AI-013**: System prompt defines AI personality and behavior
- **BR-AI-014**: Each file formatted with header, metadata, content
- **BR-AI-015**: Files separated by `---` delimiter
- **BR-AI-016**: File metadata includes path, modified date, tags
- **BR-AI-017**: Full file content included (not just preview)
- **BR-AI-018**: Files presented in relevance order (highest first)
- **BR-AI-019**: User query appended at end of prompt
- **BR-AI-020**: AI instructed to cite specific files

### 4.3 AI Model Configuration

```typescript
// OpenRouter Configuration
const AI_CONFIG = {
  provider: 'openrouter.ai',
  model: 'anthropic/claude-3.5-sonnet',
  maxTokens: 2000,
  temperature: 0.7,
  streaming: true,
  headers: {
    'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
    'X-Title': 'The Headless Horseman\'s Quest'
  }
}

// API Call
async function callAI(prompt: string): AsyncIterable<string> {
  const response = await openai.chat.completions.create({
    model: AI_CONFIG.model,
    max_tokens: AI_CONFIG.maxTokens,
    temperature: AI_CONFIG.temperature,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ]
  })

  // Yield streaming chunks
  for await (const chunk of response) {
    const text = chunk.choices[0]?.delta?.content || ''
    if (text) yield text
  }
}
```

**Business Rules:**
- **BR-AI-021**: AI provider: OpenRouter (openrouter.ai)
- **BR-AI-022**: Model: Claude 3.5 Sonnet (Anthropic)
- **BR-AI-023**: Max tokens: 2000 (controls response length)
- **BR-AI-024**: Temperature: 0.7 (balanced creativity/accuracy)
- **BR-AI-025**: Streaming: Enabled (real-time response)
- **BR-AI-026**: HTTP Referer required (OpenRouter requirement)
- **BR-AI-027**: API key from environment variable
- **BR-AI-028**: No caching of AI responses in MVP

### 4.4 Citation Extraction

```typescript
// Extract file citations from AI response
function extractCitations(response: string): string[] {
  const citations = new Set<string>()

  // Pattern 1: "in bug-report-001.md"
  const pattern1 = /in [\w-]+\.md/gi

  // Pattern 2: "according to product-logs/sprint.md"
  const pattern2 = /[\w-/]+\.md/gi

  // Extract all matches
  const matches = [
    ...response.matchAll(pattern1),
    ...response.matchAll(pattern2)
  ]

  matches.forEach(match => {
    const citation = match[0]
      .replace(/^in\s+/i, '')
      .replace(/^according to\s+/i, '')
      .trim()
    citations.add(citation)
  })

  return Array.from(citations)
}

// Match citations to actual files
function matchCitations(
  citations: string[],
  files: MarkdownFile[]
): Array<{ filename: string; relativePath: string }> {
  return citations
    .map(citation => {
      // Try exact filename match
      let file = files.find(f =>
        f.filename === citation ||
        f.relativePath === citation
      )

      // Try partial match
      if (!file) {
        file = files.find(f =>
          f.filename.includes(citation) ||
          f.relativePath.includes(citation)
        )
      }

      return file ? {
        filename: file.filename,
        relativePath: file.relativePath
      } : null
    })
    .filter(Boolean) as Array<{ filename: string; relativePath: string }>
}
```

**Business Rules:**
- **BR-AI-029**: Citations auto-extracted from AI response
- **BR-AI-030**: Citation patterns: "in file.md", "path/file.md"
- **BR-AI-031**: Citations matched to actual files
- **BR-AI-032**: Unmatched citations are ignored
- **BR-AI-033**: Citations displayed under response
- **BR-AI-034**: Clicking citation opens file modal

### 4.5 Streaming Response

```typescript
// Chat API: POST /api/chat
export async function POST(req: NextRequest) {
  const { message, vaultPath, allFiles } = await req.json()

  // Select relevant files
  const selectedFiles = selectFilesForAI(message, allFiles, 5)

  // Read full content for selected files
  const filesWithContent = await Promise.all(
    selectedFiles.map(file =>
      readFileContent(vaultPath, file.relativePath)
    )
  )

  // Format context
  const context = formatContextForAI(filesWithContent)

  // Stream AI response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of callAI(context)) {
          controller.enqueue(encoder.encode(chunk))
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked'
    }
  })
}
```

**Business Rules:**
- **BR-AI-035**: Responses stream in real-time (not waiting for completion)
- **BR-AI-036**: Client displays chunks as they arrive
- **BR-AI-037**: Streaming errors close stream gracefully
- **BR-AI-038**: No timeout on AI responses (wait indefinitely)
- **BR-AI-039**: User can't send new message until response complete
- **BR-AI-040**: Stream errors show "spirits are silent" message

---

## 5. Data Integrity Rules

### 5.1 Read-Only Operations

**Business Rules:**
- **BR-DI-001**: Application is READ-ONLY (no file modifications)
- **BR-DI-002**: No file creation, deletion, or updates
- **BR-DI-003**: No vault structure changes
- **BR-DI-004**: No frontmatter editing
- **BR-DI-005**: Original files remain untouched
- **BR-DI-006**: File permissions: read-only required, write not needed

### 5.2 No Database Storage

**Business Rules:**
- **BR-DI-007**: No Supabase database used in MVP
- **BR-DI-008**: No file metadata persistence
- **BR-DI-009**: No scan history storage
- **BR-DI-010**: All data ephemeral (memory/localStorage only)
- **BR-DI-011**: Vault path in localStorage (client-only)
- **BR-DI-012**: No user accounts or authentication

### 5.3 Data Flow

```typescript
// Data Flow Architecture
┌─────────────┐
│  Filesystem │ (Source of Truth)
└──────┬──────┘
       │ Scan
       ▼
┌─────────────┐
│  API Route  │ (Server-side)
│  /api/scan  │
└──────┬──────┘
       │ Metadata only (no absolutePath)
       ▼
┌─────────────┐
│   Client    │ (React State)
│  useState   │
└──────┬──────┘
       │ Cache
       ▼
┌─────────────┐
│ localStorage│ (Vault path only)
└─────────────┘
```

**Business Rules:**
- **BR-DI-013**: Filesystem is single source of truth
- **BR-DI-014**: Server reads files on-demand
- **BR-DI-015**: Client caches metadata in memory
- **BR-DI-016**: localStorage stores vault path only
- **BR-DI-017**: No server-side state persistence
- **BR-DI-018**: Each page load starts fresh

### 5.4 Cache Invalidation

**Business Rules:**
- **BR-DI-019**: Cache invalidated on manual rescan
- **BR-DI-020**: No automatic cache refresh
- **BR-DI-021**: Page refresh clears file cache
- **BR-DI-022**: Vault path persists across sessions
- **BR-DI-023**: Changing vault path clears cache

---

## 6. Demo Vault Requirements

### 6.1 Structure Requirements

```
demo-vault/
├── README.md              (excluded from scans)
├── product-logs/          (5 files)
│   ├── bug-report-haunted-ui.md
│   ├── bug-report-mobile-crashes.md
│   ├── feature-request-dark-mode.md
│   ├── sprint-retrospective-oct.md
│   └── performance-issues-log.md
├── feedback/              (5 files)
│   ├── user-complaints-sept.md
│   ├── user-complaints-oct.md
│   ├── praise-and-kudos.md
│   ├── survey-results-q3.md
│   └── support-tickets-summary.md
└── random-notes/          (5 files)
    ├── scattered-midnight-thoughts.md
    ├── todo-list-from-hell.md
    ├── random-product-ideas.md
    ├── meeting-notes-rambling.md
    └── inspiration-graveyard.md
```

**Business Rules:**
- **BR-DV-001**: Demo vault contains exactly 15 markdown files
- **BR-DV-002**: Files organized in 3 folders (5 files each)
- **BR-DV-003**: Folder names: product-logs, feedback, random-notes
- **BR-DV-004**: All files have spooky but professional names
- **BR-DV-005**: README.md in root (excluded from scans)

### 6.2 Content Requirements

**Business Rules:**
- **BR-DV-006**: Every file has valid YAML frontmatter
- **BR-DV-007**: Frontmatter includes: tags, date, optional severity
- **BR-DV-008**: Content is realistic product development scenarios
- **BR-DV-009**: Files reference each other (interconnected)
- **BR-DV-010**: Spooky theme throughout (emojis, metaphors)
- **BR-DV-011**: Content length: 100-500 words per file
- **BR-DV-012**: Mix of technical and casual writing

### 6.3 Frontmatter Standards

```yaml
---
tags: [bug, ui, urgent]
date: 2024-10-20
severity: high
---
```

**Business Rules:**
- **BR-DV-013**: Tags as array: `[tag1, tag2, tag3]`
- **BR-DV-014**: Date in ISO format: `YYYY-MM-DD`
- **BR-DV-015**: Severity values: low, medium, high, critical
- **BR-DV-016**: Optional fields: assignee, status, category

### 6.4 File Interconnections

**Business Rules:**
- **BR-DV-017**: Bug reports reference user complaints
- **BR-DV-018**: Sprint retrospective mentions bug files
- **BR-DV-019**: Meeting notes reference survey results
- **BR-DV-020**: Support tickets link to bug reports
- **BR-DV-021**: Cross-references use relative paths

### 6.5 Test Queries

Demo vault supports these AI queries:

```typescript
const TEST_QUERIES = [
  "What bugs are mentioned in product logs?",
  "Summarize the user feedback",
  "What features are users requesting?",
  "What did the sprint retrospective say about bugs?",
  "What are the biggest problems right now?",
  "Show me recent complaints",
  "What's in the random thoughts?",
  "Find all urgent issues"
]
```

**Business Rules:**
- **BR-DV-022**: All test queries return relevant results
- **BR-DV-023**: Queries cover different folders
- **BR-DV-024**: Queries test keyword matching
- **BR-DV-025**: Queries test tag filtering
- **BR-DV-026**: Queries demonstrate AI connections

---

## 7. Security Rules

### 7.1 Path Sanitization

```typescript
// Security Validation Pipeline
function sanitizeAndValidatePath(
  vaultPath: string,
  relativePath?: string
): { valid: boolean; error?: string } {
  // 1. Check absolute path
  if (!path.isAbsolute(vaultPath)) {
    return { valid: false, error: 'Path must be absolute' }
  }

  // 2. Resolve path (prevents traversal)
  const resolved = path.resolve(vaultPath)

  // 3. Check for suspicious patterns
  if (relativePath) {
    if (relativePath.includes('..')) {
      return { valid: false, error: 'Path traversal detected' }
    }
    if (relativePath.includes('~')) {
      return { valid: false, error: 'Home directory access forbidden' }
    }
    if (relativePath.includes('\0')) {
      return { valid: false, error: 'Null byte injection detected' }
    }

    // 4. Verify relative path stays within vault
    const fullPath = path.resolve(vaultPath, relativePath)
    if (!fullPath.startsWith(resolved)) {
      return { valid: false, error: 'Path escapes vault boundary' }
    }
  }

  return { valid: true }
}
```

**Business Rules:**
- **BR-SEC-001**: All paths validated before filesystem access
- **BR-SEC-002**: Path traversal (`..`, `~`) strictly forbidden
- **BR-SEC-003**: Null byte injection (`\0`) blocked
- **BR-SEC-004**: Relative paths must stay within vault
- **BR-SEC-005**: Absolute paths resolved to canonical form
- **BR-SEC-006**: Symlinks followed but validated

### 7.2 Server-Side Only Operations

**Business Rules:**
- **BR-SEC-007**: File reading is server-side only (API routes)
- **BR-SEC-008**: Absolute paths NEVER sent to client
- **BR-SEC-009**: Client receives only metadata + content
- **BR-SEC-010**: Vault path validated on every API call
- **BR-SEC-011**: No client-side filesystem access
- **BR-SEC-012**: API routes reject invalid requests

### 7.3 Environment Variables

```typescript
// Required Environment Variables
OPENROUTER_API_KEY=sk-...     // Required for AI
SITE_URL=http://localhost:3000  // Optional (for OpenRouter)

// Validation
function validateEnv(): void {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY required')
  }
}
```

**Business Rules:**
- **BR-SEC-013**: API keys stored in environment variables
- **BR-SEC-014**: No hardcoded secrets in code
- **BR-SEC-015**: `.env.local` excluded from git
- **BR-SEC-016**: Environment validated on startup
- **BR-SEC-017**: Missing API key prevents AI features

### 7.4 Input Validation

```typescript
// Chat API Input Validation
interface ChatRequest {
  message: string      // User query
  vaultPath: string    // Vault location
  allFiles: MarkdownFile[]  // File metadata
}

function validateChatRequest(req: ChatRequest): string | null {
  // Validate message
  if (!req.message || typeof req.message !== 'string') {
    return 'Message is required'
  }
  if (req.message.length > 1000) {
    return 'Message too long (max 1000 chars)'
  }

  // Validate vault path
  if (!req.vaultPath || typeof req.vaultPath !== 'string') {
    return 'Vault path is required'
  }

  // Validate files
  if (!Array.isArray(req.allFiles)) {
    return 'Files must be an array'
  }

  return null  // Valid
}
```

**Business Rules:**
- **BR-SEC-018**: All API inputs validated
- **BR-SEC-019**: Query length limited to 1000 characters
- **BR-SEC-020**: Type checking on all inputs
- **BR-SEC-021**: Invalid requests return 400 Bad Request
- **BR-SEC-022**: Validation errors have clear messages

### 7.5 Error Information Disclosure

**Business Rules:**
- **BR-SEC-023**: Internal errors show generic message
- **BR-SEC-024**: Filesystem errors logged server-side
- **BR-SEC-025**: Client sees themed error messages
- **BR-SEC-026**: No stack traces sent to client
- **BR-SEC-027**: Development vs production error modes

---

## 8. Performance Limits

### 8.1 File Size Constraints

```typescript
// Performance Limits
const LIMITS = {
  MAX_FILE_SIZE: 10_000_000,        // 10MB - reject
  MAX_FILE_FOR_AI: 1_000_000,       // 1MB - exclude from AI
  MAX_FILES_PER_QUERY: 5,           // AI context limit
  MAX_TOTAL_CONTEXT: 50_000,        // ~50KB total context
  MAX_QUERY_LENGTH: 1000,           // User query chars
  MAX_VAULT_FILES: 10_000,          // Total files in vault
  MAX_SCAN_TIME: 30_000,            // 30 seconds timeout
  MAX_AI_TOKENS: 2000,              // Response length
  OPTIMAL_FILE_SIZE: 100_000        // 100KB - ideal
}
```

**Business Rules:**
- **BR-PERF-001**: Files > 10MB rejected (too large)
- **BR-PERF-002**: Files > 1MB excluded from AI context
- **BR-PERF-003**: Maximum 5 files sent to AI per query
- **BR-PERF-004**: Total AI context capped at ~50KB
- **BR-PERF-005**: User queries limited to 1000 characters
- **BR-PERF-006**: Vaults with > 10,000 files show warning
- **BR-PERF-007**: Vault scan timeout: 30 seconds
- **BR-PERF-008**: AI response max: 2000 tokens

### 8.2 Context Window Management

```typescript
// Estimate context size
function estimateContextSize(files: MarkdownFile[]): number {
  return files.reduce((total, file) => {
    return total +
      file.filename.length +
      file.relativePath.length +
      (file.content?.length || 0)
  }, 0)
}

// Smart truncation if needed
function truncateForContext(
  files: MarkdownFile[],
  maxSize: number
): MarkdownFile[] {
  let currentSize = 0
  const result: MarkdownFile[] = []

  for (const file of files) {
    const fileSize = estimateContextSize([file])
    if (currentSize + fileSize > maxSize) {
      break  // Stop adding files
    }
    result.push(file)
    currentSize += fileSize
  }

  return result
}
```

**Business Rules:**
- **BR-PERF-009**: Context size estimated before sending to AI
- **BR-PERF-010**: If context too large, fewer files included
- **BR-PERF-011**: File selection prioritizes relevance
- **BR-PERF-012**: Very large files can exclude other files

### 8.3 Concurrent Requests

**Business Rules:**
- **BR-PERF-013**: One AI query at a time per user
- **BR-PERF-014**: Multiple vault scans allowed concurrently
- **BR-PERF-015**: File reads are parallelized (Promise.all)
- **BR-PERF-016**: No rate limiting in MVP
- **BR-PERF-017**: OpenRouter handles rate limits
- **BR-PERF-018**: Failed requests can be retried

### 8.4 Memory Management

**Business Rules:**
- **BR-PERF-019**: File list cached in React state
- **BR-PERF-020**: File content NOT cached (read on-demand)
- **BR-PERF-021**: Large vaults may cause memory pressure
- **BR-PERF-022**: No memory limits enforced in MVP
- **BR-PERF-023**: Browser memory warnings not handled

---

## 9. Error Handling

### 9.1 Error Codes

```typescript
enum ErrorCode {
  INVALID_PATH = 'INVALID_PATH',
  PATH_TRAVERSAL = 'PATH_TRAVERSAL',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  API_KEY_MISSING = 'API_KEY_MISSING',
  RATE_LIMIT = 'RATE_LIMIT',
  AI_ERROR = 'AI_ERROR',
  UNKNOWN = 'UNKNOWN'
}

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_PATH]: 'Invalid vault path 🪦',
  [ErrorCode.PATH_TRAVERSAL]: 'Path traversal detected! The spirits are watching... 👻',
  [ErrorCode.FILE_NOT_FOUND]: 'This ghost has vanished 👻',
  [ErrorCode.PERMISSION_DENIED]: 'The graveyard gates are locked 🔒',
  [ErrorCode.FILE_TOO_LARGE]: 'This spirit is too heavy to summon 💀',
  [ErrorCode.API_KEY_MISSING]: 'The spirits require an API key... 🔮',
  [ErrorCode.RATE_LIMIT]: 'The spirits are overwhelmed... try again soon 👻',
  [ErrorCode.AI_ERROR]: 'The spirits are silent... 👻',
  [ErrorCode.UNKNOWN]: 'A mysterious error occurred in the graveyard 🪦'
}
```

**Business Rules:**
- **BR-ERR-001**: All errors have structured error codes
- **BR-ERR-002**: Error messages maintain spooky theme
- **BR-ERR-003**: Errors include HTTP status codes
- **BR-ERR-004**: Client displays themed error messages
- **BR-ERR-005**: Errors logged server-side with details

### 9.2 Error Response Format

```typescript
interface APIError {
  success: false
  error: string          // User-friendly message
  statusCode?: number    // HTTP status
  code?: ErrorCode       // Machine-readable code
}

// Example responses
{
  success: false,
  error: "Invalid vault path 🪦",
  statusCode: 400,
  code: "INVALID_PATH"
}

{
  success: false,
  error: "The spirits are silent... 👻",
  statusCode: 500,
  code: "AI_ERROR"
}
```

**Business Rules:**
- **BR-ERR-006**: All API errors use consistent format
- **BR-ERR-007**: `success: false` indicates error
- **BR-ERR-008**: Error message is user-friendly
- **BR-ERR-009**: Status code matches HTTP response
- **BR-ERR-010**: Error code enables programmatic handling

### 9.3 Error Recovery

**Business Rules:**
- **BR-ERR-011**: Failed vault scans show error + retry button
- **BR-ERR-012**: AI errors offer retry option
- **BR-ERR-013**: Permission errors suggest troubleshooting
- **BR-ERR-014**: Network errors auto-retry (3 attempts)
- **BR-ERR-015**: Partial failures show what succeeded
- **BR-ERR-016**: Error state doesn't block other features

### 9.4 Logging

```typescript
// Server-side logging
console.error('👻 [ERROR]', {
  code: ErrorCode.FILE_NOT_FOUND,
  path: sanitizedPath,  // Never log sensitive data
  message: error.message,
  timestamp: new Date().toISOString()
})

// Client-side logging
console.error('🎃 [CLIENT ERROR]', {
  component: 'ChatInterface',
  error: error.message,
  timestamp: Date.now()
})
```

**Business Rules:**
- **BR-ERR-017**: All errors logged server-side
- **BR-ERR-018**: Critical errors logged client-side
- **BR-ERR-019**: Sensitive data excluded from logs
- **BR-ERR-020**: Logs include timestamps
- **BR-ERR-021**: Themed emojis in logs (👻, 🎃, 🪦)

---

## 10. MVP Scope Boundaries

### 10.1 In-Scope Features

**Included in MVP:**
- ✅ Vault configuration (point to Obsidian vault)
- ✅ Recursive markdown file scanning
- ✅ File metadata display (name, size, date, preview)
- ✅ Frontmatter parsing (tags, dates)
- ✅ Manual vault rescanning
- ✅ Client-side keyword search
- ✅ Client-side filtering (folder, tags, date)
- ✅ File content viewing (modal)
- ✅ AI chat with context selection
- ✅ Smart file selection (5 files max)
- ✅ AI streaming responses
- ✅ Citation extraction
- ✅ Demo vault with 15 sample files
- ✅ Dark spooky theme
- ✅ localStorage vault path persistence
- ✅ Read-only operations
- ✅ Error handling with themed messages

### 10.2 Out-of-Scope (Future Enhancements)

**NOT included in MVP:**
- ❌ File editing or modification
- ❌ Vector search / semantic search
- ❌ File system watch (auto-refresh)
- ❌ Full-text content search
- ❌ Regex search patterns
- ❌ Fuzzy filename matching
- ❌ File upload to server
- ❌ Database caching (Supabase)
- ❌ User authentication
- ❌ Multi-user support
- ❌ Vault history tracking
- ❌ File change detection
- ❌ Markdown rendering in list view
- ❌ Graph view of connections
- ❌ Advanced AI features (summarization, chat history)
- ❌ Export functionality
- ❌ Mobile app
- ❌ Browser extension
- ❌ Obsidian plugin

### 10.3 Technical Limitations

**Known MVP Limitations:**
- **Limitation 1**: No auto-refresh (manual rescan required)
- **Limitation 2**: Client-side search only (no server-side indexing)
- **Limitation 3**: Simple keyword matching (no semantic search)
- **Limitation 4**: 5-file AI context limit
- **Limitation 5**: No file edit history
- **Limitation 6**: No collaborative features
- **Limitation 7**: No offline mode
- **Limitation 8**: Desktop/browser only (no mobile optimization)
- **Limitation 9**: Single vault at a time
- **Limitation 10**: No export/backup features

### 10.4 Acceptable Trade-offs

**MVP Accepts These Trade-offs:**
- **Trade-off 1**: Manual rescan vs automatic file watching
- **Trade-off 2**: Simple keyword search vs semantic/vector search
- **Trade-off 3**: 5-file AI limit vs unlimited context
- **Trade-off 4**: Memory caching vs database persistence
- **Trade-off 5**: Single vault vs multiple vault management
- **Trade-off 6**: Read-only vs full Obsidian integration
- **Trade-off 7**: localStorage only vs cloud sync
- **Trade-off 8**: No mobile vs full responsive design

### 10.5 Success Criteria

**MVP is successful if:**
1. ✅ User can point app at Obsidian vault
2. ✅ User can see all scattered markdown files in one view
3. ✅ User can search and filter files by keyword/folder/tags
4. ✅ User can view full file content in modal
5. ✅ User can ask AI questions about files
6. ✅ AI correctly selects relevant files (5 max)
7. ✅ AI provides helpful answers with citations
8. ✅ Demo vault works out-of-box for testing
9. ✅ UI maintains spooky theme throughout
10. ✅ No crashes or data corruption

**The ultimate test:**
> "Can the Headless Horseman finally find his scattered thoughts across his markdown graveyard?"

**Answer:** YES! ✅

---

## Appendix A: File Size Reference

```typescript
// File Size Categories
1 KB   = 1,024 bytes         // Small note
10 KB  = 10,240 bytes        // Typical markdown file
100 KB = 102,400 bytes       // Optimal for AI context
500 KB = 512,000 bytes       // Performance warning
1 MB   = 1,048,576 bytes     // Oversized (no AI)
10 MB  = 10,485,760 bytes    // Maximum allowed
```

---

## Appendix B: AI Token Estimation

```typescript
// Token Estimates (rough)
1 token ≈ 4 characters
1 token ≈ 0.75 words

// Context Budget
Max tokens: 200,000 (Claude 3.5 Sonnet)
Reserved for response: 2,000 tokens
Available for input: ~198,000 tokens

// Context Size Limits
5 files × 10KB each = 50KB ≈ 12,500 tokens
System prompt ≈ 300 tokens
User query ≈ 50-100 tokens
Total ≈ 13,000 tokens (safe margin)
```

---

## Appendix C: Demo Vault Test Matrix

| Test Query | Expected Files | Expected Tags | Expected Folders |
|-----------|---------------|---------------|------------------|
| "bugs" | 3-5 | bug, ui, urgent | product-logs |
| "user complaints" | 2-3 | feedback | feedback |
| "features" | 2-4 | feature, request | product-logs |
| "sprint" | 1 | retrospective | product-logs |
| "midnight thoughts" | 1 | random | random-notes |
| "performance" | 1-2 | performance, bug | product-logs |

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-24 | Initial MVP specification | AI Assistant |

---

**End of Specification**

**May your scattered markdown files find their way home! 👻🎃🪦**
