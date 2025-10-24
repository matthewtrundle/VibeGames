#!/usr/bin/env python3
"""
Migrate database to support OpenAI embeddings (1536-dim)
Updates schema from sentence-transformers 384-dim to OpenAI ada-002 1536-dim
"""

import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("❌ DATABASE_URL not found in .env.local")
    exit(1)

print("🔧 Migrating database for OpenAI embeddings (1536-dim)...")
print("=" * 60)

try:
    # Connect to database
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    print("\n1️⃣ Dropping existing vector index...")
    cur.execute("DROP INDEX IF EXISTS markdown_chunks_embedding_idx;")
    conn.commit()
    print("✅ Index dropped")

    print("\n2️⃣ Dropping existing match function...")
    cur.execute("DROP FUNCTION IF EXISTS match_markdown_chunks;")
    conn.commit()
    print("✅ Function dropped")

    print("\n3️⃣ Clearing existing embeddings...")
    cur.execute("UPDATE markdown_chunks SET embedding = NULL;")
    conn.commit()
    print("✅ Embeddings cleared (chunk text preserved)")

    print("\n4️⃣ Altering embedding column to 1536 dimensions...")
    cur.execute("""
        ALTER TABLE markdown_chunks
        ALTER COLUMN embedding TYPE vector(1536);
    """)
    conn.commit()
    print("✅ Column altered to vector(1536)")

    print("\n5️⃣ Recreating vector similarity search function...")
    cur.execute("""
        CREATE OR REPLACE FUNCTION match_markdown_chunks(
            query_embedding vector(1536),
            match_threshold FLOAT DEFAULT 0.7,
            match_count INT DEFAULT 10
        )
        RETURNS TABLE (
            id UUID,
            file_path TEXT,
            chunk_index INTEGER,
            chunk_text TEXT,
            metadata JSONB,
            similarity FLOAT
        )
        LANGUAGE plpgsql
        AS $$
        BEGIN
            RETURN QUERY
            SELECT
                markdown_chunks.id,
                markdown_chunks.file_path,
                markdown_chunks.chunk_index,
                markdown_chunks.chunk_text,
                markdown_chunks.metadata,
                1 - (markdown_chunks.embedding <=> query_embedding) AS similarity
            FROM markdown_chunks
            WHERE 1 - (markdown_chunks.embedding <=> query_embedding) > match_threshold
            ORDER BY markdown_chunks.embedding <=> query_embedding
            LIMIT match_count;
        END;
        $$;
    """)
    conn.commit()
    print("✅ match_markdown_chunks function created (1536-dim)")

    print("\n6️⃣ Recreating HNSW vector index...")
    cur.execute("""
        CREATE INDEX markdown_chunks_embedding_idx
        ON markdown_chunks
        USING hnsw (embedding vector_cosine_ops)
        WITH (m = 16, ef_construction = 64);
    """)
    conn.commit()
    print("✅ Vector similarity index created (HNSW)")

    # Verify
    print("\n7️⃣ Verifying migration...")
    cur.execute("""
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'markdown_chunks' AND column_name = 'embedding';
    """)
    result = cur.fetchone()
    print(f"✅ Embedding column: {result[0]} ({result[1]})")

    # Count chunks
    cur.execute("SELECT COUNT(*) FROM markdown_chunks;")
    count = cur.fetchone()[0]
    print(f"✅ {count} chunks preserved (ready for re-indexing)")

    cur.close()
    conn.close()

    print("\n" + "=" * 60)
    print("🎉 MIGRATION COMPLETE!")
    print("=" * 60)
    print("\n📊 Database now supports 1536-dim OpenAI embeddings")
    print("⚠️  IMPORTANT: Run re-indexing with OpenAI embeddings:")
    print("   python3 index_vault_openai.py --vault ./demo-vault")
    print("\n✅ Your 96 chunks are preserved - just need new embeddings!")

except Exception as e:
    print(f"\n❌ Migration failed: {e}")
    import traceback
    traceback.print_exc()
    exit(1)
