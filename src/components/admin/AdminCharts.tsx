"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts"

const SITE_VISIT_DATA = [
  { day: "Mon", visits: 120 },
  { day: "Tue", visits: 188 },
  { day: "Wed", visits: 230 },
  { day: "Thu", visits: 560 },
  { day: "Fri", visits: 510 },
  { day: "Sat", visits: 710 },
  { day: "Sun", visits: 430 },
]

const LANG_DATA = [
  { name: "English", value: 65, color: "#030813" },
  { name: "Latin", value: 20, color: "#74593e" },
  { name: "Other", value: 15, color: "#fdd9b6" },
]

export function AdminCharts() {
  const [range, setRange] = useState("Last 7 Days")

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px", marginBottom: "28px" }}>
      {/* Site Visits bar chart */}
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid rgba(198,198,204,0.2)",
        padding: "28px",
        boxShadow: "0 2px 8px rgba(3,8,19,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "700", color: "#030813" }}>Site Visits</h3>
          <div style={{ position: "relative" }}>
            <select
              value={range}
              onChange={e => setRange(e.target.value)}
              style={{
                appearance: "none",
                background: "#f6f3f4",
                border: "none",
                borderRadius: "8px",
                padding: "8px 32px 8px 14px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: "600",
                color: "#1b1b1c",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
            </select>
            <span className="material-symbols-outlined" style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "16px",
              color: "#45474c",
              pointerEvents: "none",
            }}>expand_more</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={SITE_VISIT_DATA} barSize={36} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#76777c" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#76777c" }}
            />
            <Tooltip
              contentStyle={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(3,8,19,0.12)",
              }}
              cursor={{ fill: "rgba(116,89,62,0.06)" }}
            />
            <Bar dataKey="visits" radius={[4, 4, 0, 0]}>
              {SITE_VISIT_DATA.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === SITE_VISIT_DATA.length - 2 ? "#74593e" : "#e3c09f"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Songs by Language donut */}
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid rgba(198,198,204,0.2)",
        padding: "28px",
        boxShadow: "0 2px 8px rgba(3,8,19,0.04)",
      }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "700", color: "#030813", marginBottom: "20px" }}>Songs by Language</h3>

        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={LANG_DATA}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {LANG_DATA.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "Playfair Display, serif", fontSize: "22px", fontWeight: "700", fill: "#030813" }}>
              1.4k
            </text>
            <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fill: "#76777c" }}>
              Total
            </text>
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
          {LANG_DATA.map(({ name, value, color }) => (
            <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#45474c" }}>{name}</span>
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "#1b1b1c" }}>{value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
