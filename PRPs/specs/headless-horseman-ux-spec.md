# The Headless Horseman's Quest - UX Specification 👻

**Version:** 1.0
**Date:** 2025-10-24
**Status:** Draft for Review

---

## 🎯 Executive Summary

The Headless Horseman's Quest is a haunted information aggregator that helps users reunite scattered Obsidian markdown files. This UX specification defines the complete user experience, from first-time discovery to power-user workflows, with a spooky-but-functional dark theme that enhances rather than obscures usability.

**Key Design Principles:**
1. **Spooky yet Clear** - Halloween aesthetics that enhance, not hinder, UX
2. **Discovery-Friendly** - First-time users understand the app immediately
3. **Speed-Optimized** - Desktop-first for hackathon demo velocity
4. **Delightful Loading** - Async operations feel magical, not frustrating
5. **Citation-First AI** - Trustworthy AI responses with clear sourcing

---

## 📐 Design System

### Color Palette - "Haunted Harvest"

```css
/* Primary Colors */
--graveyard-black: #0a0a0a        /* Pure background */
--midnight-black: #121212         /* Card backgrounds */
--shadow-gray: #1a1a1a            /* Secondary surfaces */
--ghost-gray: #2a2a2a             /* Borders/dividers */

/* Accent Colors */
--pumpkin-orange: #ff7518         /* Primary CTA, highlights */
--dark-orange: #e65f00            /* Hover states */
--mystic-purple: #8b5cf6          /* Secondary accent */
--deep-purple: #6b21a8            /* Purple states */

/* Semantic Colors */
--warning-orange: #fb923c         /* Warnings, errors */
--success-green: #4ade80          /* Success states */
--info-blue: #60a5fa              /* Info states */

/* Text Colors */
--text-primary: #ffffff           /* Primary text */
--text-secondary: #a1a1aa         /* Secondary text */
--text-tertiary: #71717a          /* Tertiary/muted text */
--text-accent: #fbbf24            /* Accent text (golden) */
```

### Typography

**Font Stack:**
```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
                'Helvetica Neue', Arial, sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
```

**Type Scale:**
```
Display (Hero):     60px / 3.75rem (font-bold, line-height: 1.1)
H1:                 48px / 3rem (font-bold, line-height: 1.2)
H2:                 36px / 2.25rem (font-bold, line-height: 1.3)
H3:                 24px / 1.5rem (font-semibold, line-height: 1.4)
H4:                 20px / 1.25rem (font-semibold, line-height: 1.5)
Body Large:         18px / 1.125rem (font-normal, line-height: 1.6)
Body:               16px / 1rem (font-normal, line-height: 1.6)
Body Small:         14px / 0.875rem (font-normal, line-height: 1.5)
Caption:            12px / 0.75rem (font-normal, line-height: 1.4)
```

### Spacing System (8px base unit)

```
2xs: 4px
xs:  8px
sm:  12px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
4xl: 96px
```

### Border Radius

```
sm:  8px   (Pills, tags)
md:  12px  (Buttons, inputs)
lg:  16px  (Cards)
xl:  24px  (Modals, large containers)
```

### Shadows

```css
/* Glow effects for spooky aesthetic */
--shadow-orange-glow: 0 0 20px rgba(255, 117, 24, 0.3);
--shadow-purple-glow: 0 0 20px rgba(139, 92, 246, 0.3);
--shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
               0 2px 4px -1px rgba(0, 0, 0, 0.2);
--shadow-modal: 0 20px 25px -5px rgba(0, 0, 0, 0.5),
                0 10px 10px -5px rgba(0, 0, 0, 0.3);
```

### Iconography - Spooky Emoji Set

```
Primary App Icon:   👻 (Ghost)
Files/Documents:    🪦 (Tombstone), 📄
Folders:            📁
Search:             🔍, 🔮 (alternate: mystical search)
AI/Chat:            🔮 (Crystal Ball)
Loading:            ⏳, 💀 (skull for dramatic effect)
Success:            ✨, 🎃
Error:              ⚠️, 🕷️ (Spider)
Info:               💡, 🕸️
Settings:           ⚙️
Stats:              📊, 📈
Tags:               🏷️, 🦇 (Bat)
Date:               📅
Close/Exit:         ✕, 🚪
```

---

## 🗺️ User Journeys

### Journey 1: First-Time User Discovery

**Persona:** Sarah, Product Manager with 200+ scattered Obsidian notes

**Entry Point:** Clicks demo link from hackathon presentation

**Flow:**

```
1. Landing (0s)
   └─> Sees "👻 The Graveyard" hero with spooky visuals
   └─> Reads tagline: "15 scattered markdown files reunited"
   └─> Stats dashboard shows immediate value
   └─> Reaction: "Oh, this already has my demo data loaded!"

2. Exploration (5s)
   └─> Scrolls to stats cards showing file counts, tags, word counts
   └─> Notices folder filter pills (product-logs, feedback, random-notes)
   └─> Reaction: "I can filter by category - nice!"

3. File Discovery (10s)
   └─> Sees grid of tombstone-styled file cards
   └─> Hovers over card → subtle glow effect
   └─> Clicks on "Bug Report: Haunted UI"
   └─> Modal opens with full markdown content
   └─> Reaction: "This is clean and readable!"

4. AI Interaction (30s)
   └─> Scrolls to "🔮 AI Spirit Medium" section
   └─> Sees example questions pre-populated
   └─> Clicks example: "What bugs are mentioned?"
   └─> Loading state: "Consulting the spirits..." with pulsing animation
   └─> AI response appears with citations in markdown
   └─> Reaction: "It actually read my files and cited sources!"

5. Conversion (45s)
   └─> Tests search bar with custom query
   └─> Tries folder filters
   └─> Asks AI custom question about feedback files
   └─> Mental model: "This is like grep + ChatGPT for my notes"
   └─> Outcome: Bookmarks demo, shares with team
```

**Success Metrics:**
- User completes all 5 steps in < 60 seconds
- User asks at least 1 custom AI question
- User understands file organization without instructions

---

### Journey 2: Returning Power User

**Persona:** Marcus, Developer with configured vault path

**Entry Point:** Opens app from bookmark

**Flow:**

```
1. Quick Scan (0s)
   └─> Lands on dashboard
   └─> Uses Cmd+K to jump to search
   └─> Types query: "authentication"
   └─> Sees 3 matching files instantly
   └─> Opens first result

2. Deep Dive (10s)
   └─> Reads full file content in modal
   └─> Presses Esc to close
   └─> Opens second result
   └─> Copies code snippet from markdown

3. AI Research (20s)
   └─> Scrolls to AI chat
   └─> Asks: "What security concerns are mentioned in feedback?"
   └─> Gets response with 3 file citations
   └─> Clicks citation link (future: jumps to file)
   └─> Gets answer in < 5 seconds

4. Outcome (30s)
   └─> Found what they needed
   └─> Exported notes to external tool
   └─> Closed tab
```

**Success Metrics:**
- Task completion < 60 seconds
- Zero confusion/friction points
- Keyboard shortcuts used naturally

---

### Journey 3: Error Recovery

**Persona:** Julia, Designer testing the demo

**Entry Point:** Sharing demo link with colleagues

**Scenario:** AI API fails during demo

**Flow:**

```
1. Happy Path Start (0s)
   └─> Shows colleague file browsing
   └─> Demonstrates search functionality
   └─> All working perfectly

2. Error Encountered (15s)
   └─> Colleague asks AI question
   └─> API timeout occurs
   └─> Loading state shows: "Consulting the spirits..."
   └─> After 10s: Error message appears

3. Error State (25s)
   └─> Message: "🕷️ The spirits are silent... (API timeout)"
   └─> Helpful subtext: "Try again, or browse files manually"
   └─> Retry button appears
   └─> Previous messages preserved in chat

4. Recovery (30s)
   └─> Clicks retry button
   └─> New request succeeds
   └─> Chat continues seamlessly
   └─> Colleague impressed by graceful handling

5. Outcome
   └─> Demo continues successfully
   └─> Error didn't break user trust
   └─> Manual browsing still valuable
```

**Success Metrics:**
- User understands what went wrong
- User knows how to recover
- Error doesn't break app state
- User can continue using other features

---

## 🎨 Component Specifications

### 1. Hero Section

**Location:** Top of homepage

**Purpose:** Immediate value communication with spooky branding

**Visual Design:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              👻 The Graveyard 👻               │
│       (60px, bold, white, letter-spacing)      │
│                                                 │
│      15 scattered markdown files reunited      │
│         (20px, gray-400, regular)              │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Interaction:**
- Static text (no hover states)
- File count updates dynamically based on vault contents

**Accessibility:**
- Ghost emoji has aria-label: "Ghost icon"
- H1 semantic heading for SEO/screen readers

**Responsive:**
- Desktop: 60px title, 20px subtitle
- Tablet: 48px title, 18px subtitle
- Mobile: 36px title, 16px subtitle

---

### 2. Stats Dashboard

**Location:** Below hero, above file grid

**Purpose:** Quick vault insights and activity overview

**Layout:**
```
┌──────────┬──────────┬──────────┬──────────┐
│ 📚       │ 🏷️      │ 📝       │ 📊       │
│ 15       │ 42       │ 12,450   │ 830      │
│ Total    │ Unique   │ Total    │ Avg      │
│ Files    │ Tags     │ Words    │ Words    │
└──────────┴──────────┴──────────┴──────────┘

┌──────────────────────┬──────────────────────┐
│ 📁 Files by Folder   │ 🔥 Top Tags         │
│                      │                      │
│ product-logs    8 ━━ │ #bug        5       │
│ feedback        4 ━━ │ #feature    4       │
│ random-notes    3 ━━ │ #urgent     3       │
│                      │ #ui         2       │
└──────────────────────┴──────────────────────┘
```

**Card Styles:**
- Background: Gradient blur (from-purple-900/30 to-purple-800/20)
- Border: 1px colored with opacity (purple/orange/green/blue)
- Border-radius: 16px
- Padding: 24px
- Hover: Subtle lift (transform: translateY(-2px))

**Interaction:**
- Stats cards: Static (future: click to filter)
- Folder bars: Animated on load (width transition 500ms)
- Tag pills: Static (future: click to filter)

**Accessibility:**
- Each stat card has descriptive label
- Color not sole indicator (text labels present)
- Keyboard focusable if interactive

**Loading State:**
```
┌──────────────────────────────────────┐
│         ⏳ Gathering statistics...   │
│         (Pulsing animation)          │
└──────────────────────────────────────┘
```

**Error State:**
```
┌──────────────────────────────────────┐
│ ⚠️ Could not load statistics        │
│ Files may still be available below   │
└──────────────────────────────────────┘
```

---

### 3. Search Bar & Filters

**Location:** Above file grid

**Purpose:** Fast file discovery with folder filtering

**Layout:**
```
┌────────────────────────────────────────────────┐
│ 🔍 Search files by name, content, or tags...  │
│                                          (⌘K)  │
└────────────────────────────────────────────────┘

[All Files] [product-logs] [feedback] [random-notes]
```

**Search Input:**
- Background: rgba(10, 10, 10, 0.5) (semi-transparent)
- Border: 1px orange-500/30
- Border-radius: 12px
- Padding: 16px 20px
- Font-size: 18px
- Placeholder: "🔍 Search files by name, content, or tags... (⌘K)"

**Keyboard Shortcuts:**
- Cmd/Ctrl + K: Focus search input
- Escape: Clear search and unfocus
- Enter: Keep focus, update results

**Filter Pills:**
- Default (unselected): bg-gray-800/50, text-gray-400
- Selected: bg-orange-500, text-white, shadow-orange-glow
- Hover (unselected): bg-gray-800, text-white
- Padding: 8px 16px
- Border-radius: 8px
- Font-weight: 600 (semibold)

**Interaction Flow:**
```
1. User types "bug" in search
   └─> Instant filter (no submit button)
   └─> Results update in real-time
   └─> Shows "Showing 3 of 15 files for 'bug'"

2. User clicks [product-logs] pill
   └─> Combined filter (search + folder)
   └─> Shows "Showing 2 of 15 files for 'bug'"
   └─> Results narrow further

3. User clicks X button in search
   └─> Clears search query
   └─> Keeps folder filter active
   └─> Shows "Showing 8 of 15 files"
```

**Results Counter:**
```
Showing 3 of 15 files for "bug"
(14px, gray-400, regular)
```

**Accessibility:**
- Search input has aria-label: "Search markdown files"
- Filter pills have aria-pressed state
- Screen reader announces result count changes

**Loading State:**
- No loading state (instant client-side filtering)

**Empty State:**
- If no results: Show "No files found" message (see File Grid section)

---

### 4. File Grid

**Location:** Main content area

**Purpose:** Browse all markdown files with visual hierarchy

**Grid Layout:**
```
Desktop (3 columns):
┌──────┬──────┬──────┐
│ Card │ Card │ Card │
├──────┼──────┼──────┤
│ Card │ Card │ Card │
└──────┴──────┴──────┘

Tablet (2 columns):
┌──────┬──────┐
│ Card │ Card │
└──────┴──────┘

Mobile (1 column):
┌──────┐
│ Card │
└──────┘
```

**File Card Design:**
```
┌─────────────────────────────────────┐
│ PRODUCT-LOGS                        │ ← Folder badge
│                                     │
│ Bug Report Haunted UI               │ ← Filename (large)
│                                     │
│ Users report seeing ghost emoji     │ ← Preview (3 lines)
│ appearing in random locations...    │
│                                     │
│ [bug] [ui] [urgent]                 │ ← Tags (max 3)
└─────────────────────────────────────┘
```

**Card Styles:**
- Background: rgba(10, 10, 10, 0.5) (semi-transparent)
- Border: 1px gray-800
- Border-radius: 16px
- Padding: 24px
- Gap: 24px between cards

**Hover State:**
- Border: orange-500/50
- Background: rgba(10, 10, 10, 0.8) (more opaque)
- Transform: translateY(-4px)
- Transition: all 300ms ease
- Cursor: pointer

**Active State:**
- Border: orange-500
- Scale: 0.98 (slight press effect)

**Folder Badge:**
- Text: 12px, orange-500, uppercase, bold
- Spacing: tracking-wider (letter-spacing)

**Filename:**
- Text: 20px, white, bold
- Transform: Replace hyphens with spaces
- Hover: text-orange-400 (color shift)

**Preview:**
- Text: 14px, gray-400, regular
- Line-clamp: 3 (truncate after 3 lines)
- Line-height: 1.5

**Tags:**
- Background: orange-500/10
- Border: 1px orange-500/20
- Border-radius: 4px
- Padding: 4px 8px
- Text: 12px, orange-400
- Max display: 3 tags (hide overflow)

**Interaction:**
- Click card → Opens FileModal with full content
- No multi-select (MVP)
- No drag-and-drop (MVP)

**Accessibility:**
- Cards are keyboard focusable (tabindex="0")
- Enter/Space opens modal
- ARIA role="button"
- ARIA label: "Open file {filename}"

**Empty State:**
```
┌─────────────────────────────────────┐
│                                     │
│              🔍                     │
│                                     │
│        No files found               │
│                                     │
│   Try adjusting your search         │
│        or filter                    │
│                                     │
└─────────────────────────────────────┘
```

**Loading State:**
```
Grid of 6 skeleton cards:
┌─────────────────────────────────────┐
│ ▮▮▮▮▮▮▮                            │
│                                     │
│ ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮                   │
│                                     │
│ ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮       │
│ ▮▮▮▮▮▮▮▮▮▮▮▮                      │
│                                     │
└─────────────────────────────────────┘
(Pulsing animation, gray-800 → gray-700)
```

---

### 5. File Modal

**Location:** Overlay (z-index: 50)

**Purpose:** Display full markdown content with metadata

**Layout:**
```
┌────────────────────────────────────────────┐
│ PRODUCT-LOGS                              × │ ← Header
│ Bug Report: Haunted UI                      │
│ 📅 2024-10-20  [bug] [ui] [urgent]         │
├─────────────────────────────────────────────┤
│                                             │
│ # Bug Report: Haunted UI                   │ ← Content
│                                             │   (Scrollable)
│ ## Description                             │
│ Users report seeing ghost emoji...         │
│                                             │
│ (Full markdown content with styling)       │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│                             [Close]         │ ← Footer
└─────────────────────────────────────────────┘
```

**Modal Dimensions:**
- Width: max-w-4xl (896px)
- Height: max-h-[80vh] (80% viewport height)
- Position: Fixed center (flex items-center justify-center)

**Backdrop:**
- Background: rgba(0, 0, 0, 0.8)
- Backdrop-filter: blur(4px)
- Click backdrop → Close modal
- Transition: opacity 300ms

**Modal Container:**
- Background: gray-900
- Border: 1px orange-500/30
- Border-radius: 24px
- Shadow: shadow-modal
- Transition: transform + opacity 300ms

**Header Section:**
- Border-bottom: 1px orange-500/20
- Padding: 24px
- Folder badge: Same as file card
- Filename: 24px, white, bold
- Close button (×): 28px, gray-400 → white on hover

**Metadata Row:**
- Date icon + formatted date (📅 Oct 20, 2024)
- Tags: Same styling as file cards
- Flex layout with gap-4

**Content Section:**
- Padding: 24px
- Overflow-y: auto
- Max-height: Calculated (fills remaining modal height)

**Markdown Styling:**
- Prose: prose-invert (dark theme)
- Headings: orange-400
- Links: orange-500, underline on hover
- Code inline: orange-300, bg-gray-800, rounded, px-1
- Code blocks: bg-gray-800, rounded-lg, padding
- Lists: gray-300
- Blockquotes: border-left orange-500, pl-4, italic
- Images: max-w-full, rounded-lg

**Footer Section:**
- Border-top: 1px orange-500/20
- Padding: 16px 24px
- Justify-content: flex-end

**Close Button:**
- Background: orange-500
- Hover: orange-600
- Padding: 8px 24px
- Border-radius: 8px
- Font-weight: 600
- Transition: background 200ms

**Keyboard Shortcuts:**
- Escape: Close modal
- No tab trap (focus returns to card on close)

**Accessibility:**
- ARIA role="dialog"
- ARIA modal="true"
- Focus trap within modal when open
- Focus returns to triggering card on close
- Close button has aria-label: "Close modal"

**Animation:**
```
Enter:
  Backdrop: opacity 0 → 1 (300ms)
  Modal: scale(0.95) + opacity 0 → scale(1) + opacity 1 (300ms)

Exit:
  Backdrop: opacity 1 → 0 (300ms)
  Modal: scale(1) + opacity 1 → scale(0.95) + opacity 0 (300ms)
```

**Loading State:**
- Not applicable (content pre-loaded with card)

**Error State:**
- If content fails to load:
```
┌─────────────────────────────────────┐
│ 🕷️ Could not load file content    │
│                                     │
│ The file may have been moved        │
│ or deleted.                         │
│                                     │
│              [Close]                │
└─────────────────────────────────────┘
```

---

### 6. AI Chat Interface

**Location:** Bottom of page, after file grid

**Purpose:** Natural language queries with file citations

**Layout:**
```
┌────────────────────────────────────────────────┐
│                    🔮                          │
│            AI Spirit Medium                    │
│                                                │
│  Ask questions about your notes. The AI       │
│  reads through files to find answers and      │
│  provide citations.                           │
├────────────────────────────────────────────────┤
│                                                │
│  [Empty state: Example questions]             │
│  OR                                            │
│  [Chat messages]                               │
│                                                │
├────────────────────────────────────────────────┤
│ [Ask a question about your notes...]   [Ask]  │
└────────────────────────────────────────────────┘
```

**Container Styles:**
- Background: Gradient blur (from-purple-900/20 to-orange-900/20)
- Border: 1px orange-500/20
- Border-radius: 24px
- Padding: 32px

**Header:**
- Icon: 🔮 (48px)
- Title: 36px, white, bold
- Description: 16px, gray-400, max-width 800px, centered

**Chat Area:**
- Background: rgba(0, 0, 0, 0.3)
- Border-radius: 12px
- Padding: 24px
- Min-height: 300px
- Max-height: 500px
- Overflow-y: auto
- Smooth scroll behavior

**Empty State:**
```
┌────────────────────────────────────┐
│     Example Questions:             │
│                                    │
│  "What bugs are mentioned?"        │
│  "Summarize user feedback"         │
│  "What features are users          │
│   requesting?"                     │
│                                    │
│  (Clickable questions)             │
└────────────────────────────────────┘
```

**Example Questions:**
- Display: block, full-width
- Text: 14px, gray-400
- Hover: orange-400, bg-orange-500/10
- Padding: 8px
- Border-radius: 8px
- Cursor: pointer
- Click → Populates input field

**Message Layout:**

**User Message (right-aligned):**
```
                     ┌────────────────────┐
                     │ 👤 You             │
                     │                    │
                     │ What bugs are      │
                     │ mentioned?         │
                     └────────────────────┘
```
- Background: orange-500/20
- Border: 1px orange-500/30
- Border-radius: 16px
- Padding: 16px
- Max-width: 80%
- Text: 14px, white

**AI Message (left-aligned):**
```
┌────────────────────────────────────┐
│ 🔮 Spirit Medium                   │
│                                    │
│ Found 3 bugs mentioned:            │
│                                    │
│ 1. **Haunted UI** - Ghost emoji    │
│    appearing randomly              │
│    *Source: bug-report-haunted-ui* │
│                                    │
│ 2. **Mobile crashes**...           │
│                                    │
│ (Formatted markdown)               │
└────────────────────────────────────┘
```
- Background: purple-900/20
- Border: 1px purple-500/30
- Border-radius: 16px
- Padding: 16px
- Max-width: 80%

**Markdown in AI Messages:**
- Prose: prose-sm prose-invert
- Headings: orange-300
- Links: orange-400
- Strong: white
- Code: orange-200, bg-black/30, px-1, rounded
- Lists: gray-300
- Italics (citations): text-sm, orange-400, opacity-80

**Input Area:**
- Flex layout: input (flex-1) + button
- Gap: 12px

**Input Field:**
- Background: rgba(0, 0, 0, 0.5)
- Border: 1px orange-500/30
- Focus border: orange-500/60
- Border-radius: 12px
- Padding: 12px 16px
- Text: 16px, white
- Placeholder: gray-500
- Disabled opacity: 0.5

**Send Button:**
- Background: orange-500
- Hover: orange-600
- Disabled: gray-700, cursor-not-allowed
- Border-radius: 12px
- Padding: 12px 24px
- Text: 16px, white, font-semibold
- Loading text: "..." (animated dots)

**Interaction Flow:**
```
1. User types question
   └─> Button enabled when input.trim() !== ''

2. User submits (Enter or clicks button)
   └─> Input cleared immediately
   └─> User message added to chat
   └─> Placeholder assistant message added
   └─> Scroll to bottom (smooth)
   └─> Loading state activates

3. AI response streams in
   └─> Placeholder updates in real-time
   └─> User sees partial response
   └─> Scroll follows content

4. Response complete
   └─> Loading state ends
   └─> Input re-enabled
   └─> User can ask follow-up
```

**Auto-Scroll Behavior:**
- Scroll to bottom on new message
- Smooth scroll animation
- If user scrolls up manually, pause auto-scroll
- Resume auto-scroll when near bottom

**Keyboard Shortcuts:**
- Enter: Submit question
- Shift+Enter: New line in input (future)
- Escape: Clear input

**Accessibility:**
- Input has aria-label: "Ask AI a question"
- Button has aria-label: "Send question"
- Chat area has aria-live="polite" (announces new messages)
- Messages have role="log"

**Loading State:**
```
┌────────────────────────────────────┐
│ 🔮 Spirit Medium                   │
│                                    │
│ Consulting the spirits...          │
│ ⏳ (Pulsing animation)             │
└────────────────────────────────────┘
```

**Error States:**

**API Timeout:**
```
┌────────────────────────────────────┐
│ 🔮 Spirit Medium                   │
│                                    │
│ 🕷️ The spirits are silent...      │
│ (API timeout after 30s)            │
│                                    │
│ Try again, or browse files         │
│ manually below.                    │
│                                    │
│ [Retry]                            │
└────────────────────────────────────┘
```

**API Error (500):**
```
┌────────────────────────────────────┐
│ 🔮 Spirit Medium                   │
│                                    │
│ ⚠️ The spirits encountered an      │
│ error. Please try again.           │
│                                    │
│ [Retry]                            │
└────────────────────────────────────┘
```

**No Files Loaded:**
```
┌────────────────────────────────────┐
│ 🔮 Spirit Medium                   │
│                                    │
│ 🪦 No files found in the           │
│ graveyard. Load some files         │
│ first!                             │
└────────────────────────────────────┘
```

**Retry Button:**
- Background: orange-500/20
- Border: 1px orange-500/30
- Hover: orange-500/30
- Padding: 8px 16px
- Border-radius: 8px
- Text: 14px, orange-400

---

### 7. Page Layout & Navigation

**Overall Structure:**
```
┌────────────────────────────────────────┐
│ [No nav bar for MVP - single page]    │
├────────────────────────────────────────┤
│            max-w-6xl mx-auto           │
│            padding: 24px               │
│                                        │
│  1. Hero Section                       │
│  2. Stats Dashboard                    │
│  3. Search & Filters                   │
│  4. File Grid                          │
│  5. AI Chat Interface                  │
│                                        │
│  [No footer for MVP]                   │
└────────────────────────────────────────┘
```

**Container:**
- Max-width: 1152px (6xl)
- Margin: 0 auto
- Padding: 24px
- Background: Gradient from black to deep-purple

**Section Spacing:**
- Gap between sections: 48px (space-y-12)

**Responsive Breakpoints:**
```
Mobile:  < 640px
Tablet:  640px - 1024px
Desktop: > 1024px
```

**Scroll Behavior:**
- Smooth scroll
- No fixed headers (MVP)
- No "back to top" button (page isn't that long)

**Background:**
- Base: graveyard-black (#0a0a0a)
- Gradient overlay: radial-gradient from center
  - Center: transparent
  - Edges: purple-900/10

**Viewport Units:**
- Use dvh (dynamic viewport height) for mobile
- Min-height: 100dvh for full-page layouts

---

## 🎭 Interaction Patterns

### Loading States Philosophy

**Principle:** Loading states should feel magical, not frustrating.

**Timing Guidelines:**
- < 100ms: No loading state (instant)
- 100ms - 1s: Subtle spinner or pulse
- 1s - 5s: Animated loading with spooky message
- > 5s: Progress indicator + ability to cancel

**Loading Messages (Randomized):**
```
"Consulting the spirits..."
"Searching the graveyard..."
"Awakening the markdown dead..."
"Reading ancient scrolls..."
"Summoning file contents..."
"The Headless Horseman is searching..."
```

**Visual Loading Indicators:**
- Skeleton screens: For card grids
- Pulsing dots: For AI responses (⏳ → ⏳ → ⏳)
- Shimmer effect: For stat cards
- Fade-in: For content appearing

---

### Error Handling Philosophy

**Principle:** Errors should be clear, actionable, and on-brand.

**Error Message Structure:**
```
[Spooky Icon] [Clear Problem Statement]

[Friendly Explanation]

[Actionable Next Step]
```

**Example Error Messages:**

**Network Error:**
```
🕷️ The spirits are unreachable

Your connection to the spirit world
seems interrupted.

→ Check your internet connection
→ [Retry]
```

**File Read Error:**
```
🪦 File not found in the graveyard

This markdown file may have been moved
or deleted from your vault.

→ [Refresh Vault] or [Go Back]
```

**AI Context Too Large:**
```
⚠️ Too many files to consult

Your query returned 150 files, which is
too many for the spirits to read at once.

→ Try a more specific search
→ Use folder filters to narrow results
```

**Rate Limit:**
```
⏳ The spirits need rest

You've asked too many questions too quickly.
Please wait a moment.

Retry in: 30 seconds
```

---

### Form Validation

**Search Input:**
- No validation (any input is valid)
- Max length: 500 chars (prevent abuse)

**AI Chat Input:**
- Min length: 3 chars (prevent empty/gibberish)
- Max length: 1000 chars (prevent context overflow)
- No special chars restriction (allow natural language)

**Validation Feedback:**
- Real-time (as user types)
- Non-intrusive (no alerts/modals)
- Color-coded borders (red for error)

---

### Responsive Design Strategy

**Desktop-First Approach (Hackathon):**
- Primary target: 1280px - 1920px screens
- Demo will be presented on projector/laptop
- Mobile is secondary for MVP

**Breakpoints:**
```
Desktop:  1280px+ (3-column grid, full features)
Tablet:   768px  (2-column grid, condensed stats)
Mobile:   375px  (1-column grid, stacked layout)
```

**Mobile Adaptations:**
- Hero: Smaller text (36px → 24px)
- Stats: Stack into 2x2 grid → 1x4 column
- File cards: Single column
- Search: Full-width, smaller font
- Modal: Full-screen on mobile
- AI chat: Reduced max-height (300px)

**Touch Interactions:**
- Increase tap targets to 44x44px minimum
- Add touch-friendly spacing (16px gaps)
- Disable hover states on touch devices
- Use native scrolling (no custom scrollbars)

---

### Keyboard Navigation

**Global Shortcuts:**
- Cmd/Ctrl + K: Focus search
- Escape: Clear search, close modal, blur input
- Tab: Navigate through focusable elements
- Enter: Submit forms, open cards

**Card Grid:**
- Tab: Move between cards
- Enter/Space: Open selected card
- Arrow keys: Navigate grid (future enhancement)

**Modal:**
- Tab: Cycle through Close button (only interactive element)
- Escape: Close modal
- Focus trap: Keep focus within modal

**AI Chat:**
- Enter: Send message
- Escape: Clear input
- Tab: Move between input and button

**Accessibility:**
- All shortcuts documented in aria-keyshortcuts
- Screen reader announces shortcuts
- No conflicts with browser defaults

---

## 📱 Responsive Specifications

### Desktop (1280px+)

**Layout:**
- 3-column file grid
- Side-by-side stat breakdowns (2 columns)
- Full-width search bar
- Chat interface: 800px max-width, centered

**Typography:**
- Hero: 60px
- H1: 48px
- Body: 16px

**Spacing:**
- Section gaps: 48px
- Card gaps: 24px
- Container padding: 24px

---

### Tablet (768px - 1279px)

**Layout:**
- 2-column file grid
- Stats: 2x2 grid for cards, stacked breakdowns
- Full-width search bar
- Chat interface: Full container width

**Typography:**
- Hero: 48px
- H1: 36px
- Body: 16px

**Spacing:**
- Section gaps: 32px
- Card gaps: 16px
- Container padding: 16px

---

### Mobile (< 768px)

**Layout:**
- 1-column file grid
- Stats: 2x2 grid → 1x4 column
- Full-width search bar
- Chat interface: Full-width, reduced height
- Modal: Full-screen

**Typography:**
- Hero: 36px
- H1: 28px
- Body: 14px

**Spacing:**
- Section gaps: 24px
- Card gaps: 12px
- Container padding: 12px

**Touch Optimizations:**
- Buttons: Min 44x44px
- Input fields: Min 48px height
- Card padding: Increased to 20px
- Filter pills: Larger touch targets

---

## 🎨 Animation & Motion

### Animation Principles

1. **Purpose-Driven**: Every animation serves a function
2. **Fast & Snappy**: No animation > 400ms
3. **Ease Curves**: Use ease-out for entrances, ease-in for exits
4. **Respect Preferences**: Honor prefers-reduced-motion

### Timing Functions

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Animation Catalog

**Card Hover:**
```css
transition: all 300ms var(--ease-out);
transform: translateY(-4px);
border-color: orange-500/50;
```

**Modal Enter:**
```css
backdrop: opacity 0 → 1 (300ms ease-out)
modal: scale(0.95) + opacity 0 → scale(1) + opacity 1 (300ms ease-out)
```

**Button Press:**
```css
transform: scale(0.98);
transition: transform 100ms var(--ease-in-out);
```

**Loading Pulse:**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
animation: pulse 2s ease-in-out infinite;
```

**Skeleton Loading:**
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
background: linear-gradient(90deg, gray-800 25%, gray-700 50%, gray-800 75%);
animation: shimmer 2s infinite;
```

**Message Fade-In:**
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: fadeInUp 300ms ease-out;
```

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## ♿ Accessibility Guidelines

### WCAG 2.1 Level AA Compliance

**Color Contrast:**
- Text on background: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum

**Current Palette Compliance:**
```
✅ White (#ffffff) on Black (#0a0a0a): 21:1
✅ Gray-400 (#a1a1aa) on Black: 9.8:1
✅ Orange-500 (#ff7518) on Black: 4.8:1
✅ Purple-500 (#8b5cf6) on Black: 4.2:1
```

**Focus Indicators:**
- Visible focus ring on all interactive elements
- Color: orange-500
- Width: 2px
- Offset: 2px
- Style: solid or outline

**Screen Reader Support:**
- All images/icons have alt text or aria-label
- Form inputs have associated labels
- Buttons have descriptive text (no icon-only)
- Dynamic content updates use aria-live

**Keyboard Navigation:**
- All features accessible without mouse
- Logical tab order
- Skip links for long content (future)
- No keyboard traps

**Semantic HTML:**
- Proper heading hierarchy (h1 → h2 → h3)
- Landmarks (main, nav, section)
- Lists use ul/ol
- Buttons use <button>, links use <a>

**Error Handling:**
- Errors announced to screen readers
- Error messages associated with inputs (aria-describedby)
- Clear error recovery instructions

**Readability:**
- Line-height: 1.5 minimum for body text
- Paragraph width: 80ch maximum
- No justified text
- Sufficient spacing between interactive elements

---

## 🎃 Empty States & Helpful Messaging

### Philosophy

Empty states are opportunities to guide users and reinforce the spooky theme.

### Empty State Catalog

**No Files in Vault:**
```
┌─────────────────────────────────────┐
│                                     │
│              🪦                     │
│                                     │
│     The graveyard is empty          │
│                                     │
│   No markdown files found in your   │
│   vault. Add some .md files to      │
│   get started!                      │
│                                     │
│   [Configure Vault Path]            │
│                                     │
└─────────────────────────────────────┘
```

**No Search Results:**
```
┌─────────────────────────────────────┐
│                                     │
│              🔍                     │
│                                     │
│        No files found               │
│                                     │
│   Try adjusting your search         │
│        or filter                    │
│                                     │
│   [Clear Search]                    │
│                                     │
└─────────────────────────────────────┘
```

**No Tags Available:**
```
┌─────────────────────────────────────┐
│         🏷️ No tags yet             │
│                                     │
│   Add tags to your markdown         │
│   frontmatter to organize files!    │
│                                     │
│   Example:                          │
│   ---                               │
│   tags: [bug, urgent]               │
│   ---                               │
└─────────────────────────────────────┘
```

**AI Chat Empty (Before First Message):**
```
┌─────────────────────────────────────┐
│     Example Questions:              │
│                                     │
│  "What bugs are mentioned?"         │
│  "Summarize user feedback"          │
│  "What features are users           │
│   requesting?"                      │
│                                     │
│  Click a question to try it!        │
└─────────────────────────────────────┘
```

**AI No Context (No Files Match Query):**
```
┌─────────────────────────────────────┐
│ 🔮 Spirit Medium                    │
│                                     │
│ I couldn't find any files           │
│ matching your question.             │
│                                     │
│ Try asking about:                   │
│ • Bugs mentioned in files           │
│ • User feedback summaries           │
│ • Feature requests                  │
└─────────────────────────────────────┘
```

---

## 📊 Component States Summary

### State Matrix

| Component         | Loading | Empty | Error | Success |
|-------------------|---------|-------|-------|---------|
| Hero              | N/A     | N/A   | N/A   | Static  |
| Stats Dashboard   | ✅      | ✅    | ✅    | ✅      |
| Search Bar        | N/A     | N/A   | N/A   | Active  |
| File Grid         | ✅      | ✅    | N/A   | ✅      |
| File Modal        | N/A     | N/A   | ✅    | ✅      |
| AI Chat           | ✅      | ✅    | ✅    | ✅      |

### State Transition Flows

**File Grid:**
```
Initial → Loading (skeleton) → Success (cards displayed)
                              ↘ Empty (no files)
```

**AI Chat:**
```
Empty (examples) → User Input → Loading (consulting) → Success (response)
                                                      ↘ Error (retry)
```

**Search:**
```
Empty → User Types → Results Update → Success (filtered)
                                    ↘ Empty (no matches)
```

---

## 🚀 Performance Considerations

### Loading Performance

**Time to Interactive Goals:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s

**Optimization Strategies:**
- Server-side render file list (Next.js SSR)
- Lazy load file content on modal open
- Debounce search input (300ms)
- Virtualize file grid if > 100 files (future)
- Stream AI responses (don't wait for complete response)

### Animation Performance

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly (only during animation)
- Limit concurrent animations to 3-4 maximum

### Asset Optimization

- No external images (emoji only) - 0 HTTP requests
- Inline critical CSS
- Tree-shake unused Tailwind classes
- Minify JavaScript bundles
- Use Next.js Image component if images added later

---

## 🧪 Testing Scenarios

### Manual Testing Checklist

**File Browsing:**
- [ ] Load homepage, see hero and stats
- [ ] File grid displays all demo files
- [ ] Click file card, modal opens
- [ ] Read markdown content in modal
- [ ] Close modal (X button, Esc, backdrop)
- [ ] Search for "bug", see filtered results
- [ ] Click folder filter, see narrowed results
- [ ] Clear search, see all files again

**AI Chat:**
- [ ] Load chat section, see example questions
- [ ] Click example question, input populated
- [ ] Submit question, see loading state
- [ ] Response streams in progressively
- [ ] Response includes markdown formatting
- [ ] Citations/file references visible
- [ ] Ask follow-up question
- [ ] Test error state (disconnect network)
- [ ] Retry after error

**Keyboard Navigation:**
- [ ] Tab through all interactive elements
- [ ] Cmd+K focuses search
- [ ] Esc clears search
- [ ] Enter opens file card
- [ ] Esc closes modal
- [ ] Tab through chat interface

**Responsive:**
- [ ] Test on 1920px desktop
- [ ] Test on 1280px laptop
- [ ] Test on 768px tablet
- [ ] Test on 375px mobile

**Edge Cases:**
- [ ] Empty vault (no files)
- [ ] Search with no results
- [ ] AI question with no matching context
- [ ] Very long file content in modal
- [ ] Very long AI response

---

## 🎯 Success Metrics

### User Experience Metrics

**Task Completion:**
- 95%+ users can find a specific file within 30 seconds
- 90%+ users successfully ask AI question on first try
- 80%+ users understand file citations in AI responses

**User Satisfaction:**
- 4.5/5 average rating on "ease of use"
- 4.0/5 average rating on "visual appeal"
- 90%+ users say they "understood the app immediately"

**Error Recovery:**
- 95%+ users successfully recover from errors
- 90%+ users understand what went wrong
- 80%+ users know how to prevent errors

### Technical Metrics

**Performance:**
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- No layout shifts (CLS = 0)

**Accessibility:**
- WCAG 2.1 AA compliant
- Lighthouse accessibility score > 95
- All critical user flows keyboard-accessible

---

## 🔮 Future Enhancements (Post-MVP)

### Phase 2: Power User Features

1. **Advanced Search:**
   - Regex support
   - Date range filters
   - Tag boolean logic (AND/OR/NOT)
   - Saved searches

2. **File Management:**
   - Edit files in-app
   - Create new files
   - Organize into folders
   - Batch operations

3. **AI Enhancements:**
   - Citation links jump to files
   - Multi-turn conversations with context
   - Suggested follow-up questions
   - Export chat transcripts

4. **Vault Sync:**
   - Watch for file changes
   - Auto-refresh on edits
   - Conflict resolution
   - Multiple vault support

### Phase 3: Collaboration Features

1. **Sharing:**
   - Share individual files
   - Share AI conversations
   - Collaborative annotations
   - Comments on files

2. **Analytics:**
   - Most-accessed files
   - Search trends
   - AI query patterns
   - Usage heatmaps

3. **Integrations:**
   - Export to Notion
   - Sync with GitHub
   - Connect to Slack
   - API for custom integrations

---

## 📝 Component Implementation Checklist

### Pre-Implementation

- [ ] Review this UX spec with team
- [ ] Get design approval on color palette
- [ ] Confirm accessibility requirements
- [ ] Set up design tokens in Tailwind config

### Component Build Order

**Phase 1: Foundation**
- [ ] Design system setup (colors, typography, spacing)
- [ ] Page layout and background
- [ ] Hero section
- [ ] Stats dashboard (with mock data)

**Phase 2: File Browsing**
- [ ] Search bar component
- [ ] Folder filter pills
- [ ] File card component
- [ ] File grid layout
- [ ] File modal component

**Phase 3: AI Integration**
- [ ] Chat container
- [ ] Message components (user/AI)
- [ ] Input and send button
- [ ] Streaming response handler
- [ ] Error states

**Phase 4: Polish**
- [ ] Loading states (all components)
- [ ] Empty states (all scenarios)
- [ ] Error handling (all scenarios)
- [ ] Keyboard shortcuts
- [ ] Accessibility audit
- [ ] Responsive testing

### Testing

- [ ] Manual testing (see checklist above)
- [ ] Accessibility testing (screen reader, keyboard)
- [ ] Performance testing (Lighthouse)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile testing (iOS Safari, Chrome Android)

### Launch Preparation

- [ ] Write user documentation
- [ ] Create demo script
- [ ] Prepare sample questions for AI
- [ ] Test demo vault files
- [ ] Practice hackathon presentation

---

## 🎤 Demo Script (For Hackathon Presentation)

### 2-Minute Demo Flow

**[0:00 - 0:15] Hook + Problem**
```
"Meet Sarah, a PM with 200 scattered Obsidian notes.
She can't find anything. Her head is... literally scattered.

That's why we built The Headless Horseman's Quest."
```

**[0:15 - 0:30] Solution Introduction**
```
[Load homepage]

"This is The Graveyard - where scattered markdown files
come home. See? 15 files, organized, searchable."
```

**[0:30 - 0:50] Feature 1: File Browsing**
```
[Demo search]
"Let's find bugs. Just type 'bug'... filtered instantly.
Click on 'Haunted UI' bug report... full content."

[Close modal]
```

**[0:50 - 1:30] Feature 2: AI Spirit Medium**
```
[Scroll to AI chat]

"But here's the magic. Sarah can just ASK:"

[Type: "What are users complaining about?"]

[Loading: "Consulting the spirits..."]

[Response appears with citations]

"The AI reads through her files and cites sources.
No manual searching. No context-switching."
```

**[1:30 - 2:00] Close + CTA**
```
"Sarah's scattered thoughts? Reunited.

The Headless Horseman finally found his head.

Try it yourself at [demo-url]"
```

---

## 🎨 Visual Design Mockup Descriptions

### Desktop Homepage (1280px)

```
┌───────────────────────────────────────────────────────┐
│                                                       │ 120px spacing
│                 👻 The Graveyard 👻                  │
│           15 scattered markdown files reunited       │
│                                                       │
├───────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                   │ Stats (4 cards)
│  │ 📚  │ │ 🏷️ │ │ 📝  │ │ 📊  │                   │
│  └─────┘ └─────┘ └─────┘ └─────┘                   │
│                                                       │
│  ┌─────────────────┐ ┌─────────────────┐           │ Stats (2 wide)
│  │ Files by Folder │ │ Top Tags        │           │
│  └─────────────────┘ └─────────────────┘           │
│                                                       │
├───────────────────────────────────────────────────────┤
│                                                       │
│  [Search bar...........................] (⌘K)       │ Search
│                                                       │
│  [All] [product-logs] [feedback] [random-notes]     │ Filters
│                                                       │
├───────────────────────────────────────────────────────┤
│                                                       │
│  ┌────────┐ ┌────────┐ ┌────────┐                  │
│  │ File   │ │ File   │ │ File   │                  │ File Grid
│  │ Card   │ │ Card   │ │ Card   │                  │ (3 columns)
│  └────────┘ └────────┘ └────────┘                  │
│                                                       │
│  ┌────────┐ ┌────────┐ ┌────────┐                  │
│  │ File   │ │ File   │ │ File   │                  │
│  │ Card   │ │ Card   │ │ Card   │                  │
│  └────────┘ └────────┘ └────────┘                  │
│                                                       │
├───────────────────────────────────────────────────────┤
│                                                       │
│                      🔮                              │ AI Chat
│              AI Spirit Medium                        │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ [Chat messages area]                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  [Ask a question.....................] [Ask]        │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### Mobile Homepage (375px)

```
┌─────────────────────┐
│                     │
│  👻 The Graveyard  │  Hero (smaller)
│  15 files reunited │
│                     │
├─────────────────────┤
│ ┌─────┐ ┌─────┐   │  Stats (2x2 grid)
│ │ 📚  │ │ 🏷️ │   │
│ └─────┘ └─────┘   │
│ ┌─────┐ ┌─────┐   │
│ │ 📝  │ │ 📊  │   │
│ └─────┘ └─────┘   │
├─────────────────────┤
│ [Search...]       │  Full-width search
│                     │
│ [All] [product-... │  Filter pills
│                     │
├─────────────────────┤
│ ┌─────────────────┐│  Single-column
│ │ File Card       ││  file grid
│ └─────────────────┘│
│ ┌─────────────────┐│
│ │ File Card       ││
│ └─────────────────┘│
├─────────────────────┤
│      🔮            │  AI Chat
│  AI Spirit Medium  │  (reduced height)
│                     │
│ [Chat area]        │
│                     │
│ [Ask...] [Ask]     │
│                     │
└─────────────────────┘
```

---

## 🎃 Conclusion

This UX specification provides a complete blueprint for building The Headless Horseman's Quest. Every component, state, interaction, and visual element has been defined to create a cohesive, delightful, and functional user experience.

**Key Takeaways:**

1. **Spooky Theme Enhances UX** - Halloween aesthetics make the app memorable without sacrificing usability
2. **Loading States Matter** - "Consulting the spirits" is more engaging than a boring spinner
3. **Citations Build Trust** - AI responses with file sources = trustworthy insights
4. **Desktop-First Speed** - Optimize for demo environment first, mobile second
5. **Error Recovery** - Spooky error messages that actually help users

**Next Steps:**
1. Review this spec with dev team
2. Set up design tokens in Tailwind config
3. Build components in suggested order
4. Test against success metrics
5. Practice demo presentation

**Let's reunite that scattered head!** 👻🎃🪦

---

*End of UX Specification*
