import Image from 'next/image'

interface MarkdownFile {
  filename: string
  relativePath: string
  preview: string
  content: string
  tags?: string[]
  date?: string
  folder: string
}

interface StatsDashboardProps {
  files: MarkdownFile[]
}

export default function StatsDashboard({ files }: StatsDashboardProps) {
  // Calculate stats
  const totalFiles = files.length
  const folderCounts = files.reduce((acc, file) => {
    acc[file.folder] = (acc[file.folder] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const allTags = files.flatMap(f => f.tags || [])
  const uniqueTags = new Set(allTags)
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const totalWords = files.reduce((sum, file) => {
    return sum + file.content.split(/\s+/).length
  }, 0)

  const avgWordsPerFile = Math.round(totalWords / totalFiles)

  return (
    <div className="space-y-6" role="region" aria-label="Vault statistics dashboard">
      {/* Compact Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Files */}
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-xl p-4" role="status" aria-label={`${totalFiles} total files`}>
          <div className="text-3xl mb-1" aria-hidden="true">📚</div>
          <div className="text-2xl font-bold text-white">{totalFiles}</div>
          <div className="text-xs text-purple-300">Files</div>
        </div>

        {/* Total Words */}
        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-500/30 rounded-xl p-4" role="status" aria-label={`${totalWords.toLocaleString()} total words`}>
          <div className="text-3xl mb-1" aria-hidden="true">📝</div>
          <div className="text-2xl font-bold text-white">{totalWords.toLocaleString()}</div>
          <div className="text-xs text-orange-300">Words</div>
        </div>

        {/* Avg Words */}
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-xl p-4" role="status" aria-label={`${avgWordsPerFile} average words per file`}>
          <div className="text-3xl mb-1" aria-hidden="true">📊</div>
          <div className="text-2xl font-bold text-white">{avgWordsPerFile}</div>
          <div className="text-xs text-green-300">Avg/File</div>
        </div>

        {/* Folders */}
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-xl p-4" role="status" aria-label={`${Object.keys(folderCounts).length} folders`}>
          <div className="text-3xl mb-1" aria-hidden="true">📁</div>
          <div className="text-2xl font-bold text-white">{Object.keys(folderCounts).length}</div>
          <div className="text-xs text-blue-300">Folders</div>
        </div>
      </div>

      {/* Folder Breakdown - Full Width with Graveyard Map Background */}
      <div className="relative overflow-hidden border border-gray-800 rounded-xl">
        {/* AI Generated Graveyard Map Background */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/generated/graveyard-map.webp"
            alt="Graveyard map background"
            fill
            className="object-cover"
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/60"></div>

        {/* Content */}
        <div className="relative z-10 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🪦</span> The Graveyard Map
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(folderCounts).map(([folder, count]) => (
              <div key={folder} className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 capitalize font-semibold">{folder.replace('-', ' ')}</span>
                  <span className="text-orange-400 font-bold text-lg">{count}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${(count / totalFiles) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
