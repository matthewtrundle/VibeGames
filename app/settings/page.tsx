'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const [vaultPath, setVaultPath] = useState('/Users/demo/Documents/vault')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<{
    success: boolean
    filesFound: number
    lastScan?: string
    error?: string
  } | null>(null)

  const handleScan = async () => {
    setIsScanning(true)
    setScanResults(null)

    try {
      // Simulate scan process (in real app, would call API)
      await new Promise(resolve => setTimeout(resolve, 1500))

      setScanResults({
        success: true,
        filesFound: 15,
        lastScan: new Date().toLocaleString()
      })
    } catch (error) {
      setScanResults({
        success: false,
        filesFound: 0,
        error: 'Failed to scan vault. Please check the path and try again.'
      })
    } finally {
      setIsScanning(false)
    }
  }

  const useDemoVault = () => {
    setVaultPath('/demo-vault')
    setScanResults({
      success: true,
      filesFound: 15,
      lastScan: new Date().toLocaleString()
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-graveyard-black via-black to-haunted-purple/20 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-halloween-orange hover:text-orange-400 transition-colors mb-4"
          >
            <span className="text-2xl">←</span>
            <span className="font-semibold">Back to Graveyard</span>
          </Link>

          <h1 className="text-5xl font-bold text-white tracking-tight">
            ⚙️ Settings
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Configure your vault path and scan for markdown files
          </p>
        </div>

        {/* Vault Configuration Card */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 space-y-6 backdrop-blur">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              📁 Vault Configuration
            </h2>
            <p className="text-gray-400">
              Set the path to your Obsidian vault or use the demo vault
            </p>
          </div>

          {/* Vault Path Input */}
          <div className="space-y-3">
            <label htmlFor="vaultPath" className="block text-sm font-semibold text-gray-300">
              Vault Path
            </label>
            <input
              id="vaultPath"
              type="text"
              value={vaultPath}
              onChange={(e) => setVaultPath(e.target.value)}
              placeholder="/path/to/your/obsidian/vault"
              className="w-full bg-black/50 border border-orange-500/30 focus:border-orange-500/60 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
              disabled={isScanning}
            />
            <p className="text-xs text-gray-500">
              Enter the full path to your Obsidian vault directory
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleScan}
              disabled={isScanning || !vaultPath.trim()}
              className="flex-1 bg-halloween-orange hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Scanning Vault...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Scan Vault</span>
                </>
              )}
            </button>

            <button
              onClick={useDemoVault}
              disabled={isScanning}
              className="bg-mystic-purple hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Use Demo Vault
            </button>
          </div>

          {/* Scan Results */}
          {scanResults && (
            <div className={`rounded-xl p-4 ${
              scanResults.success
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              {scanResults.success ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-400 font-semibold">
                    <span>✨</span>
                    <span>Vault scanned successfully!</span>
                  </div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>📄 Files found: <span className="font-bold text-white">{scanResults.filesFound}</span></p>
                    <p>🕐 Last scan: <span className="font-mono text-gray-400">{scanResults.lastScan}</span></p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-semibold">
                    <span>⚠️</span>
                    <span>Scan failed</span>
                  </div>
                  <p className="text-sm text-gray-300">{scanResults.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Help Card */}
        <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 border border-orange-500/20 rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            💡 Quick Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-halloween-orange mt-0.5">•</span>
              <span>The app scans for <code className="bg-black/30 px-1.5 py-0.5 rounded text-orange-300">.md</code> files recursively</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-halloween-orange mt-0.5">•</span>
              <span>Frontmatter tags are automatically extracted for filtering</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-halloween-orange mt-0.5">•</span>
              <span>Files are organized by their parent folder structure</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-halloween-orange mt-0.5">•</span>
              <span>Use the demo vault to try the app with sample data</span>
            </li>
          </ul>
        </div>

        {/* Advanced Settings (Future) */}
        <div className="bg-gray-900/30 border border-gray-800/50 rounded-2xl p-6 space-y-3 opacity-60">
          <h3 className="text-lg font-bold text-gray-400 flex items-center gap-2">
            🚧 Coming Soon
          </h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>• Auto-refresh on file changes</li>
            <li>• Exclude patterns configuration</li>
            <li>• Multiple vault support</li>
            <li>• Custom tag extraction rules</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
