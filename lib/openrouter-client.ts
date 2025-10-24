import OpenAI from 'openai';
import { ErrorCode, ERROR_MESSAGES, MarkdownFileContent } from './types';

/**
 * Validate OpenRouter API key
 */
export function validateOpenRouterKey(): void {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(ERROR_MESSAGES[ErrorCode.API_KEY_MISSING]);
  }
}

/**
 * Create OpenRouter client
 */
export function createOpenRouterClient(): OpenAI {
  validateOpenRouterKey();

  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'The Headless Horseman\'s Quest'
    }
  });
}

/**
 * Call OpenRouter with retry logic
 * Implements exponential backoff for retries
 */
export async function callOpenRouterWithRetry(
  client: OpenAI,
  messages: { role: string; content: string }[],
  maxRetries: number = 2
): Promise<AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const stream = await client.chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        max_tokens: 2000,
        temperature: 0.7,
        stream: true,
        messages: messages as any
      });

      return stream;
    } catch (error: any) {
      lastError = error;

      // Don't retry on auth errors
      if (error.status === 401 || error.status === 403) {
        throw error;
      }

      // Don't retry on client errors (except rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000;  // 1s, 2s, 4s
        console.log(`👻 [Retry] Attempt ${attempt + 1} failed, waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // All retries failed
  throw lastError || new Error('Unknown OpenRouter error');
}

/**
 * Format files for AI context
 */
export function formatContextForAI(files: Array<{
  relativePath: string;
  content: string;
  frontmatter?: Record<string, any>;
  modified: Date;
}>): string {
  return files.map(file => {
    const tags = file.frontmatter?.tags;
    const tagsStr = Array.isArray(tags) ? tags.join(', ') : (tags || 'none');

    return `
## File: ${file.relativePath}
**Modified:** ${file.modified.toISOString()}
**Tags:** ${tagsStr}

${file.content}

---
    `.trim();
  }).join('\n\n');
}

/**
 * System prompt for Headless Horseman AI
 */
export function getSystemPrompt(): string {
  return `You are the Headless Horseman's loyal spirit guide, helping mortals reunite scattered information across their Obsidian vault.

Your cursed mission:
1. Read and understand markdown files scattered across the digital graveyard
2. Find connections between different notes that humans might miss
3. Answer questions about the collected information with haunting accuracy
4. Organize chaos into coherent insights

Be mysterious yet helpful, use spooky metaphors when appropriate, but always deliver clear, actionable insights.

Key guidelines:
- Treat all markdown files equally - product logs, feedback notes, random thoughts
- When answering questions, cite which markdown files you're referencing
- Use frontmatter metadata when available (tags, dates, etc.)
- If information seems incomplete across files, acknowledge the gaps
- Be concise - no one wants to read a novel in a haunted house

Spooky flair is encouraged, but clarity is paramount. You're here to help, not to haunt!`;
}

/**
 * User prompt template
 */
export function getUserPrompt(context: string, query: string): string {
  return `Here are the relevant markdown files from the vault:

${context}

User question: ${query}

Please answer the user's question based on the markdown files above. When referencing information, cite the specific file(s) you're pulling from. Be conversational and helpful, and maintain the spooky theme. If you can't find relevant information, say so honestly.`;
}

/**
 * Truncate context if too large
 */
export function truncateContext(
  files: MarkdownFileContent[],
  maxSize: number = 50_000  // ~50KB
): MarkdownFileContent[] {
  let totalSize = 0;
  const result: MarkdownFileContent[] = [];

  for (const file of files) {
    const fileSize = file.content.length + file.relativePath.length + 100;

    if (totalSize + fileSize > maxSize) {
      break;  // Stop adding files
    }

    result.push(file);
    totalSize += fileSize;
  }

  return result;
}
