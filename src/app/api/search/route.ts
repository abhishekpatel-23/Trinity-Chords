import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") || ""
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = 12
    const skip = (page - 1) * limit

    if (!query) {
      return NextResponse.json({ songs: [], total: 0, page, totalPages: 0 })
    }

    // Full search using ILIKE logic for title, artist, or genre
    const songs = await prisma.song.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { artist: { name: { contains: query } } },
          { genre: { contains: query } },
          { lyrics: { some: { content: { contains: query } } } }
        ]
      },
      include: {
        artist: true,
        labels: { include: { label: true } }
      },
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" }
    })

    const total = await prisma.song.count({
      where: {
        OR: [
          { title: { contains: query } },
          { artist: { name: { contains: query } } },
          { genre: { contains: query } },
          { lyrics: { some: { content: { contains: query } } } }
        ]
      }
    })

    return NextResponse.json({
      songs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Search failed" }, { status: 500 })
  }
}
