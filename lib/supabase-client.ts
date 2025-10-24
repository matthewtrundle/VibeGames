/**
 * Supabase Client for Server-Side Operations
 *
 * This client uses the service role key to bypass Row Level Security.
 * Only use this in server-side code (API routes, Server Components).
 *
 * For client-side operations, create a separate client with the anon key.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Lazy-initialized Supabase client
 * Only created at runtime when first accessed
 */
let _supabaseAdmin: SupabaseClient | null = null

/**
 * Get or create the Supabase admin client
 *
 * ⚠️ WARNING: This client bypasses Row Level Security!
 * Only use for server-side operations like RAG search, indexing, etc.
 */
function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) {
    return _supabaseAdmin
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return _supabaseAdmin
}

/**
 * Server-side Supabase client with service role permissions
 * Lazy-loaded to avoid build-time errors
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseAdmin()[prop as keyof SupabaseClient]
  }
})

/**
 * Database types for TypeScript
 */
export interface MarkdownChunk {
  id: string
  file_path: string
  chunk_index: number
  chunk_text: string
  embedding: number[] | null
  metadata: {
    heading?: string
    heading_level?: number
    section_type?: string
  }
  created_at: string
  updated_at: string
}

export interface MarkdownFile {
  id: string
  file_path: string
  filename: string
  folder: string | null
  size_bytes: number | null
  chunk_count: number
  last_modified: string | null
  last_indexed: string
  metadata: Record<string, any>
  created_at: string
}

export interface VaultConfig {
  id: string
  vault_path: string
  last_scan: string | null
  file_count: number
  total_chunks: number
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  vault_id: string | null
  user_message: string
  ai_response: string
  chunks_used: any[]
  metadata: Record<string, any>
  created_at: string
}

/**
 * RAG Search Result
 */
export interface RAGSearchResult {
  id: string
  file_path: string
  chunk_index: number
  chunk_text: string
  metadata: {
    heading?: string
    heading_level?: number
    section_type?: string
  }
  similarity: number
}
