"use client"

import { useState } from "react"

interface LyricVersion {
  id: string
  languageCode: string
  content: string
}

interface LyricAndChordSectionProps {
  lyrics: LyricVersion[]
}

export function LyricAndChordSection({ lyrics }: LyricAndChordSectionProps) {
  const [activeLangIndex, setActiveLangIndex] = useState(0)
  const [fontSize, setFontSize] = useState(18) // default is 18px (text-body-lg)

  const currentLyric = lyrics[activeLangIndex] || null

  const handleTextIncrease = () => {
    setFontSize((prev) => (prev >= 24 ? 14 : prev + 2))
  }

  const handleTranslate = () => {
    if (lyrics.length > 1) {
      setActiveLangIndex((prev) => (prev + 1) % lyrics.length)
    }
  }

  // Parse lyrics text into styled blocks (Chorus, Verse, Bridge, etc.)
  const renderFormattedLyrics = (text: string) => {
    if (!text) return null

    // Normalize newlines and split by double newlines to find paragraphs
    const paragraphs = text.split(/\r?\n\s*\r?\n/)

    return paragraphs.map((para, index) => {
      const lines = para.split(/\r?\n/).map((line) => line.trim())
      if (lines.length === 0 || (lines.length === 1 && lines[0] === "")) return null

      const firstLine = lines[0].toUpperCase()

      const isChorus = firstLine.startsWith("CHORUS")
      const isVerse = firstLine.startsWith("VERSE")
      const isBridge = firstLine.startsWith("BRIDGE")

      if (isChorus || isVerse || isBridge) {
        const header = lines[0]
        const contentLines = lines.slice(1)

        if (isChorus) {
          return (
            <div key={index} className="mb-lg border-l-4 border-[var(--color-primary)] pl-4 py-1 bg-[var(--color-primary)]/5">
              <span className="text-[var(--color-primary)] font-bold text-sm block mb-1">{header}</span>
              {contentLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          )
        } else {
          return (
            <div key={index} className="mb-lg">
              <span className="text-[var(--color-on-surface-variant)] font-bold text-sm block mb-1">{header}</span>
              {contentLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          )
        }
      }

      // Default styling for paragraphs without headers
      return (
        <div key={index} className="mb-lg">
          {lines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )
    })
  }

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-xl shadow-sm border border-[var(--color-outline-variant)]/30 p-lg">
      <div className="flex justify-between items-center mb-lg">
        <h3 className="font-headline-md text-headline-md text-[var(--color-on-surface)] font-semibold">Lyrics</h3>
        <div className="flex gap-sm">
          <button 
            onClick={handleTextIncrease}
            title="Adjust Font Size"
            className="p-2 rounded-lg bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">text_increase</span>
          </button>
          {lyrics.length > 1 && (
            <button 
              onClick={handleTranslate}
              title="Translate"
              className="p-2 rounded-lg bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-colors cursor-pointer flex items-center gap-1 font-label-sm text-label-sm"
            >
              <span className="material-symbols-outlined text-sm">translate</span>
              <span className="uppercase">{currentLyric?.languageCode}</span>
            </button>
          )}
        </div>
      </div>
      
      <div 
        className="h-80 overflow-y-auto custom-scrollbar pr-md text-on-surface leading-loose"
        style={{ fontSize: `${fontSize}px` }}
      >
        {currentLyric ? (
          renderFormattedLyrics(currentLyric.content)
        ) : (
          <p className="text-[var(--color-on-surface-variant)] italic">No lyrics available.</p>
        )}
      </div>
    </div>
  )
}
