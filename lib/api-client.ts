/**
 * API Client for The Headless Horseman's Quest
 * Enhanced client-side API wrapper with streaming, error handling, and type safety
 */

import type {
  ScanVaultRequest,
  ScanVaultResponse,
  ReadFileRequest,
  ReadFileResponse,
  ChatRequest,
  ChatResponse,
  ErrorCode
} from './api/types';

// ============================================================================
// Error Classes
// ============================================================================

export class APIError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public code?: ErrorCode
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// ============================================================================
// Spooky Error Messages
// ============================================================================

export const SPOOKY_ERRORS = {
  network: "The connection to the spirit realm is lost... 🕸️",
  notFound: "This file has vanished into the void... 🪦",
  forbidden: "The graveyard gates are locked... 🔒",
  serverError: "The spirits are silent... 👻",
  timeout: "The spirits took too long to respond... ⏳",
  unknown: "A mysterious error occurred in the graveyard... 🪦"
};

// ============================================================================
// Base Fetch Helper with Timeout
// ============================================================================

async function fetchAPI<T>(
  url: string,
  options?: RequestInit,
  timeoutMs = 30000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const data = await response.json();

    // Handle HTTP errors
    if (!response.ok) {
      const errorMessage = data.error || SPOOKY_ERRORS.unknown;
      throw new APIError(
        errorMessage,
        response.status,
        data.code
      );
    }

    // Handle API-level errors
    if ('success' in data && !data.success) {
      throw new APIError(
        data.error || SPOOKY_ERRORS.unknown,
        response.status,
        data.code
      );
    }

    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    // Timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError(SPOOKY_ERRORS.timeout);
    }

    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(SPOOKY_ERRORS.network);
    }

    // Re-throw API errors
    if (error instanceof APIError) {
      throw error;
    }

    // Unknown errors
    throw new APIError(SPOOKY_ERRORS.unknown);
  }
}

// ============================================================================
// Streaming Response Helper
// ============================================================================

export interface StreamingOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Fetch with streaming response support
 * @param url - API endpoint
 * @param options - Fetch options
 * @param streamingOptions - Callbacks for streaming chunks
 * @returns Promise that resolves when streaming completes
 */
export async function fetchStream(
  url: string,
  options: RequestInit,
  streamingOptions: StreamingOptions
): Promise<void> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.error || SPOOKY_ERRORS.serverError,
        response.status,
        errorData.code
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new APIError('No readable stream available');
    }

    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;

      if (streamingOptions.onChunk) {
        streamingOptions.onChunk(chunk);
      }
    }

    if (streamingOptions.onComplete) {
      streamingOptions.onComplete(fullText);
    }
  } catch (error) {
    const apiError = error instanceof APIError
      ? error
      : new APIError(SPOOKY_ERRORS.unknown);

    if (streamingOptions.onError) {
      streamingOptions.onError(apiError);
    } else {
      throw apiError;
    }
  }
}

// ============================================================================
// API Endpoints
// ============================================================================

/**
 * Scan vault for all markdown files
 * @param path - Absolute path to Obsidian vault
 * @returns List of markdown files with metadata
 */
export async function scanVault(path: string): Promise<ScanVaultResponse> {
  const encodedPath = encodeURIComponent(path);
  return fetchAPI<ScanVaultResponse>(
    `/api/vault/scan?path=${encodedPath}`
  );
}

/**
 * Read specific markdown file
 * @param fileId - Base64 encoded file path
 * @param vaultPath - Absolute path to vault
 * @returns Full file content with metadata
 */
export async function readFile(
  fileId: string,
  vaultPath: string
): Promise<ReadFileResponse> {
  const encodedId = encodeURIComponent(fileId);
  const encodedPath = encodeURIComponent(vaultPath);

  return fetchAPI<ReadFileResponse>(
    `/api/vault/read?id=${encodedId}&vaultPath=${encodedPath}`
  );
}

/**
 * Send chat message to AI Spirit Medium
 * @param request - Chat request with query and context
 * @returns AI response with citations
 */
export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  return fetchAPI<ChatResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Send chat message with streaming response
 * @param request - Chat request with query and context
 * @param streamingOptions - Callbacks for handling streaming chunks
 */
export async function sendChatMessageStream(
  request: ChatRequest,
  streamingOptions: StreamingOptions
): Promise<void> {
  return fetchStream(
    '/api/chat',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    streamingOptions
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get user-friendly error message based on status code
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return SPOOKY_ERRORS.unknown;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof APIError) {
    return error.message === SPOOKY_ERRORS.network;
  }
  return false;
}

/**
 * Check if error is a 404 error
 */
export function isNotFoundError(error: unknown): boolean {
  if (error instanceof APIError) {
    return error.statusCode === 404;
  }
  return false;
}

/**
 * Check if error is a permission error
 */
export function isForbiddenError(error: unknown): boolean {
  if (error instanceof APIError) {
    return error.statusCode === 403;
  }
  return false;
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof APIError) {
    return error.message === SPOOKY_ERRORS.timeout;
  }
  return false;
}

/**
 * Retry a request with exponential backoff
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param baseDelayMs - Initial delay in milliseconds
 * @returns Promise with result of successful attempt
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on client errors (4xx)
      if (error instanceof APIError && error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      // Last attempt failed
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new APIError(SPOOKY_ERRORS.unknown);
}

// ============================================================================
// Request Deduplication
// ============================================================================

const pendingRequests = new Map<string, Promise<any>>();

/**
 * Deduplicate identical concurrent requests
 * @param key - Unique key for the request
 * @param fn - Async function to execute
 * @returns Promise with result (shared across duplicate requests)
 */
export async function deduplicateRequest<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  const existing = pendingRequests.get(key);
  if (existing) {
    return existing;
  }

  const promise = fn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}
