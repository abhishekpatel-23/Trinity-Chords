"use client"

import { useState } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

/* ========================================================
   1. ADMIN ARTISTS MODAL
   ======================================================== */
export function AdminArtistsModal({ isOpen, onClose }: ModalProps) {
  const [artists, setArtists] = useState([
    { id: "1", name: "Hillsong Worship", count: 8 },
    { id: "2", name: "Bethel Music", count: 5 },
    { id: "3", name: "CityAlight", count: 6 },
    { id: "4", name: "Elevation Worship", count: 4 }
  ])
  const [newArtistName, setNewArtistName] = useState("")

  if (!isOpen) return null

  function handleAddArtist(e: React.FormEvent) {
    e.preventDefault()
    if (!newArtistName.trim()) return
    setArtists([...artists, {
      id: Date.now().toString(),
      name: newArtistName.trim(),
      count: 0
    }])
    setNewArtistName("")
  }

  function handleDeleteArtist(id: string) {
    setArtists(artists.filter(a => a.id !== id))
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="slide-in-up" style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "540px",
        position: "relative",
        boxShadow: "0 32px 80px rgba(3,8,19,0.18)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#45474c",
          padding: "4px"
        }}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "#f0edee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span className="material-symbols-outlined" style={{ color: "#74593e", fontSize: "24px" }}>person</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "#030813" }}>Artist Manager</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c" }}>Manage platform artists and categories</p>
          </div>
        </div>

        {/* Add Artist Form */}
        <form onSubmit={handleAddArtist} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            className="tc-input"
            type="text"
            placeholder="New Artist Name"
            value={newArtistName}
            onChange={e => setNewArtistName(e.target.value)}
            style={{ flex: 1 }}
            required
          />
          <button type="submit" style={{
            background: "#030813",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Add
          </button>
        </form>

        {/* List */}
        <div style={{
          maxHeight: "240px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "24px"
        }}>
          {artists.map((a) => (
            <div key={a.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              background: "#fcf8f9",
              borderRadius: "8px",
              border: "1px solid rgba(198,198,204,0.15)"
            }}>
              <div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "600", color: "#030813" }}>{a.name}</span>
                <span style={{ fontSize: "12px", color: "#76777c", marginLeft: "10px" }}>{a.count} Songs</span>
              </div>
              <button 
                onClick={() => handleDeleteArtist(a.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#ba1a1a", padding: "2px" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>delete</span>
              </button>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{
          width: "100%",
          background: "#030813",
          color: "#ffffff",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer"
        }}>
          Done
        </button>
      </div>
    </div>
  )
}

/* ========================================================
   2. ADMIN REQUESTS MODAL
   ======================================================== */
export function AdminRequestsModal({ isOpen, onClose }: ModalProps) {
  const [requests, setRequests] = useState([
    { id: "1", title: "Goodness of God", artist: "Bethel Music", user: "worship@fellowship.com" },
    { id: "2", title: "Gratitude", artist: "Brandon Lake", user: "john@calvary.org" },
    { id: "3", title: "Build My Life", artist: "Housefires", user: "sarah@gracechurch.com" }
  ])

  if (!isOpen) return null

  function handleAction(id: string) {
    // Remove request on approve/reject action
    setRequests(requests.filter(r => r.id !== id))
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="slide-in-up" style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "600px",
        position: "relative",
        boxShadow: "0 32px 80px rgba(3,8,19,0.18)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#45474c",
          padding: "4px"
        }}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "#fff0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span className="material-symbols-outlined" style={{ color: "#ba1a1a", fontSize: "24px" }}>playlist_add_check</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "#030813" }}>Song Requests</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c" }}>Moderate pending user requests</p>
          </div>
        </div>

        {/* Requests List */}
        <div style={{
          maxHeight: "300px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "24px"
        }}>
          {requests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "#76777c", fontFamily: "var(--font-body)" }}>
              No pending requests!
            </div>
          ) : (
            requests.map((r) => (
              <div key={r.id} style={{
                padding: "16px",
                background: "#fcf8f9",
                borderRadius: "10px",
                border: "1px solid rgba(198,198,204,0.15)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <h4 style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "700", color: "#030813", marginBottom: "4px" }}>{r.title}</h4>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#45474c", marginBottom: "2px" }}>Artist: {r.artist}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#76777c" }}>By: {r.user}</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    onClick={() => handleAction(r.id)}
                    style={{
                      background: "#2e7d32",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(r.id)}
                    style={{
                      background: "rgba(186,26,26,0.08)",
                      color: "#ba1a1a",
                      border: "1.5px solid rgba(186,26,26,0.15)",
                      padding: "7px 11px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button onClick={onClose} style={{
          width: "100%",
          background: "#030813",
          color: "#ffffff",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer"
        }}>
          Close Panel
        </button>
      </div>
    </div>
  )
}

/* ========================================================
   3. ADMIN ANALYTICS MODAL
   ======================================================== */
export function AdminAnalyticsModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null

  const metrics = [
    { label: "Active Sessions", value: "1,492", change: "+14.2%" },
    { label: "Chord Sheet Loads", value: "8,941", change: "+22.5%" },
    { label: "Song PDF Downloads", value: "624", change: "+8.9%" },
    { label: "Cache Hit Efficiency", value: "93.8%", change: "+1.2%" }
  ]

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="slide-in-up" style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "540px",
        position: "relative",
        boxShadow: "0 32px 80px rgba(3,8,19,0.18)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#45474c",
          padding: "4px"
        }}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "#f0edee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span className="material-symbols-outlined" style={{ color: "#74593e", fontSize: "24px" }}>bar_chart</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "#030813" }}>Platform Analytics</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c" }}>Real-time user engagement metrics</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "24px"
        }}>
          {metrics.map((m) => (
            <div key={m.label} style={{
              padding: "16px",
              background: "#fcf8f9",
              borderRadius: "10px",
              border: "1px solid rgba(198,198,204,0.15)"
            }}>
              <span style={{ fontSize: "12px", color: "#76777c", fontFamily: "var(--font-body)" }}>{m.label}</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "4px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "#030813" }}>{m.value}</span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#2e7d32" }}>{m.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Mock */}
        <div style={{
          height: "120px",
          background: "#f6f3f4",
          borderRadius: "10px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "16px 24px",
          marginBottom: "24px"
        }}>
          {[40, 60, 50, 75, 90, 85, 95].map((h, i) => (
            <div key={i} style={{ width: "32px", height: `${h}%`, background: "linear-gradient(to top, #74593e, #e3c09f)", borderRadius: "4px 4px 0 0" }} />
          ))}
        </div>

        <button onClick={onClose} style={{
          width: "100%",
          background: "#030813",
          color: "#ffffff",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer"
        }}>
          Done
        </button>
      </div>
    </div>
  )
}

/* ========================================================
   4. ADMIN SETTINGS MODAL
   ======================================================== */
export function AdminSettingsModal({ isOpen, onClose }: ModalProps) {
  const [settings, setSettings] = useState({
    registrations: true,
    caching: true,
    offlineMode: false,
    contributors: false
  })

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="slide-in-up" style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "480px",
        position: "relative",
        boxShadow: "0 32px 80px rgba(3,8,19,0.18)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#45474c",
          padding: "4px"
        }}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "#f0edee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span className="material-symbols-outlined" style={{ color: "#74593e", fontSize: "24px" }}>settings</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "#030813" }}>Portal Settings</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c" }}>Manage platform configurations</p>
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
          {[
            { key: "registrations", title: "Allow public registrations", desc: "Enable new visitor accounts registration" },
            { key: "caching", title: "Enable transposition cache", desc: "Cache transposed chords in Redis" },
            { key: "offlineMode", title: "Enable offline access", desc: "Allow offline syncing of chords sheets" },
            { key: "contributors", title: "Enable contributor role", desc: "Allow users to submit new chord sheets" }
          ].map(({ key, title, desc }) => (
            <div key={key} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(198,198,204,0.15)"
            }}>
              <div>
                <h4 style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "700", color: "#030813", marginBottom: "2px" }}>{title}</h4>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#76777c" }}>{desc}</p>
              </div>
              {/* Checkbox Switch */}
              <input
                type="checkbox"
                checked={settings[key as keyof typeof settings]}
                onChange={e => setSettings({ ...settings, [key]: e.target.checked })}
                style={{
                  width: "40px",
                  height: "20px",
                  cursor: "pointer"
                }}
              />
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{
          width: "100%",
          background: "#030813",
          color: "#ffffff",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer"
        }}>
          Save Settings
        </button>
      </div>
    </div>
  )
}
