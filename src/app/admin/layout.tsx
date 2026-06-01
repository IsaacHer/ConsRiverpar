import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/data/admin'
import SidebarNav from './_components/SidebarNav'
import LogoutButton from './_components/LogoutButton'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-rp-gray-100">
      <aside className="w-60 bg-rp-black flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="px-6 py-5 border-b border-white/10">
          <span className="font-display text-white text-xl tracking-wide">RIVERPAR</span>
          <p className="text-white/40 text-xs mt-0.5">Panel administrativo</p>
        </div>

        <SidebarNav />

        <div className="p-4 border-t border-white/10">
          <p className="text-white/80 text-sm font-medium truncate">{profile.full_name}</p>
          <p className="text-white/40 text-xs truncate mb-3">{profile.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 ml-60">
        <div className="p-8 min-h-screen">{children}</div>
      </main>
    </div>
  )
}
