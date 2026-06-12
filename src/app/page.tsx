import { Suspense } from "react"
import prisma from "@/lib/prisma"
import { getCachedData } from "@/lib/redis"
import { SongGrid } from "@/components/songs/SongGrid"
import { Navbar } from "@/components/layout/Navbar"
import { SongFilters } from "@/components/songs/SongFilters"
import Link from "next/link"

async function getHomePageData(params: {
  q?: string
  label?: string
  lang?: string
  artist?: string
  genre?: string
  tempo?: string
  sort?: string
}) {
  const cacheKey = `home_page_data_v2_${JSON.stringify(params)}`
  return getCachedData(cacheKey, async () => {
    // 1. Build the dynamic where clause based on the params
    const andConditions: any[] = []

    if (params.q) {
      andConditions.push({
        OR: [
          { title: { contains: params.q } },
          { artist: { name: { contains: params.q } } },
          { genre: { contains: params.q } },
          { lyrics: { some: { content: { contains: params.q } } } }
        ]
      })
    }

    if (params.label) {
      andConditions.push({
        labels: {
          some: {
            label: {
              name: { contains: params.label }
            }
          }
        }
      })
    }

    if (params.lang && params.lang !== "Language") {
      andConditions.push({
        labels: {
          some: {
            label: {
              name: { contains: params.lang }
            }
          }
        }
      })
    }

    if (params.artist && params.artist !== "Artist") {
      andConditions.push({
        artist: {
          name: { contains: params.artist }
        }
      })
    }

    if (params.genre && params.genre !== "Genre") {
      andConditions.push({
        genre: { contains: params.genre }
      })
    }

    if (params.tempo && params.tempo !== "Tempo") {
      if (params.tempo.toLowerCase().includes("slow")) {
        andConditions.push({ tempoBpm: { gte: 60, lte: 80 } })
      } else if (params.tempo.toLowerCase().includes("medium")) {
        andConditions.push({ tempoBpm: { gte: 80, lte: 120 } })
      } else if (params.tempo.toLowerCase().includes("fast")) {
        andConditions.push({ tempoBpm: { gte: 120 } })
      }
    }

    const whereClause = andConditions.length > 0 ? { AND: andConditions } : {}

    // 2. Determine ordering
    let orderByClause: any = { publishedAt: 'desc' }
    if (params.sort === "A-Z") {
      orderByClause = { title: 'asc' }
    } else if (params.sort === "Popular") {
      orderByClause = {
        likes: {
          _count: 'desc'
        }
      }
    }

    // 3. Query Prisma
    const [featuredSong, labels, recentSongs, totalSongs, allArtists, allSongsWithGenres] = await Promise.all([
      prisma.song.findFirst({
        where: { isFeatured: true },
        include: { artist: true },
        orderBy: { publishedAt: 'desc' }
      }),
      prisma.label.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.song.findMany({
        where: whereClause,
        orderBy: orderByClause,
        take: 12,
        include: {
          artist: true,
          labels: {
            include: { label: true }
          }
        }
      }),
      prisma.song.count({
        where: whereClause
      }),
      prisma.artist.findMany({
        orderBy: { name: 'asc' },
        select: { name: true }
      }),
      prisma.song.findMany({
        select: { genre: true },
        distinct: ['genre']
      })
    ])

    const genres = allSongsWithGenres
      .map(s => s.genre)
      .filter(Boolean) as string[]

    return {
      featuredSong,
      labels,
      recentSongs,
      totalSongs,
      artists: allArtists,
      genres
    }
  }, 10) // Cache dynamic searches for 10 seconds
}

export default async function Home(props: {
  searchParams: Promise<{ q?: string; label?: string; lang?: string; artist?: string; genre?: string; tempo?: string; sort?: string }>
}) {
  const searchParams = await props.searchParams
  const { featuredSong, labels, recentSongs, totalSongs, artists, genres } = await getHomePageData({
    q: searchParams.q,
    label: searchParams.label,
    lang: searchParams.lang,
    artist: searchParams.artist,
    genre: searchParams.genre,
    tempo: searchParams.tempo,
    sort: searchParams.sort,
  })

  const formattedSongs = recentSongs.map(song => ({
    id: song.id,
    title: song.title,
    slug: song.slug,
    artistName: song.artist.name,
    genre: song.genre,
    tempoBpm: song.tempoBpm,
    keyName: song.key,
    labels: song.labels
  }))

  return (
    <div style={{ background: "#fcf8f9", minHeight: "100vh", color: "#1b1b1c" }}>
      <Navbar />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "64px" }}>

        {/* ===== HERO ===== */}
        {featuredSong && (
          <section style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "16px",
            height: "450px",
            boxShadow: "0 20px 60px rgba(3,8,19,0.15)",
          }}>
            {/* Background */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBbgB38UGO_WLgcI6WgYs5glsihI0GUj5RxEF3cmxZ24RvDLHOD32WjeC_bDWHFEyA1R8upNRzt1uxo-IQSqYGLlyGCcYgLZoKDCr4E4tbgszaEUH9rQujq99JRxpBsAXPxmvKyFQW6Lo8VO2j3k_gXKzkd4UvsbOq4uBJwB9ueANhoV_OsL8a2nmBfSrO6ywIebBbJCBbd-KgZfNlFkE_jEQVy5thBxPBiKUmol6_rgJwrnZG6MxaGzzcuxYZKb5U3BoFRF9KowUdU')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scale(1.05)",
              transition: "transform 0.7s ease",
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(3,8,19,0.9) 0%, rgba(3,8,19,0.45) 50%, transparent 100%)",
              }} />
            </div>

            {/* Content */}
            <div style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "64px",
              maxWidth: "640px",
              color: "#ffffff",
            }}>
              <span style={{
                display: "inline-block",
                padding: "4px 12px",
                background: "#74593e",
                color: "#ffffff",
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                borderRadius: "4px",
                marginBottom: "16px",
                alignSelf: "flex-start",
              }}>Featured Release</span>

              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "48px",
                fontWeight: "700",
                lineHeight: "1.15",
                letterSpacing: "-0.02em",
                marginBottom: "8px",
                color: "#ffffff",
              }}>{featuredSong.title}</h1>

              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "18px",
                fontWeight: "600",
                color: "#ffdcbb",
                marginBottom: "32px",
                opacity: 0.92,
              }}>
                {featuredSong.artist.name}{featuredSong.genre ? ` • ${featuredSong.genre}` : ""}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Link href={`/songs/${featuredSong.slug}`}>
                  <button style={{
                    background: "#74593e",
                    color: "#ffffff",
                    padding: "12px 28px",
                    borderRadius: "8px",
                    border: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "background 0.15s, transform 0.15s",
                  }}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}>play_circle</span>
                    View Chords
                  </button>
                </Link>
                <button style={{
                  padding: "11px",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>favorite</span>
                </button>
                <button style={{
                  padding: "11px",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>share</span>
                </button>
              </div>
            </div>
          </section>
        )}

        <SongFilters 
          labels={labels}
          artists={artists}
          genres={genres}
          totalSongs={totalSongs}
        />

        {/* ===== SONG GRID ===== */}
        <section>
          <Suspense fallback={
            <div style={{ textAlign: "center", padding: "40px", fontFamily: "var(--font-body)", color: "#45474c" }}>
              Loading songs...
            </div>
          }>
            <SongGrid songs={formattedSongs} />
          </Suspense>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{
        borderTop: "1px solid rgba(198,198,204,0.25)",
        marginTop: "80px",
        padding: "64px 24px",
        background: "#fcf8f9",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
          gap: "48px",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#74593e", fontVariationSettings: "'FILL' 1" }}>music_note</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "700", color: "#030813" }}>Trinity Chords</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#45474c", lineHeight: "1.7", maxWidth: "260px" }}>
              © {new Date().getFullYear()} Trinity Chords. Spiritual Harmony, Modern Utility.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#030813", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>Platform</h4>
            {["About Us", "Privacy Policy", "Terms of Service"].map(link => (
              <a key={link} href="#" style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "14px", color: "#45474c", textDecoration: "none", marginBottom: "10px", transition: "color 0.15s" }}>
                {link}
              </a>
            ))}
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#030813", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>Resources</h4>
            {["Contact", "Donate"].map(link => (
              <a key={link} href="#" style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "14px", color: "#45474c", textDecoration: "none", marginBottom: "10px" }}>
                {link}
              </a>
            ))}
          </div>

          {/* Community */}
          <div>
            <h4 style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#030813", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>Join the Movement</h4>
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                { icon: "language", label: "Website" },
                { icon: "alternate_email", label: "Email" },
              ].map(({ icon, label }) => (
                <button key={label} style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "1.5px solid #c6c6cc",
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#45474c",
                  transition: "border-color 0.15s, color 0.15s",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
