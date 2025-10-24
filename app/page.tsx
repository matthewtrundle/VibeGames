import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
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

    function scanDir(dir: string, baseDir: string = '') {
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
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Simple Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-purple-500 bg-clip-text text-transparent animate-gradient-shift">
            <span className="animate-float-ghost">👻</span> The Graveyard
          </h1>
          <p className="text-xl text-gray-400">
            {files.length > 0 ? (
              `${files.length} scattered markdown files reunited`
            ) : (
              'The graveyard is empty...'
            )}
          </p>
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
            {/* Stats Dashboard */}
            <StatsDashboard files={files} />

            {/* File Grid - Simple and Clean */}
            <FileGrid files={files} />

            {/* AI Chat Interface */}
            <ChatInterface />
          </>
        )}
      </div>
    </ErrorBoundary>
  )
}
