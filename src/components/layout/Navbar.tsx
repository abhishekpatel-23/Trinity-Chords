"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthModal } from "@/components/auth/AuthModal"
import { PremiumModal } from "@/components/premium/PremiumModal"

interface NavbarProps {
  onSearch?: (q: string) => void
}

export function Navbar({ onSearch }: NavbarProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"register" | "login">("register")
  const [showPremium, setShowPremium] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchVal, setSearchVal] = useState(searchParams.get("q") || "")

  useEffect(() => {
    setSearchVal(searchParams.get("q") || "")
  }, [searchParams])

  function triggerSearch(val: string) {
    if (onSearch) {
      onSearch(val)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      if (val) {
        params.set("q", val)
      } else {
        params.delete("q")
      }
      params.delete("page") // Reset pagination
      router.push(`/?${params.toString()}`)
    }
  }

  function handleSearchKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      triggerSearch(searchVal)
    }
  }

  return (
    <>
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(252,248,249,0.88)",
        borderBottom: "1px solid rgba(198,198,204,0.3)",
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          gap: "24px",
        }}>
          {/* Brand */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{
              fontSize: "28px",
              color: "#74593e",
              fontVariationSettings: "'FILL' 1",
            }}>music_note</span>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontWeight: "700",
              color: "#030813",
              letterSpacing: "-0.01em",
            }}>Trinity Chords</span>
          </Link>

          {/* Search */}
          <div style={{
            flex: 1,
            maxWidth: "480px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            background: "#f6f3f4",
            borderRadius: "999px",
            padding: "8px 16px",
            border: "1px solid rgba(198,198,204,0.3)",
            gap: "8px",
          }}>
            <span 
              className="material-symbols-outlined" 
              onClick={() => triggerSearch(searchVal)}
              style={{ color: "#45474c", fontSize: "20px", flexShrink: 0, cursor: "pointer" }}
            >
              search
            </span>
            <input
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "#1b1b1c",
              }}
              placeholder="Search songs, artists, or themes..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={handleSearchKey}
            />
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                flexShrink: 0,
                color: "#74593e",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>mic</span>
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Link href="/" style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: "700",
                color: "#74593e",
                textDecoration: "none",
                borderBottom: "2px solid #74593e",
                paddingBottom: "2px",
              }}>Songs</Link>
              <Link href="/theology" style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: "500",
                color: "#45474c",
                textDecoration: "none",
                transition: "color 0.15s",
              }}>Theology</Link>
              <Link href="/community" style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: "500",
                color: "#45474c",
                textDecoration: "none",
              }}>Community</Link>
              <button
                onClick={() => setShowPremium(true)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#45474c",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >Premium</button>
            </div>

            {/* Icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                color: "#45474c",
                borderRadius: "50%",
                transition: "background 0.15s",
              }}>
                <span className="material-symbols-outlined">language</span>
              </button>

              <button style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                color: "#45474c",
                borderRadius: "50%",
                position: "relative",
              }}>
                <span className="material-symbols-outlined">notifications</span>
                <span style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "8px",
                  height: "8px",
                  background: "#ba1a1a",
                  borderRadius: "50%",
                }} />
              </button>

              {/* Avatar */}
              {session ? (
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "#fdd9b6",
                      border: "2px solid #ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: "#74593e", fontSize: "22px" }}>person</span>
                  </button>
                  {showUserMenu && (
                    <div style={{
                      position: "absolute",
                      top: "48px",
                      right: 0,
                      background: "#ffffff",
                      borderRadius: "12px",
                      boxShadow: "0 16px 48px rgba(3,8,19,0.12)",
                      padding: "8px",
                      minWidth: "200px",
                      zIndex: 100,
                    }}>
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0edee" }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "600", color: "#030813" }}>
                          {session.user?.name || "User"}
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#45474c" }}>
                          {session.user?.email}
                        </div>
                      </div>
                      {(session.user as { role?: string })?.role === "admin" && (
                        <Link
                          href="/admin"
                          style={{ display: "block", padding: "10px 16px", fontFamily: "var(--font-body)", fontSize: "14px", color: "#1b1b1c", textDecoration: "none", borderRadius: "8px" }}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => { setShowUserMenu(false); signOut() }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 16px",
                          fontFamily: "var(--font-body)",
                          fontSize: "14px",
                          color: "#ba1a1a",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "8px",
                        }}
                      >Sign out</button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { setAuthMode("register"); setShowAuth(true) }}
                  style={{
                    background: "#030813",
                    color: "#ffffff",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    border: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  Sign in
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} initialMode={authMode} />
      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
    </>
  )
}
