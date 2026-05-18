'use client'

import { useState, useTransition } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { archiveProjectAction } from '../actions'

export default function ArchiveButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    if (
      !window.confirm(
        '¿Eliminar este proyecto? Desaparecerá de la vitrina y quedará en la pestaña Eliminados del panel. Esta acción no borra el registro permanentemente.'
      )
    )
      return
    setError(null)
    startTransition(async () => {
      const result = await archiveProjectAction(id)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <span className="flex flex-col items-start gap-0.5">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-1 text-red-400 hover:text-red-600 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        title="Eliminación lógica — el registro permanece en la base de datos y puede recuperarse desde Supabase"
      >
        {isPending ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Trash2 size={12} />
        )}
        {isPending ? 'Eliminando...' : 'Eliminar'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  )
}
