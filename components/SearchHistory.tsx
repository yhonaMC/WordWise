'use client'

import React from 'react'
import { Clock, Search, X, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { useStore } from '../store/useStore'

const SearchHistory: React.FC = () => {
  const {
    searchHistory,
    showHistory,
    toggleHistory,
    clearHistory,
    searchWord
  } = useStore()

  if (!showHistory) return null

  const handleSearchHistoryItem = (word: string) => {
    searchWord(word)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Search History
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {searchHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                aria-label="Clear all history"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={toggleHistory}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close history"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
          {searchHistory.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No search history yet. Start searching for words to see them
                here!
              </p>
            </div>
          ) : (
            <div className="p-4">
              {searchHistory.map((item, index) => (
                <div
                  key={`${item.word}-${item.timestamp}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    {item.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => handleSearchHistoryItem(item.word)}
                      className="w-full text-left"
                      disabled={!item.success}
                    >
                      <p
                        className={`font-medium truncate ${
                          item.success
                            ? 'text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {item.word}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(item.timestamp)}
                      </p>
                    </button>
                  </div>

                  {item.success && (
                    <button
                      onClick={() => handleSearchHistoryItem(item.word)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                      aria-label={`Search for ${item.word}`}
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchHistory
