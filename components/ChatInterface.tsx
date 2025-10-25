'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }

  useEffect(() => {
    // Don't scroll during streaming - only when streaming completes
    if (isLoading) {
      return // Skip scrolling while AI is typing
    }

    // Scroll after streaming is complete or for user messages
    scrollToBottom()
  }, [messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    // Add placeholder for assistant message
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No reader available')
      }

      let assistantMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        assistantMessage += chunk

        // Update the last message (assistant) with streaming content
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantMessage
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error('Error:', error)

      let errorMessage = 'Sorry, I encountered an error. Please try again.'

      if (error instanceof TypeError) {
        // Network error
        errorMessage = '🕷️ The spirits are unreachable. Check your internet connection and try again.'
      } else if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = '⏳ The spirits are taking too long. Please try again.'
        } else if (error.message.includes('429')) {
          errorMessage = '⚠️ Too many requests. Please wait a moment before trying again.'
        }
      }

      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: errorMessage
        }
        return newMessages
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exampleQuestions = [
    "What bugs are mentioned?",
    "Summarize user feedback",
    "What features are users requesting?"
  ]

  const loadingMessages = [
    "Consulting the spirits...",
    "Searching the graveyard...",
    "Awakening the markdown dead...",
    "Reading ancient scrolls...",
    "Summoning file contents...",
    "The Headless Horseman is searching..."
  ]

  const [loadingMessage] = useState(() =>
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  )

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 border border-orange-500/20 rounded-2xl p-8">
      <div className="text-center space-y-4 mb-6">
        <div className="relative inline-block w-48 h-48 mx-auto">
          <Image
            src="/generated/ai-medium-crystal.webp"
            alt="AI Spirit Medium Crystal Ball"
            width={192}
            height={192}
            className="object-contain animate-pulse-crystal filter drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]"
            priority
          />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-orange-500 bg-clip-text text-transparent animate-gradient-shift">
          AI Spirit Medium
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Ask questions about your notes. The AI reads through files to find answers and provide citations.
        </p>
      </div>

      {/* Chat Messages */}
      <div className="bg-black/30 rounded-xl p-6 mb-4 min-h-[300px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center space-y-4 pt-8">
            <p className="text-sm text-orange-500 font-semibold">Example Questions:</p>
            <div className="space-y-2">
              {exampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="block w-full text-sm text-gray-400 hover:text-orange-400 transition-colors p-2 rounded hover:bg-orange-500/10"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-orange-500/20 border border-orange-500/30 text-white'
                    : 'bg-purple-900/20 border border-purple-500/30 text-gray-200'
                }`}
              >
                <div className="text-xs font-semibold mb-2 opacity-60">
                  {msg.role === 'user' ? '👤 You' : '🔮 Spirit Medium'}
                </div>
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="prose prose-sm prose-invert max-w-none prose-headings:text-orange-300 prose-a:text-orange-400 prose-strong:text-white prose-code:text-orange-200 prose-code:bg-black/30 prose-code:px-1 prose-code:rounded">
                    {msg.content ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      isLoading && idx === messages.length - 1 ? (
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="text-lg animate-pulse">⏳</span>
                          <span className="animate-pulse">{loadingMessage}</span>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your notes..."
          disabled={isLoading}
          aria-label="Ask AI a question"
          aria-describedby="chat-instructions"
          className="flex-1 bg-black/50 border border-orange-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-colors disabled:opacity-50"
        />
        <div id="chat-instructions" className="sr-only">
          Type your question and press Enter or click Ask button
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send question to AI"
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {isLoading ? '...' : 'Ask'}
        </button>
      </form>
    </div>
  )
}
