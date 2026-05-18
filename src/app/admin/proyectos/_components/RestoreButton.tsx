'use client'

import { useState, useTransition } from 'react'
import { RotateCcw, Loader2 } from 'lucide-react'
import { restoreProjectAction } from '../actions'

export default function RestoreButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    if (
      !window.confirm(
        '¿Recuperar este proyecto? Volverá al listado en estado Borrador y podrás editarlo y publicarlo nuevamente.'
      )
    )
      return
    setError(null)
    startTransition(async () => {
      const result = await restoreProjectAction(id)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <span className="flex flex-col items-start gap-0.5">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        title="Recuperar proyecto — vuelve a Borrador"
      >
        {isPending ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
        {isPending ? 'Recuperando...' : 'Recuperar'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  )
}
