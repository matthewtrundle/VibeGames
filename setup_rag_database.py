#!/usr/bin/env python3
"""
Setup RAG Database with pgvector
Creates tables and functions for vector similarity search
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

print("🔧 Setting up RAG database with pgvector...")
print("=" * 60)

try:
    # Connect to database
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    print("\n1️⃣ Enabling pgvector extension...")
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    conn.commit()
    print("✅ pgvector extension enabled")

    print("\n2️⃣ Creating markdown_chunks table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS markdown_chunks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            file_path TEXT NOT NULL,
            chunk_index INTEGER NOT NULL,
            chunk_text TEXT NOT NULL,
            chunk_tokens INTEGER,
            embedding vector(1536),
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(file_path, chunk_index)
        );
    """)
    conn.commit()
    print("✅ markdown_chunks table created")

    print("\n3️⃣ Creating indexes for performance...")

    # Index for vector similarity search using HNSW
    cur.execute("""
        CREATE INDEX IF NOT EXISTS markdown_chunks_embedding_idx
        ON markdown_chunks
        USING hnsw (embedding vector_cosine_ops)
        WITH (m = 16, ef_construction = 64);
    """)
    print("✅ Vector similarity index created (HNSW)")

    # Index for file path lookups
    cur.execute("""
        CREATE INDEX IF NOT EXISTS markdown_chunks_file_path_idx
        ON markdown_chunks (file_path);
    """)
    print("✅ File path index created")

    # Index for metadata queries
    cur.execute("""
        CREATE INDEX IF NOT EXISTS markdown_chunks_metadata_idx
        ON markdown_chunks USING GIN (metadata);
    """)
    print("✅ Metadata index created (GIN)")

    conn.commit()

    print("\n4️⃣ Creating vector similarity search function...")
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
    print("✅ match_markdown_chunks function created")

    print("\n5️⃣ Creating file management table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS markdown_files (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            file_path TEXT UNIQUE NOT NULL,
            filename TEXT NOT NULL,
            folder TEXT,
            size_bytes INTEGER,
            chunk_count INTEGER DEFAULT 0,
            last_modified TIMESTAMP WITH TIME ZONE,
            last_indexed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    """)
    conn.commit()
    print("✅ markdown_files table created")

    # Index for file lookups
    cur.execute("""
        CREATE INDEX IF NOT EXISTS markdown_files_path_idx
        ON markdown_files (file_path);
    """)
    conn.commit()
    print("✅ File path index created")

    print("\n6️⃣ Creating vault configuration table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS vault_configs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            vault_path TEXT UNIQUE NOT NULL,
            last_scan TIMESTAMP WITH TIME ZONE,
            file_count INTEGER DEFAULT 0,
            total_chunks INTEGER DEFAULT 0,
            settings JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    """)
    conn.commit()
    print("✅ vault_configs table created")

    print("\n7️⃣ Creating chat history table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS chat_history (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            vault_id UUID REFERENCES vault_configs(id) ON DELETE CASCADE,
            user_message TEXT NOT NULL,
            ai_response TEXT NOT NULL,
            chunks_used JSONB DEFAULT '[]',
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    """)
    conn.commit()
    print("✅ chat_history table created")

    # Verify setup
    print("\n8️⃣ Verifying setup...")
    cur.execute("""
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename IN ('markdown_chunks', 'markdown_files', 'vault_configs', 'chat_history')
        ORDER BY tablename;
    """)
    tables = cur.fetchall()
    print(f"✅ Found {len(tables)} tables:")
    for table in tables:
        print(f"   - {table[0]}")

    # Check vector extension
    cur.execute("SELECT * FROM pg_extension WHERE extname = 'vector';")
    if cur.fetchone():
        print("✅ pgvector extension is active")

    cur.close()
    conn.close()

    print("\n" + "=" * 60)
    print("🎉 RAG DATABASE SETUP COMPLETE!")
    print("=" * 60)
    print("\n📊 Database Schema:")
    print("   - markdown_chunks: Stores text chunks with embeddings")
    print("   - markdown_files: Tracks indexed files")
    print("   - vault_configs: Stores vault configurations")
    print("   - chat_history: Persists chat conversations")
    print("\n🔍 Search Function:")
    print("   - match_markdown_chunks(): Vector similarity search")
    print("\n⚡ Indexes:")
    print("   - HNSW vector index for fast similarity search")
    print("   - B-tree indexes for file paths")
    print("   - GIN index for metadata queries")
    print("\n🚀 Ready for RAG implementation!")

except Exception as e:
    print(f"\n❌ Error setting up database: {e}")
    import traceback
    traceback.print_exc()
    exit(1)
