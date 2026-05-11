import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, priority: 1.0, changeFrequency: 'weekly' },
  { url: `${BASE_URL}/proyectos`, priority: 0.9, changeFrequency: 'daily' },
  { url: `${BASE_URL}/nosotros`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/contacto`, priority: 0.6, changeFrequency: 'monthly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('publication_status', 'publicado')
      .is('deleted_at', null)

    const projectRoutes: MetadataRoute.Sitemap = (data ?? []).map(
      (row: { slug: string; updated_at: string | null }) => ({
        url: `${BASE_URL}/proyectos/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
        priority: 0.8,
        changeFrequency: 'weekly' as const,
      })
    )

    return [...STATIC_ROUTES, ...projectRoutes]
  } catch {
    return STATIC_ROUTES
  }
}
