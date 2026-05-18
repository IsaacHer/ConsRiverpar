'use client'

import { useState, useTransition } from 'react'
import { Trash, Loader2 } from 'lucide-react'
import { permanentlyDeleteAction } from '../actions'

export default function PermanentDeleteButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    if (
      !window.confirm(
        `¿Eliminar permanentemente "${name}"?\n\nEsta acción NO se puede deshacer. El proyecto y todos sus registros serán borrados definitivamente de la base de datos.`
      )
    )
      return
    setError(null)
    startTransition(async () => {
      const result = await permanentlyDeleteAction(id)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <span className="flex flex-col items-start gap-0.5">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-1 text-red-700 hover:text-red-900 font-medium transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        title="Eliminar permanentemente — acción irreversible"
      >
        {isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash size={12} />}
        {isPending ? 'Eliminando...' : 'Borrar definitivo'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  )
}
