'use client'

import { useRef, useEffect } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  selectedFolder: string
  onFolderChange: (folder: string) => void
  folders: string[]
}

export default function SearchBar({
  value,
  onChange,
  selectedFolder,
  onFolderChange,
  folders
}: SearchBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={searchInputRef}
          id="search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="🔍 Search files by name, content, or tags... (⌘K)"
          className="w-full bg-gray-900/50 border border-orange-500/30 rounded-xl px-5 py-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-colors text-lg"
          aria-label="Search files by name, content, or tags"
          aria-keyshortcuts="Control+K Meta+K"
          role="searchbox"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            aria-label="Clear search"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Folder Filter Pills */}
      <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter files by folder">
        <button
          onClick={() => onFolderChange('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 ${
            selectedFolder === 'all'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
          aria-label="Show all files"
          aria-pressed={selectedFolder === 'all'}
        >
          All Files
        </button>
        {folders.map((folder) => (
          <button
            key={folder}
            onClick={() => onFolderChange(folder)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              selectedFolder === folder
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            aria-label={`Filter by ${folder.replace('-', ' ')} folder`}
            aria-pressed={selectedFolder === folder}
          >
            {folder.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  )
}
