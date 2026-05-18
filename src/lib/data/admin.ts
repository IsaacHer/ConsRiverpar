import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { CommercialStatus, PublicationStatus, Profile } from '@/types'

export type CreateProjectInput = {
  name: string
  short_description?: string | null
  location_city: string
  location_zone?: string | null
  address_reference?: string | null
  price_base_cop?: number | null
  price_visible: boolean
  bedrooms?: number | null
  bathrooms?: number | null
  parking_spaces?: number | null
  area_m2?: number | null
  stratum?: number | null
  commercial_status: CommercialStatus
  publication_status: PublicationStatus
  featured: boolean
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export type AdminProject = {
  id: string
  slug: string
  name: string
  commercial_status: CommercialStatus
  publication_status: PublicationStatus
  featured: boolean
  published_at: string | null
  created_at: string
  deleted_at: string | null
}

type RawProject = {
  commercial_status: CommercialStatus
  publication_status: PublicationStatus
  featured: boolean
  deleted_at: string | null
}

export type TablaRow = {
  commercial_status: CommercialStatus
  publicado: number
  oculto: number
  borrador: number
  archivado: number
  total: number
}

export type AdminStats = {
  total: number
  porEstado: Record<CommercialStatus, number>
  porPublicacion: Record<PublicationStatus, number>
  destacados: number
  tabla: TablaRow[]
}

const EMPTY_STATS: AdminStats = {
  total: 0,
  porEstado: { preventa: 0, en_obra: 0, listo_entrega: 0, vendido: 0 },
  porPublicacion: { borrador: 0, publicado: 0, oculto: 0, archivado: 0 },
  destacados: 0,
  tabla: [],
}

const COMMERCIAL_STATUSES: CommercialStatus[] = ['preventa', 'en_obra', 'listo_entrega', 'vendido']

export async function getAdminProjects(): Promise<AdminProject[]> {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('projects')
      .select(
        'id, slug, name, commercial_status, publication_status, featured, published_at, created_at, deleted_at'
      )
      .order('created_at', { ascending: false })

    if (error || !data) return []
    return data as AdminProject[]
  } catch {
    return []
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('projects')
      .select('commercial_status, publication_status, featured, deleted_at')

    if (error || !data) return EMPTY_STATS

    const active = (data as RawProject[]).filter((p) => p.deleted_at === null)

    const tabla: TablaRow[] = COMMERCIAL_STATUSES.map((cs) => ({
      commercial_status: cs,
      publicado: active.filter((p) => p.commercial_status === cs && p.publication_status === 'publicado').length,
      oculto: active.filter((p) => p.commercial_status === cs && p.publication_status === 'oculto').length,
      borrador: active.filter((p) => p.commercial_status === cs && p.publication_status === 'borrador').length,
      archivado: active.filter((p) => p.commercial_status === cs && p.publication_status === 'archivado').length,
      total: active.filter((p) => p.commercial_status === cs).length,
    }))

    return {
      total: active.length,
      porEstado: {
        preventa: active.filter((p) => p.commercial_status === 'preventa').length,
        en_obra: active.filter((p) => p.commercial_status === 'en_obra').length,
        listo_entrega: active.filter((p) => p.commercial_status === 'listo_entrega').length,
        vendido: active.filter((p) => p.commercial_status === 'vendido').length,
      },
      porPublicacion: {
        borrador: active.filter((p) => p.publication_status === 'borrador').length,
        publicado: active.filter((p) => p.publication_status === 'publicado').length,
        oculto: active.filter((p) => p.publication_status === 'oculto').length,
        archivado: active.filter((p) => p.publication_status === 'archivado').length,
      },
      destacados: active.filter((p) => p.featured && p.publication_status === 'publicado').length,
      tabla,
    }
  } catch {
    return EMPTY_STATS
  }
}

export async function createProject(
  input: CreateProjectInput
): Promise<{ project: AdminProject | null; error: string | null }> {
  try {
    const supabase = createServiceClient()

    const baseSlug = toSlug(input.name)
    let slug = baseSlug
    let suffix = 2

    for (;;) {
      const { data: existing } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      if (!existing) break
      slug = `${baseSlug}-${suffix++}`
    }

    const publishedAt = input.publication_status === 'publicado' ? new Date().toISOString() : null

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: input.name,
        slug,
        short_description: input.short_description ?? null,
        location_city: input.location_city,
        location_zone: input.location_zone ?? null,
        address_reference: input.address_reference ?? null,
        price_base_cop: input.price_base_cop ?? null,
        price_visible: input.price_visible,
        bedrooms: input.bedrooms ?? null,
        bathrooms: input.bathrooms ?? null,
        parking_spaces: input.parking_spaces ?? null,
        area_m2: input.area_m2 ?? null,
        stratum: input.stratum ?? null,
        commercial_status: input.commercial_status,
        publication_status: input.publication_status,
        featured: input.featured,
        published_at: publishedAt,
      })
      .select(
        'id, slug, name, commercial_status, publication_status, featured, published_at, created_at, deleted_at'
      )
      .single()

    if (error) return { project: null, error: error.message }
    return { project: data as AdminProject, error: null }
  } catch {
    return { project: null, error: 'Error al crear el proyecto. Intenta de nuevo.' }
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser()
    if (!user) return null

    const { data } = await createServiceClient()
      .from('profiles')
      .select('id, full_name, email, role, is_active')
      .eq('id', user.id)
      .single<Profile>()

    return data ?? null
  } catch {
    return null
  }
}
