import { createClient } from '@/lib/supabase/server'
import type { CommercialStatus, SiteSettings } from '@/types'

export type FeaturedProject = {
  id: string
  slug: string
  name: string
  short_description: string | null
  location_city: string
  location_zone: string | null
  price_base_cop: number | null
  price_visible: boolean
  area_m2: number | null
  bedrooms: number | null
  bathrooms: number | null
  parking_spaces: number | null
  commercial_status: CommercialStatus
  published_at: string | null
  mainImage: { public_url: string; alt_text: string | null } | null
}

type RawProject = Omit<FeaturedProject, 'mainImage'> & {
  project_media: Array<{
    public_url: string
    alt_text: string | null
    is_main: boolean
  }>
}

export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('projects')
      .select(
        `id, slug, name, short_description, location_city, location_zone,
         price_base_cop, price_visible, area_m2, bedrooms, bathrooms,
         parking_spaces, commercial_status, published_at,
         project_media ( public_url, alt_text, is_main )`
      )
      .eq('publication_status', 'publicado')
      .is('deleted_at', null)
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(4)

    if (error || !data) return []

    return (data as unknown as RawProject[]).map(({ project_media, ...rest }) => ({
      ...rest,
      mainImage: project_media?.find((m) => m.is_main) ?? null,
    }))
  } catch {
    return []
  }
}

export type PublicProject = FeaturedProject

type PublicProjectFilters = {
  estado?: CommercialStatus
  precio_min?: number
  precio_max?: number
  orden?: 'recientes' | 'precio_asc' | 'precio_desc'
}

export async function getPublicProjects(
  filters: PublicProjectFilters = {}
): Promise<PublicProject[]> {
  try {
    const supabase = createClient()

    let query = supabase
      .from('projects')
      .select(
        `id, slug, name, short_description, location_city, location_zone,
         price_base_cop, price_visible, area_m2, bedrooms, bathrooms,
         parking_spaces, commercial_status, published_at,
         project_media ( public_url, alt_text, is_main )`
      )
      .eq('publication_status', 'publicado')
      .is('deleted_at', null)

    if (filters.estado) {
      query = query.eq('commercial_status', filters.estado)
    }

    if (filters.precio_min !== undefined) {
      query = query.eq('price_visible', true).gte('price_base_cop', filters.precio_min)
    }

    if (filters.precio_max !== undefined) {
      query = query.eq('price_visible', true).lte('price_base_cop', filters.precio_max)
    }

    if (filters.orden === 'precio_asc') {
      query = query.order('price_base_cop', { ascending: true })
    } else if (filters.orden === 'precio_desc') {
      query = query.order('price_base_cop', { ascending: false })
    } else {
      query = query.order('published_at', { ascending: false })
    }

    const { data, error } = await query

    if (error || !data) return []

    return (data as unknown as RawProject[]).map(({ project_media, ...rest }) => ({
      ...rest,
      mainImage: project_media?.find((m) => m.is_main) ?? null,
    }))
  } catch {
    return []
  }
}

export type ProjectDetailMedia = {
  id: string
  public_url: string
  alt_text: string | null
  is_main: boolean
  sort_order: number
}

export type ProjectDetailAmenity = {
  id: string
  name: string
  sort_order: number
}

export type ProjectDetail = {
  id: string
  slug: string
  name: string
  short_description: string | null
  description: string | null
  location_city: string
  location_zone: string | null
  price_base_cop: number | null
  price_visible: boolean
  area_m2: number | null
  bedrooms: number | null
  bathrooms: number | null
  parking_spaces: number | null
  commercial_status: CommercialStatus
  published_at: string | null
  media: ProjectDetailMedia[]
  amenities: ProjectDetailAmenity[]
}

type RawProjectDetail = Omit<ProjectDetail, 'media' | 'amenities'> & {
  project_media: Array<ProjectDetailMedia & { deleted_at: string | null }>
  project_amenities: ProjectDetailAmenity[]
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('projects')
      .select(
        `id, slug, name, short_description, description, location_city, location_zone,
         price_base_cop, price_visible, area_m2, bedrooms, bathrooms,
         parking_spaces, commercial_status, published_at,
         project_media ( id, public_url, alt_text, is_main, sort_order, deleted_at ),
         project_amenities ( id, name, sort_order )`
      )
      .eq('slug', slug)
      .eq('publication_status', 'publicado')
      .is('deleted_at', null)
      .single()

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('getProjectBySlug:', error.code, error.message)
      }
      return null
    }
    if (!data) return null

    const raw = data as unknown as RawProjectDetail

    return {
      ...raw,
      media: (raw.project_media ?? [])
        .filter((m) => m.deleted_at === null)
        .sort((a, b) => a.sort_order - b.sort_order),
      amenities: (raw.project_amenities ?? []).sort(
        (a, b) => a.sort_order - b.sort_order
      ),
    }
  } catch {
    return null
  }
}

export async function getPublishedSlugs(): Promise<string[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('slug')
      .eq('publication_status', 'publicado')
      .is('deleted_at', null)

    if (error || !data) return []
    return data.map((r: { slug: string }) => r.slug)
  } catch {
    return []
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single<SiteSettings>()

    if (error) return null
    return data
  } catch {
    return null
  }
}
