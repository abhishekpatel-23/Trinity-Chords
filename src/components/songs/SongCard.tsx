import Link from "next/link"

export interface SongCardProps {
  id: string
  title: string
  slug: string
  artistName: string
  genre?: string | null
  tempoBpm?: number | null
  keyName?: string | null
  labels: { label: { name: string; colorHex: string | null } }[]
}

export function SongCard({ title, slug, artistName, genre, tempoBpm, keyName, labels }: SongCardProps) {
  // Placeholder images based on genre/random for the aesthetic
  const placeholderImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAaQOI76CEtX3BihPnjhMdvIj_mfXCj7iGfFsSn5cjAry2P7jafxy2q74UWI63w_-uFKDPCXzk2iN3tOuiCwYidyAGA_YVtJfvYkFcJFYCESjUDrpozO_90gyMU6nL5uQlkNzPtlXEius2AtZPxxn0wt0Hp0cW0q7HaxqieAOOmtYsiYl9XrymJ6ci_st-cAl8NJ7N-LmmyfkYLnvOHh9Y1P3j5cj0VV-1L5GDU3jlJLuW5GjBySKai6cc1z8U2Zr-fKKnVV-poNROm";

  return (
    <Link href={`/songs/${slug}`}>
      <div className="bg-white rounded-xl overflow-hidden ambient-lift hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
        <div className="relative aspect-video">
          <img 
            alt="Song cover" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            src={placeholderImage} 
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform">
              <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </div>
          </div>
          {tempoBpm && (
            <div className="absolute top-2 right-2 flex gap-1">
              <span className="bg-[var(--color-secondary)]/90 text-white text-[10px] font-bold px-2 py-1 rounded">{tempoBpm} BPM</span>
            </div>
          )}
        </div>
        
        <div className="p-md space-y-3 flex flex-col flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-title-lg text-title-lg text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors line-clamp-1">{title}</h3>
              <p className="text-[var(--color-on-surface-variant)] font-body-md">{artistName}</p>
            </div>
            <button className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary)] transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 flex-grow">
            {labels.map((l) => (
              <span key={l.label.name} className="text-[10px] font-bold tracking-tight bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] px-2 py-0.5 rounded border border-[var(--color-outline-variant)]/20">
                {l.label.name.substring(0, 2).toUpperCase()}
              </span>
            ))}
            {keyName && (
              <span className="text-[10px] font-bold tracking-tight bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] px-2 py-0.5 rounded border border-[var(--color-outline-variant)]/20">
                Key: {keyName}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-outline-variant)]/10 mt-auto">
            <div className="flex items-center gap-1 text-[var(--color-on-surface-variant)]">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span className="text-label-sm">0</span>
            </div>
            {genre && (
              <span className="font-label-sm text-[var(--color-secondary-fixed-dim)] bg-[var(--color-primary)] px-3 py-1 rounded-full">{genre}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
