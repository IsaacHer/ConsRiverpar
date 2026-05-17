'use client'

import { useState } from 'react'
import { LogOut, Loader2 } from 'lucide-react'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors w-full disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <LogOut size={14} />
      )}
      {loading ? 'Cerrando sesión…' : 'Cerrar sesión'}
    </button>
  )
}
