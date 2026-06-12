import prisma from "@/lib/prisma"
import { SongManager } from "@/components/admin/SongManager"

export default async function AdminSongsPage() {
  const songs = await prisma.song.findMany({
    orderBy: { publishedAt: 'desc' },
    include: { artist: true },
    take: 100 // Fetch up to 100 songs for the list
  })

  return (
    <div>
      <SongManager initialSongs={songs} />
    </div>
  )
}
