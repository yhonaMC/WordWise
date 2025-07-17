export interface Phonetic {
  text: string
  audio: string
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

export type FontType = 'serif' | 'sans' | 'mono'
export type Theme = 'light' | 'dark'
