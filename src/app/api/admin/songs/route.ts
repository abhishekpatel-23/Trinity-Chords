import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const GUITAR_CHORDS_MAP: Record<string, number[]> = {
  "G": [3, 2, 0, 0, 3, 3],
  "C": [-1, 3, 2, 0, 1, 0],
  "D": [-1, -1, 0, 2, 3, 2],
  "Em": [0, 2, 2, 0, 0, 0],
  "Am": [-1, 0, 2, 2, 1, 0],
  "F": [1, 3, 3, 2, 1, 1],
  "A": [-1, 0, 2, 2, 2, 0],
  "E": [0, 2, 2, 1, 0, 0],
  "Dm": [-1, -1, 0, 2, 3, 1],
  "Bm": [-1, 2, 4, 4, 3, 2],
}

const PIANO_CHORDS_MAP: Record<string, number[]> = {
  "G": [0, 4, 7],
  "C": [0, 4, 7],
  "D": [2, 6, 9],
  "Em": [4, 7, 11],
  "Am": [0, 3, 7],
  "F": [5, 9, 0],
  "A": [1, 4, 9],
  "E": [4, 8, 11],
  "Dm": [2, 5, 9],
  "Bm": [2, 6, 11],
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate check
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role?: string })?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      slug,
      artistId,
      newArtistName,
      genre,
      key,
      tempo,
      timeSignature,
      isFeatured,
      isPremium,
      lyricsContent,
      languageCode,
      youtubeId,
      chordsInput,
      existingLabelIds,
      customLabelsString,
    } = body

    // Validate required fields
    if (!title || !slug || !artistId || !lyricsContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify unique slug
    const duplicate = await prisma.song.findUnique({ where: { slug } })
    if (duplicate) {
      return NextResponse.json({ error: "A song with this slug already exists" }, { status: 409 })
    }

    // 2. Resolve Artist
    let finalArtistId = artistId
    if (artistId === "new") {
      if (!newArtistName || !newArtistName.trim()) {
        return NextResponse.json({ error: "New artist name is required" }, { status: 400 })
      }
      const trimmedArtistName = newArtistName.trim()
      const existingArtist = await prisma.artist.findFirst({
        where: { name: { equals: trimmedArtistName } }
      })
      if (existingArtist) {
        finalArtistId = existingArtist.id
      } else {
        const createdArtist = await prisma.artist.create({
          data: { name: trimmedArtistName }
        })
        finalArtistId = createdArtist.id
      }
    }

    // 3. Resolve Custom Labels (Categories)
    const labelIds: string[] = Array.isArray(existingLabelIds) ? [...existingLabelIds] : []
    if (customLabelsString && customLabelsString.trim()) {
      const customNames = customLabelsString
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)

      for (const name of customNames) {
        const slugified = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")

        if (!slugified) continue

        const existingLabel = await prisma.label.findUnique({
          where: { slug: slugified }
        })
        if (existingLabel) {
          if (!labelIds.includes(existingLabel.id)) {
            labelIds.push(existingLabel.id)
          }
        } else {
          const newLabel = await prisma.label.create({
            data: { name, slug: slugified }
          })
          labelIds.push(newLabel.id)
        }
      }
    }

    // 4. Resolve Chord Diagrams
    const chordsList = chordsInput
      ? chordsInput
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : []

    const guitarChordData = chordsList.map((name: string) => ({
      name,
      frets: GUITAR_CHORDS_MAP[name] || [0, 0, 0, 0, 0, 0],
    }))

    const pianoChordData = chordsList.map((name: string) => ({
      name,
      keys: PIANO_CHORDS_MAP[name] || [0, 4, 7],
    }))

    // 5. Create song with nested structures inside a Prisma transaction
    const song = await prisma.$transaction(async (tx) => {
      const createdSong = await tx.song.create({
        data: {
          title: title.trim(),
          slug: slug.trim(),
          artistId: finalArtistId,
          tempoBpm: tempo ? parseInt(tempo, 10) : null,
          key: key || null,
          timeSignature: timeSignature || "4/4",
          genre: genre || null,
          isFeatured: !!isFeatured,
          isPremium: !!isPremium,
          lyrics: {
            create: {
              languageCode: languageCode || "en",
              content: lyricsContent,
            }
          },
          labels: {
            create: labelIds.map((id: string) => ({
              labelId: id,
            }))
          }
        }
      })

      // Create video record if provided
      if (youtubeId && youtubeId.trim()) {
        await tx.songVideo.create({
          data: {
            songId: createdSong.id,
            youtubeId: youtubeId.trim(),
            title: `${createdSong.title} - Official Video`,
            languageLabel: languageCode === "hi" ? "Hindi" : (languageCode === "gu" ? "Gujarati" : "English"),
          }
        })
      }

      // Create chords records if provided
      if (chordsList.length > 0) {
        await tx.songChord.create({
          data: {
            songId: createdSong.id,
            instrument: "guitar",
            chordData: JSON.stringify(guitarChordData),
          }
        })
        await tx.songChord.create({
          data: {
            songId: createdSong.id,
            instrument: "piano",
            chordData: JSON.stringify(pianoChordData),
          }
        })
      }

      return createdSong
    })

    return NextResponse.json({ success: true, songId: song.id }, { status: 201 })
  } catch (error) {
    console.error("Add song error:", error)
    return NextResponse.json({ error: "Failed to create song" }, { status: 500 })
  }
}
