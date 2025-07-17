'use client'

import React, { useState, useRef } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

interface AudioPlayerProps {
  audioUrl: string
  word: string
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, word }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlay = async () => {
    if (!audioUrl) return

    try {
      setIsLoading(true)
      setError(false)

      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl)

        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false)
        })

        audioRef.current.addEventListener('error', () => {
          setError(true)
          setIsPlaying(false)
          setIsLoading(false)
        })

        audioRef.current.addEventListener('canplaythrough', () => {
          setIsLoading(false)
        })
      }

      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (err) {
      console.error('Error playing audio:', err)
      setError(true)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('ended', () => {})
        audioRef.current.removeEventListener('error', () => {})
        audioRef.current.removeEventListener('canplaythrough', () => {})
      }
    }
  }, [])

  if (!audioUrl || error) {
    return (
      <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
        <Volume2 className="h-4 w-4" />
        <span className="text-sm">No audio available</span>
      </div>
    )
  }

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading}
      className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label={`Play pronunciation of ${word}`}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-purple-600 dark:border-purple-400 border-t-transparent rounded-full animate-spin" />
      ) : isPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
      <span className="text-sm font-medium">
        {isLoading ? 'Loading...' : isPlaying ? 'Playing' : 'Play'}
      </span>
    </button>
  )
}

export default AudioPlayer
