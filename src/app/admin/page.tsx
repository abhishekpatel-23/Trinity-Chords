import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboardPage() {
  const [totalSongs, totalUsers, pendingRequests, reports] = await Promise.all([
    prisma.song.count(),
    prisma.user.count(),
    prisma.songRequest.count({ where: { status: 'Pending' } }),
    prisma.report.count({ where: { status: 'Open' } })
  ])

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Songs" value={totalSongs} />
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Pending Requests" value={pendingRequests} alert={pendingRequests > 0} />
        <StatCard title="Open Reports" value={reports} alert={reports > 0} />
      </div>

      <div className="bg-[#1a202c] border border-[#313031] rounded-lg p-8 h-96 flex items-center justify-center">
        <p className="text-[#828796] text-center">
          Chart visualizations will be rendered here using Recharts.<br/>
          (e.g., Page Views over time, User Growth)
        </p>
      </div>
    </div>
  )
}

function StatCard({ title, value, alert = false }: { title: string; value: number; alert?: boolean }) {
  return (
    <div className={`bg-[#1a202c] border rounded-lg p-6 ${alert ? 'border-[#ba1a1a]' : 'border-[#313031]'}`}>
      <h3 className="text-sm font-medium text-[#828796] uppercase tracking-wider mb-2">{title}</h3>
      <div className={`text-4xl font-bold ${alert ? 'text-[#ffdad6]' : 'text-white'}`}>
        {value.toLocaleString()}
      </div>
    </div>
  )
}
