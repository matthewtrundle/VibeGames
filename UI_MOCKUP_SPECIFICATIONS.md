# UI Mockup Specifications
**Detailed visual descriptions for The Headless Horseman's Quest**

---

## 🎨 Note on Image Generation

OpenRouter API does not currently support image generation through their API endpoint. As an alternative, this document provides **detailed visual specifications** that can be used to:

1. Create mockups manually using design tools (Figma, Sketch, Photoshop)
2. Generate images using dedicated AI image tools (Midjourney, DALL-E, Stable Diffusion)
3. Communicate design vision to designers/developers
4. Reference during implementation

---

## 📐 Mockup 1: Dashboard Landing Page

### Visual Description

**Overall Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│         👻 The Graveyard                    │
│     15 scattered markdown files reunited    │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  [📚 Stats] [🏷️ Stats] [📝 Stats] [📊 Stats]│
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  [File Card] [File Card] [File Card]       │
│  [File Card] [File Card] [File Card]       │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│            🔮 AI Spirit Medium              │
│         [Chat Interface Area]               │
│                                             │
└─────────────────────────────────────────────┘
```

**Color Specifications:**
- **Background:** Pure black (#000000) with subtle radial gradients
  - Top-left: Purple glow (rgba(139, 92, 246, 0.1))
  - Bottom-right: Orange glow (rgba(255, 117, 24, 0.1))
- **Hero Text:** Gradient from orange (#ff7518) to purple (#8b5cf6)
- **Subtitle:** Light gray (#a1a1aa)

**Stats Cards (4 across):**
1. **Total Files (Purple)**
   - Background: Gradient purple-900/30 to purple-800/20
   - Border: Purple-500/30
   - Icon: 📚 (large)
   - Number: 15 (3xl, white, bold)
   - Label: "Total Files" (purple-300)

2. **Unique Tags (Orange)**
   - Background: Gradient orange-900/30 to orange-800/20
   - Border: Orange-500/30
   - Icon: 🏷️ (large)
   - Number: 12 (3xl, white, bold)
   - Label: "Unique Tags" (orange-300)

3. **Total Words (Green)**
   - Background: Gradient green-900/30 to green-800/20
   - Border: Green-500/30
   - Icon: 📝 (large)
   - Number: 3,247 (3xl, white, bold)
   - Label: "Total Words" (green-300)

4. **Average Words (Blue)**
   - Background: Gradient blue-900/30 to blue-800/20
   - Border: Blue-500/30
   - Icon: 📊 (large)
   - Number: 216 (3xl, white, bold)
   - Label: "Avg Words/File" (blue-300)

**File Cards (3 columns, 2 rows shown):**

Each card:
- Background: Dark gray (#1a1a1a to #2a2a2a) with 50% opacity
- Border: Gray-800, changes to orange-500/50 on hover
- Border radius: 1rem (rounded-2xl)
- Padding: 1.5rem
- Hover effect: Lifts up 2px, orange glow shadow

Card structure:
```
┌────────────────────────────┐
│ 📁 FOLDER-NAME             │  ← Orange text, small, uppercase
│                            │
│ File Title With Spaces     │  ← White, bold, 1.25rem
│                            │
│ Preview text goes here     │  ← Gray, 3 lines max
│ showing first 120 chars    │
│ of the file content...     │
│                            │
│ [tag1] [tag2] [tag3]       │  ← Orange pills with borders
└────────────────────────────┘
```

**AI Chat Section:**
- Background: Purple-orange gradient border
- Inside: Black-ish background
- Crystal ball emoji: 🔮 (large, pulsing)
- Title: "AI Spirit Medium" (white, bold)
- Description: Gray text
- Input field: Black with orange border
- Button: Orange solid background

**Visual Effects:**
- Subtle animated gradient in background (slowly shifting)
- Cards have drop shadows
- Hover states show orange glow
- Text is crisp with good contrast

---

## 📐 Mockup 2: AI Chat Interface

### Visual Description

**Layout:**
```
┌─────────────────────────────────────────────┐
│            🔮 AI Spirit Medium              │
│  Ask questions about your notes. The AI     │
│  reads through files to find answers...     │
│                                             │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ │  [User Message - Right Aligned]        │ │
│ │                                         │ │
│ │ [AI Response - Left Aligned]           │ │
│ │                                         │ │
│ │  [User Message - Right Aligned]        │ │
│ │                                         │ │
│ │ [AI Response - Left Aligned]           │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Input Field                         ] [Ask]│
└─────────────────────────────────────────────┘
```

**Color Specifications:**
- **Container Background:** Purple-orange gradient border
  - Border: 2px, gradient from purple to orange
- **Chat Area:** Very dark (#0a0a0a)
- **User Messages:**
  - Background: Orange glow (rgba(255, 117, 24, 0.2))
  - Border: Orange-500/30
  - Text: White
  - Position: Right-aligned
  - Max width: 80%
  - Rounded corners: 1rem

- **AI Messages:**
  - Background: Purple glow (rgba(139, 92, 246, 0.2))
  - Border: Purple-500/30
  - Text: Light gray
  - Position: Left-aligned
  - Max width: 80%
  - Rounded corners: 1rem

**Message Labels:**
- User: "👤 You" (small, faded)
- AI: "🔮 Spirit Medium" (small, faded)

**Example Messages:**

User message:
```
┌─────────────────────────────┐
│ 👤 You                      │
│ What bugs are mentioned?    │
└─────────────────────────────┘
```

AI message:
```
┌──────────────────────────────────────┐
│ 🔮 Spirit Medium                     │
│                                      │
│ Based on the files I found:          │
│                                      │
│ • **Bug #1**: Login timeout issue    │
│   - File: bug-reports/auth-bug.md    │
│                                      │
│ • **Bug #2**: Image upload fails     │
│   - File: bugs/upload-issue.md       │
│                                      │
│ Would you like more details?         │
└──────────────────────────────────────┘
```

**Input Area:**
- Background: Black (#0a0a0a)
- Border: Orange with glow (orange-500/30)
- Focus state: Brighter orange border (orange-500/60)
- Placeholder: "Ask a question about your notes..." (gray-500)
- Text: White

**Ask Button:**
- Background: Solid orange (#ff7518)
- Hover: Darker orange (#e65f00)
- Text: White, bold
- Padding: Comfortable touch target

**Loading State:**
- Hourglass: ⏳ (rotating)
- Text: "Consulting the spirits..." (pulsing)
- Gray color

---

## 📐 Mockup 3: File Viewer Page

### Visual Description

**Layout:**
```
┌─────────────────────────────────────────────┐
│ 🏠 Home / folder / file-name                │  ← Breadcrumb
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ 📁 FOLDER-NAME                       [×]│ │  ← Header
│ │                                         │ │
│ │ Large File Title Here                   │ │
│ │                                         │ │
│ │ 📅 2024-10-20  📝 1,234 words  🕐 Modified│ │
│ │ [tag1] [tag2] [tag3]                   │ │
│ ├─────────────────────────────────────────┤ │
│ │                                         │ │
│ │ # Heading 1                             │ │  ← Content
│ │                                         │ │
│ │ Paragraph text goes here with proper    │ │
│ │ line spacing and comfortable reading    │ │
│ │ width. Text is light gray on dark.      │ │
│ │                                         │ │
│ │ ## Heading 2                            │ │
│ │                                         │ │
│ │ • Bullet point one                      │ │
│ │ • Bullet point two                      │ │
│ │                                         │ │
│ │ ```code                                 │ │
│ │ const example = 'code block';           │ │
│ │ ```                                     │ │
│ │                                         │ │
│ ├─────────────────────────────────────────┤ │
│ │ ← Back to Graveyard     [📋 Copy]      │ │  ← Footer
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ ┌─────────────┐                             │  ← Sidebar
│ │ 📊 Details  │                             │
│ │             │                             │
│ │ Path:       │                             │
│ │ folder/file │                             │
│ │             │                             │
│ │ Words: 1,234│                             │
│ │             │                             │
│ │ Modified:   │                             │
│ │ Oct 20      │                             │
│ └─────────────┘                             │
└─────────────────────────────────────────────┘
```

**Color Specifications:**

**Background:**
- Pure black with purple gradient toward edges
- No distracting patterns

**Main Content Card:**
- Background: Dark gray (#1a1a1a)
- Border: Orange with glow (orange-500/30)
- Shadow: Large, soft shadow
- Border radius: 1rem

**Header Section:**
- Folder badge: Orange background (rgba(255, 117, 24, 0.1)), orange text, orange border
- Title: Very large (2rem), white, bold
- Metadata icons: Emojis with gray text
- Tags: Orange pills with borders
- Close button: Gray, hover white

**Breadcrumb:**
- Home link: Orange, hover brighter
- Separators: Gray slashes
- Current page: White

**Markdown Content:**
- H1: Large orange (#ff9d5c)
- H2: Medium orange (#ff9d5c)
- H3: Smaller orange (#ffa873)
- Paragraphs: Light gray (#d1d5db)
- Code inline: Orange text on dark gray background
- Code blocks: Dark gray background (#1f2937) with light gray text
- Lists: Gray text with proper bullets
- Blockquotes: Orange left border, gray text

**Sidebar (Desktop):**
- Background: Purple-orange gradient
- Border: Orange-500/20
- Text: White for labels, gray for values
- Compact layout

**Footer:**
- Border top: Orange-500/20
- Back link: Gray, hover white
- Copy button: Dark gray background, hover lighter

**Visual Effects:**
- Modal entrance: Fade in + scale up
- Content: Smooth scrolling
- Close button: Rotate on hover
- Copy button: Pulse on click

---

## 📐 Mockup 4: Settings Page

### Visual Description

**Layout:**
```
┌─────────────────────────────────────────────┐
│ ← Back to Graveyard                         │
│                                             │
│              ⚙️ Settings                     │
│   Configure your vault path and scan for    │
│            markdown files                   │
│                                             │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ 📁 Vault Configuration                  │ │
│ │                                         │ │
│ │ Vault Path                              │ │
│ │ [/path/to/your/obsidian/vault         ]│ │
│ │ Enter the full path to your vault...    │ │
│ │                                         │ │
│ │ [Scan Vault]  [Use Demo Vault]         │ │
│ │                                         │ │
│ │ ┌─────────────────────────────────────┐ │ │
│ │ │ ✨ Vault scanned successfully!      │ │ │
│ │ │ 📄 Files found: 15                  │ │ │
│ │ │ 🕐 Last scan: Oct 20, 2024 3:45 PM │ │ │
│ │ └─────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 💡 Quick Tips                           │ │
│ │                                         │ │
│ │ • Scans for .md files recursively       │ │
│ │ • Frontmatter tags extracted            │ │
│ │ • Organized by folder structure         │ │
│ │ • Use demo vault for sample data        │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🚧 Coming Soon                          │ │
│ │                                         │ │
│ │ • Auto-refresh on file changes          │ │
│ │ • Exclude patterns configuration        │ │
│ │ • Multiple vault support                │ │
│ │ • Custom tag extraction rules           │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Color Specifications:**

**Background:**
- Black with purple gradient from top
- Clean, minimal

**Back Link:**
- Orange text (#ff7518)
- Hover: Brighter orange
- Arrow emoji

**Header:**
- Title: Gradient from orange to purple (same as dashboard)
- Subtitle: Gray (#a1a1aa)
- Centered layout

**Vault Configuration Card:**
- Background: Dark gray (#1a1a1a)
- Border: Subtle gray-800
- Rounded corners: 1rem
- Padding: 2rem

**Form Elements:**

Input field:
- Label: "Vault Path" (gray-300, small)
- Input background: Black (#0a0a0a)
- Border: Orange-500/30
- Focus border: Orange-500/60
- Text: White
- Placeholder: Gray-500
- Help text: Small, gray-500

Buttons:
- Scan Vault: Orange solid (#ff7518), white text, bold
- Use Demo Vault: Purple solid (#8b5cf6), white text, bold
- Hover: Darker shade
- Disabled: Gray-700

**Success Notification:**
- Background: Green-500/10
- Border: Green-500/30
- Icon: ✨ (sparkles)
- Heading: Green-400
- Details: White/gray
- Emojis for visual interest

**Quick Tips Card:**
- Background: Purple-orange gradient (subtle)
- Border: Orange-500/20
- Icon: 💡 (light bulb)
- Bullets: Orange dots
- Text: Light gray
- Code inline: `.md` with background

**Coming Soon Card:**
- Background: Gray-900/30
- Border: Gray-800/50
- Opacity: 60% (grayed out)
- Icon: 🚧 (construction)
- Text: Gray-500
- Conveys "future feature"

**Visual Effects:**
- Scan button shows loading spinner when active
- Success box slides in from top
- Form validation shows error shake
- Hover states on all interactive elements

---

## 🎨 Common Visual Elements Across All Mockups

### Typography
- **Headings:** Bold, white or gradient
- **Body text:** Light gray (#d1d5db)
- **Labels:** Medium gray (#a1a1aa)
- **Links:** Orange, underlined on hover
- **Code:** Orange text on dark background

### Spacing
- **Comfortable padding:** 1.5rem to 2rem
- **Card gaps:** 1.5rem
- **Section spacing:** 3rem vertical
- **Line height:** 1.7 for body text

### Borders
- **Default:** Gray-800
- **Hover:** Orange-500/50
- **Active:** Orange-500
- **Radius:** 1rem (rounded-xl) to 1.5rem (rounded-2xl)

### Shadows
- **Cards:** Soft, dark shadows
- **Hover:** Orange glows
- **Modals:** Deep, dramatic shadows

### Animations
- **Transitions:** 300ms ease-out
- **Hover:** 500ms ease-in-out
- **Page transitions:** Smooth fades
- **Micro-interactions:** Quick, snappy

---

## 🖼️ Creating Actual Mockups

### Option 1: Manual Design (Figma/Sketch)

Use these specifications to create mockups in design tools:

1. Set up artboards (1920x1080 for desktop)
2. Apply color palette from specs
3. Use Inter font family
4. Follow layout grids exactly
5. Add hover states as separate frames
6. Export as PNG at 2x resolution

### Option 2: AI Image Generation

Use these prompts with Midjourney, DALL-E, or Stable Diffusion:

**Prompt Template:**
```
Modern dark web dashboard UI mockup, Halloween spooky theme,
pure black background (#000000) with subtle purple and orange
radial gradient glows, file cards in 3-column grid,
each card has dark gray background (#1a1a1a),
pumpkin orange accent color (#ff7518),
mystic purple highlights (#8b5cf6),
professional SaaS design, clean typography,
rounded corners, glowing hover states,
realistic web application screenshot,
high contrast, WCAG accessible,
not concept art, photorealistic UI
```

### Option 3: Screenshot After Implementation

The best mockups are the real thing!

1. Implement the quick win enhancements
2. Take high-res screenshots (Command+Shift+4 on Mac)
3. Open in different states (default, hover, active)
4. Use browser dev tools to resize for different screens
5. Export at 2x resolution for crisp images

---

## 📏 Design Specifications Reference

### Color Palette (Hex Codes)
```css
--graveyard-black: #0a0a0a
--midnight-black: #121212
--shadow-gray: #1a1a1a
--ghost-gray: #2a2a2a
--pumpkin-orange: #ff7518
--dark-orange: #e65f00
--mystic-purple: #8b5cf6
--deep-purple: #6b21a8
--text-primary: #ffffff
--text-secondary: #a1a1aa
--text-tertiary: #71717a
```

### Typography Scale
```css
--text-xs: 0.75rem (12px)
--text-sm: 0.875rem (14px)
--text-base: 1rem (16px)
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px)
--text-2xl: 1.5rem (24px)
--text-3xl: 1.875rem (30px)
--text-4xl: 2.25rem (36px)
--text-5xl: 3rem (48px)
--text-6xl: 3.75rem (60px)
```

### Spacing Scale
```css
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
--space-12: 3rem (48px)
--space-16: 4rem (64px)
```

---

## 🎯 Summary

While I cannot generate actual images via OpenRouter API, these detailed specifications provide everything needed to:

1. **Create mockups manually** using design tools
2. **Generate images** using dedicated AI image services
3. **Communicate vision** to team members
4. **Reference during implementation**
5. **Verify design accuracy** after development

The real "mockups" will be your **actual implemented interface** with the quick win enhancements applied - and those will be far more impressive to judges than static images!

---

**Document Version:** 1.0
**Created:** 2025-10-24
**Status:** Complete
**Use Case:** Visual reference for implementation and design
