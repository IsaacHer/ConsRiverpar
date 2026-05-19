import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generatePresignedUrl, generateR2Key } from '@/lib/r2'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data: profile } = await createServiceClient()
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin' || !profile.is_active) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const { projectId, mimeType, sizeBytes } = body as {
      projectId?: string
      mimeType?: string
      sizeBytes?: number
    }

    if (!projectId || typeof projectId !== 'string') {
      return NextResponse.json({ error: 'projectId requerido' }, { status: 400 })
    }
    if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
    }
    if (!sizeBytes || sizeBytes <= 0 || sizeBytes > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Tamaño de archivo inválido (máx. 5 MB)' }, { status: 400 })
    }

    const { data: project } = await createServiceClient()
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .maybeSingle()

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    const ext = mimeType === 'application/pdf' ? 'pdf'
      : mimeType === 'image/png' ? 'png'
      : mimeType === 'image/webp' ? 'webp'
      : 'jpg'

    const fakeFileName = `upload.${ext}`
    const r2Key = generateR2Key(projectId, fakeFileName)
    const uploadUrl = await generatePresignedUrl(r2Key, mimeType)

    return NextResponse.json({ uploadUrl, r2Key, expiresInSeconds: 300, method: 'PUT' })
  } catch (err) {
    console.error('[presign] error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
