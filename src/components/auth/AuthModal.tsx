"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "register" | "login"
}

export function AuthModal({ isOpen, onClose, initialMode = "register" }: AuthModalProps) {
  const [mode, setMode] = useState<"register" | "login">(initialMode)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (mode === "register") {
      if (password !== confirm) {
        setError("Passwords do not match")
        setLoading(false)
        return
      }
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Registration failed")
        setLoading(false)
        return
      }
      // Auto-login after register
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      if (loginRes?.error) {
        setError("Account created! Please sign in.")
        setMode("login")
      } else {
        onClose()
        router.refresh()
      }
    } else {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      if (res?.error) {
        setError("Invalid email or password")
      } else {
        onClose()
        router.refresh()
      }
    }
    setLoading(false)
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/" })
  }

  async function handleAdminLogin() {
    setMode("login")
    setEmail("admin@trinitychords.com")
    setPassword("")
    setError("Please enter admin password and click Sign in")
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Decorative circles */}
      <div style={{
        position: "absolute",
        top: "-80px",
        right: "-80px",
        width: "320px",
        height: "320px",
        borderRadius: "50%",
        border: "1.5px solid rgba(116,89,62,0.15)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "-60px",
        left: "-60px",
        width: "240px",
        height: "240px",
        borderRadius: "50%",
        border: "1.5px solid rgba(116,89,62,0.10)",
        pointerEvents: "none"
      }} />

      {/* Modal card */}
      <div
        className="slide-in-up"
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          boxShadow: "0 32px 80px rgba(3,8,19,0.18)",
        }}
      >
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

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px",
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: "32px",
              color: "#74593e",
              fontVariationSettings: "'FILL' 1",
            }}>music_note</span>
          </div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: "700",
            color: "#030813",
            letterSpacing: "-0.01em",
          }}>Trinity Chords</div>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "#45474c",
            marginTop: "4px",
          }}>Begin Your Worship Journey</div>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          style={{
            width: "100%",
            padding: "13px 16px",
            border: "1.5px solid #c6c6cc",
            borderRadius: "8px",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            fontWeight: "500",
            color: "#1b1b1c",
            transition: "background 0.15s, border-color 0.15s",
            marginBottom: "20px",
          }}
          onMouseOver={e => (e.currentTarget.style.background = "#f6f3f4")}
          onMouseOut={e => (e.currentTarget.style.background = "#ffffff")}
        >
          {/* Google SVG icon */}
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", background: "#e5e2e3" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#76777c", fontWeight: "500" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "#e5e2e3" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {mode === "register" && (
            <input
              className="tc-input"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          )}
          <input
            className="tc-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              className="tc-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            {mode === "register" && (
              <input
                className="tc-input"
                type="password"
                placeholder="Confirm"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                style={{ flex: 1 }}
              />
            )}
          </div>

          {error && (
            <p style={{ color: "#ba1a1a", fontSize: "13px", fontFamily: "var(--font-body)", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #74593e 0%, #5a4228 100%)",
              color: "#ffffff",
              padding: "14px 16px",
              borderRadius: "8px",
              border: "none",
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.2s",
              opacity: loading ? 0.7 : 1,
              marginTop: "4px",
            }}
          >
            {loading ? "Please wait..." : (mode === "register" ? "Create Account →" : "Sign in →")}
          </button>
        </form>

        {/* Toggle */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          {mode === "register" ? (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#45474c" }}>
              Already have an account?{" "}
              <button
                onClick={() => { setMode("login"); setError("") }}
                style={{ background: "none", border: "none", color: "#74593e", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}
              >
                Sign in
              </button>
            </p>
          ) : (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#45474c" }}>
              Don't have an account?{" "}
              <button
                onClick={() => { setMode("register"); setError("") }}
                style={{ background: "none", border: "none", color: "#74593e", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}
              >
                Sign up
              </button>
            </p>
          )}
          <button
            onClick={handleAdminLogin}
            style={{
              background: "none",
              border: "none",
              color: "#76777c",
              fontSize: "13px",
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              marginTop: "8px",
              textDecoration: "underline",
            }}
          >
            Login as Admin →
          </button>
        </div>
      </div>
    </div>
  )
}
