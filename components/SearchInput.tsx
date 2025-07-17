'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, RotateCcw } from 'lucide-react'
import { useStore } from '../store/useStore'

const SearchInput: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchWord,
    isLoading,
    error,
    setError,
    clearResults,
    searchResult,
    searchSuggestions,
    fetchSuggestions,
    isLoadingSuggestions,
    setSearchSuggestions
  } = useStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (localQuery.trim() && localQuery.length > 2) {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(localQuery)
        setShowSuggestions(true)
      }, 300)
    } else {
      setSearchSuggestions([])
      setShowSuggestions(false)
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [localQuery, fetchSuggestions, setSearchSuggestions])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedSuggestion(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchResult && searchResult.length > 0) {
      setShowSuggestions(false)
      setSelectedSuggestion(-1)
    }
  }, [searchResult])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!localQuery.trim()) {
      setError('Please enter a word to search')
      return
    }

    setError(null)
    setSearchQuery(localQuery)
    setShowSuggestions(false)
    setSelectedSuggestion(-1)
    await searchWord(localQuery)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalQuery(value)
    setSelectedSuggestion(-1)

    if (error && value.trim()) {
      setError(null)
    }
  }

  const handleClear = () => {
    setLocalQuery('')
    setSearchQuery('')
    setError(null)
    setShowSuggestions(false)
    setSelectedSuggestion(-1)
  }

  const handleClearResults = () => {
    clearResults()
    setLocalQuery('')
    setShowSuggestions(false)
    setSelectedSuggestion(-1)
  }

  const handleSuggestionClick = async (suggestion: string) => {
    setLocalQuery(suggestion)
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    setSelectedSuggestion(-1)
    setSearchSuggestions([])
    await searchWord(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (selectedSuggestion >= 0 && searchSuggestions[selectedSuggestion]) {
        handleSuggestionClick(searchSuggestions[selectedSuggestion].word)
      } else {
        handleSubmit(e)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestion((prev) =>
        prev < searchSuggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestion((prev) =>
        prev > 0 ? prev - 1 : searchSuggestions.length - 1
      )
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedSuggestion(-1)
    }
  }

  const hasResults = searchResult || searchSuggestions.length > 0

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative" ref={suggestionsRef}>
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              type="text"
              value={localQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => localQuery.length > 2 && setShowSuggestions(true)}
              placeholder="Search for any word..."
              className={`w-full px-4 py-4 pl-12 pr-20 text-lg rounded-2xl border-2 transition-all duration-200 focus:outline-none ${
                error
                  ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800'
                  : showSuggestions && searchSuggestions.length > 0
                  ? 'border-blue-500 dark:border-blue-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800'
                  : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm dark:shadow-gray-900/20 ${
                showSuggestions && searchSuggestions.length > 0
                  ? 'rounded-b-none'
                  : ''
              }`}
              disabled={isLoading}
              aria-label="Search for a word"
              aria-describedby={error ? 'search-error' : undefined}
              autoComplete="off"
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

        {showSuggestions && searchSuggestions.length > 0 && !isLoading && (
          <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border-2 border-t-0 border-blue-500 dark:border-blue-400 rounded-b-2xl shadow-lg max-h-60 overflow-y-auto">
            {isLoadingSuggestions && (
              <div className="flex items-center justify-center py-4">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Loading suggestions...
                </span>
              </div>
            )}

            {!isLoadingSuggestions && (
              <>
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Suggestions (press ↑↓ to navigate, Enter to select)
                  </p>
                </div>

                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.word}-${index}`}
                    onClick={() => handleSuggestionClick(suggestion.word)}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      selectedSuggestion === index
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {suggestion.word}
                      </span>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {hasResults && (
        <div className="mt-4 text-center">
          <button
            onClick={handleClearResults}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium border border-gray-300 dark:border-gray-600"
            aria-label="Clear all results and start a new search"
          >
            <RotateCcw className="h-4 w-4" />
            Clear Results & Start New Search
          </button>
        </div>
      )}

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
