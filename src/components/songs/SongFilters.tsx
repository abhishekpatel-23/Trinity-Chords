"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface SongFiltersProps {
  labels: { name: string; slug: string }[]
  artists: { name: string }[]
  genres: string[]
  totalSongs: number
}

export function SongFilters({ labels, artists, genres, totalSongs }: SongFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentLabel = searchParams.get("label") || ""
  const currentLang = searchParams.get("lang") || "Language"
  const currentArtist = searchParams.get("artist") || "Artist"
  const currentGenre = searchParams.get("genre") || "Genre"
  const currentTempo = searchParams.get("tempo") || "Tempo"
  const currentSort = searchParams.get("sort") || "Recent"

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "Language" && value !== "Artist" && value !== "Genre" && value !== "Tempo") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Reset page query when filter changes
    params.delete("page")
    router.push(`/?${params.toString()}`)
  }

  // Common distinct values for pills
  const fixedPills = ["Prayer Songs", "Good Friday Songs", "Easter Songs", "English", "Hindi", "Gujarati", "Marathi", "Lent"]
  const mergedPills = Array.from(new Set([...fixedPills, ...labels.map(l => l.name)]))

  return (
    <>
      {/* ===== DISCOVER THEMES ===== */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            fontWeight: "600",
            color: "#030813",
          }}>Discover Themes</h2>
        </div>

        <div className="no-scrollbar" style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          paddingBottom: "8px",
        }}>
          {/* All Songs Pill */}
          <button 
            onClick={() => updateParam("label", "")}
            style={{
              whiteSpace: "nowrap",
              padding: "8px 20px",
              borderRadius: "999px",
              background: !currentLabel ? "#74593e" : "#e5e2e3",
              color: !currentLabel ? "#ffffff" : "#45474c",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: !currentLabel ? "600" : "500",
              border: "none",
              cursor: "pointer",
              boxShadow: !currentLabel ? "0 4px 12px rgba(116,89,62,0.3)" : "none",
            }}
          >
            All Songs
          </button>

          {mergedPills.map((name) => {
            const isActive = currentLabel.toLowerCase() === name.toLowerCase()
            return (
              <button 
                key={name}
                onClick={() => updateParam("label", name)}
                style={{
                  whiteSpace: "nowrap",
                  padding: "8px 20px",
                  borderRadius: "999px",
                  background: isActive ? "#74593e" : "#e5e2e3",
                  color: isActive ? "#ffffff" : "#45474c",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "500",
                  border: "1.5px solid transparent",
                  cursor: "pointer",
                  boxShadow: isActive ? "0 4px 12px rgba(116,89,62,0.3)" : "none",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {name}
              </button>
            )
          })}
        </div>
      </section>

      {/* ===== FILTER BAR ===== */}
      <section style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "16px 24px",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 20px 30px -10px rgba(26,32,44,0.06)",
        border: "1px solid rgba(198,198,204,0.15)",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Language filter */}
          <div style={{ position: "relative" }}>
            <select 
              className="tc-select" 
              value={currentLang}
              onChange={e => updateParam("lang", e.target.value)}
              style={{
                paddingRight: "36px",
                minWidth: "120px",
              }}
            >
              <option value="Language">Language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Marathi">Marathi</option>
            </select>
            <span className="material-symbols-outlined" style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "18px",
              color: "#45474c",
              pointerEvents: "none",
            }}>expand_more</span>
          </div>

          {/* Artist filter */}
          <div style={{ position: "relative" }}>
            <select 
              className="tc-select" 
              value={currentArtist}
              onChange={e => updateParam("artist", e.target.value)}
              style={{
                paddingRight: "36px",
                minWidth: "120px",
              }}
            >
              <option value="Artist">Artist</option>
              {artists.map(artist => (
                <option key={artist.name} value={artist.name}>{artist.name}</option>
              ))}
            </select>
            <span className="material-symbols-outlined" style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "18px",
              color: "#45474c",
              pointerEvents: "none",
            }}>expand_more</span>
          </div>

          {/* Genre filter */}
          <div style={{ position: "relative" }}>
            <select 
              className="tc-select" 
              value={currentGenre}
              onChange={e => updateParam("genre", e.target.value)}
              style={{
                paddingRight: "36px",
                minWidth: "120px",
              }}
            >
              <option value="Genre">Genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <span className="material-symbols-outlined" style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "18px",
              color: "#45474c",
              pointerEvents: "none",
            }}>expand_more</span>
          </div>

          {/* Tempo filter */}
          <div style={{ position: "relative" }}>
            <select 
              className="tc-select" 
              value={currentTempo}
              onChange={e => updateParam("tempo", e.target.value)}
              style={{
                paddingRight: "36px",
                minWidth: "120px",
              }}
            >
              <option value="Tempo">Tempo</option>
              <option value="Slow">Slow (60-80 BPM)</option>
              <option value="Medium">Medium (80-120 BPM)</option>
              <option value="Fast">Fast (120+ BPM)</option>
            </select>
            <span className="material-symbols-outlined" style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "18px",
              color: "#45474c",
              pointerEvents: "none",
            }}>expand_more</span>
          </div>
        </div>

        {/* Total songs and Sorting */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c" }}>
            {totalSongs} Songs Found
          </span>
          <div style={{ width: "1px", height: "20px", background: "rgba(198,198,204,0.4)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#45474c" }}>Sort by:</span>
            <select 
              value={currentSort}
              onChange={e => updateParam("sort", e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: "700",
                color: "#74593e",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="Recent">Recent</option>
              <option value="Popular">Popular</option>
              <option value="A-Z">A-Z</option>
            </select>
          </div>
        </div>
      </section>
    </>
  )
}
