import { Suspense } from "react"
import prisma from "@/lib/prisma"
import { getCachedData } from "@/lib/redis"
import { SongGrid } from "@/components/songs/SongGrid"
import Link from "next/link"

async function getHomePageData() {
  return getCachedData('home_page_data', async () => {
    const featuredSong = await prisma.song.findFirst({
      where: { isFeatured: true },
      include: { artist: true },
      orderBy: { publishedAt: 'desc' }
    })

    const labels = await prisma.label.findMany({
      orderBy: { name: 'asc' }
    })

    const recentSongs = await prisma.song.findMany({
      take: 12,
      orderBy: { publishedAt: 'desc' },
      include: {
        artist: true,
        labels: {
          include: { label: true }
        }
      }
    })

    return { featuredSong, labels, recentSongs }
  }, 300)
}

export default async function Home() {
  const { featuredSong, labels, recentSongs } = await getHomePageData()

  const formattedSongs = recentSongs.map(song => ({
    id: song.id,
    title: song.title,
    slug: song.slug,
    artistName: song.artist.name,
    genre: song.genre,
    tempoBpm: song.tempoBpm,
    keyName: song.key,
    labels: song.labels
  }))

  return (
    <div className="bg-[var(--color-background)] text-[var(--color-on-surface)] font-body-md min-h-screen">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 glass-effect border-b border-[var(--color-outline-variant)]/30 px-gutter py-4">
        <div className="max-w-container-max mx-auto flex items-center justify-between gap-md">
          {/* Brand Identity */}
          <div className="flex items-center gap-sm shrink-0">
            <span className="font-headline-sm text-headline-sm font-bold text-[var(--color-primary)]">Trinity Chords</span>
          </div>
          
          {/* Search Bar Cluster */}
          <div className="flex-1 max-w-2xl relative group hidden md:flex items-center bg-[var(--color-surface-container-low)] rounded-full px-4 py-2 border border-[var(--color-outline-variant)]/20 focus-within:border-[var(--color-secondary)] transition-all">
            <span className="material-symbols-outlined text-[var(--color-on-surface-variant)] mr-2">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 w-full text-body-md placeholder:text-[var(--color-on-surface-variant)]/60 outline-none" 
              placeholder="Search songs, artists, or themes..." 
              type="text"
            />
            <button className="ml-2 p-1 hover:bg-[var(--color-surface-container-high)] rounded-full transition-colors">
              <span className="material-symbols-outlined text-[var(--color-secondary)]">mic</span>
            </button>
          </div>
          
          {/* Action Cluster */}
          <nav className="flex items-center gap-md">
            <div className="hidden lg:flex items-center gap-6 mr-4">
              <a className="font-label-md text-label-md text-[var(--color-secondary)] font-bold border-b-2 border-[var(--color-secondary)] pb-1" href="#">Songs</a>
              <a className="font-label-md text-label-md text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors" href="#">Theology</a>
              <a className="font-label-md text-label-md text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors" href="#">Community</a>
              <a className="font-label-md text-label-md text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors" href="#">Premium</a>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] rounded-full transition-all active:scale-95">
                <span className="material-symbols-outlined">language</span>
              </button>
              <button className="p-2 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] rounded-full transition-all relative active:scale-95">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-error)] rounded-full"></span>
              </button>
              <div className="w-10 h-10 rounded-full bg-[var(--color-secondary-container)] flex items-center justify-center overflow-hidden border-2 border-[var(--color-surface)] cursor-pointer">
                <span className="material-symbols-outlined text-[var(--color-on-secondary-container)]">person</span>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-gutter py-md space-y-xl">
        {/* Hero: Song of the Week */}
        {featuredSong && (
          <section className="relative overflow-hidden rounded-xl h-[450px] ambient-lift group">
            {/* Background Image with Blur */}
            <div 
              className="absolute inset-0 z-0 scale-105 transition-transform duration-700 group-hover:scale-100 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBbgB38UGO_WLgcI6WgYs5glsihI0GUj5RxEF3cmxZ24RvDLHOD32WjeC_bDWHFEyA1R8upNRzt1uxo-IQSqYGLlyGCcYgLZoKDCr4E4tbgszaEUH9rQujq99JRxpBsAXPxmvKyFQW6Lo8VO2j3k_gXKzkd4UvsbOq4uBJwB9ueANhoV_OsL8a2nmBfSrO6ywIebBbJCBbd-KgZfNlFkE_jEQVy5thBxPBiKUmol6_rgJwrnZG6MxaGzzcuxYZKb5U3BoFRF9KowUdU')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/90 via-[var(--color-primary)]/40 to-transparent"></div>
            </div>
            
            {/* Content Overlay */}
            <div className="relative z-10 h-full flex flex-col justify-end p-xl max-w-2xl text-white">
              <span className="inline-block px-3 py-1 bg-[var(--color-secondary)] text-[var(--color-on-secondary)] font-label-sm text-label-sm rounded-md mb-4 tracking-widest uppercase self-start">Featured Release</span>
              <h1 className="font-display-lg text-display-lg mb-2">{featuredSong.title}</h1>
              <p className="font-title-lg text-title-lg text-[var(--color-secondary-fixed)] mb-8 opacity-90">{featuredSong.artist.name} {featuredSong.genre ? `• ${featuredSong.genre}` : ''}</p>
              
              <div className="flex items-center gap-4">
                <Link href={`/songs/${featuredSong.slug}`}>
                  <button className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-[var(--color-on-secondary)] px-8 py-3 rounded-lg font-label-md flex items-center gap-2 transition-all transform hover:-translate-y-1 active:scale-95">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                    View Chords
                  </button>
                </Link>
                <button className="p-3 border border-white/30 hover:bg-white/10 rounded-lg transition-all active:scale-95">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
                <button className="p-3 border border-white/30 hover:bg-white/10 rounded-lg transition-all active:scale-95">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Category Horizontal Scroll */}
        <section className="space-y-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-[var(--color-primary)]">Discover Themes</h2>
            <a className="text-[var(--color-secondary)] font-label-md hover:underline" href="#">View All</a>
          </div>
          <div className="flex gap-sm overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
            <button className="whitespace-nowrap px-6 py-2 rounded-full bg-[var(--color-secondary)] text-[var(--color-on-secondary)] font-label-md transition-all shadow-md">All Songs</button>
            {labels.map(label => (
              <button key={label.id} className="whitespace-nowrap px-6 py-2 rounded-full bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)] transition-all font-label-md">
                {label.name}
              </button>
            ))}\
          </div>\
        </section>\
\
        {/* Filter Bar */}\
        <section className=\"flex flex-col md:flex-row items-center justify-between gap-md p-md bg-white rounded-xl ambient-lift border border-[var(--color-outline-variant)]/10\">\
          <div className=\"flex flex-wrap items-center gap-sm\">\
            <div className=\"relative\">\
              <select className=\"appearance-none bg-[var(--color-surface-container-low)] border-none rounded-lg px-4 py-2 pr-10 font-label-md text-[var(--color-on-surface-variant)] focus:ring-1 focus:ring-[var(--color-secondary)] cursor-pointer outline-none\">\
                <option>Language</option>\
                <option>English</option>\
                <option>Hindi</option>\
              </select>\
              <span className=\"material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] pointer-events-none\">expand_more</span>\
            </div>\
            <div className=\"relative\">\
              <select className=\"appearance-none bg-[var(--color-surface-container-low)] border-none rounded-lg px-4 py-2 pr-10 font-label-md text-[var(--color-on-surface-variant)] focus:ring-1 focus:ring-[var(--color-secondary)] cursor-pointer outline-none\">\
                <option>Artist</option>\
              </select>\
              <span className=\"material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] pointer-events-none\">expand_more</span>\
            </div>\
            <div className=\"relative\">\
              <select className=\"appearance-none bg-[var(--color-surface-container-low)] border-none rounded-lg px-4 py-2 pr-10 font-label-md text-[var(--color-on-surface-variant)] focus:ring-1 focus:ring-[var(--color-secondary)] cursor-pointer outline-none\">\
                <option>Genre</option>\
              </select>\
              <span className=\"material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] pointer-events-none\">expand_more</span>\
            </div>\
          </div>\
          \
          <div className=\"flex items-center gap-md\">\
            <span className=\"text-[var(--color-on-surface-variant)] font-label-sm\">{formattedSongs.length} Songs Found</span>\
            <div className=\"h-6 w-[1px] bg-[var(--color-outline-variant)]/30 hidden md:block\"></div>\
            <div className=\"flex items-center gap-2\">\
              <span className=\"text-[var(--color-on-surface-variant)] font-label-md\">Sort by:</span>\
              <select className=\"bg-transparent border-none font-bold text-[var(--color-secondary)] focus:ring-0 cursor-pointer outline-none\">\
                <option>Recent</option>\
                <option>Popular</option>\
                <option>A-Z</option>\
              </select>\
            </div>\
          </div>\
        </section>\
\
        {/* Song Card Grid */}\
        <section>\
          <Suspense fallback={<div className=\"py-10 text-center\">Loading songs...</div>}>\
            <SongGrid songs={formattedSongs} />\
          </Suspense>\
        </section>\
      </main>\
    </div>\
  )\n}\n"
        },
        {
          "path": "src/app/songs/[slug]/page.tsx",
          "content": "import { notFound } from \"next/navigation\"\nimport prisma from \"@/lib/prisma\"\nimport { getCachedData } from \"@/lib/redis\"\nimport { LyricAndChordSection } from \"@/components/songs/LyricAndChordSection\"\nimport Link from \"next/link\"\n\ninterface SongPageProps {\n  params: {\n    slug: string\n  }\n}\n\nexport default async function SongPage({ params }: SongPageProps) {\n  const { slug } = await params\n\n  const song = await getCachedData(`song:${slug}`, async () => {\n    return prisma.song.findUnique({\n      where: { slug },\n      include: {\n        artist: true,\n        lyrics: true,\n        chords: true,\n        videos: true,\n        labels: { include: { label: true } },\n      }\n    })\n  }, 600) // 10 minutes cache\n\n  if (!song) {\n    notFound()\n  }\n\n  const videos = song.videos || []\n  \n  // Custom video sources or mockup fallbacks\n  const liveSessionPlaceholderImg = \"https://lh3.googleusercontent.com/aida-public/AB6AXuDwx6yk-8VzcJRL2ihVnVFSkMMpYksUEK3CV606dtep1VR_MollbkIrdcjLwlldVn82jozbKyuwgSctjQ4iDMpT204_9yRQoswA0hhohz4Cf2lei01fJIKo5BCa3cYGHIi6eL3RqEJd6u2ndowjXN1gqQpPjr-Z4jP9hwDu6Cs-Tqe8DQdSd3rHPNZsqz1evO4ni6MmpdmAcWemw-fm1gwzUVroAOlhiAJW3rFTItL2WWuEqdEuCi41zmxORBoTJUuCPIX0U84-WJlY\"\n  const lyricVersionPlaceholderImg = \"https://lh3.googleusercontent.com/aida-public/AB6AXuBJQjXZabadRxL8PWdjpcCFh1zUOiwITDsmbaOplw4u8qrJJmOsiZyi2NnxuvBYL9kZ6_zg_Rb7nBLzi0FiuAEGMNJvzA07c5maQCzcZZmu1BmSzx6Un5avTfRo8Tr4qtBC5bPX8Kr5g9oKnfJ61akQMA_Aw8Dw6V9XQxXNP9h_qNvjpl7gDZb5gF08pgXxLTv1jr5IuHa6KoD8meTGguS1KAj5gudCvXOXuLPCBtzCobdBYClUSx_q3Q9L2fhQ_r-oI8-phn7tx14s\"\n\n  const liveSessionVideo = videos[0]\n  const lyricVersionVideo = videos[1]\n\n  const liveSessionImg = liveSessionVideo ? `https://img.youtube.com/vi/${liveSessionVideo.youtubeId}/hqdefault.jpg` : liveSessionPlaceholderImg\n  const liveSessionTitle = liveSessionVideo ? liveSessionVideo.title : \"Live Session\"\n  const liveSessionSub = liveSessionVideo ? \"Video Stream\" : \"Full Acoustic Performance\"\n  const liveSessionUrl = liveSessionVideo ? `https://youtube.com/watch?v=${liveSessionVideo.youtubeId}` : \"#\"\n\n  const lyricVersionImg = lyricVersionVideo ? `https://img.youtube.com/vi/${lyricVersionVideo.youtubeId}/hqdefault.jpg` : lyricVersionPlaceholderImg\n  const lyricVersionTitle = lyricVersionVideo ? lyricVersionVideo.title : \"Lyric Version\"\n  const lyricVersionSub = lyricVersionVideo ? \"Lyrics Video\" : \"Congregational Singalong\"\n  const lyricVersionUrl = lyricVersionVideo ? `https://youtube.com/watch?v=${lyricVersionVideo.youtubeId}` : \"#\"\n\n  const displayGenre = (song.genre || song.labels[0]?.label.name || \"WORSHIP ANTHEM\").toUpperCase()\n\n  return (\n    <div className=\"bg-[var(--color-background)] text-[var(--color-on-background)] font-body-md overflow-x-hidden min-h-screen flex flex-col pb-32\">\n      {/* Top Navigation Bar (Simplified for Details Page) */}\n      <header className=\"bg-[var(--color-surface)]/80 backdrop-blur-md sticky top-0 z-50 border-b border-[var(--color-outline-variant)]/30 px-margin-mobile py-4 shadow-sm\">\n        <div className=\"flex justify-between items-center max-w-container-max mx-auto w-full\">\n          <Link href=\"/\" className=\"text-[var(--color-primary)] active:scale-95 transition-transform flex items-center\">\n            <span className=\"material-symbols-outlined text-[28px]\">arrow_back_ios_new</span>\n          </Link>\n          <h1 className=\"font-headline-md text-headline-md text-[var(--color-primary)] font-bold\">Trinity Chords</h1>\n          <div className=\"flex gap-4 cursor-pointer text-[var(--color-on-surface-variant)]\">\n            <span className=\"material-symbols-outlined\">favorite</span>\n            <span className=\"material-symbols-outlined\">share</span>\n          </div>\n        </div>\n      </header>\n\n      <main className=\"flex flex-col gap-xl max-w-4xl mx-auto w-full pb-xl\">\n        {/* Song Header Section */}\n        <section className=\"px-margin-mobile pt-md\">\n          <div className=\"flex flex-col gap-xs\">\n            <span className=\"font-label-md text-label-md text-[var(--color-primary)] tracking-widest\">{displayGenre}</span>\n            <h2 className=\"font-headline-lg-mobile text-headline-lg-mobile text-[var(--color-on-surface)] font-bold\">{song.title}</h2>\n            <div className=\"flex items-center gap-sm mt-1\">\n              {song.key && (\n                <span className=\"bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-2 py-0.5 rounded-full font-label-sm text-label-sm\">{song.key}</span>\n              )}\n              {song.tempoBpm && (\n                <span className=\"bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)] px-2 py-0.5 rounded-full font-label-sm text-label-sm\">{song.tempoBpm} BPM</span>\n              )}\n              <span className=\"bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] px-2 py-0.5 rounded-full font-label-sm text-label-sm\">Original Key</span>\n            </div>\n          </div>\n        </section>\n\n        {/* Media Previews Section */}\n        <section className=\"px-margin-mobile flex flex-col md:grid md:grid-cols-2 gap-lg\">\n          {/* Live Session Video */}\n          <a href={liveSessionUrl} target=\"_blank\" rel=\"noopener noreferrer\" className=\"group relative rounded-xl overflow-hidden shadow-md bg-[var(--color-surface-container-lowest)] block\">\n            <div className=\"aspect-video bg-[var(--color-inverse-surface)] relative flex items-center justify-center\">\n              <img alt=\"Live Session Preview\" className=\"w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105\" src={liveSessionImg} />\n              <div className=\"absolute inset-0 flex items-center justify-center group-active:scale-90 transition-transform\">\n                <div className=\"bg-[var(--color-primary)]/90 text-[var(--color-on-primary)] w-16 h-16 rounded-full flex items-center justify-center shadow-lg\">\n                  <span className=\"material-symbols-outlined text-[40px]\" style={{ fontVariationSettings: \"'FILL' 1\" }}>play_arrow</span>\n                </div>\n              </div>\n            </div>\n            <div className=\"p-md flex justify-between items-center border-t border-[var(--color-outline-variant)]/10\">\n              <div>\n                <p className=\"font-label-md text-label-md text-[var(--color-on-surface)] font-bold uppercase\">{liveSessionTitle}</p>\n                <p className=\"font-body-sm text-body-sm text-[var(--color-on-surface-variant)]\">{liveSessionSub}</p>\n              </div>\n              <span className=\"material-symbols-outlined text-[var(--color-primary)]\">open_in_new</span>\n            </div>\n          </a>\n\n          {/* Lyric Version Video */}\n          <a href={lyricVersionUrl} target=\"_blank\" rel=\"noopener noreferrer\" className=\"group relative rounded-xl overflow-hidden shadow-md bg-[var(--color-surface-container-lowest)] block\">\n            <div className=\"aspect-video bg-[var(--color-inverse-surface)] relative flex items-center justify-center\">\n              <img alt=\"Lyric Version Preview\" className=\"w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105\" src={lyricVersionImg} />\n              <div className=\"absolute inset-0 flex items-center justify-center group-active:scale-90 transition-transform\">\n                <div className=\"bg-[var(--color-surface)]/90 text-[var(--color-primary)] w-12 h-12 rounded-full flex items-center justify-center shadow-lg\">\n                  <span className=\"material-symbols-outlined text-[32px]\" style={{ fontVariationSettings: \"'FILL' 1\" }}>play_circle</span>\n                </div>\n              </div>\n            </div>\n            <div className=\"p-md flex justify-between items-center border-t border-[var(--color-outline-variant)]/10\">\n              <div>\n                <p className=\"font-label-md text-label-md text-[var(--color-on-surface)] font-bold uppercase\">{lyricVersionTitle}</p>\n                <p className=\"font-body-sm text-body-sm text-[var(--color-on-surface-variant)]\">{lyricVersionSub}</p>\n              </div>\n              <span className=\"material-symbols-outlined text-[var(--color-primary)]\">playlist_add_check</span>\n            </div>\n          </a>\n        </section>\n\n        {/* Lyrics Section */}\n        <section className=\"px-margin-mobile\">\n          <LyricAndChordSection lyrics={song.lyrics} />\n        </section>\n\n        {/* Chord Diagrams Section */}\n        <section className=\"px-margin-mobile flex flex-col gap-lg\">\n          <h3 className=\"font-headline-md text-headline-md text-[var(--color-on-surface)] font-semibold\">Chord Guide</h3>\n          \n          {/* Guitar Chord Card */}\n          <div className=\"bg-white rounded-xl shadow-md p-lg border-l-4 border-[var(--color-primary)]\">\n            <div className=\"flex items-center gap-md mb-lg\">\n              <div className=\"bg-[var(--color-primary)]/10 text-[var(--color-primary)] p-3 rounded-lg\">\n                <span className=\"material-symbols-outlined\">straighten</span>\n              </div>\n              <div>\n                <h4 className=\"font-label-md text-label-md text-[var(--color-on-surface)] font-bold uppercase\">Guitar - {song.key || \"E Major\"}</h4>\n                <p className=\"font-body-sm text-body-sm text-[var(--color-on-surface-variant)]\">Standard Tuning</p>\n              </div>\n            </div>\n            <div className=\"flex justify-center py-4 bg-[var(--color-surface-bright)] rounded-lg border border-[var(--color-outline-variant)]/10\">\n              <div className=\"w-48\">\n                <div className=\"flex justify-between px-2 mb-2\">\n                  <span className=\"text-[10px] font-bold text-[var(--color-secondary)]\">E</span>\n                  <span className=\"text-[10px] font-bold text-[var(--color-secondary)]\">A</span>\n                  <span className=\"text-[10px] font-bold text-[var(--color-secondary)]\">D</span>\n                  <span className=\"text-[10px] font-bold text-[var(--color-secondary)]\">G</span>\n                  <span className=\"text-[10px] font-bold text-[var(--color-secondary)]\">B</span>\n                  <span className=\"text-[10px] font-bold text-[var(--color-secondary)]\">E</span>\n                </div>\n                <div className=\"relative h-40 border-x border-[var(--color-outline)]/30 flex flex-col justify-between\">\n                  <div className=\"fret-line\"></div>\n                  <div className=\"fret-line\"></div>\n                  <div className=\"fret-line\"></div>\n                  <div className=\"fret-line\"></div>\n                  <div className=\"fret-line\"></div>\n                  {/* Dots for E Major layout as visual style representation */}\n                  <div className=\"absolute top-[10%] left-[33%] chord-dot shadow-sm\"></div>\n                  <div className=\"absolute top-[30%] left-[17%] chord-dot shadow-sm\"></div>\n                  <div className=\"absolute top-[30%] left-[50%] chord-dot shadow-sm\"></div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          {/* Piano Chord Card */}\n          <div className=\"bg-white rounded-xl shadow-md p-lg border-l-4 border-[var(--color-tertiary)]\">\n            <div className=\"flex items-center gap-md mb-lg\">\n              <div className=\"bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] p-3 rounded-lg\">\n                <span className=\"material-symbols-outlined\">piano</span>\n              </div>\n              <div>\n                <h4 className=\"font-label-md text-label-md text-[var(--color-on-surface)] font-bold uppercase\">Piano - {song.key || \"E Major\"}</h4>\n                <p className=\"font-body-sm text-body-sm text-[var(--color-on-surface-variant)]\">Root Position</p>\n              </div>\n            </div>\n            <div className=\"flex justify-center py-4 bg-[var(--color-surface-bright)] rounded-lg border border-[var(--color-outline-variant)]/10 relative overflow-hidden\">\n              {/* Simplified Piano Keys Representation */}\n              <div className=\"flex gap-[1px] bg-[var(--color-outline-variant)]/30 p-[1px] relative\">\n                {/* White Keys */}\n                <div className=\"w-8 h-24 bg-white relative flex flex-col items-center justify-end pb-2\">\n                  <div className=\"w-3 h-3 bg-[var(--color-primary)] rounded-full absolute bottom-4\"></div>\n                  <span className=\"text-[8px] font-bold text-[var(--color-on-surface-variant)]\">E</span>\n                </div>\n                <div className=\"w-8 h-24 bg-white\"></div>\n                <div className=\"w-8 h-24 bg-white relative flex flex-col items-center justify-end pb-2\">\n                  <span className=\"text-[8px] font-bold text-[var(--color-on-surface-variant)]\">G</span>\n                </div>\n                <div className=\"w-8 h-24 bg-white\"></div>\n                <div className=\"w-8 h-24 bg-white relative flex flex-col items-center justify-end pb-2\">\n                  <div className=\"w-3 h-3 bg-[var(--color-primary)] rounded-full absolute bottom-4\"></div>\n                  <span className=\"text-[8px] font-bold text-[var(--color-on-surface-variant)]\">B</span>\n                </div>\n                <div className=\"w-8 h-24 bg-white\"></div>\n                <div className=\"w-8 h-24 bg-white\"></div>\n                {/* Black Keys (Simplified position) */}\n                <div className=\"absolute flex gap-10 mt-0 ml-10\">\n                  <div className=\"w-5 h-14 bg-[var(--color-inverse-surface)] rounded-b-sm\"></div>\n                  <div className=\"w-5 h-14 bg-[var(--color-inverse-surface)] rounded-b-sm relative\">\n                    <div className=\"w-3 h-3 bg-[var(--color-primary-fixed-dim)] rounded-full absolute bottom-2 left-1\"></div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </section>\n\n        {/* CTA Action Buttons */}\n        <section className=\"px-margin-mobile flex gap-md\">\n          <button className=\"flex-1 bg-[var(--color-primary)] text-[var(--color-on-primary)] py-4 rounded-xl font-label-md text-label-md flex items-center justify-center gap-sm active:scale-[0.98] transition-all shadow-md cursor-pointer\">\n            <span className=\"material-symbols-outlined\">download</span> DOWNLOAD PDF\n          </button>\n          <button className=\"flex-1 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] py-4 rounded-xl font-label-md text-label-md flex items-center justify-center gap-sm active:scale-[0.98] transition-all cursor-pointer\">\n            <span className=\"material-symbols-outlined\">queue_music</span> ADD TO SETLIST\n          </button>\n        </section>\n      </main>\n\n      {/* Footer for Mobile */}\n      <footer className=\"bg-[var(--color-surface)] border-t border-[var(--color-outline-variant)]/20 pt-xl pb-32\">\n        <div className=\"px-margin-mobile max-w-4xl mx-auto w-full\">\n          <h5 className=\"font-headline-sm text-headline-sm text-[var(--color-secondary)] font-bold mb-md\">Trinity Chords</h5>\n          <p className=\"font-body-md text-body-md text-[var(--color-on-surface-variant)] mb-lg\">© 2026 Trinity Chords. Spiritual Harmony, Modern Utility.</p>\n          <div className=\"grid grid-cols-2 gap-md\">\n            <a className=\"text-[var(--color-on-surface-variant)] font-label-sm text-label-sm\" href=\"#\">Privacy Policy</a>\n            <a className=\"text-[var(--color-on-surface-variant)] font-label-sm text-label-sm\" href=\"#\">Terms of Service</a>\n            <a className=\"text-[var(--color-on-surface-variant)] font-label-sm text-label-sm\" href=\"#\">Contact Us</a>\n            <a className=\"text-[var(--color-on-surface-variant)] font-label-sm text-label-sm\" href=\"#\">Donate</a>\n          </div>\n        </div>\n      </footer>\n\n      {/* Bottom Navigation Bar */}\n      <nav className=\"md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface)]/90 backdrop-blur-xl border-t border-[var(--color-outline-variant)]/20 px-gutter py-4 z-50 flex justify-between items-center shadow-[0_-4px_20px_rgba(15,23,42,0.05)]\">\n        <Link className=\"flex flex-col items-center gap-1 text-[var(--color-on-surface-variant)]\" href=\"/\">\n          <span className=\"material-symbols-outlined text-[24px]\">home</span>\n          <span className=\"font-label-sm text-label-sm\">Home</span>\n        </Link>\n        <a className=\"flex flex-col items-center gap-1 text-[var(--color-secondary)] font-bold\" href=\"#\">\n          <span className=\"material-symbols-outlined text-[24px]\" style={{ fontVariationSettings: \"'FILL' 1\" }}>queue_music</span>\n          <span className=\"font-label-sm text-label-sm\">Songs</span>\n        </a>\n        <div className=\"relative -top-8\">\n          <button className=\"bg-[var(--color-primary)] text-[var(--color-on-primary)] w-14 h-14 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer\">\n            <span className=\"material-symbols-outlined text-[32px]\">add</span>\n          </button>\n        </div>\n        <a className=\"flex flex-col items-center gap-1 text-[var(--color-on-surface-variant)]\" href=\"#\">\n          <span className=\"material-symbols-outlined text-[24px]\">library_music</span>\n          <span className=\"font-label-sm text-label-sm\">Library</span>\n        </a>\n        <a className=\"flex flex-col items-center gap-1 text-[var(--color-on-surface-variant)]\" href=\"#\">\n          <span className=\"material-symbols-outlined text-[24px]\">person</span>\n          <span className=\"font-label-sm text-label-sm\">Profile</span>\n        </a>\n      </nav>\n    </div>\n  )\n}\n