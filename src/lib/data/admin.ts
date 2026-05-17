import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { CommercialStatus, PublicationStatus, Profile } from '@/types'

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
