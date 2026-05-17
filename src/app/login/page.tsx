import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Acceso administrativo — Riverpar SAS',
}

export default async function LoginPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/admin')
  }

  return <LoginForm />
}
