import prisma from "@/lib/prisma"
import { SongForm } from "@/components/admin/SongForm"

export default async function NewSongPage() {
  const [artists, labels] = await Promise.all([
    prisma.artist.findMany({
      orderBy: { name: "asc" }
    }),
    prisma.label.findMany({
      orderBy: { name: "asc" }
    })
  ])

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "28px",
          fontWeight: "700",
          color: "#030813",
        }}>Add New Song</h1>
      </div>
      <SongForm artists={artists} labels={labels} />
    </div>
  )
}
