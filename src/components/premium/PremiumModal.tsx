"use client"

import { useState } from "react"

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [plan, setPlan] = useState<"yearly" | "monthly">("yearly")
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  async function handleUpgrade() {
    setLoading(true)
    // Simulate checkout - in production this calls /api/stripe/checkout
    await new Promise(r => setTimeout(r, 1200))
    alert(`Starting ${plan} plan checkout... Connect Stripe to complete payment.`)
    setLoading(false)
  }

  return (
    <div
      className="modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Decorative circle bottom-right */}
      <div style={{
        position: "absolute",
        bottom: "-60px",
        right: "-60px",
        width: "240px",
        height: "240px",
        borderRadius: "50%",
        border: "1.5px solid rgba(116,89,62,0.15)",
        pointerEvents: "none",
      }} />

      {/* Modal */}
      <div
        className="slide-in-up"
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "760px",
          display: "flex",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 32px 80px rgba(3,8,19,0.18)",
        }}
      >
        {/* Left panel */}
        <div style={{
          flex: "0 0 45%",
          background: "#fcf8f9",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}>
          {/* Icon */}
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #74593e 0%, #5a4228 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span className="material-symbols-outlined" style={{
              color: "#ffffff",
              fontSize: "28px",
              fontVariationSettings: "'FILL' 1",
            }}>workspace_premium</span>
          </div>

          {/* Title */}
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: "700",
              color: "#030813",
              lineHeight: "1.25",
              marginBottom: "12px",
            }}>Unlock Trinity Chords Premium</h2>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "#45474c",
              lineHeight: "1.6",
            }}>More ways to worship, share, and grow spiritually through music.</p>
          </div>

          {/* Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { icon: "image", label: "Share as Image" },
              { icon: "description", label: "Share as Text" },
              { icon: "download_done", label: "Offline lyrics" },
              { icon: "swap_vert", label: "Chord transposition" },
              { icon: "playlist_add", label: "Personal playlists" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#f6f3f4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#74593e" }}>{icon}</span>
                </div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "#1b1b1c", fontWeight: "500" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{
          flex: "1",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#45474c",
              padding: "4px",
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <h3 style={{
            fontFamily: "var(--font-body)",
            fontSize: "20px",
            fontWeight: "700",
            color: "#030813",
            marginBottom: "24px",
          }}>Choose Your Journey</h3>

          {/* Yearly plan */}
          <div
            onClick={() => setPlan("yearly")}
            style={{
              border: `2px solid ${plan === "yearly" ? "#74593e" : "#e5e2e3"}`,
              borderRadius: "12px",
              padding: "20px 24px",
              cursor: "pointer",
              marginBottom: "12px",
              transition: "border-color 0.2s, background 0.2s",
              background: plan === "yearly" ? "#fffbf8" : "#ffffff",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.1em",
                    color: "#74593e",
                    textTransform: "uppercase",
                  }}>Yearly</span>
                  <span style={{
                    background: "#74593e",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    letterSpacing: "0.05em",
                  }}>BEST VALUE</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#1b1b1c", alignSelf: "flex-start", paddingTop: "4px" }}>$</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: "700", color: "#1b1b1c" }}>49.99</span>
                  <span style={{ fontSize: "14px", color: "#45474c" }}>/year</span>
                </div>
              </div>
              {/* Radio */}
              <div style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                border: `2px solid ${plan === "yearly" ? "#74593e" : "#c6c6cc"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {plan === "yearly" && (
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#74593e" }} />
                )}
              </div>
            </div>
          </div>

          {/* Monthly plan */}
          <div
            onClick={() => setPlan("monthly")}
            style={{
              border: `2px solid ${plan === "monthly" ? "#74593e" : "#e5e2e3"}`,
              borderRadius: "12px",
              padding: "20px 24px",
              cursor: "pointer",
              marginBottom: "32px",
              transition: "border-color 0.2s, background 0.2s",
              background: plan === "monthly" ? "#fffbf8" : "#ffffff",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ marginBottom: "6px" }}>
                  <span style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.1em",
                    color: "#45474c",
                    textTransform: "uppercase",
                  }}>Monthly</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#1b1b1c", alignSelf: "flex-start", paddingTop: "4px" }}>$</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: "700", color: "#1b1b1c" }}>5.99</span>
                  <span style={{ fontSize: "14px", color: "#45474c" }}>/month</span>
                </div>
              </div>
              <div style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                border: `2px solid ${plan === "monthly" ? "#74593e" : "#c6c6cc"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {plan === "monthly" && (
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#74593e" }} />
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #74593e 0%, #5a4228 100%)",
              color: "#ffffff",
              padding: "16px 24px",
              borderRadius: "10px",
              border: "none",
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.2s, transform 0.15s",
              opacity: loading ? 0.8 : 1,
              width: "100%",
              marginBottom: "16px",
            }}
          >
            {loading ? "Processing..." : "Upgrade Now →"}
          </button>

          {/* Legal */}
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "#76777c",
            textAlign: "center",
            lineHeight: "1.6",
          }}>
            7-day free trial. Cancel anytime.<br />
            By clicking, you agree to our{" "}
            <a href="#" style={{ color: "#74593e", textDecoration: "underline" }}>Terms of Service</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
