import { NextRequest } from 'next/server';
import { supabaseAdmin, type RAGSearchResult } from '@/lib/supabase-client';

/**
 * RAG Search API - Vercel Compatible
 * Performs semantic search using OpenAI embeddings + Supabase pgvector
 */

interface RAGChunk {
  id: string;
  file_path: string;
  chunk_index: number;
  chunk_text: string;
  metadata: {
    heading?: string;
    heading_level?: number;
    section_type?: string;
  };
  similarity: number;
}

interface RAGResponse {
  success: boolean;
  query: string;
  chunks?: RAGChunk[];
  count?: number;
  error?: string;
}

/**
 * Generate embedding using OpenAI API
 * Uses text-embedding-ada-002 (1536 dimensions)
 */
async function generateQueryEmbedding(text: string): Promise<number[]> {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set. Please add it to .env.local');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Search for similar chunks using Supabase pgvector
 */
async function searchSimilarChunks(
  queryEmbedding: number[],
  matchCount: number = 10,
  threshold: number = 0.3
): Promise<RAGSearchResult[]> {
  // Call the match_markdown_chunks function via Supabase RPC
  const { data, error } = await supabaseAdmin.rpc('match_markdown_chunks', {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: matchCount,
  });

  if (error) {
    console.error('👻 [RAG] Supabase RPC error:', error);
    throw new Error(`Vector search failed: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  // Transform to RAGSearchResult format
  return data.map((row: any) => ({
    id: row.id,
    file_path: row.file_path,
    chunk_index: row.chunk_index,
    chunk_text: row.chunk_text,
    metadata: row.metadata || {},
    similarity: row.similarity,
  }));
}

/**
 * POST /api/rag
 * Semantic search using RAG
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { query, matchCount = 10, threshold = 0.3 } = body;

    // Validation
    if (!query || typeof query !== 'string') {
      return Response.json({
        success: false,
        error: 'Query is required and must be a string'
      }, { status: 400 });
    }

    if (query.length === 0) {
      return Response.json({
        success: false,
        error: 'Query cannot be empty'
      }, { status: 400 });
    }

    if (query.length > 500) {
      return Response.json({
        success: false,
        error: 'Query too long (max 500 characters)'
      }, { status: 400 });
    }

    console.log(`👻 [RAG] Searching for: "${query}"`);

    // Step 1: Generate query embedding using OpenAI
    console.log(`👻 [RAG] Generating query embedding...`);
    let queryEmbedding: number[];
    try {
      queryEmbedding = await generateQueryEmbedding(query);
      console.log(`👻 [RAG] Embedding generated (${queryEmbedding.length} dimensions)`);
    } catch (error) {
      console.error('👻 [RAG] Embedding generation failed:', error);
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate embedding'
      }, { status: 500 });
    }

    // Step 2: Search for similar chunks in Supabase
    console.log(`👻 [RAG] Searching pgvector...`);
    let results: RAGSearchResult[];
    try {
      results = await searchSimilarChunks(queryEmbedding, matchCount, threshold);
    } catch (error) {
      console.error('👻 [RAG] Vector search failed:', error);
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : 'Vector search failed'
      }, { status: 500 });
    }

    const duration = Date.now() - startTime;
    console.log(`👻 [RAG] Found ${results.length} chunks in ${duration}ms`);

    // Step 3: Format and return results
    const chunks: RAGChunk[] = results.map(result => ({
      id: result.id,
      file_path: result.file_path,
      chunk_index: result.chunk_index,
      chunk_text: result.chunk_text,
      metadata: result.metadata,
      similarity: result.similarity,
    }));

    return Response.json({
      success: true,
      query,
      chunks,
      count: chunks.length,
    });

  } catch (error) {
    console.error('👻 [RAG API Error]', error);

    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
