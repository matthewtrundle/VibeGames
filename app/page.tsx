import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Image from 'next/image'
import ChatInterface from '@/components/ChatInterface'
import FileGrid from '@/components/FileGrid'
import StatsDashboard from '@/components/StatsDashboard'
import { ErrorBoundary } from '@/lib/error-boundary'

interface MarkdownFile {
  filename: string
  relativePath: string
  preview: string
  content: string
  tags?: string[]
  date?: string
  folder: string
}

// Read all markdown files from demo vault
function getMarkdownFiles(): MarkdownFile[] {
  try {
    const vaultPath = path.join(process.cwd(), 'demo-vault')

    // Check if vault directory exists
    if (!fs.existsSync(vaultPath)) {
      console.warn('Vault directory not found:', vaultPath)
      return []
    }

    const files: MarkdownFile[] = []

    const scanDir = (dir: string, baseDir: string = ''): void => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true })

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name)
          const relativePath = path.join(baseDir, entry.name)

          if (entry.isDirectory()) {
            scanDir(fullPath, relativePath)
          } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
            try {
              const content = fs.readFileSync(fullPath, 'utf-8')
              const { data, content: markdown } = matter(content)

              // Get preview (first 120 chars of content)
              const preview = markdown.substring(0, 120).trim() + '...'

              files.push({
                filename: entry.name.replace('.md', ''),
                relativePath,
                preview,
                content: markdown,
                tags: data.tags || [],
                date: data.date ? String(data.date) : '',
                folder: baseDir.split('/')[0] || 'root'
              })
            } catch (fileError) {
              console.error(`Error reading file ${fullPath}:`, fileError)
              // Continue with other files
            }
          }
        }
      } catch (dirError) {
        console.error(`Error scanning directory ${dir}:`, dirError)
      }
    }

    scanDir(vaultPath)

    // Sort by date (newest first)
    return files.sort((a, b) => {
      const dateA = String(a.date || '')
      const dateB = String(b.date || '')
      return dateB.localeCompare(dateA)
    })
  } catch (error) {
    console.error('Error getting markdown files:', error)
    return []
  }
}

export default function Home() {
  const files = getMarkdownFiles()

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero with Headless Horseman */}
        <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 mb-8">
          {/* AI Generated Background Image */}
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/generated/hero-background.webp"
              alt="Headless Horseman in digital graveyard"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

          {/* Main Hero Content */}
          <div className="relative z-10 text-center space-y-8 p-12">
            {/* AI Generated Logo */}
            <div className="relative inline-block w-64 h-64 mx-auto">
              <Image
                src="/generated/logo-variant.webp"
                alt="Headless Horseman Logo"
                width={256}
                height={256}
                className="object-contain animate-float filter drop-shadow-[0_0_30px_rgba(255,117,24,0.6)]"
                priority
              />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-purple-500 bg-clip-text text-transparent animate-gradient-shift leading-tight">
                The Headless Horseman's Quest
              </h1>
              <p className="text-xl text-orange-400/80 font-semibold tracking-wider">
                ~ Reuniting Scattered Markdown Souls ~
              </p>
            </div>

            {/* Subtitle with Stats */}
            <div className="max-w-3xl mx-auto">
              <p className="text-2xl text-gray-300 leading-relaxed">
                {files.length > 0 ? (
                  <>
                    <span className="text-purple-400">Lost in the digital graveyard</span>, your notes await the Horseman's guidance.
                    <span className="block mt-2 text-orange-400 font-bold text-3xl">{files.length} markdown souls discovered</span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400">The graveyard is silent...</span>
                    <span className="block mt-2 text-orange-400/60">Awaiting lost souls to appear</span>
                  </>
                )}
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center gap-8 text-4xl opacity-50">
              <span className="animate-pulse">🕷️</span>
              <span className="animate-pulse delay-100">🕸️</span>
              <span className="animate-pulse delay-200">🦇</span>
              <span className="animate-pulse delay-100">🕸️</span>
              <span className="animate-pulse">🕷️</span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {files.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
            <div className="text-8xl mb-6">🪦</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              The graveyard is empty
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              No markdown files found in your vault. Add some .md files to the demo-vault directory to get started!
            </p>
          </div>
        ) : (
          <>
            {/* AI Chat Interface - FEATURED */}
            <ChatInterface />

            {/* Stats Dashboard - Compact */}
            <StatsDashboard files={files} />

            {/* File Grid */}
            <FileGrid files={files} />
          </>
        )}
      </div>
    </ErrorBoundary>
  )
}
