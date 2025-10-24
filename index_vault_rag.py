#!/usr/bin/env python3
"""
Index Vault with RAG (Local Embeddings)
Processes markdown files, generates embeddings using sentence-transformers, and stores in Supabase
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import execute_values
from sentence_transformers import SentenceTransformer

# Add lib to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))
from chunking import chunk_markdown_file, count_tokens

# Load environment variables
load_dotenv('.env.local')

DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("❌ DATABASE_URL not found in .env.local")
    exit(1)

# Initialize local embedding model
# Using all-MiniLM-L6-v2: Fast, efficient, 384-dimensional embeddings
print("🤖 Loading local embedding model (all-MiniLM-L6-v2)...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ Model loaded and ready!")

def generate_embedding(text: str) -> list:
    """
    Generate embedding for text using local sentence-transformers model
    Returns 384-dimensional vector
    """
    try:
        # Generate embedding locally (no API call needed!)
        embedding = embedding_model.encode(text, convert_to_tensor=False)
        return embedding.tolist()
    except Exception as e:
        print(f"  ❌ Error generating embedding: {e}")
        raise e

def scan_vault(vault_path: str) -> list:
    """Scan vault directory for markdown files"""
    markdown_files = []

    for root, dirs, files in os.walk(vault_path):
        # Skip hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.')]

        for file in files:
            if file.endswith('.md') and file != 'README.md' and not file.startswith('.'):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, vault_path)
                markdown_files.append(rel_path)

    return markdown_files

def process_file(vault_path: str, rel_path: str) -> tuple:
    """
    Process a single markdown file
    Returns: (chunks, file_info)
    """
    full_path = os.path.join(vault_path, rel_path)

    # Read file
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Get file stats
    stats = os.stat(full_path)

    # Parse frontmatter (basic YAML parsing)
    metadata = {}
    if content.startswith('---'):
        end = content.find('---', 3)
        if end != -1:
            frontmatter = content[3:end].strip()
            content = content[end + 3:].strip()

            # Simple YAML parsing
            for line in frontmatter.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    metadata[key.strip()] = value.strip()

    # Chunk the file
    chunks = chunk_markdown_file(rel_path, content, max_tokens=500, overlap_tokens=100)

    # File info
    file_info = {
        'file_path': rel_path,
        'filename': os.path.basename(rel_path),
        'folder': os.path.dirname(rel_path) or 'root',
        'size_bytes': stats.st_size,
        'chunk_count': len(chunks),
        'last_modified': datetime.fromtimestamp(stats.st_mtime),
        'metadata': metadata
    }

    return chunks, file_info

def index_vault(vault_path: str, batch_size: int = 10):
    """
    Main indexing function
    Processes all markdown files in vault and stores in database
    """
    print("🔍 Indexing vault with RAG...")
    print("=" * 60)
    print(f"Vault: {vault_path}")
    print(f"Batch size: {batch_size}")
    print()

    # Connect to database
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    try:
        # Create or update vault config
        print("1️⃣ Registering vault...")
        cur.execute("""
            INSERT INTO vault_configs (vault_path, settings)
            VALUES (%s, %s)
            ON CONFLICT (vault_path)
            DO UPDATE SET updated_at = NOW()
            RETURNING id;
        """, (vault_path, json.dumps({})))
        vault_id = cur.fetchone()[0]
        conn.commit()
        print(f"✅ Vault ID: {vault_id}")

        # Scan for markdown files
        print("\n2️⃣ Scanning for markdown files...")
        markdown_files = scan_vault(vault_path)
        print(f"✅ Found {len(markdown_files)} markdown files")

        if not markdown_files:
            print("⚠️  No markdown files found. Exiting.")
            return

        # Process files
        print("\n3️⃣ Processing files and generating embeddings...")
        total_chunks = 0
        total_tokens = 0

        for i, rel_path in enumerate(markdown_files, 1):
            print(f"\n[{i}/{len(markdown_files)}] Processing: {rel_path}")

            try:
                # Process file
                chunks, file_info = process_file(vault_path, rel_path)
                print(f"  📄 Created {len(chunks)} chunks")

                # Delete existing chunks for this file
                cur.execute("DELETE FROM markdown_chunks WHERE file_path = %s", (rel_path,))
                cur.execute("DELETE FROM markdown_files WHERE file_path = %s", (rel_path,))

                # Insert file info
                cur.execute("""
                    INSERT INTO markdown_files
                    (file_path, filename, folder, size_bytes, chunk_count, last_modified, metadata)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    file_info['file_path'],
                    file_info['filename'],
                    file_info['folder'],
                    file_info['size_bytes'],
                    file_info['chunk_count'],
                    file_info['last_modified'],
                    json.dumps(file_info['metadata'])
                ))

                # Process chunks in batches
                for batch_start in range(0, len(chunks), batch_size):
                    batch = chunks[batch_start:batch_start + batch_size]

                    # Generate embeddings
                    print(f"  🤖 Generating embeddings for batch {batch_start//batch_size + 1}...", end='')
                    embeddings = []
                    for chunk in batch:
                        embedding = generate_embedding(chunk['chunk_text'])
                        embeddings.append(embedding)
                    print(" ✅")

                    # Insert chunks with embeddings
                    values = []
                    for chunk, embedding in zip(batch, embeddings):
                        values.append((
                            chunk['file_path'],
                            chunk['chunk_index'],
                            chunk['chunk_text'],
                            chunk['chunk_tokens'],
                            embedding,
                            json.dumps(chunk['metadata'])
                        ))

                    execute_values(cur, """
                        INSERT INTO markdown_chunks
                        (file_path, chunk_index, chunk_text, chunk_tokens, embedding, metadata)
                        VALUES %s
                    """, values)

                    total_chunks += len(batch)
                    total_tokens += sum(chunk['chunk_tokens'] for chunk in batch)

                conn.commit()
                print(f"  ✅ Indexed successfully")

            except Exception as e:
                print(f"  ❌ Error processing {rel_path}: {e}")
                conn.rollback()
                continue

        # Update vault stats
        print("\n4️⃣ Updating vault statistics...")
        cur.execute("""
            UPDATE vault_configs
            SET
                last_scan = NOW(),
                file_count = %s,
                total_chunks = %s
            WHERE id = %s
        """, (len(markdown_files), total_chunks, vault_id))
        conn.commit()

        print("\n" + "=" * 60)
        print("🎉 INDEXING COMPLETE!")
        print("=" * 60)
        print(f"📊 Statistics:")
        print(f"   Files processed: {len(markdown_files)}")
        print(f"   Total chunks: {total_chunks}")
        print(f"   Total tokens: {total_tokens:,}")
        print(f"   Avg tokens/chunk: {total_tokens // total_chunks if total_chunks > 0 else 0}")
        print(f"\n✅ Vault indexed and ready for semantic search!")

    except Exception as e:
        print(f"\n❌ Indexing failed: {e}")
        import traceback
        traceback.print_exc()
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Index vault with RAG')
    parser.add_argument('--vault', default='./demo-vault', help='Path to vault directory')
    parser.add_argument('--batch-size', type=int, default=10, help='Batch size for embedding generation')

    args = parser.parse_args()

    vault_path = os.path.abspath(args.vault)

    if not os.path.exists(vault_path):
        print(f"❌ Vault not found: {vault_path}")
        exit(1)

    index_vault(vault_path, args.batch_size)
