"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react"

interface Artist {
  name: string
}

interface Song {
  id: string
  title: string
  slug: string
  publishedAt: string | Date
  isFeatured: boolean
  isPremium: boolean
  artist: Artist
}

interface SongManagerProps {
  initialSongs: Song[]
}

export function SongManager({ initialSongs }: SongManagerProps) {
  const [songs, setSongs] = useState<Song[]>(initialSongs)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  // Filter songs based on search query (case-insensitive title or artist name)
  const filteredSongs = songs.filter(song => {
    const titleMatch = song.title.toLowerCase().includes(searchQuery.toLowerCase())
    const artistMatch = song.artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    return titleMatch || artistMatch
  })

  // Handle song deletion
  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the song sheet "${title}"? This cannot be undone.`)
    if (!confirmed) return

    setDeletingId(id)
    setError("")

    try {
      const res = await fetch(`/api/admin/songs/${id}`, {
        method: "DELETE"
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete song")
      }

      // Remove from local list
      setSongs(prev => prev.filter(song => song.id !== id))
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An unexpected error occurred during deletion.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Action Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "28px",
          fontWeight: "700",
          color: "#030813"
        }}>Songs Manager</h1>
        <Link href="/admin/songs/new">
          <button style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #74593e 0%, #5a4228 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = "0.9")}
          onMouseOut={e => (e.currentTarget.style.opacity = "1")}
          >
            <Plus size={16} />
            Add Song
          </button>
        </Link>
      </div>

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
        }}>
          {error}
        </div>
      )}

      {/* Table & Controls Panel */}
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid rgba(198,198,204,0.2)",
        boxShadow: "0 2px 12px rgba(3,8,19,0.04)",
        overflow: "hidden"
      }}>
        {/* Search and Filters row */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid rgba(198,198,204,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#ffffff",
          gap: "16px"
        }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "320px" }}>
            <span style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#76777c",
              display: "flex",
              alignItems: "center"
            }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search songs or artists..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 16px 10px 40px",
                border: "1.5px solid #c6c6cc",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#1b1b1c",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#74593e")}
              onBlur={e => (e.currentTarget.style.borderColor = "#c6c6cc")}
            />
          </div>
          <button style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "1.5px solid #c6c6cc",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#45474c",
            padding: "9px 16px",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.15s"
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = "#f6f3f4"
            e.currentTarget.style.borderColor = "#74593e"
            e.currentTarget.style.color = "#74593e"
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = "#ffffff"
            e.currentTarget.style.borderColor = "#c6c6cc"
            e.currentTarget.style.color = "#45474c"
          }}
          >
            <Filter size={14} />
            Filters
          </button>
        </div>

        {/* Songs list table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{
                background: "#fcf8f9",
                borderBottom: "1px solid rgba(198,198,204,0.2)",
              }}>
                <th style={{ padding: "14px 24px", fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#74593e", textAlign: "left" }}>Title</th>
                <th style={{ padding: "14px 24px", fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#74593e", textAlign: "left" }}>Artist</th>
                <th style={{ padding: "14px 24px", fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#74593e", textAlign: "left" }}>Status</th>
                <th style={{ padding: "14px 24px", fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#74593e", textAlign: "left" }}>Date Added</th>
                <th style={{ padding: "14px 24px", fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#74593e", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSongs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{
                    padding: "40px 24px",
                    textAlign: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "#76777c"
                  }}>
                    No songs found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSongs.map(song => (
                  <tr
                    key={song.id}
                    style={{
                      borderBottom: "1px solid rgba(198,198,204,0.15)",
                      transition: "background 0.15s"
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = "#fcf8f9")}
                    onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Title */}
                    <td style={{ padding: "16px 24px", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "600", color: "#030813" }}>
                      {song.title}
                    </td>
                    {/* Artist */}
                    <td style={{ padding: "16px 24px", fontFamily: "var(--font-body)", fontSize: "14px", color: "#45474c" }}>
                      {song.artist.name}
                    </td>
                    {/* Status badges */}
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {song.isFeatured && (
                          <span style={{
                            background: "rgba(116,89,62,0.1)",
                            color: "#74593e",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}>
                            Featured
                          </span>
                        )}
                        {song.isPremium ? (
                          <span style={{
                            background: "rgba(3,8,19,0.06)",
                            color: "#030813",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}>
                            Premium
                          </span>
                        ) : (
                          <span style={{
                            background: "rgba(118,119,124,0.1)",
                            color: "#76777c",
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}>
                            Free
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Date */}
                    <td style={{ padding: "16px 24px", fontFamily: "var(--font-body)", fontSize: "13px", color: "#76777c" }}>
                      {new Date(song.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </td>
                    {/* Actions */}
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <Link
                          href={`/admin/songs/${song.id}/edit`}
                          title="Edit Song"
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "6px",
                            border: "none",
                            background: "transparent",
                            color: "#74593e",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "background 0.15s",
                            textDecoration: "none"
                          }}
                          onMouseOver={e => (e.currentTarget.style.background = "#f6f3f4")}
                          onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          type="button"
                          title="Delete Song"
                          disabled={deletingId === song.id}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDelete(song.id, song.title)
                          }}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "6px",
                            border: "none",
                            background: "transparent",
                            color: deletingId === song.id ? "#c6c6cc" : "#ba1a1a",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: deletingId === song.id ? "not-allowed" : "pointer",
                            transition: "background 0.15s"
                          }}
                          onMouseOver={e => {
                            if (deletingId !== song.id) e.currentTarget.style.background = "#fff0f0"
                          }}
                          onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
