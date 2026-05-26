import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { MediaType } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const service = createServiceClient()

    const { data: profile } = await service
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin' || !profile.is_active) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const { projectId, r2Key, mimeType, sizeBytes, altText, mediaType } = body as {
      projectId?: string
      r2Key?: string
      mimeType?: string
      sizeBytes?: number
      altText?: string
      mediaType?: MediaType
    }

    if (!projectId || !r2Key || !mimeType) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE_URL ?? ''
    const publicUrl = `${cdnBase}/${r2Key}`

    const { data: existing } = await service
      .from('project_media')
      .select('id, sort_order, is_main')
      .eq('project_id', projectId)
      .is('deleted_at', null)
      .order('sort_order', { ascending: false })
      .limit(1)

    const hasActiveImages = existing && existing.length > 0
    const isMain = !hasActiveImages
    const sortOrder = hasActiveImages ? (existing[0].sort_order ?? 0) + 1 : 0

    const { data, error } = await service
      .from('project_media')
      .insert({
        project_id: projectId,
        r2_key: r2Key,
        public_url: publicUrl,
        media_type: mediaType ?? 'imagen',
        mime_type: mimeType,
        size_bytes: sizeBytes ?? null,
        alt_text: altText ?? null,
        sort_order: sortOrder,
        is_main: isMain,
      })
      .select('id, public_url, is_main, sort_order')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ media: data })
  } catch (err) {
    console.error('[confirm] error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
