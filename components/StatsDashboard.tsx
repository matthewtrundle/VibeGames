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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" role="region" aria-label="Vault statistics dashboard">
      {/* Total Files */}
      <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-xl p-6" role="status" aria-label={`${totalFiles} total files`}>
        <div className="text-4xl mb-2" aria-hidden="true">📚</div>
        <div className="text-3xl font-bold text-white mb-1">{totalFiles}</div>
        <div className="text-sm text-purple-300">Total Files</div>
      </div>

      {/* Total Tags */}
      <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-500/30 rounded-xl p-6" role="status" aria-label={`${uniqueTags.size} unique tags`}>
        <div className="text-4xl mb-2" aria-hidden="true">🏷️</div>
        <div className="text-3xl font-bold text-white mb-1">{uniqueTags.size}</div>
        <div className="text-sm text-orange-300">Unique Tags</div>
      </div>

      {/* Total Words */}
      <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-xl p-6" role="status" aria-label={`${totalWords.toLocaleString()} total words`}>
        <div className="text-4xl mb-2" aria-hidden="true">📝</div>
        <div className="text-3xl font-bold text-white mb-1">{totalWords.toLocaleString()}</div>
        <div className="text-sm text-green-300">Total Words</div>
      </div>

      {/* Avg Words */}
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-xl p-6" role="status" aria-label={`${avgWordsPerFile} average words per file`}>
        <div className="text-4xl mb-2" aria-hidden="true">📊</div>
        <div className="text-3xl font-bold text-white mb-1">{avgWordsPerFile}</div>
        <div className="text-sm text-blue-300">Avg Words/File</div>
      </div>

      {/* Folder Breakdown */}
      <div className="md:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          📁 Files by Folder
        </h3>
        <div className="space-y-3">
          {Object.entries(folderCounts).map(([folder, count]) => (
            <div key={folder}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300 capitalize">{folder.replace('-', ' ')}</span>
                <span className="text-orange-400 font-semibold">{count}</span>
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

      {/* Top Tags */}
      <div className="md:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          🔥 Top Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {topTags.map(([tag, count]) => (
            <div
              key={tag}
              className="px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-300"
            >
              <span className="font-semibold">{tag}</span>
              <span className="ml-2 text-xs text-orange-400">×{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
