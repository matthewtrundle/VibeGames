#!/usr/bin/env python3
"""
RAG Search Script
Performs semantic search on indexed markdown chunks
Called by Next.js API to get relevant context
"""

import sys
import json
import os
from dotenv import load_dotenv
import psycopg2
from sentence_transformers import SentenceTransformer

# Load environment
load_dotenv('.env.local')
DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print(json.dumps({"error": "DATABASE_URL not found"}), flush=True)
    sys.exit(1)

# Initialize model (cached after first load)
model = SentenceTransformer('all-MiniLM-L6-v2')

def search_chunks(query: str, match_count: int = 10, threshold: float = 0.3):
    """
    Search for relevant markdown chunks using semantic similarity

    Args:
        query: User's search query
        match_count: Maximum number of chunks to return
        threshold: Minimum similarity threshold (0.0 to 1.0)

    Returns:
        List of matching chunks with metadata
    """
    try:
        # Generate query embedding
        query_embedding = model.encode(query, convert_to_tensor=False).tolist()

        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        # Call vector similarity function
        cur.execute("""
            SELECT
                id,
                file_path,
                chunk_index,
                chunk_text,
                metadata,
                similarity
            FROM match_markdown_chunks(
                %s::vector,
                %s,
                %s
            )
            ORDER BY similarity DESC;
        """, (query_embedding, threshold, match_count))

        results = cur.fetchall()

        # Format results
        chunks = []
        for row in results:
            chunks.append({
                "id": str(row[0]),
                "file_path": row[1],
                "chunk_index": row[2],
                "chunk_text": row[3],
                "metadata": row[4],
                "similarity": float(row[5])
            })

        cur.close()
        conn.close()

        return {
            "success": True,
            "query": query,
            "chunks": chunks,
            "count": len(chunks)
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "query": query
        }

if __name__ == '__main__':
    # Read query from stdin or command line
    if len(sys.argv) > 1:
        query = ' '.join(sys.argv[1:])
    else:
        # Read from stdin (for piped input)
        query = sys.stdin.read().strip()

    if not query:
        print(json.dumps({"error": "No query provided"}), flush=True)
        sys.exit(1)

    # Get optional parameters from environment
    match_count = int(os.getenv('RAG_MATCH_COUNT', '10'))
    threshold = float(os.getenv('RAG_THRESHOLD', '0.3'))

    # Perform search
    result = search_chunks(query, match_count, threshold)

    # Output JSON result
    print(json.dumps(result, indent=2), flush=True)
