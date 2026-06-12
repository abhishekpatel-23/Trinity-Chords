import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { SongForm } from "@/components/admin/SongForm"

interface EditSongPageProps {
  params: Promise<{ id: string }>
}

export default async function EditSongPage({ params }: EditSongPageProps) {
  const { id } = await params

  const [song, artists, labels] = await Promise.all([
    prisma.song.findUnique({
      where: { id },
      include: {
        lyrics: true,
        videos: true,
        chords: true,
        labels: true,
      }
    }),
    prisma.artist.findMany({
      orderBy: { name: "asc" }
    }),
    prisma.label.findMany({
      orderBy: { name: "asc" }
    })
  ])

  if (!song) {
    notFound()
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "28px",
          fontWeight: "700",
          color: "#030813",
        }}>Edit Song</h1>
      </div>
      <SongForm song={song} artists={artists} labels={labels} />
    </div>
  )
}
