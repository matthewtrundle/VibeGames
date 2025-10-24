/**
 * API Client for The Headless Horseman's Quest
 * Type-safe fetch wrappers for all backend endpoints
 */

import type {
  ScanVaultRequest,
  ScanVaultResponse,
  ReadFileRequest,
  ReadFileResponse,
  ChatRequest,
  ChatResponse,
  ErrorCode
} from './types';

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
// Base Fetch Helper
// ============================================================================

async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    // Parse response
    const data = await response.json();

    // Handle HTTP errors
    if (!response.ok) {
      const errorMessage = data.error || SPOOKY_ERRORS.unknown;
      throw new APIError(
        errorMessage,
        response.status
      );
    }

    // Handle API-level errors
    if ('success' in data && !data.success) {
      throw new APIError(
        data.error || SPOOKY_ERRORS.unknown,
        response.status
      );
    }

    return data as T;
  } catch (error) {
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
