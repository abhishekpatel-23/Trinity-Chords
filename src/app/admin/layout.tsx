"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import { 
  AdminArtistsModal, 
  AdminRequestsModal, 
  AdminAnalyticsModal, 
  AdminSettingsModal 
} from "@/components/admin/AdminModals"

const NAV_ITEMS = [
  { href: "/admin", icon: "dashboard", label: "Dashboard" },
  { href: "/admin/songs", icon: "library_music", label: "Songs" },
  { href: "/admin/artists", icon: "person", label: "Artists" },
  { href: "/admin/requests", icon: "playlist_add_check", label: "Song Requests" },
  { href: "/admin/analytics", icon: "bar_chart", label: "Analytics" },
  { href: "/admin/settings", icon: "settings", label: "Settings" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [showArtists, setShowArtists] = useState(false)
  const [showRequests, setShowRequests] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  if (status === "loading") {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#fcf8f9",
        fontFamily: "var(--font-body)",
        color: "#45474c",
        fontSize: "15px",
      }}>
        Loading Admin Portal...
      </div>
    )
  }

  if (!session || (session.user as { role?: string })?.role !== "admin") {
    redirect("/")
  }

  const handleItemClick = (label: string, e: React.MouseEvent) => {
    if (label === "Artists") {
      e.preventDefault()
      setShowArtists(true)
    } else if (label === "Song Requests") {
      e.preventDefault()
      setShowRequests(true)
    } else if (label === "Analytics") {
      e.preventDefault()
      setShowAnalytics(true)
    } else if (label === "Settings") {
      e.preventDefault()
      setShowSettings(true)
    }
  }

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#fcf8f9",
      overflow: "hidden",
      fontFamily: "var(--font-body)",
    }}>
      {/* ===== SIDEBAR ===== */}
      <aside style={{
        width: "240px",
        flexShrink: 0,
        background: "#ffffff",
        borderRight: "1px solid rgba(198,198,204,0.25)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 12px rgba(3,8,19,0.04)",
      }}>
        {/* Logo */}
        <div style={{
          padding: "28px 24px 20px",
          borderBottom: "1px solid rgba(198,198,204,0.2)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #74593e, #5a4228)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#ffffff", fontVariationSettings: "'FILL' 1" }}>music_note</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: "700", color: "#030813", lineHeight: "1.2" }}>Admin</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: "700", color: "#030813", lineHeight: "1.2" }}>Portal</div>
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#74593e", fontWeight: "500", marginTop: "4px" }}>Worship Leader Mode</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
          {NAV_ITEMS.map(({ href, icon, label }) => {
            const isModal = ["Artists", "Song Requests", "Analytics", "Settings"].includes(label)

            if (isModal) {
              return (
                <button
                  key={label}
                  onClick={(e) => handleItemClick(label, e)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "none",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#45474c",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  className="admin-nav-link"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{icon}</span>
                  {label}
                </button>
              )
            }

            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#45474c",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "background 0.15s, color 0.15s",
                }}
                className="admin-nav-link"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Add New Song CTA */}
        <div style={{ padding: "16px 12px" }}>
          <Link href="/admin/songs/new">
            <button style={{
              width: "100%",
              padding: "12px",
              background: "linear-gradient(135deg, #74593e, #5a4228)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "opacity 0.15s",
              marginBottom: "12px",
            }}>
              Add New Song
            </button>
          </Link>
        </div>

        {/* Footer links */}
        <div style={{ padding: "0 12px 20px", borderTop: "1px solid rgba(198,198,204,0.2)", paddingTop: "12px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", textDecoration: "none", color: "#45474c", fontSize: "13px", borderRadius: "6px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>logout</span>
            Log Out
          </Link>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: "64px",
          background: "#ffffff",
          borderBottom: "1px solid rgba(198,198,204,0.2)",
          flexShrink: 0,
        }}>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#fdd9b6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#74593e", fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          {children}
        </main>
      </div>

      {/* Modals */}
      <AdminArtistsModal isOpen={showArtists} onClose={() => setShowArtists(false)} />
      <AdminRequestsModal isOpen={showRequests} onClose={() => setShowRequests(false)} />
      <AdminAnalyticsModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} />
      <AdminSettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
