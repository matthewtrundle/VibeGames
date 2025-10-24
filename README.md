# 👻 The Headless Horseman's Quest

**A haunted information aggregator for your scattered markdown notes**

Built for the hackathon - reunite your scattered markdown souls with AI-powered search and chat!

## 🎃 What is this?

The Headless Horseman's Quest is an AI-powered markdown file aggregator that helps you find information across scattered notes. Think of it as your personal spirit medium for navigating the graveyard of markdown files in your Obsidian vault (or any markdown collection).

### Key Features

- **📁 Auto-Discovery**: Automatically scans and indexes all markdown files
- **🔮 AI Spirit Medium**: Chat with Claude AI to ask questions about your notes
- **🎨 Spooky Theme**: Halloween-inspired dark UI with purple & orange accents
- **⚡ Real-time Streaming**: Get answers as they're generated
- **📝 Citation Support**: AI references specific files when answering questions
- **🏷️ Tag Support**: Organize with frontmatter tags
- **🌙 Dark Mode**: Because scattered thoughts deserve atmospheric lighting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key (Claude AI)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# The ANTHROPIC_API_KEY should be available in your shell environment
# If running locally, you can add it to .env.local

# Start the development server
npm run dev
```

Visit `http://localhost:3000` and watch your markdown files come to life!

## 📁 Project Structure

```
VibeGames/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts         # AI chat API endpoint
│   ├── page.tsx                 # Main dashboard
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles with spooky theme
├── components/
│   └── ChatInterface.tsx        # AI chat UI component
├── demo-vault/                  # Sample markdown files (15 files)
│   ├── product-logs/
│   ├── feedback/
│   └── random-notes/
├── tailwind.config.ts           # Tailwind configuration
└── postcss.config.js            # PostCSS configuration
```

## 🎯 How It Works

### File Discovery

The app scans your `demo-vault` directory (or any markdown directory you configure) and:

1. Reads all `.md` files recursively
2. Parses frontmatter (YAML metadata) for tags, dates, etc.
3. Extracts content previews
4. Groups files by folder

### AI Chat

When you ask a question:

1. Your question is sent to the `/api/chat` endpoint
2. The API reads all markdown files and builds context
3. Claude AI receives the context + your question
4. AI generates a streaming response with file citations
5. You see the answer appear in real-time

### Example Questions

Try asking:
- "What bugs are mentioned?"
- "Summarize user feedback"
- "What features are users requesting?"
- "What did the sprint retrospective say about performance?"

## 🎨 Tech Stack

- **Next.js 14** - App Router, Server Components
- **React 18** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom spooky theme
- **Anthropic Claude** - AI chat powered by Claude 3.5 Sonnet
- **gray-matter** - Frontmatter parsing
- **@anthropic-ai/sdk** - Anthropic API client

## 🔧 Configuration

### Adding Your Own Markdown Files

Replace the `demo-vault` directory with your own markdown files:

```bash
# Option 1: Replace demo-vault
rm -rf demo-vault
ln -s /path/to/your/obsidian/vault demo-vault

# Option 2: Update the path in app/page.tsx
const vaultPath = path.join(process.cwd(), 'your-vault-name')
```

### Customizing the Theme

Edit `tailwind.config.ts` to change the spooky colors:

```typescript
colors: {
  'haunted-purple': '#2D1B69',
  'halloween-orange': '#FF6B35',
  'graveyard-black': '#0D0221',
  // ... add your own!
}
```

## 📊 Demo Vault

The included `demo-vault` contains 15 interconnected markdown files:

- **product-logs/** - Bug reports, features, sprint notes
- **feedback/** - User complaints, surveys, support tickets
- **random-notes/** - Ideas, todos, meeting notes

These files reference each other to demonstrate the AI's ability to connect information across multiple sources.

## 🎭 Hackathon Features Implemented

✅ Markdown file aggregation
✅ AI-powered search with citations
✅ Streaming responses
✅ Beautiful spooky UI
✅ Real-time chat interface
✅ Frontmatter support (tags, dates)
✅ Folder organization
✅ Mobile responsive design

## 🚧 Future Enhancements

- [ ] File content view modal
- [ ] Search/filter by tags
- [ ] Export chat conversations
- [ ] Support for images and attachments
- [ ] Keyboard shortcuts
- [ ] Dark/light mode toggle
- [ ] Custom vault paths via UI
- [ ] Vector search for semantic matching

## 🎃 Halloween Theme

This project embraces the spooky season with:

- 👻 Ghost emoji branding
- 🔮 Crystal ball for AI features
- 🎃 Pumpkin orange accents
- 💜 Mystic purple gradients
- 🌙 Dark atmospheric background
- ⚰️ "Graveyard" metaphor for scattered files

## 📝 License

MIT - Built for the hackathon with ❤️ and 👻

## 🙏 Acknowledgments

- Built with Claude Code
- Powered by Anthropic's Claude AI
- Inspired by scattered markdown files everywhere
- Special thanks to the spooky season for inspiration

---

**May the Headless Horseman reunite your scattered thoughts!** 👻🎃
