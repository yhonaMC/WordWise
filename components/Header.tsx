'use client'

import React from 'react'
import { BookOpen, ChevronDown, History } from 'lucide-react'
import { useStore } from '../store/useStore'
import { FontType } from '../types/dictionary'

const Header: React.FC = () => {
  const { fontType, setFontType, toggleHistory, showHistory } = useStore()

  const handleFontChange = (newFont: FontType) => {
    setFontType(newFont)
  }

  const getFontLabel = (font: FontType) => {
    switch (font) {
      case 'serif':
        return 'Serif'
      case 'sans':
        return 'Sans Serif'
      case 'mono':
        return 'Mono'
      default:
        return 'Sans Serif'
    }
  }

  const fontOptions: FontType[] = ['serif', 'sans', 'mono']

  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          WordWise
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <select
            value={fontType}
            onChange={(e) => handleFontChange(e.target.value as FontType)}
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-0 md:pr-10 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-purple-500 dark:hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-colors cursor-pointer"
            aria-label="Select font type"
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>
                {getFontLabel(font)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />

        <button
          onClick={toggleHistory}
          className={`p-2 rounded-lg transition-colors ${
            showHistory
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
          aria-label="Toggle search history"
        >
          <History className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}

export default Header
