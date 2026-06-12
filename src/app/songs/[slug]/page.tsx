import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { LyricAndChordSection } from "@/components/songs/LyricAndChordSection"

interface Props {
  params: Promise<{ slug: string }>
}

async function getSong(slug: string) {
  return prisma.song.findUnique({
    where: { slug },
    include: {
      artist: {
        include: { musicians: true }
      },
      lyrics: true,
      videos: { orderBy: { sortOrder: "asc" } },
      chords: true,
      labels: { include: { label: true } },
      _count: { select: { likes: true } },
    },
  })
}

async function getRelatedSongs(artistId: string, excludeSlug: string) {
  return prisma.song.findMany({
    where: { artistId, slug: { not: excludeSlug } },
    take: 3,
    include: { artist: true },
    orderBy: { publishedAt: "desc" },
  })
}

export default async function SongDetailPage({ params }: Props) {
  const { slug } = await params
  const song = await getSong(slug)
  if (!song) notFound()

  const relatedSongs = await getRelatedSongs(song.artistId, slug)
  const langCodes = song.labels.map(l => l.label.name)

  return (
    <div style={{ background: "#fcf8f9", minHeight: "100vh" }}>
      <Navbar />

      <style>{`
        .related-song-item:hover { background: #f6f3f4; }
        .action-btn:hover { opacity: 0.7; }
        .follow-btn:hover { background: #5a4228; }
        .explore-btn:hover { border-color: #74593e; color: #74593e; }
      `}</style>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "48px", alignItems: "start" }}>

          {/* ===== LEFT COLUMN ===== */}
          <div>
            {/* Song header */}
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "36px",
                fontWeight: "700",
                color: "#030813",
                lineHeight: "1.2",
                marginBottom: "8px",
              }}>{song.title}</h1>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#45474c" }}>
                by{" "}
                <span style={{ color: "#74593e", fontWeight: "600" }}>{song.artist.name}</span>
              </p>
            </div>

            {/* Language pills */}
            {langCodes.length > 0 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
                {langCodes.map((code, i) => (
                  <span key={code} style={{
                    display: "inline-block",
                    padding: "6px 16px",
                    borderRadius: "999px",
                    border: i === 0 ? "none" : "1.5px solid #c6c6cc",
                    background: i === 0 ? "#74593e" : "transparent",
                    color: i === 0 ? "#ffffff" : "#45474c",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "default",
                  }}>{code}</span>
                ))}
              </div>
            )}

            {/* Actions row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
              paddingBottom: "24px",
              borderBottom: "1px solid rgba(198,198,204,0.25)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#45474c", fontFamily: "var(--font-body)", fontSize: "14px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>favorite</span>
                  {song._count.likes.toLocaleString()}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#45474c", fontFamily: "var(--font-body)", fontSize: "14px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>share</span>
                  Share
                </span>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#76777c", fontFamily: "var(--font-body)", fontSize: "13px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>flag</span>
                Report
              </span>
            </div>

            {/* Song metadata bar */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
              padding: "20px 24px",
              background: "#f6f3f4",
              borderRadius: "12px",
              marginBottom: "40px",
            }}>
              {[
                { label: "KEY", value: song.key || "—" },
                { label: "TEMPO", value: song.tempoBpm ? `${song.tempoBpm} BPM` : "—" },
                { label: "TIME SIG", value: song.timeSignature || "4/4" },
                { label: "GENRE", value: song.genre || "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: "#76777c", textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: "600", color: "#1b1b1c" }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Lyrics section */}
            <LyricAndChordSection lyrics={song.lyrics} />

            {/* Guitar Chords section */}
            {song.chords.filter(c => c.instrument === "guitar").map(chord => {
              let chordData: { name: string; frets: number[] }[] = []
              try { chordData = JSON.parse(chord.chordData) } catch {}
              return (
                <div key={chord.id} style={{ marginTop: "48px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "#030813" }}>Guitar Chords</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1.5px solid #c6c6cc", background: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#1b1b1c" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>remove</span>
                        </span>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "600", color: "#1b1b1c" }}>Key: {song.key || "G"}</span>
                        <span style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1.5px solid #c6c6cc", background: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#1b1b1c" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
                        </span>
                      </div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", color: "#45474c", textTransform: "uppercase" }}>Diagrams</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    {chordData.slice(0, 4).map((c, i) => (
                      <GuitarChordDiagram key={i} name={c.name} frets={c.frets} />
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Piano Chords section */}
            {song.chords.filter(c => c.instrument === "piano").map(chord => {
              let chordData: { name: string; keys: number[] }[] = []
              try { chordData = JSON.parse(chord.chordData) } catch {}
              return (
                <div key={chord.id} style={{ marginTop: "48px" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "#030813", marginBottom: "20px" }}>Piano Chords</h2>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    {chordData.slice(0, 4).map((c, i) => (
                      <PianoChordDiagram key={i} name={c.name} keys={c.keys} />
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Artist card */}
            <div style={{
              marginTop: "48px",
              background: "#030813",
              borderRadius: "16px",
              padding: "36px",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#1a202c",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}>
                {song.artist.profileImageUrl ? (
                  <img src={song.artist.profileImageUrl} alt={song.artist.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "#74593e", fontVariationSettings: "'FILL' 1" }}>person</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>{song.artist.name}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#828796", lineHeight: "1.6", marginBottom: "16px" }}>
                  {song.artist.bio || "A dedicated worship artist committed to creating meaningful music for the body of Christ."}
                </p>
                <span style={{
                  display: "inline-block",
                  background: "#74593e",
                  color: "#ffffff",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }} className="follow-btn">Follow Artist</span>
              </div>
            </div>

            {/* Featured musicians */}
            {song.artist.musicians.length > 0 && (
              <div style={{ marginTop: "32px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "600", color: "#030813", marginBottom: "16px" }}>Featured Musicians</h3>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  {song.artist.musicians.map(m => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#e5e2e3", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {m.imageUrl ? (
                          <img src={m.imageUrl} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "#76777c" }}>person</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "600", color: "#1b1b1c" }}>{m.name}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#76777c", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===== RIGHT SIDEBAR ===== */}
          <div style={{ position: "sticky", top: "80px" }}>
            {/* Watch/Listen */}
            {song.videos.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: "700", color: "#1b1b1c", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#74593e", fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  Watch / Listen
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {song.videos.slice(0, 2).map(video => (
                    <a
                      key={video.id}
                      href={`https://youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", display: "block" }}
                    >
                      <div style={{
                        position: "relative",
                        borderRadius: "10px",
                        overflow: "hidden",
                        background: "#e5e2e3",
                        aspectRatio: "16/9",
                        marginBottom: "8px",
                      }}>
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                          alt={video.title || "Video"}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(3,8,19,0.3)",
                        }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "#74593e", fontVariationSettings: "'FILL' 1", paddingLeft: "2px" }}>play_arrow</span>
                          </div>
                        </div>
                        {video.languageLabel && (
                          <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(116,89,62,0.9)", color: "#ffffff", fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {video.languageLabel}
                          </div>
                        )}
                      </div>
                      {video.title && (
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "600", color: "#1b1b1c" }}>{video.title}</div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Related Songs */}
            {relatedSongs.length > 0 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: "700", color: "#1b1b1c", marginBottom: "14px" }}>Related Songs</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px" }}>
                  {relatedSongs.map(rel => (
                    <Link key={rel.id} href={`/songs/${rel.slug}`} style={{ textDecoration: "none" }}>
                      <div
                        className="related-song-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                      >
                        <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#fdd9b6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#74593e", fontVariationSettings: "'FILL' 1" }}>music_note</span>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "600", color: "#1b1b1c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rel.title}</div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#76777c" }}>
                            {rel.artist.name}{rel.key ? ` • ${rel.key}` : ""}{rel.tempoBpm ? ` • ${rel.tempoBpm} BPM` : ""}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/">
                  <span
                    className="explore-btn"
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "11px 20px",
                      border: "1.5px solid #c6c6cc",
                      borderRadius: "999px",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1b1b1c",
                      cursor: "pointer",
                      transition: "border-color 0.15s, color 0.15s",
                      textAlign: "center",
                    }}
                  >Explore All Songs</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(198,198,204,0.25)", marginTop: "80px", padding: "48px 24px", background: "#fcf8f9" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "32px" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "700", color: "#030813", marginBottom: "4px" }}>Trinity Chords</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c", maxWidth: "240px", lineHeight: "1.6" }}>
              Spiritual Harmony, Modern Utility. Bridging tradition and technology for worship leaders worldwide.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#76777c", marginTop: "8px" }}>© {new Date().getFullYear()} Trinity Chords.</p>
          </div>
          <div style={{ display: "flex", gap: "48px" }}>
            {([ ["PLATFORM", ["About Us", "Premium", "Donate"]], ["LEGAL", ["Privacy Policy", "Terms of Service", "Contact"]] ] as [string, string[]][]).map(([title, links]) => (
              <div key={title}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#030813", marginBottom: "12px" }}>{title}</div>
                {links.map(l => (
                  <a key={l} href="#" style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c", textDecoration: "none", marginBottom: "8px" }}>{l}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

// Guitar chord diagram component
function GuitarChordDiagram({ name, frets }: { name: string; frets: number[] }) {
  const strings = frets && frets.length === 6 ? frets : [0, 2, 2, 1, 0, 0]
  return (
    <div style={{ background: "#ffffff", border: "1.5px solid #e5e2e3", borderRadius: "10px", padding: "16px", minWidth: "88px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "700", color: "#030813" }}>{name}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 12px)", gridTemplateRows: "repeat(5, 12px)", gap: "2px" }}>
        {Array.from({ length: 5 }).flatMap((_, row) =>
          strings.map((fret, col) => (
            <div key={`${row}-${col}`} style={{
              width: "12px",
              height: "12px",
              border: "0.5px solid #c6c6cc",
              borderRadius: fret === row + 1 ? "50%" : "1px",
              background: fret === row + 1 ? "#74593e" : "transparent",
            }} />
          ))
        )}
      </div>
    </div>
  )
}

// Piano chord diagram component
function PianoChordDiagram({ name, keys }: { name: string; keys: number[] }) {
  const pressedKeys = keys || [0, 4, 7]
  return (
    <div style={{ background: "#ffffff", border: "1.5px solid #e5e2e3", borderRadius: "10px", padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", minWidth: "140px" }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "700", color: "#030813" }}>{name}</div>
      <div style={{ display: "flex", height: "64px" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            width: "20px",
            height: "64px",
            background: pressedKeys.includes(i) ? "#fdd9b6" : "#ffffff",
            border: "1px solid #c6c6cc",
            borderRadius: "0 0 3px 3px",
            borderTop: pressedKeys.includes(i) ? "2px solid #74593e" : "1px solid #c6c6cc",
          }} />
        ))}
      </div>
    </div>
  )
}
