import prisma from "@/lib/prisma"
import Link from "next/link"
import { AdminCharts } from "@/components/admin/AdminCharts"

export default async function AdminDashboardPage() {
  const [totalSongs, totalUsers, pendingRequests, songsLikedToday] = await Promise.all([
    prisma.song.count(),
    prisma.user.count(),
    prisma.songRequest.count({ where: { status: "Pending" } }),
    prisma.songLike.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
  ])

  // Recent songs for the song manager table
  const recentSongs = await prisma.song.findMany({
    take: 10,
    orderBy: { publishedAt: "desc" },
    include: {
      artist: true,
      labels: { include: { label: true } },
    },
  })

  const stats = [
    { icon: "library_music", label: "Total Songs", value: totalSongs, bg: "#f0edee" },
    { icon: "group", label: "Total Users", value: totalUsers, bg: "#f0edee" },
    { icon: "favorite", label: "Songs Liked Today", value: songsLikedToday, bg: "#fff5ee" },
    { icon: "assignment", label: "Pending Requests", value: pendingRequests, bg: pendingRequests > 0 ? "#fff0f0" : "#f0edee", alert: pendingRequests > 0 },
  ]

  return (
    <div>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: "28px",
        fontWeight: "700",
        color: "#030813",
        marginBottom: "32px",
      }}>Dashboard Overview</h1>

      {/* ===== STAT CARDS ===== */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "32px",
      }}>
        {stats.map(({ icon, label, value, bg, alert }) => (
          <div key={label} style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            border: `1.5px solid ${alert ? "rgba(186,26,26,0.2)" : "rgba(198,198,204,0.2)"}`,
            boxShadow: "0 2px 8px rgba(3,8,19,0.04)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "24px", color: alert ? "#ba1a1a" : "#74593e" }}>{icon}</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c", marginBottom: "4px" }}>{label}</div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "700",
                color: alert ? "#ba1a1a" : "#030813",
              }}>{value.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CHARTS ROW ===== */}
      <AdminCharts />

      {/* ===== SONG MANAGER TABLE ===== */}
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid rgba(198,198,204,0.2)",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(3,8,19,0.04)",
      }}>
        <div style={{
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(198,198,204,0.15)",
        }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "#030813", marginBottom: "4px" }}>Song Manager</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c" }}>Manage your library and metadata</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative" }}>
              <span className="material-symbols-outlined" style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "18px",
                color: "#76777c",
                pointerEvents: "none",
              }}>search</span>
              <input
                placeholder="Search songs..."
                style={{
                  padding: "10px 16px 10px 40px",
                  border: "1.5px solid rgba(198,198,204,0.4)",
                  borderRadius: "8px",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "#1b1b1c",
                  outline: "none",
                  width: "220px",
                  background: "#fcf8f9",
                }}
              />
            </div>
            <Link href="/admin/songs/new">
              <button style={{
                background: "#030813",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
                New
              </button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fcf8f9", borderBottom: "1px solid rgba(198,198,204,0.2)" }}>
              {["THUMBNAIL", "TITLE", "ARTIST", "LANGUAGES", "STATUS", "ACTIONS"].map(col => (
                <th key={col} style={{
                  padding: "12px 20px",
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  color: "#76777c",
                  textAlign: "left",
                  textTransform: "uppercase",
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentSongs.map(song => (
              <tr key={song.id} className="admin-table-row" style={{ borderBottom: "1px solid rgba(198,198,204,0.1)", transition: "background 0.1s" }}>
                {/* Thumbnail */}
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ width: "48px", height: "36px", borderRadius: "6px", background: "#e5e2e3", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#74593e", fontVariationSettings: "'FILL' 1" }}>music_note</span>
                  </div>
                </td>
                {/* Title */}
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "600", color: "#030813" }}>{song.title}</div>
                </td>
                {/* Artist */}
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#45474c" }}>{song.artist.name}</div>
                </td>
                {/* Languages */}
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {song.labels.slice(0, 3).map(l => (
                      <span key={l.label.name} style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        border: "1px solid rgba(198,198,204,0.4)",
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#45474c",
                        background: "#f6f3f4",
                      }}>{l.label.name.substring(0, 2).toUpperCase()}</span>
                    ))}
                  </div>
                </td>
                {/* Status */}
                <td style={{ padding: "14px 20px" }}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "#e8f5e9",
                    color: "#2e7d32",
                  }}>● Published</span>
                </td>
                {/* Actions */}
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link href={`/admin/songs/${song.id}/edit`}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#45474c", padding: "4px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>edit</span>
                      </button>
                    </Link>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#ba1a1a", padding: "4px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
