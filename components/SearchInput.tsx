'use client'

import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useStore } from '../store/useStore'

const SearchInput: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchWord,
    isLoading,
    error,
    setError
  } = useStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!localQuery.trim()) {
      setError('Please enter a word to search')
      return
    }

    setError(null)
    setSearchQuery(localQuery)
    await searchWord(localQuery)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalQuery(value)

    if (error && value.trim()) {
      setError(null)
    }
  }

  const handleClear = () => {
    setLocalQuery('')
    setSearchQuery('')
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for any word..."
            className={`w-full px-4 py-4 pl-12 pr-20 text-lg rounded-2xl border-2 transition-all duration-200 focus:outline-none ${
              error
                ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800'
                : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm dark:shadow-gray-900/20`}
            disabled={isLoading}
            aria-label="Search for a word"
            aria-describedby={error ? 'search-error' : undefined}
          />

          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />

          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !localQuery.trim()}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-xl transition-colors ${
              isLoading || !localQuery.trim()
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 dark:bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-500 text-white shadow-md'
            }`}
            aria-label="Search"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Searching...</span>
              </div>
            ) : (
              <span className="text-sm font-medium">Search</span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div
          id="search-error"
          className="mt-3 text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800"
        >
          {error}
        </div>
      )}
    </div>
  )
}

export default SearchInput
