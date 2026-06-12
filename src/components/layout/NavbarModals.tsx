"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

/* ========================================================
   1. THEOLOGY MODAL
   ======================================================== */
export function TheologyModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null

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
            background: "#fdf3eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span className="material-symbols-outlined" style={{ color: "#74593e", fontSize: "24px" }}>auto_stories</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "#030813" }}>Worship Theology</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c" }}>The Heart and Word behind the Chords</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
          {[
            { title: "Scriptural Integrity", text: "We believe worship lyrics should align with sound biblical doctrine. Every song sheet is verified for scriptural context." },
            { title: "Multilingual Worship", text: "Praising God transcends borders. We support English, Hindi, Gujarati, Marathi, and other regional languages to enable unified local expressions." },
            { title: "Acoustic Harmony", text: "Chords are mapped in simple, elegant progressions (e.g. key transposition) to keep focus on congregation participation rather than performance." }
          ].map(({ title, text }) => (
            <div key={title} style={{ padding: "16px", borderRadius: "10px", background: "#fcf8f9", border: "1px solid rgba(198,198,204,0.2)" }}>
              <h4 style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "700", color: "#030813", marginBottom: "6px" }}>{title}</h4>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c", lineHeight: "1.6" }}>{text}</p>
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
          Close Guide
        </button>
      </div>
    </div>
  )
}

/* ========================================================
   2. COMMUNITY MODAL
   ======================================================== */
export function CommunityModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null

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
            background: "#f3f0ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span className="material-symbols-outlined" style={{ color: "#74593e", fontSize: "24px" }}>groups</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "#030813" }}>Leader Community</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c" }}>Collaborate with Worship Leaders Worldwide</p>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "32px 24px", background: "#fcf8f9", borderRadius: "12px", border: "1.5px dashed rgba(198,198,204,0.5)", marginBottom: "24px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#c6c6cc", marginBottom: "12px" }}>construction</span>
          <h4 style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: "700", color: "#030813", marginBottom: "6px" }}>Under Construction</h4>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#45474c", lineHeight: "1.6" }}>
            We are currently developing a collaboration space for worship teams to share custom chord transpositions, setlists, and practice schedules. Stay tuned!
          </p>
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
          Acknowledge
        </button>
      </div>
    </div>
  )
}

/* ========================================================
   3. LANGUAGE SELECTION MODAL
   ======================================================== */
export function LanguageModal({ isOpen, onClose }: ModalProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (!isOpen) return null

  function selectLanguage(lang: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (lang) {
      params.set("lang", lang)
    } else {
      params.delete("lang")
    }
    params.delete("page")
    router.push(`/?${params.toString()}`)
    onClose()
  }

  const languages = [
    { name: "English", local: "English", code: "EN" },
    { name: "Hindi", local: "हिन्दी", code: "HI" },
    { name: "Gujarati", local: "ગુજરાતી", code: "GU" },
    { name: "Marathi", local: "मराठी", code: "MR" }
  ]

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="slide-in-up" style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
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

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#74593e", marginBottom: "8px" }}>language</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "700", color: "#030813" }}>Select Language</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c" }}>Filter songs by worship language</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          <button 
            onClick={() => selectLanguage("")}
            style={{
              padding: "14px 20px",
              borderRadius: "8px",
              border: "1.5px solid rgba(198,198,204,0.3)",
              background: "#fcf8f9",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: "600",
              color: "#030813",
              textAlign: "left",
              cursor: "pointer"
            }}
          >
            All Languages
          </button>

          {languages.map((l) => (
            <button
              key={l.name}
              onClick={() => selectLanguage(l.name)}
              style={{
                padding: "14px 20px",
                borderRadius: "8px",
                border: "1.5px solid rgba(198,198,204,0.3)",
                background: "#ffffff",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: "500",
                color: "#1b1b1c",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer"
              }}
            >
              <span>{l.name}</span>
              <span style={{ fontSize: "12px", color: "#76777c", background: "#f0edee", padding: "2px 8px", borderRadius: "4px" }}>{l.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ========================================================
   4. NOTIFICATIONS MODAL
   ======================================================== */
export function NotificationsModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null

  const notifications = [
    { id: 1, title: "Featured Release Updated", text: "Hosanna by Hillsong Worship is now featured on the homepage.", time: "2 hours ago", unread: true },
    { id: 2, title: "New Chord Chart Added", text: "Lyrics and guitar diagrams for 'Way Maker' are now online.", time: "1 day ago", unread: false },
    { id: 3, title: "Stitch UI Synced", text: "Homepage fonts and colors have been fully synced to Google Stitch spec.", time: "2 days ago", unread: false }
  ]

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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="material-symbols-outlined" style={{ color: "#74593e", fontSize: "26px" }}>notifications</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "700", color: "#030813" }}>Notifications</h2>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
          {notifications.map((n) => (
            <div key={n.id} style={{
              padding: "16px",
              borderRadius: "10px",
              background: n.unread ? "#fffbf8" : "#ffffff",
              border: `1.5px solid ${n.unread ? "rgba(116,89,62,0.15)" : "rgba(198,198,204,0.2)"}`,
              position: "relative"
            }}>
              {n.unread && (
                <div style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "8px",
                  height: "8px",
                  background: "#ba1a1a",
                  borderRadius: "50%"
                }} />
              )}
              <h4 style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "700", color: "#030813", marginBottom: "4px" }}>{n.title}</h4>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c", lineHeight: "1.5", marginBottom: "6px" }}>{n.text}</p>
              <span style={{ fontSize: "11px", color: "#76777c" }}>{n.time}</span>
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
          Dismiss All
        </button>
      </div>
    </div>
  )
}
