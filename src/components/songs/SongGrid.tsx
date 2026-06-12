import { SongCard, SongCardProps } from "./SongCard"

interface SongGridProps {
  songs: SongCardProps[]
}

export function SongGrid({ songs }: SongGridProps) {
  if (songs.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--color-on-surface-variant)]">
        <p>No songs found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
      {songs.map((song) => (
        <SongCard key={song.id} {...song} />
      ))}
    </div>
  )
}
