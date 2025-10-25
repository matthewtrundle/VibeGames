#!/usr/bin/env python3
"""
Simple vault indexing with OpenAI - treats each file as one chunk for speed
"""

import psycopg2
from psycopg2.extras import Json
import os
import requests
import time
from dotenv import load_dotenv

load_dotenv('.env.local')

DATABASE_URL = os.getenv('DATABASE_URL')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

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
    data = response.json()
    return data['data'][0]['embedding']

def scan_vault(vault_path):
    """Scan vault for markdown files"""
    md_files = []
    for root, dirs, files in os.walk(vault_path):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for file in files:
            if file.endswith('.md') and file != 'README.md':
                md_files.append(os.path.join(root, file))
    return md_files

def main():
    print("🚀 Simple vault indexing with OpenAI")
    print("=" * 60)

    vault_path = './demo-vault'
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # Clear existing chunks
    print("\n1️⃣ Clearing existing chunks...")
    cur.execute("DELETE FROM markdown_chunks;")
    conn.commit()
    print("✅ Cleared")

    # Scan vault
    print(f"\n2️⃣ Scanning vault...")
    files = scan_vault(vault_path)
    print(f"📊 Found {len(files)} files")

    # Process each file
    print(f"\n3️⃣ Processing...")
    start_time = time.time()
    total = 0

    for idx, file_path in enumerate(files, 1):
        rel_path = os.path.relpath(file_path, vault_path)

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Skip frontmatter
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    content = parts[2].strip()

            # Generate embedding
            embedding = generate_embedding(content)

            # Insert
            cur.execute("""
                INSERT INTO markdown_chunks (file_path, chunk_index, chunk_text, embedding, metadata)
                VALUES (%s, %s, %s, %s, %s)
            """, (rel_path, 0, content[:2000], embedding, Json({})))

            conn.commit()
            total += 1

            if idx % 10 == 0:
                print(f"  ✓ {idx}/{len(files)} processed")

            time.sleep(0.05)  # Rate limit

        except Exception as e:
            print(f"  ❌ Error on {rel_path}: {e}")
            continue

    elapsed = time.time() - start_time
    print(f"\n🎉 Done! Indexed {total}/{len(files)} files in {elapsed:.1f}s")

    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
