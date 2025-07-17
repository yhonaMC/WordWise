'use client'

import React from 'react'
import { ExternalLink } from 'lucide-react'
import { useStore } from '../store/useStore'
import { DictionaryEntry } from '../types/dictionary'
import AudioPlayer from './AudioPlayer'

interface WordDefinitionProps {
  entries: DictionaryEntry[]
}

const WordDefinition: React.FC<WordDefinitionProps> = ({ entries }) => {
  const { fontType } = useStore()

  if (!entries || entries.length === 0) {
    return null
  }

  const entry = entries[0]
  const audioUrl = entry.phonetics.find((p) => p.audio)?.audio || ''

  const getFontClass = () => {
    switch (fontType) {
      case 'serif':
        return 'font-serif'
      case 'mono':
        return 'font-mono'
      default:
        return 'font-sans'
    }
  }

  return (
    <div className={`max-w-4xl mx-auto ${getFontClass()}`}>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {entry.word}
            </h1>
            {entry.phonetic && (
              <p className="text-lg text-purple-600 dark:text-purple-400 font-medium">
                {entry.phonetic}
              </p>
            )}
          </div>

          {audioUrl && <AudioPlayer audioUrl={audioUrl} word={entry.word} />}
        </div>
      </div>

      <div className="space-y-8">
        {entry.meanings.map((meaning, meaningIndex) => (
          <div
            key={meaningIndex}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white italic">
                {meaning.partOfSpeech}
              </h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                Meaning
              </h3>

              <ul className="space-y-3">
                {meaning.definitions.map((definition, defIndex) => (
                  <li key={defIndex} className="flex gap-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-lg leading-6">
                      •
                    </span>
                    <div className="flex-1 space-y-2">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {definition.definition}
                      </p>

                      {definition.example && (
                        <p className="text-gray-600 dark:text-gray-400 italic text-sm">
                          &ldquo;{definition.example}&rdquo;
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {meaning.definitions.some(
                (def) => def.synonyms && def.synonyms.length > 0
              ) && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Synonyms:
                    </span>
                    {meaning.definitions
                      .flatMap((def) => def.synonyms || [])
                      .slice(0, 5)
                      .map((synonym, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-md text-sm font-medium"
                        >
                          {synonym}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {meaning.definitions.some(
                (def) => def.antonyms && def.antonyms.length > 0
              ) && (
                <div className="mt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Antonyms:
                    </span>
                    {meaning.definitions
                      .flatMap((def) => def.antonyms || [])
                      .slice(0, 5)
                      .map((antonym, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm font-medium"
                        >
                          {antonym}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {entry.sourceUrls && entry.sourceUrls.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Source:</span>
            <a
              href={entry.sourceUrls[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline hover:no-underline transition-colors"
            >
              {entry.sourceUrls[0]}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default WordDefinition
