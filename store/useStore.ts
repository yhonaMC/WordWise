import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DictionaryEntry,
  SearchHistoryItem,
  FontType,
  Theme
} from '../types/dictionary'

interface AppState {
  theme: Theme
  fontType: FontType
  isThemeManual: boolean
  searchQuery: string
  searchResult: DictionaryEntry[] | null
  isLoading: boolean
  error: string | null
  searchHistory: SearchHistoryItem[]
  showHistory: boolean
  setTheme: (theme: Theme) => void
  setFontType: (fontType: FontType) => void
  setSearchQuery: (query: string) => void
  setSearchResult: (result: DictionaryEntry[] | null) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addToHistory: (item: SearchHistoryItem) => void
  clearHistory: () => void
  toggleHistory: () => void
  searchWord: (word: string) => Promise<void>
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
      isLoading: false,
      error: null,
      searchHistory: [],
      showHistory: false,

      setTheme: (theme) => set({ theme }),
      setFontType: (fontType) => set({ fontType }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchResult: (result) => set({ searchResult: result }),
      setIsLoading: (loading) => set({ isLoading: loading }),
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

      searchWord: async (word: string) => {
        const validationError = validateSearchInput(word)
        if (validationError) {
          set({ error: validationError })
          return
        }

        set({ isLoading: true, error: null })

        try {
          const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word.trim()}`
          )

          if (!response.ok) {
            throw new Error('Word not found')
          }

          const data: DictionaryEntry[] = await response.json()

          set({ searchResult: data, isLoading: false })

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
