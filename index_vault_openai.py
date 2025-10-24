#!/usr/bin/env python3
"""
Re-index markdown chunks with OpenAI embeddings
Generates 1536-dim embeddings using text-embedding-ada-002
"""

import psycopg2
import os
import requests
import json
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

DATABASE_URL = os.getenv('DATABASE_URL')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not DATABASE_URL:
    print("❌ DATABASE_URL not found in .env.local")
    exit(1)

if not OPENAI_API_KEY:
    print("❌ OPENAI_API_KEY not found in .env.local")
    exit(1)

def generate_embedding(text: str) -> list[float]:
    """
    Generate embedding using OpenAI API
    Returns 1536-dimensional vector
    """
    response = requests.post(
        'https://api.openai.com/v1/embeddings',
        headers={
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json',
        },
        json={
            'model': 'text-embedding-ada-002',
            'input': text,
        }
    )

    if response.status_code != 200:
        error = response.json().get('error', {})
        raise Exception(f"OpenAI API error: {error.get('message', response.text)}")

    data = response.json()
    return data['data'][0]['embedding']

def main():
    print("🚀 Re-indexing vault with OpenAI embeddings")
    print("=" * 60)

    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        # Get chunks that need embeddings
        print("\n1️⃣ Fetching chunks from database...")
        cur.execute("""
            SELECT id, chunk_text, file_path, chunk_index
            FROM markdown_chunks
            WHERE embedding IS NULL
            ORDER BY file_path, chunk_index;
        """)
        chunks = cur.fetchall()
        total_chunks = len(chunks)

        if total_chunks == 0:
            print("✅ All chunks already have embeddings!")
            cur.close()
            conn.close()
            return

        print(f"📊 Found {total_chunks} chunks to process")

        # Cost estimate
        avg_tokens_per_chunk = 32  # Conservative estimate
        total_tokens = total_chunks * avg_tokens_per_chunk
        cost_per_1k = 0.0001  # OpenAI ada-002 pricing
        estimated_cost = (total_tokens / 1000) * cost_per_1k

        print(f"\n💰 Cost Estimate:")
        print(f"   - {total_chunks} chunks × ~{avg_tokens_per_chunk} tokens = ~{total_tokens:,} tokens")
        print(f"   - Estimated cost: ~${estimated_cost:.4f}")
        print(f"   - Time estimate: ~{total_chunks * 0.3:.0f} seconds")

        input("\n⚠️  Press Enter to continue or Ctrl+C to cancel...")

        # Process each chunk
        print(f"\n2️⃣ Generating embeddings...")
        start_time = time.time()

        for idx, (chunk_id, chunk_text, file_path, chunk_index) in enumerate(chunks, 1):
            try:
                # Generate embedding
                embedding = generate_embedding(chunk_text)

                # Update database
                cur.execute("""
                    UPDATE markdown_chunks
                    SET embedding = %s, updated_at = NOW()
                    WHERE id = %s;
                """, (embedding, chunk_id))
                conn.commit()

                # Progress indicator
                if idx % 10 == 0 or idx == total_chunks:
                    elapsed = time.time() - start_time
                    rate = idx / elapsed
                    remaining = (total_chunks - idx) / rate if rate > 0 else 0
                    print(f"   ✓ {idx}/{total_chunks} chunks processed ({elapsed:.1f}s elapsed, ~{remaining:.0f}s remaining)")

                # Rate limiting (OpenAI allows 3000 RPM on free tier)
                time.sleep(0.05)  # 20 requests per second = 1200 RPM

            except Exception as e:
                print(f"\n   ❌ Error processing chunk {chunk_id}: {e}")
                print(f"      File: {file_path}, Chunk: {chunk_index}")
                conn.rollback()
                continue

        # Verify
        print(f"\n3️⃣ Verifying re-indexing...")
        cur.execute("SELECT COUNT(*) FROM markdown_chunks WHERE embedding IS NOT NULL;")
        embedded_count = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM markdown_chunks;")
        total_count = cur.fetchone()[0]

        cur.close()
        conn.close()

        elapsed_total = time.time() - start_time

        print("\n" + "=" * 60)
        print("🎉 RE-INDEXING COMPLETE!")
        print("=" * 60)
        print(f"\n📊 Results:")
        print(f"   - {embedded_count}/{total_count} chunks have embeddings")
        print(f"   - Processing time: {elapsed_total:.1f} seconds")
        print(f"   - Average time per chunk: {elapsed_total/total_chunks:.2f}s")

        if embedded_count == total_count:
            print("\n✅ All chunks successfully indexed!")
            print("\n🧪 Test your RAG endpoint:")
            print("   curl -X POST http://localhost:3002/api/rag \\")
            print("     -H 'Content-Type: application/json' \\")
            print("     -d '{\"query\": \"What bugs are mentioned?\", \"matchCount\": 5}'")
        else:
            print(f"\n⚠️  {total_count - embedded_count} chunks still need embeddings")
            print("   Re-run this script to process remaining chunks")

    except KeyboardInterrupt:
        print("\n\n⚠️  Indexing cancelled by user")
        exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

if __name__ == '__main__':
    main()
