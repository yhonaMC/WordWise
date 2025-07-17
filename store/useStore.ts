import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DictionaryEntry,
  SearchHistoryItem,
  SearchSuggestion,
  SearchSuggestionResponse,
  FontType,
  Theme
} from '../types/dictionary'

interface AppState {
  theme: Theme
  fontType: FontType
  isThemeManual: boolean
  searchQuery: string
  searchResult: DictionaryEntry[] | null
  searchSuggestions: SearchSuggestion[]
  isLoading: boolean
  isLoadingSuggestions: boolean
  error: string | null
  searchHistory: SearchHistoryItem[]
  showHistory: boolean
  setTheme: (theme: Theme) => void
  setFontType: (fontType: FontType) => void
  setSearchQuery: (query: string) => void
  setSearchResult: (result: DictionaryEntry[] | null) => void
  setSearchSuggestions: (suggestions: SearchSuggestion[]) => void
  setIsLoading: (loading: boolean) => void
  setIsLoadingSuggestions: (loading: boolean) => void
  setError: (error: string | null) => void
  addToHistory: (item: SearchHistoryItem) => void
  clearHistory: () => void
  toggleHistory: () => void
  searchWord: (word: string) => Promise<void>
  fetchSuggestions: (query: string) => Promise<void>
  clearResults: () => void
  initializeTheme: () => void
  toggleTheme: () => void
}

const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  return 'light'
}

const validateSearchInput = (word: string): string | null => {
  const trimmed = word.trim()

  if (!trimmed) {
    return 'Please enter a word to search'
  }

  if (trimmed.length < 1) {
    return 'Word must be at least 1 character long'
  }

  if (trimmed.length > 50) {
    return 'Word must be less than 50 characters long'
  }

  if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
    return 'Word can only contain letters, spaces, hyphens, and apostrophes'
  }

  if (/^\s|\s$/.test(word)) {
    return 'Word cannot start or end with spaces'
  }

  return null
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      fontType: 'sans',
      isThemeManual: false,
      searchQuery: '',
      searchResult: null,
      searchSuggestions: [],
      isLoading: false,
      isLoadingSuggestions: false,
      error: null,
      searchHistory: [],
      showHistory: false,

      setTheme: (theme) => set({ theme }),
      setFontType: (fontType) => set({ fontType }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchResult: (result) => set({ searchResult: result }),
      setSearchSuggestions: (suggestions) =>
        set({ searchSuggestions: suggestions }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsLoadingSuggestions: (loading) =>
        set({ isLoadingSuggestions: loading }),
      setError: (error) => set({ error }),

      addToHistory: (item) => {
        const history = get().searchHistory
        const existingIndex = history.findIndex(
          (h) => h.word.toLowerCase() === item.word.toLowerCase()
        )

        if (existingIndex !== -1) {
          const updatedHistory = [...history]
          updatedHistory[existingIndex] = item
          set({ searchHistory: updatedHistory })
        } else {
          const newHistory = [item, ...history].slice(0, 20)
          set({ searchHistory: newHistory })
        }
      },

      clearHistory: () => set({ searchHistory: [] }),
      toggleHistory: () => set({ showHistory: !get().showHistory }),

      clearResults: () =>
        set({
          searchResult: null,
          searchSuggestions: [],
          error: null,
          searchQuery: ''
        }),

      initializeTheme: () => {
        const isManual = get().isThemeManual
        if (!isManual) {
          const systemTheme = getSystemTheme()
          set({ theme: systemTheme })
        }
      },

      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme, isThemeManual: true })
      },

      fetchSuggestions: async (query: string) => {
        if (!query.trim()) {
          set({ searchSuggestions: [] })
          return
        }

        set({ isLoadingSuggestions: true })

        try {
          const response = await fetch(
            `https://api.datamuse.com/words?sp=${encodeURIComponent(
              query.trim()
            )}*&max=8`
          )

          if (!response.ok) {
            throw new Error('Failed to fetch suggestions')
          }

          const data: { word: string; score?: number }[] = await response.json()
          const suggestions: SearchSuggestion[] = data.map((item) => ({
            word: item.word,
            score: item.score || 0
          }))

          set({ searchSuggestions: suggestions, isLoadingSuggestions: false })
        } catch (error) {
          set({ searchSuggestions: [], isLoadingSuggestions: false })
        }
      },

      searchWord: async (word: string) => {
        const validationError = validateSearchInput(word)
        if (validationError) {
          set({ error: validationError })
          return
        }

        set({ isLoading: true, error: null, searchSuggestions: [] })

        try {
          const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word.trim()}`
          )

          if (!response.ok) {
            // If word not found, search for suggestions
            await get().fetchSuggestions(word)
            throw new Error('Word not found. Here are some suggestions:')
          }

          const data: DictionaryEntry[] = await response.json()

          // Clear suggestions when search is successful
          set({
            searchResult: data,
            isLoading: false,
            searchSuggestions: []
          })

          get().addToHistory({
            word: word.trim(),
            timestamp: new Date(),
            success: true
          })
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'An error occurred'
          set({ error: errorMessage, isLoading: false, searchResult: null })

          get().addToHistory({
            word: word.trim(),
            timestamp: new Date(),
            success: false
          })
        }
      }
    }),
    {
      name: 'wordwise-storage',
      partialize: (state) => ({
        theme: state.theme,
        fontType: state.fontType,
        searchHistory: state.searchHistory,
        isThemeManual: state.isThemeManual
      })
    }
  )
)
