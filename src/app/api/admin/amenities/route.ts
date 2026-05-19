import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { addAmenity } from '@/lib/data/admin'

async function getAdminUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await createServiceClient()
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single()
  if (!profile || profile.role !== 'admin' || !profile.is_active) return null
  return user
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAdminUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { projectId, name } = (await req.json()) as {
      projectId?: string
      name?: string
    }
    if (!projectId || !name?.trim()) {
      return NextResponse.json({ error: 'projectId y name requeridos' }, { status: 400 })
    }

    const { id, error } = await addAmenity(projectId, name)
    if (error) return NextResponse.json({ error }, { status: 500 })

    return NextResponse.json({ id })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
