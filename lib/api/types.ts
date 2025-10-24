/**
 * API Types for The Headless Horseman's Quest
 * Type-safe contracts between frontend and backend
 */

// ============================================================================
// Core Data Models
// ============================================================================

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

export interface MarkdownFileContent extends MarkdownFile {
  content: string;        // Full markdown content
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: MarkdownFile[];
  timestamp: Date;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

// Vault Scan
export interface ScanVaultRequest {
  path: string;
}

export interface ScanVaultResponse {
  success: boolean;
  files?: MarkdownFile[];
  count?: number;
  scanTime?: number;
  cached?: boolean;
  error?: string;
}

// File Read
export interface ReadFileRequest {
  id: string;
  vaultPath: string;
}

export interface ReadFileResponse {
  success: boolean;
  file?: MarkdownFileContent;
  error?: string;
}

// Chat
export interface ChatRequest {
  query: string;
  vaultPath: string;
  fileIds?: string[];
  allFiles: MarkdownFile[];
}

export interface AIResponse {
  message: string;
  citations: {
    filename: string;
    relativePath: string;
  }[];
  confidence: number;
  tokensUsed: number;
}

export interface ChatResponse {
  success: boolean;
  response?: AIResponse;
  error?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export enum ErrorCode {
  INVALID_PATH = 'INVALID_PATH',
  PATH_TRAVERSAL = 'PATH_TRAVERSAL',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  API_KEY_MISSING = 'API_KEY_MISSING',
  RATE_LIMIT = 'RATE_LIMIT',
  AI_ERROR = 'AI_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN'
}

export interface APIError {
  success: false;
  error: string;
  code?: ErrorCode;
  statusCode?: number;
}
