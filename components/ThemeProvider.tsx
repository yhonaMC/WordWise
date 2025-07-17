'use client'

import React, { useEffect } from 'react'
import { useStore } from '../store/useStore'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, fontType, setTheme, initializeTheme } = useStore()

  useEffect(() => {
    initializeTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const currentIsManual = useStore.getState().isThemeManual
      if (!currentIsManual) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [initializeTheme, setTheme])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    const fontClass = `font-${fontType}`
    document.documentElement.className =
      document.documentElement.className
        .replace(/font-(serif|sans|mono)/g, '')
        .trim() + ` ${fontClass}`
  }, [fontType])

  return <>{children}</>
}

export default ThemeProvider
