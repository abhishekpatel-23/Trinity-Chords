"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Artist {
  id: string
  name: string
}

interface Label {
  id: string
  name: string
}

interface SongFormProps {
  artists: Artist[]
  labels: Label[]
  song?: any
}

export function SongForm({ artists, labels, song }: SongFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form states
  const [title, setTitle] = useState(song?.title || "")
  const [slug, setSlug] = useState(song?.slug || "")
  const [artistId, setArtistId] = useState(song?.artistId || "")
  const [newArtistName, setNewArtistName] = useState("")
  const [genre, setGenre] = useState(song?.genre || "")
  const [key, setKey] = useState(song?.key || "G")
  const [tempo, setTempo] = useState(song?.tempoBpm ? String(song.tempoBpm) : "")
  const [timeSignature, setTimeSignature] = useState(song?.timeSignature || "4/4")
  const [isFeatured, setIsFeatured] = useState(song?.isFeatured || false)
  const [isPremium, setIsPremium] = useState(song?.isPremium || false)

  const initialLyric = song?.lyrics?.[0]
  const [lyricsContent, setLyricsContent] = useState(initialLyric?.content || "")
  const [languageCode, setLanguageCode] = useState(initialLyric?.languageCode || "en")

  const [youtubeId, setYoutubeId] = useState(song?.videos?.[0]?.youtubeId || "")

  // Extract chords list
  const getGuitarChords = () => {
    const guitarChordEntry = song?.chords?.find((c: any) => c.instrument === "guitar")
    if (guitarChordEntry) {
      try {
        const parsed = JSON.parse(guitarChordEntry.chordData)
        return parsed.map((c: any) => c.name).join(", ")
      } catch (e) {}
    }
    return ""
  }
  const [chordsInput, setChordsInput] = useState(getGuitarChords())

  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
    song?.labels?.map((l: any) => l.labelId) || []
  )
  const [customLabelsString, setCustomLabelsString] = useState("")

  // Auto-generate slug when title changes (ONLY in Create mode)
  useEffect(() => {
    if (!song) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setSlug(generated)
    }
  }, [title, song])

  // Initialize artist selection
  useEffect(() => {
    if (artists.length > 0 && !artistId) {
      setArtistId(artists[0].id)
    }
  }, [artists, artistId])

  const handleLabelToggle = (id: string) => {
    if (selectedLabelIds.includes(id)) {
      setSelectedLabelIds(selectedLabelIds.filter(item => item !== id))
    } else {
      setSelectedLabelIds([...selectedLabelIds, id])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!title.trim()) {
      setError("Title is required")
      setLoading(false)
      return
    }
    if (!slug.trim()) {
      setError("Slug is required")
      setLoading(false)
      return
    }
    if (artistId === "new" && !newArtistName.trim()) {
      setError("Please specify the name of the new artist")
      setLoading(false)
      return
    }
    if (!lyricsContent.trim()) {
      setError("Lyrics content is required")
      setLoading(false)
      return
    }

    try {
      const url = song ? `/api/admin/songs/${song.id}` : "/api/admin/songs"
      const method = song ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          artistId,
          newArtistName: artistId === "new" ? newArtistName : undefined,
          genre,
          key,
          tempo: tempo ? parseInt(tempo, 10) : undefined,
          timeSignature,
          isFeatured,
          isPremium,
          lyricsContent,
          languageCode,
          youtubeId,
          chordsInput,
          existingLabelIds: selectedLabelIds,
          customLabelsString,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to save song")
        setLoading(false)
        return
      }

      router.push("/admin/songs")
      router.refresh()
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  const keysList = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B", "Am", "Bm", "Cm", "Dm", "Em", "Fm", "Gm"]

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "16px",
      border: "1px solid rgba(198,198,204,0.2)",
      boxShadow: "0 2px 12px rgba(3,8,19,0.04)",
      padding: "32px",
      maxWidth: "800px",
      margin: "0 auto",
    }}>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "24px",
        fontWeight: "700",
        color: "#030813",
        marginBottom: "24px",
        borderBottom: "1px solid rgba(198,198,204,0.15)",
        paddingBottom: "12px",
      }}>{song ? "Edit Song Sheet" : "Create New Song Sheet"}</h2>

      {error && (
        <div style={{
          background: "#fff0f0",
          border: "1.5px solid rgba(186,26,26,0.2)",
          borderRadius: "8px",
          padding: "12px 16px",
          color: "#ba1a1a",
          fontSize: "14px",
          fontWeight: "600",
          fontFamily: "var(--font-body)",
          marginBottom: "20px",
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Title and Slug */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#45474c", marginBottom: "8px" }}>Song Title *</label>
            <input
              type="text"
              className="tc-input"
              placeholder="e.g. Goodness of God"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#45474c", marginBottom: "8px" }}>URL Slug *</label>
            <input
              type="text"
              className="tc-input"
              placeholder="e.g. goodness-of-god"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Artist Selection */}
        <div style={{ background: "#fcf8f9", padding: "16px", borderRadius: "10px", border: "1px solid rgba(198,198,204,0.15)" }}>
          <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#45474c", marginBottom: "8px" }}>Artist / Worship Leader *</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <select
              value={artistId}
              onChange={e => setArtistId(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1.5px solid #c6c6cc",
                borderRadius: "8px",
                background: "#ffffff",
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {artists.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
              <option value="new">+ Add New Artist...</option>
            </select>

            {artistId === "new" && (
              <input
                type="text"
                className="tc-input"
                placeholder="Type new artist name..."
                value={newArtistName}
                onChange={e => setNewArtistName(e.target.value)}
                required
              />
            )}
          </div>
        </div>

        {/* Metadata Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#45474c", marginBottom: "8px" }}>Original Key</label>
            <select
              value={key}
              onChange={e => setKey(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1.5px solid #c6c6cc",
                borderRadius: "8px",
                background: "#ffffff",
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {keysList.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#45474c", marginBottom: "8px" }}>Tempo (BPM)</label>
            <input
              type="number"
              className="tc-input"
              placeholder="e.g. 74"
              value={tempo}
              onChange={e => setTempo(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#45474c", marginBottom: "8px" }}>Time Signature</label>
            <input
              type="text"
              className="tc-input"
              placeholder="e.g. 4/4"
              value={timeSignature}
              onChange={e => setTimeSignature(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#45474c", marginBottom: "8px" }}>Genre / Style</label>
            <input
              type="text"
              className="tc-input"
              placeholder="e.g. Contemporary"
              value={genre}
              onChange={e => setGenre(e.target.value)}
            />
          </div>
        </div>

        {/* Categories (Labels) & Themes */}
        <div>
          <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#45474c", marginBottom: "8px" }}>Select Themes / Categories (Discover Pills)</label>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            background: "#fcf8f9",
            padding: "16px",
            borderRadius: "10px",
            border: "1px solid rgba(198,198,204,0.15)",
            marginBottom: "12px",
          }}>
            {labels.map(l => {
              const isChecked = selectedLabelIds.includes(l.id)
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => handleLabelToggle(l.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: `1.5px solid ${isChecked ? "#74593e" : "#c6c6cc"}`,
                    background: isChecked ? "#74593e" : "#ffffff",
                    color: isChecked ? "#ffffff" : "#45474c",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {l.name}
                </button>
              )
            })}
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#74593e", marginBottom: "4px" }}>+ Add New Categories</label>
            <input
              type="text"
              className="tc-input"
              placeholder="Enter comma-separated names, e.g. Good Friday Songs, Prayer Songs"
              value={customLabelsString}
              onChange={e => setCustomLabelsString(e.target.value)}
            />
          </div>
        </div>

        {/* Video & Chords mapping */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#45474c", marginBottom: "8px" }}>YouTube Video ID (Optional)</label>
            <input
              type="text"
              className="tc-input"
              placeholder="e.g. mC-A84Gpy50 (11 chars)"
              value={youtubeId}
              onChange={e => setYoutubeId(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#45474c", marginBottom: "8px" }}>Chords Used (Optional)</label>
            <input
              type="text"
              className="tc-input"
              placeholder="Comma-separated list, e.g. G, C, D, Em"
              value={chordsInput}
              onChange={e => setChordsInput(e.target.value)}
            />
            <span style={{ fontSize: "11px", color: "#76777c", marginTop: "4px", display: "block" }}>
              Maps chord diagrams automatically for: G, C, D, Em, Am, F, A, E, Dm, Bm.
            </span>
          </div>
        </div>

        {/* Song Settings */}
        <div style={{ display: "flex", gap: "24px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "14px", color: "#1b1b1c", fontWeight: "600" }}>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={e => setIsFeatured(e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            Feature on Homepage (Song of the Week Hero)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "14px", color: "#1b1b1c", fontWeight: "600" }}>
            <input
              type="checkbox"
              checked={isPremium}
              onChange={e => setIsPremium(e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            Premium Access Only (Transposition limits)
          </label>
        </div>

        {/* Lyrics & Language */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <label style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#030813" }}>Lyrics & Chords Chord Sheet *</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#45474c", fontWeight: "600" }}>Language:</span>
              <select
                value={languageCode}
                onChange={e => setLanguageCode(e.target.value)}
                style={{
                  padding: "6px 10px",
                  border: "1.5px solid #c6c6cc",
                  borderRadius: "6px",
                  background: "#ffffff",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="en">English (en)</option>
                <option value="hi">Hindi (hi)</option>
                <option value="gu">Gujarati (gu)</option>
                <option value="mr">Marathi (mr)</option>
              </select>
            </div>
          </div>
          <textarea
            value={lyricsContent}
            onChange={e => setLyricsContent(e.target.value)}
            placeholder={`VERSE 1\nG    D    Em  C\nYou were the Word at the beginning\nG         D        Em   C\nOne with God the Lord Most High\n\nCHORUS\nG           D\nWhat a beautiful Name it is...`}
            rows={12}
            required
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "1.5px solid #c6c6cc",
              borderRadius: "8px",
              fontFamily: "Courier, monospace",
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#1b1b1c",
              background: "#ffffff",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "#74593e")}
            onBlur={e => (e.currentTarget.style.borderColor = "#c6c6cc")}
          />
        </div>

        {/* Buttons */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          borderTop: "1px solid rgba(198,198,204,0.15)",
          paddingTop: "20px",
          marginTop: "12px",
        }}>
          <Link href="/admin/songs">
            <button
              type="button"
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "1.5px solid #c6c6cc",
                background: "transparent",
                color: "#45474c",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseOver={e => (e.currentTarget.style.background = "#f6f3f4")}
              onMouseOut={e => (e.currentTarget.style.background = "transparent")}
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 28px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #74593e 0%, #5a4228 100%)",
              color: "#ffffff",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading ? "wait" : "pointer",
              transition: "opacity 0.15s",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : (song ? "Update Song Sheet" : "Save Song Sheet")}
          </button>
        </div>
      </form>
    </div>
  )
}
