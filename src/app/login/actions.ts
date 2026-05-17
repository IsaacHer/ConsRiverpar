'use server'

import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = (formData.get('email') as string)?.trim()
  const password = (formData.get('password') as string)?.trim()

  if (!email || !password) {
    return { error: 'Completa todos los campos para continuar.' }
  }

  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    const msg = error?.message ?? ''

    if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
      return { error: 'El correo o la contraseña son incorrectos.' }
    }
    if (msg.includes('Email not confirmed')) {
      return { error: 'Debes confirmar tu correo antes de iniciar sesión.' }
    }
    if (msg.includes('Too many requests')) {
      return { error: 'Demasiados intentos fallidos. Espera unos minutos e intenta de nuevo.' }
    }
    return { error: 'No se pudo iniciar sesión. Intenta de nuevo.' }
  }

  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_active')
    .eq('id', data.user.id)
    .single()

  if (!profile || !profile.is_active) {
    await supabase.auth.signOut()
    return { error: 'Esta cuenta no tiene acceso al panel administrativo. Contacta al administrador.' }
  }

  redirect('/admin')
}
