import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default async function AdminSongsPage() {
  const songs = await prisma.song.findMany({
    orderBy: { publishedAt: 'desc' },
    include: { artist: true },
    take: 50 // Simplified for demonstration
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold">Songs Manager</h1>
        <Link href="/admin/songs/new">
          <Button className="bg-[#c0a080] text-[#1a202c] hover:bg-[#a68868]">
            <Plus size={16} className="mr-2" />
            Add Song
          </Button>
        </Link>
      </div>

      <div className="bg-[#1a202c] border border-[#313031] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#313031] flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#828796]" size={16} />
            <Input 
              placeholder="Search songs..." 
              className="pl-9 h-9 bg-[#030813] border-[#313031] text-white"
            />
          </div>
          <Button variant="outline" size="sm" className="border-[#313031] text-[#c1c6d7]">
            Filters
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-[#030813] text-[#828796] border-b border-[#313031]">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Artist</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date Added</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#313031]">
              {songs.map((song) => (
                <tr key={song.id} className="hover:bg-[#313031]/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{song.title}</td>
                  <td className="px-6 py-4 text-[#c1c6d7]">{song.artist.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${song.isFeatured ? 'bg-[#c0a080]/20 text-[#c0a080]' : 'bg-[#313031] text-[#828796]'}`}>
                      {song.isFeatured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#828796]">
                    {new Date(song.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#c1c6d7] hover:text-white">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#ba1a1a] hover:bg-[#ba1a1a]/10">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
