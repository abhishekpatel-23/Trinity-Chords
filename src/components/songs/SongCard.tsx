"use client"

import Link from "next/link"

// Different images for variety
const COVER_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAaQOI76CEtX3BihPnjhMdvIj_mfXCj7iGfFsSn5cjAry2P7jafxy2q74UWI63w_-uFKDPCXzk2iN3tOuiCwYidyAGA_YVtJfvYkFcJFYCESjUDrpozO_90gyMU6nL5uQlkNzPtlXEius2AtZPxxn0wt0Hp0cW0q7HaxqieAOOmtYsiYl9XrymJ6ci_st-cAl8NJ7N-LmmyfkYLnvOHh9Y1P3j5cj0VV-1L5GDU3jlJLuW5GjBySKai6cc1z8U2Zr-fKKnVV-poNROm",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCEWcXNMIPJFcEsggjVV798kpNbDP9TxT8ACeADsFB3_tpa7I53HW_MczV9jHkQXv79WvMXG4IkD8O9gWFqagqZjScqd7EfAnbr74kgn3AVLFU3QWIJ3oi5ZBl-eIxYYR4_ZcoNVH-mENVp4xzKxxikl8RZJ1cuYOXMIJHrKWtDbErj1UhWEWuQEqtzCGkNX4Wr3Lrmbfl5ezh984w7AoPfJ0WnrpD9S0fC91Z4z5vc6PVOG2H82s-fnZaTSBur5KWMk_umScYMTYkO",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBAWTCKyd4PbhG2TOgoPhk_L4VPBrLQulqRze3GuoYA6HJXVlz6oLKOsd_6IwIJ_21i8uoXemmEgieECwSLaf3YVF-lnEhm6uGGki6vVuSXMA6SOmqS-NeeDg7tW_H9DO7WLA8ZxpZfQTkqksQrlAsCqoQj0e2dkJeaNEBN5SA4Oyt9G6VFJQA5aDKmyL2BTjuV_uJRWoRfz31_vCG9x8vTdoHW02pUXostueBkuehQuL87mQA7ghIrn5y4fM-kewsaIUdhOfQw5q0Q",
]

export interface SongCardProps {
  id: string
  title: string
  slug: string
  artistName: string
  genre?: string | null
  tempoBpm?: number | null
  keyName?: string | null
  labels: { label: { name: string; colorHex: string | null } }[]
  index?: number
}

export function SongCard({ title, slug, artistName, genre, tempoBpm, labels, index = 0 }: SongCardProps) {
  const image = COVER_IMAGES[index % COVER_IMAGES.length]

  // Get short language codes from labels
  const langCodes = labels
    .filter(l => l.label.name.length <= 10)
    .slice(0, 3)
    .map(l => l.label.name.substring(0, 2).toUpperCase())

  return (
    <Link href={`/songs/${slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div className="song-card" style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.3s",
      }}
        onMouseOver={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = "translateY(-2px)"
        }}
        onMouseOut={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = "translateY(0)"
        }}
      >
        {/* Thumbnail */}
        <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
          <img
            src={image}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
            }}
          />
          {/* Hover play overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
            onMouseOver={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = "rgba(0,0,0,0.35)"
            }}
            onMouseOut={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = "rgba(0,0,0,0)"
            }}
          >
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.2s",
            }}>
              <span className="material-symbols-outlined" style={{
                color: "#ffffff",
                fontSize: "28px",
                fontVariationSettings: "'FILL' 1",
              }}>play_arrow</span>
            </div>
          </div>

          {/* BPM badge */}
          {tempoBpm && (
            <div style={{ position: "absolute", top: "8px", right: "8px" }}>
              <span style={{
                background: "rgba(116,89,62,0.92)",
                color: "#ffffff",
                fontSize: "10px",
                fontWeight: "700",
                fontFamily: "var(--font-body)",
                padding: "3px 8px",
                borderRadius: "4px",
                letterSpacing: "0.04em",
              }}>{tempoBpm} BPM</span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          {/* Title row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{
                fontFamily: "var(--font-body)",
                fontSize: "18px",
                fontWeight: "600",
                color: "#030813",
                marginBottom: "4px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                transition: "color 0.15s",
              }}>{title}</h3>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "#45474c",
              }}>{artistName}</p>
            </div>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#76777c",
                padding: "2px",
                flexShrink: 0,
                transition: "color 0.15s",
              }}
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                navigator.share?.({ title, url: `/songs/${slug}` })
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>share</span>
            </button>
          </div>

          {/* Language tags */}
          {langCodes.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {langCodes.map(code => (
                <span key={code} style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.04em",
                  background: "#f0edee",
                  color: "#45474c",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  border: "1px solid rgba(198,198,204,0.3)",
                }}>{code}</span>
              ))}
            </div>
          )}

          {/* Footer row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid rgba(198,198,204,0.2)",
            marginTop: "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#76777c" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: "500" }}>
                {((slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) * 7) % 1800 + 201).toLocaleString()}
              </span>
            </div>
            {genre && (
              <span style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: "600",
                background: "#030813",
                color: "#e3c09f",
                padding: "4px 12px",
                borderRadius: "999px",
                letterSpacing: "0.02em",
              }}>{genre}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
