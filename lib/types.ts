/**
 * Markdown file metadata (sent to client)
 */
export interface MarkdownFile {
  id: string;              // base64(relativePath)
  filename: string;        // "bug-report-001.md"
  relativePath: string;    // "product-logs/bug-report-001.md"
  size: number;           // bytes
  modified: Date;
  created: Date;
  preview: string;        // First 200 chars (no frontmatter)
  isOversized: boolean;   // > 1MB
  frontmatter?: Record<string, any>;  // Parsed YAML
}

/**
 * Full file content (server-side)
 */
export interface MarkdownFileContent extends MarkdownFile {
  absolutePath: string;   // Never send to client!
  content: string;        // Full markdown content
}

/**
 * AI context for query
 */
export interface AIContext {
  query: string;
  files: MarkdownFile[];
  context: string;        // Formatted file contents
}

/**
 * AI response
 */
export interface AIResponse {
  message: string;
  citations: {
    filename: string;
    relativePath: string;
  }[];
  confidence: number;     // 0-1
  tokensUsed: number;
}

/**
 * API error response
 */
export interface APIError {
  success: false;
  error: string;
  statusCode?: number;
}

/**
 * Vault scan result
 */
export interface VaultScanResult {
  success: true;
  files: MarkdownFile[];
  count: number;
  scanTime: number;       // milliseconds
}

/**
 * File read result
 */
export interface FileReadResult {
  success: true;
  file: MarkdownFileContent;
}

/**
 * Chat result
 */
export interface ChatResult {
  success: true;
  response: AIResponse;
}

/**
 * GET /api/vault/scan
 */
export type ScanVaultRequest = {
  path: string;  // Query param
};

export type ScanVaultResponse = VaultScanResult | APIError;

/**
 * GET /api/vault/read
 */
export type ReadFileRequest = {
  id: string;           // Query param
  vaultPath: string;    // Query param
};

export type ReadFileResponse = FileReadResult | APIError;

/**
 * POST /api/chat
 */
export type ChatRequest = {
  query: string;
  vaultPath: string;
  fileIds?: string[];
  allFiles: MarkdownFile[];
};

export type ChatResponse = ChatResult | APIError;

/**
 * Error codes
 */
export enum ErrorCode {
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

/**
 * Structured error
 */
export interface StructuredError {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: any;
}

/**
 * Error messages
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_PATH]: 'Invalid vault path 🪦',
  [ErrorCode.PATH_TRAVERSAL]: 'Path traversal detected! The spirits are watching... 👻',
  [ErrorCode.FILE_NOT_FOUND]: 'This ghost has vanished 👻',
  [ErrorCode.PERMISSION_DENIED]: 'The graveyard gates are locked 🔒',
  [ErrorCode.FILE_TOO_LARGE]: 'This spirit is too heavy to summon 💀',
  [ErrorCode.API_KEY_MISSING]: 'The spirits require an API key... 🔮',
  [ErrorCode.RATE_LIMIT]: 'The spirits are overwhelmed... try again soon 👻',
  [ErrorCode.AI_ERROR]: 'The spirits are silent... 👻',
  [ErrorCode.UNKNOWN]: 'A mysterious error occurred in the graveyard 🪦'
};
