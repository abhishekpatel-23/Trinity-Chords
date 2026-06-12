import { SongCard } from "./SongCard"

interface SongGridProps {
  songs: {
    id: string
    title: string
    slug: string
    artistName: string
    genre?: string | null
    tempoBpm?: number | null
    keyName?: string | null
    labels: { label: { name: string; colorHex: string | null } }[]
  }[]
}

export function SongGrid({ songs }: SongGridProps) {
  if (songs.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "80px 24px",
        fontFamily: "var(--font-body)",
        color: "#45474c",
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#c6c6cc", display: "block", marginBottom: "16px" }}>library_music</span>
        <p style={{ fontSize: "18px", fontWeight: "600", color: "#1b1b1c", marginBottom: "8px" }}>No songs found</p>
        <p style={{ fontSize: "14px" }}>Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "24px",
    }}>
      {songs.map((song, i) => (
        <SongCard key={song.id} {...song} index={i} />
      ))}
    </div>
  )
}
