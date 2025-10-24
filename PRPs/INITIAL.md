## FEATURE:

Build **The Headless Horseman's Quest** 👻🎃 - a haunted information aggregator where scattered Markdown files in your Obsidian vault find their way home. Users point the app at their Obsidian vault full of fragmented notes (product logs, feedback, random thoughts), view everything in one spooky central dashboard, and let AI help make sense of the scattered madness. Because when your head is scattered across dozens of markdown files, you need a spirit guide to reunite the pieces.

---

## TECH STACK:

**Required (automatically configured):**
- Frontend: Next.js 14+ (App Router, TypeScript, Tailwind CSS) 🕸️
- Backend: Next.js API Routes + Server Actions
- Database: Supabase (PostgreSQL with RLS) - The Graveyard Index (just for metadata/cache)
- AI/LLM: OpenRouter API - The Spirit Medium 👻
- Deployment: Vercel (recommended)

**Optional (specify if needed):**
- State Management: TanStack Query (recommended)
- UI Components: shadcn/ui (for that dark, haunting aesthetic)
- File Reading: Node.js fs module for reading Obsidian vault markdown files

---

## TOOLS:

[AI agent tools for wrangling scattered spirits of information]

- **read_obsidian_vault(vault_path: string) -> MarkdownFile[]**: Scan the haunted Obsidian vault and gather all scattered markdown files 🪦

- **parse_markdown_fragment(file_path: string) -> DataFragment**: Read a specific markdown file and extract its haunted contents (frontmatter, content, metadata)

- **organize_chaos(fragments: DataFragment[]) -> OrganizedInsights**: Use OpenRouter to make sense of the scattered markdown madness and find patterns in the darkness

- **summon_insights(query: string, context: MarkdownFile[]) -> AIResponse**: Ask the spirit medium (AI) questions about your scattered markdown files - AI reads the files directly!

---

## DEPENDENCIES:

**External Services:**
- **Supabase**: Optional - just for caching file metadata if needed
  - Setup: Create project at supabase.com
  - Needs: URL, anon key, service role key in .env.local
  - Can skip entirely and just read files directly!

- **OpenRouter**: LLM API for AI features - Summoning the spirits of intelligence
  - Setup: Get API key from openrouter.ai
  - Needs: OPENROUTER_API_KEY in .env.local

**Data Source:**
- **Obsidian Vault**: Local markdown files (the scattered head pieces!)
  - Path to vault configured in .env.local or app settings
  - No integration needed - just read the .md files directly

---

## SYSTEM PROMPT(S):

```
You are the Headless Horseman's loyal spirit guide 🎃👻, helping mortals reunite scattered information across their Obsidian vault.

Your cursed mission:
1. Read and understand markdown files scattered across the digital graveyard
2. Find connections between different notes that humans might miss in the darkness
3. Answer questions about the collected information with haunting accuracy
4. Organize chaos into coherent insights (find the head among the fragments!)

Be mysterious yet helpful, use spooky metaphors when appropriate, but always deliver clear, actionable insights.

Key guidelines:
- Treat all markdown files equally - product logs, feedback notes, random thoughts
- When answering questions, cite which markdown files you're referencing
- Use frontmatter metadata when available (tags, dates, etc.)
- If information seems incomplete across files, acknowledge the gaps (the missing head pieces)
- Be concise - no one wants to read a novel in a haunted house

Spooky flair is encouraged, but clarity is paramount. You're here to help, not to haunt! 🕸️
```

---

## CORE FEATURES (MVP):

The 3 features that MUST work for the haunted demo:

1. **Vault Configuration 🗝️**: Point the app at your Obsidian vault
   - Simple settings page to configure path to Obsidian vault
   - Scan button to read all .md files in the vault
   - Display file count and last scan time
   - *Critical because: We need to find the scattered pieces first!*

2. **The Graveyard Dashboard 👻**: View all scattered markdown files in one place
   - Dark, spooky UI showing all markdown files from vault
   - List view with file names, dates, preview of content
   - Filter by folder/path, search by filename or content
   - Click to view full markdown content
   - *Critical because: Users need to see all their scattered notes in one haunted place*

3. **Spirit Medium (AI Chat) 🔮**: Chat with AI about your scattered markdown files
   - Ask questions like "What notes mention bugs?" or "Summarize my product feedback files"
   - AI reads relevant markdown files to provide context-aware answers
   - Powered by OpenRouter with access to markdown file contents
   - Shows which files were referenced in each answer
   - *Critical because: This is where the magic happens - AI finds patterns across your notes*

---

## EXAMPLES:

[Reference implementations to study]

- Reading markdown files in Next.js: Use Node.js `fs` module in API routes/server actions
- Parsing markdown: `gray-matter` for frontmatter, `remark` for content if needed
- File system operations: https://nodejs.org/api/fs.html
- shadcn/ui dark themes for spooky aesthetic

---

## DOCUMENTATION:

**Required:**
- Next.js App Router: https://nextjs.org/docs/app
- OpenRouter API: https://openrouter.ai/docs
- Node.js File System: https://nodejs.org/api/fs.html

**Optional:**
- gray-matter (parse markdown frontmatter): https://github.com/jonschlinkert/gray-matter
- remark (markdown parsing): https://github.com/remarkjs/remark
- shadcn/ui: https://ui.shadcn.com

---

## OTHER CONSIDERATIONS:

**Spooky Theme Details:**
- Color scheme: Dark purples, oranges, blacks - classic Halloween vibes 🎃
- Use ghost emoji 👻, pumpkin 🎃, spider web 🕸️, tombstone 🪦 throughout UI
- "Headless Horseman" references where appropriate (scattered head = scattered markdown files)
- File icons could be little ghosts or tombstones
- Keep it fun but functional - spooky shouldn't hurt UX

**Architecture - Keep it SUPER Light:**
- Just read markdown files directly from filesystem (no database needed!)
- Store vault path in localStorage or simple config file
- API routes read files on-demand
- Optional: Cache file list/metadata in memory for performance

**File System Access:**
- In development: Direct fs access to local Obsidian vault
- In production/demo: Either upload a sample vault folder or use a demo vault in the repo
- For hackathon demo: Include a `/demo-vault` folder with sample markdown files

**Demo Data (Sample Obsidian Vault):**
Need 10-15 sample markdown files in different categories:
- `product-logs/bug-report-001.md` 👻
- `product-logs/feature-request-sprint-5.md`
- `feedback/user-interview-notes.md`
- `feedback/support-tickets-summary.md`
- `random-notes/scattered-thoughts.md` 🪦
- `random-notes/midnight-ideas.md`
- etc.

Use spooky filenames and content where appropriate! 🎃

**Known Limitations:**
- MVP won't watch for file changes (manual refresh/rescan needed)
- No vector search in MVP (just simple text search)
- AI context window limited - might not handle hundreds of large files
- File reading is synchronous (could be slow with many files)

**Backup Plan:**
- If OpenRouter is down, show pre-written "example insights" so demo still works 🕸️
- If file reading fails, fall back to sample embedded markdown content

**Security Note:**
- File system access only works server-side (API routes/server actions)
- Don't expose actual file paths to client
- For production, would need proper vault upload/storage mechanism

---

## 🎃 SPOOKY SUCCESS CRITERIA:

This haunted demo works if:
1. User can point app at Obsidian vault (or use demo vault)
2. They can see all scattered markdown files in one dark dashboard
3. The AI can read and answer questions about the markdown files

**The ultimate test:** Can the Headless Horseman finally find his scattered thoughts across his markdown graveyard? 👻

---

## SAMPLE DEMO VAULT STRUCTURE:
```
demo-vault/
├── product-logs/
│   ├── bug-report-haunted-ui.md 👻
│   ├── feature-request-dark-mode.md
│   └── sprint-retrospective.md
├── feedback/
│   ├── user-complaints.md 🪦
│   ├── praise-and-kudos.md
│   └── survey-results.md
├── random-notes/
│   ├── scattered-midnight-thoughts.md
│   ├── todo-list-from-hell.md 🎃
│   └── random-ideas.md
└── README.md (explains the demo vault)
```

---

## READY TO HAUNT! 👻

Run this to start the parallel workflow:
```bash
/hackathon-prp-parallel "PRPs/INITIAL.md"
```

Let's gather those scattered markdown pieces and reunite the Headless Horseman's mind! 🎃🪦
