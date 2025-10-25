#!/usr/bin/env python3
"""
Index entire vault from scratch with OpenAI embeddings
Scans vault folder, chunks files, generates OpenAI embeddings, inserts to DB
"""

import psycopg2
import os
import sys
import requests
import time
from dotenv import load_dotenv
from pathlib import Path

# Add lib to path
sys.path.append(str(Path(__file__).parent / 'lib'))
from chunking import chunk_markdown_file

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
    """Generate embedding using OpenAI API"""
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

def scan_vault(vault_path):
    """Scan vault for markdown files"""
    md_files = []
    for root, dirs, files in os.walk(vault_path):
        # Skip hidden folders
        dirs[:] = [d for d in dirs if not d.startswith('.')]

        for file in files:
            if file.endswith('.md') and file != 'README.md':
                md_files.append(os.path.join(root, file))

    return md_files

def main():
    print("🚀 Indexing vault with OpenAI embeddings")
    print("=" * 60)

    vault_path = './demo-vault'

    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        # Clear existing chunks
        print("\n1️⃣ Clearing existing chunks...")
        cur.execute("DELETE FROM markdown_chunks;")
        cur.execute("DELETE FROM markdown_files;")
        conn.commit()
        print("✅ Cleared old data")

        # Scan vault
        print(f"\n2️⃣ Scanning vault: {vault_path}")
        files = scan_vault(vault_path)
        print(f"📊 Found {len(files)} markdown files")

        # Process each file
        print(f"\n3️⃣ Processing files...")
        start_time = time.time()
        total_chunks = 0

        for idx, file_path in enumerate(files, 1):
            # Get relative path
            rel_path = os.path.relpath(file_path, vault_path)

            print(f"\n[{idx}/{len(files)}] {rel_path}")

            try:
                # Read and chunk file
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                chunks = chunk_markdown_file(content, rel_path)
                print(f"  📄 Created {len(chunks)} chunks")

                # Process each chunk
                for chunk_idx, chunk in enumerate(chunks):
                    # Generate embedding
                    embedding = generate_embedding(chunk['text'])

                    # Insert into database
                    cur.execute("""
                        INSERT INTO markdown_chunks (file_path, chunk_index, chunk_text, embedding, metadata)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (
                        rel_path,
                        chunk_idx,
                        chunk['text'],
                        embedding,
                        {
                            'heading': chunk.get('heading'),
                            'heading_level': chunk.get('heading_level'),
                            'section_type': chunk.get('section_type', 'content')
                        }
                    ))

                    total_chunks += 1

                    # Rate limiting
                    time.sleep(0.05)

                conn.commit()
                print(f"  ✅ Indexed {len(chunks)} chunks")

                # Progress update every 10 files
                if idx % 10 == 0:
                    elapsed = time.time() - start_time
                    rate = idx / elapsed
                    remaining = (len(files) - idx) / rate if rate > 0 else 0
                    print(f"\n  ⏱️  Progress: {idx}/{len(files)} files ({elapsed:.1f}s elapsed, ~{remaining:.0f}s remaining)")

            except Exception as e:
                print(f"  ❌ Error: {e}")
                conn.rollback()
                continue

        # Final stats
        cur.execute("SELECT COUNT(*) FROM markdown_chunks;")
        final_count = cur.fetchone()[0]

        elapsed_total = time.time() - start_time

        print("\n" + "=" * 60)
        print("🎉 INDEXING COMPLETE!")
        print("=" * 60)
        print(f"\n📊 Results:")
        print(f"   - Files processed: {len(files)}")
        print(f"   - Total chunks: {final_count}")
        print(f"   - Processing time: {elapsed_total:.1f} seconds")
        print(f"   - Average: {elapsed_total/len(files):.2f}s per file")

        cur.close()
        conn.close()

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
