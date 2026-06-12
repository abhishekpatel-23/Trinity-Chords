import Link from "next/link"
import { LayoutDashboard, Music, ListTodo, Flag, Users, FileWarning, Tag, Mic2 } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  
  // Protect all /admin routes
  if (!session || session.user?.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex h-screen bg-[#030813] text-[#fcf8f9] overflow-hidden font-sans">
      {/* Dark Sidebar Layout */}
      <aside className="w-64 flex flex-col bg-[#1a202c] border-r border-[#313031]">
        <div className="p-6 border-b border-[#313031]">
          <h2 className="text-xl font-serif font-bold text-[#c0a080]">Trinity Admin</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <SidebarLink href="/admin" icon={<LayoutDashboard size={20} />} label="Analytics" />
          <SidebarLink href="/admin/songs" icon={<Music size={20} />} label="Songs" />
          <SidebarLink href="/admin/requests" icon={<ListTodo size={20} />} label="Requests" />
          <SidebarLink href="/admin/reports" icon={<FileWarning size={20} />} label="Reports" />
          <SidebarLink href="/admin/artists" icon={<Mic2 size={20} />} label="Artists" />
          <SidebarLink href="/admin/labels" icon={<Tag size={20} />} label="Labels" />
          <SidebarLink href="/admin/users" icon={<Users size={20} />} label="Users" />
          <SidebarLink href="/admin/feature-flags" icon={<Flag size={20} />} label="Feature Flags" />
        </nav>
        <div className="p-4 border-t border-[#313031]">
          <div className="text-sm text-[#828796] mb-2">Logged in as Admin</div>
          <Link href="/" className="text-sm text-[#c1c6d7] hover:text-white transition-colors">
            ← Back to Main Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#030813] p-8">
        {children}
      </main>
    </div>
  )
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 rounded-md text-[#c1c6d7] hover:bg-[#313031] hover:text-white transition-colors"
    >\
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  )
}
