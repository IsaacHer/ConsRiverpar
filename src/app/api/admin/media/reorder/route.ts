import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { updateMediaOrder } from '@/lib/data/admin'

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

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAdminUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { updates } = (await req.json()) as {
      updates?: { id: string; sort_order: number }[]
    }
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'updates requerido' }, { status: 400 })
    }

    const { error } = await updateMediaOrder(updates)
    if (error) return NextResponse.json({ error }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
