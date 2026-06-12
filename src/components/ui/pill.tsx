import * as React from "react"
import { cn } from "@/lib/utils"

export interface PillProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  colorHex?: string | null
}

export function Pill({ className, active, colorHex, children, ...props }: PillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer",
        active 
          ? "bg-[var(--color-secondary)] text-[var(--color-on-secondary)]" 
          : "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] hover:opacity-80",
        className
      )}
      style={colorHex ? { backgroundColor: active ? colorHex : undefined } : undefined}
      {...props}
    >
      {children}
    </div>
  )
}
