'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import FileModal from './FileModal'
import SearchBar from './SearchBar'

interface MarkdownFile {
  filename: string
  relativePath: string
  preview: string
  content: string
  tags?: string[]
  date?: string
  folder: string
}

interface FileGridProps {
  files: MarkdownFile[]
}

// Loading skeleton component
function FileGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 animate-pulse"
        >
          {/* Folder badge skeleton */}
          <div className="h-4 w-24 bg-gray-700 rounded mb-4" />

          {/* Title skeleton */}
          <div className="h-6 w-3/4 bg-gray-700 rounded mb-3" />

          {/* Preview skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-gray-700 rounded" />
            <div className="h-4 w-5/6 bg-gray-700 rounded" />
            <div className="h-4 w-4/6 bg-gray-700 rounded" />
          </div>

          {/* Tags skeleton */}
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-gray-700 rounded" />
            <div className="h-6 w-20 bg-gray-700 rounded" />
            <div className="h-6 w-14 bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FileGrid({ files }: FileGridProps) {
  const [selectedFile, setSelectedFile] = useState<MarkdownFile | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Get unique folders
  const folders = useMemo(() => {
    const uniqueFolders = Array.from(new Set(files.map(f => f.folder)))
    return uniqueFolders.sort()
  }, [files])

  // Filter files based on search and folder
  const filteredFiles = useMemo(() => {
    let result = files

    // Filter by folder
    if (selectedFolder !== 'all') {
      result = result.filter(f => f.folder === selectedFolder)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(f =>
        f.filename.toLowerCase().includes(query) ||
        f.content.toLowerCase().includes(query) ||
        f.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        f.folder.toLowerCase().includes(query)
      )
    }

    return result
  }, [files, selectedFolder, searchQuery])

  // Handle keyboard navigation
  const handleCardKeyDown = (e: React.KeyboardEvent, file: MarkdownFile) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSelectedFile(file)
    }
  }

  return (
    <div className="space-y-6">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        selectedFolder={selectedFolder}
        onFolderChange={setSelectedFolder}
        folders={folders}
      />

      {/* File Grid with Background */}
      <div className="relative overflow-hidden border border-orange-500/20 rounded-2xl">
        {/* AI Generated File Cards Background */}
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/generated/file-cards-bg.webp"
            alt="Floating markdown file cards background"
            fill
            className="object-cover"
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80"></div>

        {/* Content */}
        <div className="relative z-10 p-6 space-y-6">
          {/* Results count */}
          <div className="text-sm text-gray-400">
            Showing {filteredFiles.length} of {files.length} files
            {searchQuery && <span> for "{searchQuery}"</span>}
          </div>

          {/* Show loading skeleton */}
          {isLoading ? (
            <FileGridSkeleton />
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-16 bg-gray-900/30 rounded-2xl border border-gray-800">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No files found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search or filter
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-orange-400 hover:text-orange-300 text-sm underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiles.map((file, index) => (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedFile(file)}
                  onKeyDown={(e) => handleCardKeyDown(e, file)}
                  aria-label={`Open file ${file.filename.replace(/-/g, ' ')}`}
                  className="group bg-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-orange-500/50 hover:bg-black/70 hover:shadow-2xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-500 ease-out cursor-pointer hover:-translate-y-2 hover:scale-[1.02] hover:rotate-1 active:scale-98"
                >
                  {/* Folder Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
                      {file.folder.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                    {file.filename.replace(/-/g, ' ')}
                  </h3>

                  {/* Preview */}
                  <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                    {file.preview}
                  </p>

                  {/* Tags */}
                  {file.tags && file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {file.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FileModal
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
      />
    </div>
  )
}
