'use client'

import React from 'react'
import { useStore } from '../store/useStore'
import Header from '../components/Header'
import SearchInput from '../components/SearchInput'
import WordDefinition from '../components/WordDefinition'
import SearchHistory from '../components/SearchHistory'
import SearchSuggestions from '../components/SearchSuggestions'

const Home: React.FC = () => {
  const {
    searchResult,
    isLoading,
    error,
    searchSuggestions,
    isLoadingSuggestions
  } = useStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 max-w-6xl">
        <Header />

        <main className="py-8">
          <div className="mb-12">
            <SearchInput />
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-purple-600 dark:border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          )}

          {isLoadingSuggestions && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Finding suggestions...
              </p>
            </div>
          )}

          {error && !isLoading && !isLoadingSuggestions && (
            <>
              {error.includes('suggestions') && searchSuggestions.length > 0 ? (
                <SearchSuggestions />
              ) : (
                <div className="max-w-2xl mx-auto text-center py-16">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
                    <div className="text-red-600 dark:text-red-400 text-6xl mb-4">
                      😔
                    </div>
                    <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">
                      Word Not Found
                    </h2>
                    <p className="text-red-600 dark:text-red-400 mb-4">
                      {error}
                    </p>
                    <p className="text-red-500 dark:text-red-400 text-sm">
                      Please check the spelling and try again.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {!error &&
            searchSuggestions.length > 0 &&
            !isLoading &&
            !isLoadingSuggestions &&
            !searchResult && <SearchSuggestions />}

          {searchResult && !isLoading && !error && (
            <div className="px-4">
              <WordDefinition entries={searchResult} />
            </div>
          )}

          {!searchResult &&
            !isLoading &&
            !error &&
            !searchSuggestions.length &&
            !isLoadingSuggestions && (
              <div className="max-w-2xl mx-auto text-center py-16">
                <div className="text-8xl mb-6">📚</div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  Welcome to WordWise
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                  Your intelligent dictionary companion. Search for any word to
                  discover its meaning, pronunciation, and usage examples.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl mb-3">🔍</div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Smart Search
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Find definitions, synonyms, and examples for any word
                      instantly.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl mb-3">🔊</div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Pronunciation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Listen to correct pronunciation with phonetic
                      transcriptions.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl mb-3">📋</div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Search History
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Keep track of your searches with timestamps and success
                      status.
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    ✨ New Feature: Smart Suggestions
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    When we can&apos;t find a word, we&apos;ll suggest similar
                    words to help you find what you&apos;re looking for!
                  </p>
                </div>
              </div>
            )}
        </main>
      </div>

      <SearchHistory />
    </div>
  )
}

export default Home
