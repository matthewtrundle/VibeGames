'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface FileModalProps {
  file: {
    filename: string
    folder: string
    content: string
    tags?: string[]
    date?: string
  } | null
  onClose: () => void
}

export default function FileModal({ file, onClose }: FileModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (file) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [file])

  // Add Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && file) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [file, onClose])

  if (!file) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-gray-900 border border-orange-500/30 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col transition-transform duration-300 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
      >
        {/* Header */}
        <div className="border-b border-orange-500/20 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2 block">
                {file.folder.replace('-', ' ')}
              </span>
              <h2 id="modal-title" className="text-2xl font-bold text-white">
                {file.filename.replace(/-/g, ' ')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl leading-none ml-4"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Meta info */}
          <div className="flex gap-4 text-sm text-gray-400">
            {file.date && (
              <div>
                📅 {file.date}
              </div>
            )}
            {file.tags && file.tags.length > 0 && (
              <div className="flex gap-2">
                {file.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6" role="document">
          <div className="prose prose-invert max-w-none prose-headings:text-orange-400 prose-a:text-orange-500 prose-strong:text-white prose-code:text-orange-300 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {file.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-orange-500/20 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
