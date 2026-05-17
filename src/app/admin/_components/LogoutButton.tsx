'use client'

import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors w-full"
    >
      <LogOut size={14} />
      Cerrar sesión
    </button>
  )
}
