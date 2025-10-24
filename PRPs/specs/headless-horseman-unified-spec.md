# 🎃 The Headless Horseman's Quest - Unified Specification

**Project:** Haunted Information Aggregator for Obsidian Vaults
**Hackathon:** Vibe Games
**Build Time:** ~25 minutes (12 parallel agents)
**Status:** Ready for Implementation

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technical Architecture](#technical-architecture)
3. [User Experience & Design](#user-experience--design)
4. [Business Logic & Rules](#business-logic--rules)
5. [Demo Strategy](#demo-strategy)
6. [Implementation Roadmap](#implementation-roadmap)

---

## 🎯 Executive Summary

### The Concept
**The Headless Horseman's Quest** helps users reunite scattered Obsidian markdown files through a haunted information aggregator powered by AI. When your notes are scattered across the digital graveyard, you need a spirit guide to find the missing pieces.

### Core Value Proposition
- **Gather:** Scan Obsidian vaults to discover all scattered .md files
- **Organize:** Beautiful dark dashboard showing all files in one place
- **Understand:** AI-powered chat that reads and answers questions about your files

### Tech Stack
- **Frontend:** Next.js 14+ (App Router, TypeScript, Tailwind CSS, shadcn/ui)
- **Backend:** Next.js API Routes + Server Actions
- **File Operations:** Node.js `fs` module (server-side only)
- **AI:** OpenRouter API (Claude/GPT models)
- **Markdown:** gray-matter (frontmatter) + remark (rendering)
- **State:** TanStack Query (optional)
- **Deployment:** Vercel

### Success Criteria
✅ User can point app at Obsidian vault (or use demo vault)
✅ Dashboard shows all scattered markdown files beautifully
✅ AI can answer questions by reading relevant files with citations
✅ Spooky theme enhances without hurting UX
✅ Demo-ready in 25 minutes

---

## 🏗️ Technical Architecture

### Directory Structure
```
headless-horseman-quest/
├── app/
│   ├── layout.tsx                 # Root layout (spooky theme)
│   ├── page.tsx                   # Landing/Dashboard
│   ├── settings/
│   │   └── page.tsx              # Vault configuration
│   ├── graveyard/
│   │   ├── page.tsx              # File dashboard
│   │   └── [fileId]/page.tsx     # File viewer
│   ├── spirit-medium/
│   │   └── page.tsx              # AI chat
│   └── api/
│       ├── vault/
│       │   ├── scan/route.ts     # Scan vault for files
│       │   └── read/route.ts     # Read specific file
│       └── chat/route.ts         # OpenRouter AI chat
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── graveyard/                 # File list, cards, viewer
│   ├── settings/                  # Vault config
│   └── spirit-medium/             # Chat interface
├── lib/
│   ├── openrouter.ts             # OpenRouter client
│   ├── markdown.ts               # Markdown parsing
│   ├── vault.ts                  # Vault operations
│   └── types.ts                  # TypeScript types
├── demo-vault/                    # Sample markdown files
│   ├── product-logs/
│   ├── feedback/
│   └── random-notes/
└── .env.local                     # Environment variables
```

### Key API Routes

**`/api/vault/scan` (GET)**
- Recursively scans vault directory for .md files
- Returns metadata: filename, path, size, modified date, preview
- Excludes hidden files/folders (starts with .)
- Maximum preview: 200 characters

**`/api/vault/read` (GET)**
- Reads specific file by ID (base64 encoded relative path)
- Parses frontmatter with gray-matter
- Returns full content + metadata
- Security: Validates path within vault

**`/api/chat` (POST)**
- Receives user query + optional file IDs
- Selects max 5 relevant files (keyword matching)
- Builds context with file contents
- Sends to OpenRouter with system prompt
- Returns AI response + source citations

### Data Models

**MarkdownFile:**
```typescript
interface MarkdownFile {
  id: string;              // base64(relativePath)
  filename: string;        // "bug-report-001.md"
  relativePath: string;    // "product-logs/bug-report-001.md"
  absolutePath: string;    // Full system path (server-side only)
  size: number;           // bytes
  modified: Date;
  created: Date;
  frontmatter?: object;   // Parsed YAML
  preview: string;        // First 200 chars
  isOversized: boolean;   // > 1MB
}
```

**AI Context Selection:**
```javascript
function selectRelevantFiles(query, files, maxFiles = 5) {
  // Score each file based on keyword matches in:
  // - Filename (score: 3)
  // - Path (score: 2)
  // - Preview (score: 1)
  // - Tags (score: 2)
  // Return top 5 scoring files
}
```

---

## 🎨 User Experience & Design

### Spooky Dark Theme
**Colors:**
```css
--haunted-purple: #2D1B69;      /* Deep purple background */
--halloween-orange: #FF6B35;    /* Orange CTAs/accents */
--graveyard-black: #0D0221;     /* Near-black elements */
--ghost-white: #FCFCFC;         /* Text color */
--mystic-purple: #6A4C93;       /* Hover states */
--midnight-blue: #1A1A2E;       /* Cards/panels */
```

**Typography:**
- **Headings:** Creepster or Eater (spooky display font)
- **Body:** Inter or Roboto (clean sans-serif)
- **Code:** Fira Code (monospace)

**Icons:**
- 👻 Ghost (files, AI messages)
- 🎃 Pumpkin (success states)
- 🪦 Tombstone (delete, empty states)
- 🕸️ Spider web (decorative)
- 🔮 Crystal ball (AI chat)
- 🗝️ Key (settings)

### Key User Flows

**First-Time User:**
```
Landing → Settings → Configure Vault → Scan → Dashboard → Browse Files → AI Chat
```

**Recurring User:**
```
Dashboard → Search/Filter → View File → AI Chat → Ask Question
```

### Core Pages

**Settings Page (`/settings`):**
- Vault path input with validation
- "Scan the Graveyard" button (primary CTA)
- Demo vault option
- Scan results: file count, last scan time

**Dashboard (`/graveyard`):**
- File grid/list view
- Search bar (filters filename/path)
- Folder filter dropdown
- File cards: preview, date, size, folder badge
- Click → opens file viewer

**File Viewer (`/graveyard/[id]`):**
- Full markdown content rendered
- Metadata sidebar (filename, path, date, size, frontmatter)
- Breadcrumb navigation
- Back to dashboard button

**AI Chat (`/spirit-medium`):**
- Chat interface with message bubbles
- User queries + AI responses
- File citations shown below AI answers
- Spooky loading state: "Consulting the spirits..."
- Suggested questions when empty

### Loading & Error States

**Vault Scanning:**
- Loading: "Searching the graveyard..." 👻
- Success: "Found X markdown souls! 🎃"
- Error: "The graveyard is unreachable... 🪦"

**AI Thinking:**
- Loading: "Consulting the spirits..." 🔮
- Success: AI response with citations
- Error: "The spirits are silent... 👻"

**Empty States:**
- No files: "The graveyard is empty... 🪦"
- No search results: "No spirits match your search 👻"
- File not found: "This ghost has vanished 👻"

---

## 📜 Business Logic & Rules

### File Processing
- **Only .md files** processed (ignore all other types)
- **Maximum file size:** 1MB (truncated preview if larger)
- **Preview length:** First 200 characters (exclude frontmatter)
- **Recursive scanning:** All subdirectories included
- **Hidden files:** Ignored (. prefix)

### Vault Configuration
- **Path types:** Absolute paths only (no relative)
- **Validation:** Check path exists + read permissions
- **Persistence:** Store in localStorage (`obsidian_vault_path`)
- **Demo mode:** Auto-trigger if no path configured

### Search & Filtering
- **Search scope:** Filename + path (not content in MVP)
- **Match type:** Case-insensitive substring
- **Folder filter:** Show only files in selected folder
- **Combination:** Search + filter work together (AND)

### AI Chat Logic
- **System prompt:** Headless Horseman spirit guide persona
- **Context selection:** Max 5 files via keyword scoring
- **Context format:** File path + full content
- **Response requirements:** Answer + citations + confidence
- **Model:** Claude 3 Haiku (fast, cheap)
- **Max tokens:** 1000 (concise responses)

### Data Integrity
- **Read-only:** No file editing/creation/deletion in MVP
- **No database:** Files are source of truth
- **Persistence:** Only vault path in localStorage
- **Chat history:** Ephemeral (resets on refresh)

### Demo Vault
- **Location:** `/demo-vault` in project root
- **File count:** 10-15 sample markdown files
- **Structure:** 3 folders (product-logs, feedback, random-notes)
- **Content:** Spooky themed but realistic

---

## 🎬 Demo Strategy

### 3-Minute Demo Script

**[0:00-0:30] Introduction:**
- "Ever feel like your notes are scattered across the digital realm?"
- Show landing page with spooky title
- Click "Enter the Graveyard"

**[0:30-1:00] Vault Scanning:**
- Show settings page
- Click "Use Demo Vault"
- Watch scan animation
- "15 files discovered!"
- Auto-redirect to dashboard

**[1:00-1:45] Dashboard Exploration:**
- Show file grid with spooky cards
- Search for "bug" → 3 files appear
- Click file → View full markdown
- Return to dashboard

**[1:45-2:30] AI Spirit Medium:**
- Navigate to chat
- Ask: "What notes mention product issues?"
- AI responds with summary + citations
- Ask: "Summarize user feedback"
- AI provides coherent answer from multiple files

**[2:30-3:00] Closing:**
- "The Headless Horseman has found his scattered thoughts!"
- "Built in 25 minutes with 12 parallel AI agents"
- "Questions?"

### Key Wow Factors

**Visual:**
- Elegant dark theme (not just black background)
- Smooth hover/click animations
- Professional typography
- Consistent spooky branding

**Performance:**
- Scan completes in <2 seconds
- Instant search/filter
- AI responds in 2-5 seconds

**AI Intelligence:**
- Actually reads 3-5+ files per query
- Provides citations with specific file names
- Coherent summaries connecting info across files
- Maintains spooky personality without sacrificing clarity

### Demo Vault Content
- 16 files total (15 content + README)
- Interconnected (files reference each other)
- Realistic product development scenarios
- Optimized for demo queries:
  - "What bugs are mentioned?" → 3-5 file matches
  - "Summarize user feedback" → AI connects multiple files
  - "What features are requested?" → Organized extraction

### Backup Plans

**If OpenRouter down:**
- Show hardcoded example responses
- Still demonstrates UI and concept

**If file reading fails:**
- Load from static JSON fallback
- Fully functional demo

**If deployment broken:**
- Run localhost with screen share
- Works identically

---

## 🚀 Implementation Roadmap

### Phase 1: Project Setup (5 min)
- [ ] Create Next.js 14 project with TypeScript
- [ ] Install dependencies: gray-matter, remark, TanStack Query, shadcn/ui
- [ ] Set up Tailwind with custom spooky theme colors
- [ ] Configure .env.local with OPENROUTER_API_KEY

### Phase 2: Demo Vault Creation (5 min)
- [ ] Create `/demo-vault` directory structure
- [ ] Write 15 sample markdown files with frontmatter
- [ ] Ensure interconnected references
- [ ] Add README explaining demo vault

### Phase 3: Backend Implementation (10 min)
- [ ] `/api/vault/scan` - Recursive file scanning
- [ ] `/api/vault/read` - File reading with frontmatter parsing
- [ ] `/api/chat` - OpenRouter integration with context building
- [ ] Vault path validation utilities
- [ ] Security: Path sanitization

### Phase 4: Frontend Components (15 min)
- [ ] Settings page: Vault config + scan button
- [ ] Dashboard: File grid with search/filter
- [ ] File viewer: Markdown rendering + metadata
- [ ] AI chat: Message bubbles + citations
- [ ] shadcn/ui components: Button, Card, Input
- [ ] Loading/error states for all flows

### Phase 5: Styling & Polish (10 min)
- [ ] Apply spooky dark theme consistently
- [ ] Add hover animations on cards
- [ ] Smooth transitions between pages
- [ ] Emoji icons throughout
- [ ] Responsive adjustments (desktop priority)

### Phase 6: Testing & Demo Prep (10 min)
- [ ] Test vault scanning with demo vault
- [ ] Test search/filter functionality
- [ ] Test AI chat with sample queries
- [ ] Verify all error states work
- [ ] Run through 3-minute demo script
- [ ] Take screenshots as backup

### Total Time: ~55 minutes
**Target: <25 minutes for MVP**
(Some tasks can run in parallel via agents!)

---

## ✅ MVP Validation Checklist

### Core Features Working
- [ ] User can configure vault path
- [ ] Scan discovers all .md files recursively
- [ ] Dashboard displays files with previews
- [ ] Search filters by filename/path
- [ ] Clicking file shows full content
- [ ] AI chat responds to queries
- [ ] AI includes file citations
- [ ] Demo vault loads automatically

### UX Requirements
- [ ] Dark theme applied consistently
- [ ] Spooky icons/emojis throughout
- [ ] Smooth animations (hover, transitions)
- [ ] Loading states for async operations
- [ ] Error messages are helpful
- [ ] Empty states guide user

### Technical Requirements
- [ ] File operations server-side only
- [ ] OpenRouter API integrated
- [ ] Frontmatter parsed correctly
- [ ] Preview truncated to 200 chars
- [ ] Max 5 files sent to AI
- [ ] Vault path persists in localStorage

### Demo Readiness
- [ ] Demo vault has 15 interconnected files
- [ ] Scan completes in <2 seconds
- [ ] AI responds in <5 seconds
- [ ] No console errors
- [ ] Deployed to Vercel successfully
- [ ] Backup plans ready

---

## 🎃 Success Criteria

**This hackathon MVP succeeds if:**

1. **The Headless Horseman finds his head** - Scattered markdown files are reunited
2. **AI genuinely helps** - Answers are accurate and cite real file sources
3. **Theme delights** - Spooky aesthetic enhances, doesn't distract
4. **Demo impresses** - 3-minute walkthrough gets "wow" reactions
5. **Build speed amazes** - Mentioning "built in 25 minutes" is credible

**Ultimate test:** *"Would I actually use this for my own scattered notes?"*
- If YES → Ship it! 🚀
- If NO → Fix the critical gap

---

## 📊 Technologies Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI development |
| Backend | Next.js API Routes | Server-side logic |
| File Operations | Node.js `fs` module | Read markdown files |
| Markdown Parsing | gray-matter + remark | Frontmatter + rendering |
| AI | OpenRouter API | LLM integration |
| State Management | TanStack Query (optional) | Server state caching |
| Deployment | Vercel | Instant deployment |

---

## 🕸️ Final Notes

### What Makes This Special
- **Memorable metaphor:** Headless Horseman = scattered information seeking reunion
- **Real AI value:** Not a gimmick - genuinely reads and understands files
- **Beautiful execution:** Dark theme is elegant, professional
- **Rapid build:** 25 minutes with parallel agents is genuinely impressive
- **Solves real pain:** Anyone with notes has felt this problem

### Key Implementation Principles
1. **Server-side file access only** - Security + Next.js compatibility
2. **Lazy loading** - Don't read all files upfront
3. **Simple search for MVP** - Keyword matching, not vector DB
4. **Spooky but usable** - Theme enhances, never hinders
5. **Demo-first development** - Build what shows well

### After the Hackathon
This MVP proves the concept. To productionize:
- Add file watching for real-time updates
- Implement vector search for semantic queries
- Support multiple vaults per user
- Add user authentication
- Persistent chat history
- Markdown editing capabilities
- Mobile app or browser extension

---

**Now go forth and reunite the Headless Horseman's scattered markdown souls! 👻🎃🕸️**

*May the spirits guide your implementation...*
