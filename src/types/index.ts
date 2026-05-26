export type CommercialStatus =
  | 'preventa'
  | 'en_obra'
  | 'listo_entrega'
  | 'vendido'

export type PublicationStatus =
  | 'borrador'
  | 'publicado'
  | 'oculto'
  | 'archivado'

export type MediaType =
  | 'imagen'
  | 'render'
  | 'plano'
  | 'brochure'
  | 'otro'

export interface Project {
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
  stratum: number | null
  commercial_status: CommercialStatus
  publication_status: PublicationStatus
  featured: boolean
  published_at: string | null
}

export interface ProjectMedia {
  id: string
  project_id: string
  media_type: MediaType
  r2_key: string
  public_url: string
  alt_text: string | null
  sort_order: number
  is_main: boolean
  mime_type: string | null
  size_bytes: number | null
}

export interface ProjectAmenity {
  id: string
  project_id: string
  name: string
  sort_order: number
}

export interface SiteSettings {
  id: string
  company_name: string
  contact_whatsapp: string | null
  contact_email: string | null
  address: string | null
  seo_title: string | null
  seo_description: string | null
  updated_at?: string
}

export interface Profile {
  id: string
  full_name: string
  email: string
  role: 'admin'
  is_active: boolean
}
