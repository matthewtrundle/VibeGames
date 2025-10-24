import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface FilePageProps {
  params: {
    id: string
  }
}

function getFileByPath(filePath: string) {
  try {
    // Decode the path from URL encoding
    const decodedPath = decodeURIComponent(filePath)
    const vaultPath = path.join(process.cwd(), 'demo-vault')
    const fullPath = path.join(vaultPath, decodedPath)

    // Security check: ensure path is within vault
    if (!fullPath.startsWith(vaultPath)) {
      return null
    }

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data: frontmatter, content } = matter(fileContents)

    const stats = fs.statSync(fullPath)
    const filename = path.basename(decodedPath, '.md')
    const folder = path.dirname(decodedPath).replace(/^\.?\/?/, '') || 'root'

    return {
      filename,
      folder,
      relativePath: decodedPath,
      content,
      tags: frontmatter.tags || [],
      date: frontmatter.date || stats.mtime.toISOString().split('T')[0],
      wordCount: content.split(/\s+/).length,
      modified: stats.mtime.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  } catch (error) {
    console.error('Error reading file:', error)
    return null
  }
}

export default function FilePage({ params }: FilePageProps) {
  const file = getFileByPath(params.id)

  if (!file) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-graveyard-black via-black to-haunted-purple/20 px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-halloween-orange hover:text-orange-400 transition-colors font-semibold"
          >
            🏠 Home
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-400">{file.folder}</span>
          <span className="text-gray-600">/</span>
          <span className="text-white font-semibold">{file.filename}</span>
        </nav>

        {/* Main Content Card */}
        <div className="bg-gray-900/50 border border-orange-500/30 rounded-2xl overflow-hidden backdrop-blur shadow-2xl">
          {/* Header */}
          <div className="border-b border-orange-500/20 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                {/* Folder Badge */}
                <div className="inline-block">
                  <span className="text-xs font-bold uppercase tracking-wider text-halloween-orange bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    📁 {file.folder}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {file.filename.replace(/-/g, ' ')}
                </h1>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <span>📅</span>
                    <span>{file.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>📝</span>
                    <span>{file.wordCount} words</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🕐</span>
                    <span>Modified {file.modified}</span>
                  </div>
                </div>

                {/* Tags */}
                {file.tags && file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {file.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs font-medium bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full border border-orange-500/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Back Button */}
              <Link
                href="/"
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors border border-gray-700"
                aria-label="Close and return to graveyard"
              >
                <span className="text-xl">✕</span>
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="prose prose-invert prose-orange max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-orange-400 mb-4 mt-6">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-orange-400 mb-3 mt-5">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-orange-300 mb-2 mt-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-gray-300 space-y-1 mb-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-gray-300 space-y-1 mb-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-300">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-orange-500 pl-4 italic text-gray-400 my-4">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className
                    if (isInline) {
                      return (
                        <code className="bg-gray-800 text-orange-300 px-1.5 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      )
                    }
                    return (
                      <code className={`${className} bg-gray-800 text-gray-300 block p-4 rounded-lg overflow-x-auto font-mono text-sm`}>
                        {children}
                      </code>
                    )
                  },
                  pre: ({ children }) => (
                    <pre className="bg-gray-800 rounded-lg overflow-x-auto mb-4">
                      {children}
                    </pre>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-halloween-orange hover:text-orange-400 underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-white">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-200">{children}</em>
                  ),
                }}
              >
                {file.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-orange-500/20 p-6 flex justify-between items-center bg-gray-900/30">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>←</span>
              <span>Back to Graveyard</span>
            </Link>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(file.content)
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
              >
                📋 Copy Content
              </button>
            </div>
          </div>
        </div>

        {/* Metadata Sidebar (Desktop Only) */}
        <div className="hidden lg:block bg-gradient-to-br from-purple-900/20 to-orange-900/20 border border-orange-500/20 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">📊 File Details</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-400 mb-1">Path</dt>
              <dd className="text-gray-300 font-mono text-xs bg-black/30 px-2 py-1 rounded">
                {file.relativePath}
              </dd>
            </div>
            <div>
              <dt className="text-gray-400 mb-1">Folder</dt>
              <dd className="text-white font-semibold">{file.folder}</dd>
            </div>
            <div>
              <dt className="text-gray-400 mb-1">Word Count</dt>
              <dd className="text-white font-semibold">{file.wordCount.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-gray-400 mb-1">Last Modified</dt>
              <dd className="text-white font-semibold">{file.modified}</dd>
            </div>
            {file.tags && file.tags.length > 0 && (
              <div>
                <dt className="text-gray-400 mb-2">Tags</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {file.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded border border-orange-500/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}
