export interface Phonetic {
  text: string
  audio?: string
}

export interface Definition {
  definition: string
  example?: string
  synonyms?: string[]
  antonyms?: string[]
}

export interface Meaning {
  partOfSpeech: string
  definitions: Definition[]
  synonyms?: string[]
  antonyms?: string[]
}

export interface DictionaryEntry {
  word: string
  phonetic?: string
  phonetics: Phonetic[]
  meanings: Meaning[]
  sourceUrls?: string[]
}

export interface SearchHistoryItem {
  word: string
  timestamp: Date
  success: boolean
}

// New types for search suggestions
export interface SearchSuggestion {
  word: string
  score: number
}

export interface SearchSuggestionResponse {
  suggestions: SearchSuggestion[]
  originalQuery: string
}

export type FontType = 'serif' | 'sans' | 'mono'
export type Theme = 'light' | 'dark'
