import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { SiteSettings } from '@/types'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single<SiteSettings>()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  )
}
