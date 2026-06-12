"use client"

import { useState, ReactNode } from "react"

interface LyricVersion {
  id: string
  languageCode: string
  content: string
}

interface LyricAndChordSectionProps {
  lyrics: LyricVersion[]
}

// Parse a lyric line that may have chords embedded like [G]word [D]word
function parseLyricLine(line: string) {
  // Check if this line is a chord line (all tokens are chord names like G, Am, D/F#, Em)
  const chordPattern = /^([A-G][b#]?(m|M|maj|min|dim|aug|sus|add)?\d*(\/?[A-G][b#]?)?\s*)+$/
  if (chordPattern.test(line.trim()) && line.trim().length > 0 && line.trim().length < 60) {
    return { type: "chord" as const, chords: line.trim().split(/\s+/).filter(Boolean) }
  }
  return { type: "lyric" as const, text: line }
}

export function LyricAndChordSection({ lyrics }: LyricAndChordSectionProps) {
  const [activeLangIndex, setActiveLangIndex] = useState(0)
  const [fontSize, setFontSize] = useState(16)

  const currentLyric = lyrics[activeLangIndex] || null

  function renderContent(text: string) {
    if (!text) return null

    const paragraphs = text.split(/\r?\n\s*\r?\n/)

    return paragraphs.map((para, pIdx) => {
      const lines = para.split(/\r?\n/).map(l => l.trim())
      if (!lines.length || (lines.length === 1 && !lines[0])) return null

      const firstLine = lines[0].toUpperCase()
      const isChorus = firstLine.startsWith("CHORUS")
      const isVerse = firstLine.startsWith("VERSE")
      const isBridge = firstLine.startsWith("BRIDGE")
      const hasHeader = isChorus || isVerse || isBridge

      const headerLine = hasHeader ? lines[0] : null
      const contentLines = hasHeader ? lines.slice(1) : lines

      // Parse pairs: chord line + lyric line
      const renderedLines: ReactNode[] = []
      let i = 0
      while (i < contentLines.length) {
        const parsed = parseLyricLine(contentLines[i])
        if (parsed.type === "chord" && i + 1 < contentLines.length) {
          // Chord + lyric pair
          renderedLines.push(
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "2px" }}>
                {parsed.chords.map((ch, ci) => (
                  <span key={ci} className="chord-label">{ch}</span>
                ))}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: `${fontSize}px`, color: "#1b1b1c", lineHeight: "1.8" }}>
                {contentLines[i + 1]}
              </div>
            </div>
          )
          i += 2
        } else {
          // Regular lyric line
          renderedLines.push(
            <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: `${fontSize}px`, color: "#1b1b1c", lineHeight: "1.8", marginBottom: "2px" }}>
              {parsed.type === "chord" ? (
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {parsed.chords.map((ch, ci) => (
                    <span key={ci} className="chord-label">{ch}</span>
                  ))}
                </div>
              ) : parsed.text}
            </div>
          )
          i++
        }
      }

      if (isChorus) {
        return (
          <div key={pIdx} style={{
            marginBottom: "28px",
            paddingLeft: "20px",
            paddingTop: "12px",
            paddingBottom: "12px",
            paddingRight: "16px",
            borderLeft: "4px solid #74593e",
            background: "rgba(116,89,62,0.04)",
            borderRadius: "0 8px 8px 0",
          }}>
            {headerLine && (
              <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#74593e", marginBottom: "10px" }}>
                {headerLine}
              </div>
            )}
            {renderedLines}
          </div>
        )
      }

      return (
        <div key={pIdx} style={{ marginBottom: "28px" }}>
          {headerLine && (
            <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#76777c", marginBottom: "10px" }}>
              {headerLine}
            </div>
          )}
          {renderedLines}
        </div>
      )
    })
  }

  return (
    <div>
      {/* Language tabs + controls */}
      {lyrics.length > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {lyrics.map((lyr, idx) => (
              <button
                key={lyr.id}
                onClick={() => setActiveLangIndex(idx)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  border: `1.5px solid ${idx === activeLangIndex ? "#74593e" : "#c6c6cc"}`,
                  background: idx === activeLangIndex ? "#74593e" : "transparent",
                  color: idx === activeLangIndex ? "#ffffff" : "#45474c",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >{lyr.languageCode}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={() => setFontSize(s => Math.max(12, s - 2))} style={{ background: "#f6f3f4", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "#45474c" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>text_decrease</span>
            </button>
            <button onClick={() => setFontSize(s => Math.min(24, s + 2))} style={{ background: "#f6f3f4", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "#45474c" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>text_increase</span>
            </button>
          </div>
        </div>
      )}

      {/* Lyrics content */}
      <div style={{ lineHeight: "1.8" }}>
        {currentLyric ? (
          renderContent(currentLyric.content)
        ) : (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "#76777c", fontStyle: "italic" }}>
            No lyrics available for this song yet.
          </p>
        )}
      </div>
    </div>
  )
}
