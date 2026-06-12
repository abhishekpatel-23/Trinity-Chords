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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate check
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role?: string })?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Song ID is required" }, { status: 400 })
    }

    // Cascade delete automatically deletes relations due to onDelete: Cascade in Prisma schema
    await prisma.song.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: "Song deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete song error:", error)
    return NextResponse.json({ error: "Failed to delete song" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate check
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role?: string })?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    const { id } = await params
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

    // Verify unique slug (ignoring current song)
    const duplicate = await prisma.song.findFirst({
      where: {
        slug,
        id: { not: id }
      }
    })
    if (duplicate) {
      return NextResponse.json({ error: "A song with this slug already exists" }, { status: 409 })
    }

    // Resolve Artist
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

    // Resolve Custom Labels (Categories)
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

    // Resolve Chord Diagrams
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

    // Perform database updates inside transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update main song details
      await tx.song.update({
        where: { id },
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
        }
      })

      // 2. Upsert/Update lyrics content
      const lang = languageCode || "en"
      await tx.songLyrics.upsert({
        where: { songId_languageCode: { songId: id, languageCode: lang } },
        update: { content: lyricsContent },
        create: { songId: id, languageCode: lang, content: lyricsContent }
      })

      // 3. Update Labels: Delete existing links and recreate
      await tx.songLabel.deleteMany({ where: { songId: id } })
      if (labelIds.length > 0) {
        await tx.songLabel.createMany({
          data: labelIds.map((labelId: string) => ({
            songId: id,
            labelId
          }))
        })
      }

      // 4. Update Videos: Delete existing and recreate if provided
      await tx.songVideo.deleteMany({ where: { songId: id } })
      if (youtubeId && youtubeId.trim()) {
        await tx.songVideo.create({
          data: {
            songId: id,
            youtubeId: youtubeId.trim(),
            title: `${title.trim()} - Official Video`,
            languageLabel: lang === "hi" ? "Hindi" : (lang === "gu" ? "Gujarati" : "English"),
          }
        })
      }

      // 5. Update Chords: Delete existing and recreate if list is populated
      await tx.songChord.deleteMany({ where: { songId: id } })
      if (chordsList.length > 0) {
        await tx.songChord.create({
          data: {
            songId: id,
            instrument: "guitar",
            chordData: JSON.stringify(guitarChordData),
          }
        })
        await tx.songChord.create({
          data: {
            songId: id,
            instrument: "piano",
            chordData: JSON.stringify(pianoChordData),
          }
        })
      }
    })

    return NextResponse.json({ success: true, songId: id }, { status: 200 })
  } catch (error) {
    console.error("Update song error:", error)
    return NextResponse.json({ error: "Failed to update song" }, { status: 500 })
  }
}
