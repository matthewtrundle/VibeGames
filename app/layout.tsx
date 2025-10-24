import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '👻 The Headless Horseman\'s Quest',
  description: 'Reunite your scattered markdown souls',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen py-12 px-6">
          {children}
        </main>
      </body>
    </html>
  )
}
