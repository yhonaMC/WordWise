'use client'

import React from 'react'
import { Lightbulb, Search } from 'lucide-react'
import { useStore } from '../store/useStore'

const SearchSuggestions: React.FC = () => {
  const {
    searchSuggestions,
    isLoadingSuggestions,
    searchWord,
    error,
    searchResult
  } = useStore()

  if (searchResult && searchResult.length > 0) {
    return null
  }

  if (!error || !error.includes('suggestions') || isLoadingSuggestions) {
    return null
  }

  if (searchSuggestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
              No Suggestions Found
            </h3>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            We couldn&apos;t find any similar words. Try checking the spelling
            or using a different word.
          </p>
        </div>
      </div>
    )
  }

  const handleSuggestionClick = (word: string) => {
    searchWord(word)
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
            Did you mean...?
          </h3>
        </div>
        <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
          We found some similar words that might help:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {searchSuggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.word}-${index}`}
              onClick={() => handleSuggestionClick(suggestion.word)}
              className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-left group"
            >
              <Search className="h-4 w-4 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300" />
              <span className="text-gray-900 dark:text-white font-medium">
                {suggestion.word}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
          <p className="text-blue-600 dark:text-blue-400 text-xs">
            💡 Click on any suggestion to search for it
          </p>
        </div>
      </div>
    </div>
  )
}

export default SearchSuggestions
