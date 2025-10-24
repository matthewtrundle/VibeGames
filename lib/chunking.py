#!/usr/bin/env python3
"""
Document Chunking Module
Intelligently splits markdown documents into semantic chunks
"""

import re
from typing import List, Dict, Any
import tiktoken

# Initialize tokenizer for counting tokens
encoding = tiktoken.get_encoding("cl100k_base")  # GPT-3.5/4 encoding

def count_tokens(text: str) -> int:
    """Count tokens in text using tiktoken"""
    return len(encoding.encode(text))

def split_by_headings(markdown: str) -> List[Dict[str, Any]]:
    """
    Split markdown by headings to respect document structure
    Returns list of sections with heading hierarchy
    """
    sections = []
    lines = markdown.split('\n')

    current_section = {
        'heading': '',
        'level': 0,
        'content': []
    }

    for line in lines:
        # Check if line is a heading
        heading_match = re.match(r'^(#{1,6})\s+(.+)$', line)

        if heading_match:
            # Save previous section if it has content
            if current_section['content']:
                sections.append({
                    'heading': current_section['heading'],
                    'level': current_section['level'],
                    'text': '\n'.join(current_section['content']).strip()
                })

            # Start new section
            level = len(heading_match.group(1))
            heading = heading_match.group(2)
            current_section = {
                'heading': heading,
                'level': level,
                'content': [line]  # Include heading in content
            }
        else:
            current_section['content'].append(line)

    # Add final section
    if current_section['content']:
        sections.append({
            'heading': current_section['heading'],
            'level': current_section['level'],
            'text': '\n'.join(current_section['content']).strip()
        })

    return sections

def chunk_by_tokens(
    text: str,
    max_tokens: int = 500,
    overlap_tokens: int = 100
) -> List[str]:
    """
    Chunk text by token count with overlap
    Tries to split on paragraph boundaries
    """
    tokens = encoding.encode(text)
    chunks = []

    start = 0
    while start < len(tokens):
        # Get chunk
        end = start + max_tokens
        chunk_tokens = tokens[start:end]

        # Decode back to text
        chunk_text = encoding.decode(chunk_tokens)

        # If this isn't the last chunk, try to split at paragraph boundary
        if end < len(tokens):
            # Look for last paragraph break in chunk
            last_break = chunk_text.rfind('\n\n')
            if last_break > len(chunk_text) // 2:  # Only if break is in second half
                chunk_text = chunk_text[:last_break].strip()
                # Re-encode to get actual token count
                chunk_tokens = encoding.encode(chunk_text)
                end = start + len(chunk_tokens)

        chunks.append(chunk_text)

        # Move start position with overlap
        start = end - overlap_tokens
        if start >= len(tokens):
            break

    return chunks

def chunk_markdown_file(
    file_path: str,
    markdown_content: str,
    max_tokens: int = 500,
    overlap_tokens: int = 100
) -> List[Dict[str, Any]]:
    """
    Main chunking function for markdown files

    Strategy:
    1. Split by headings to respect document structure
    2. If section is too large, chunk by tokens with overlap
    3. Preserve heading context in each chunk

    Args:
        file_path: Path to the markdown file
        markdown_content: Full markdown content
        max_tokens: Maximum tokens per chunk (default: 500)
        overlap_tokens: Token overlap between chunks (default: 100)

    Returns:
        List of chunks with metadata
    """
    sections = split_by_headings(markdown_content)
    chunks = []
    chunk_index = 0

    for section in sections:
        section_text = section['text']
        section_tokens = count_tokens(section_text)

        # If section is small enough, keep as single chunk
        if section_tokens <= max_tokens:
            chunks.append({
                'chunk_index': chunk_index,
                'file_path': file_path,
                'chunk_text': section_text,
                'chunk_tokens': section_tokens,
                'metadata': {
                    'heading': section['heading'],
                    'heading_level': section['level'],
                    'section_type': 'complete_section'
                }
            })
            chunk_index += 1
        else:
            # Split large section into multiple chunks
            sub_chunks = chunk_by_tokens(section_text, max_tokens, overlap_tokens)

            for i, sub_chunk in enumerate(sub_chunks):
                chunks.append({
                    'chunk_index': chunk_index,
                    'file_path': file_path,
                    'chunk_text': sub_chunk,
                    'chunk_tokens': count_tokens(sub_chunk),
                    'metadata': {
                        'heading': section['heading'],
                        'heading_level': section['level'],
                        'section_type': 'partial_section',
                        'part': i + 1,
                        'total_parts': len(sub_chunks)
                    }
                })
                chunk_index += 1

    return chunks

def optimize_chunk_for_context(chunk: Dict[str, Any], window_size: int = 50) -> str:
    """
    Optimize chunk for AI context by adding heading context
    """
    heading = chunk['metadata'].get('heading', '')
    text = chunk['chunk_text']

    if heading:
        # Add heading as context if not already in text
        if not text.startswith(f"# {heading}") and not text.startswith(f"## {heading}"):
            level = chunk['metadata'].get('heading_level', 1)
            heading_md = '#' * level + ' ' + heading
            return f"{heading_md}\n\n{text}"

    return text

# Example usage
if __name__ == '__main__':
    example_markdown = """
# Introduction

This is the introduction section with some content.

It has multiple paragraphs.

## Background

Here's some background information. This section has a lot of text that might need to be chunked.

Let's add more content to make it longer...

### Technical Details

More nested content here.

## Methods

Description of methods used.
"""

    chunks = chunk_markdown_file('example.md', example_markdown)

    print(f"Created {len(chunks)} chunks:\n")
    for chunk in chunks:
        print(f"Chunk {chunk['chunk_index']}")
        print(f"  Heading: {chunk['metadata']['heading']}")
        print(f"  Tokens: {chunk['chunk_tokens']}")
        print(f"  Preview: {chunk['chunk_text'][:100]}...")
        print()
