'use client'

import { useState, useTransition } from 'react'
import { Loader2, CheckCircle2, X } from 'lucide-react'
import { changeStatus } from '../actions'

export type VisibleStatus = 'borrador' | 'publicado' | 'oculto'

const SELECT_CLS: Record<VisibleStatus, string> = {
  publicado: 'bg-green-100 text-green-700 border-green-200 focus:ring-green-300',
  borrador: 'bg-rp-gray-100 text-rp-gray-700 border-rp-gray-200 focus:ring-rp-gray-300',
  oculto: 'bg-amber-100 text-amber-700 border-amber-200 focus:ring-amber-300',
}

type UiStatus = 'idle' | 'pending' | 'success' | 'error'

export default function StatusQuickChange({
  id,
  status: initial,
}: {
  id: string
  status: VisibleStatus
}) {
  const [current, setCurrent] = useState<VisibleStatus>(initial)
  const [uiStatus, setUiStatus] = useState<UiStatus>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function handleChange(val: VisibleStatus) {
    const prev = current
    setCurrent(val)
    setUiStatus('pending')
    setErrorMsg(null)

    startTransition(async () => {
      const { error } = await changeStatus(id, 'publication_status', val)
      if (error) {
        setCurrent(prev)
        setUiStatus('error')
        setErrorMsg(error)
      } else {
        setUiStatus('success')
        setTimeout(() => setUiStatus('idle'), 1000)
      }
    })
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value as VisibleStatus)}
        disabled={uiStatus === 'pending'}
        className={`text-xs font-semibold rounded-full px-2.5 py-0.5 border cursor-pointer focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${SELECT_CLS[current]}`}
      >
        <option value="borrador">Borrador</option>
        <option value="publicado">Publicado</option>
        <option value="oculto">Oculto</option>
      </select>

      {uiStatus === 'pending' && (
        <Loader2
          size={16}
          className="animate-spin text-rp-gray-400 shrink-0"
          aria-label="Guardando…"
        />
      )}
      {uiStatus === 'success' && (
        <CheckCircle2
          size={16}
          className="text-green-600 shrink-0"
          aria-label="Guardado"
        />
      )}
      {uiStatus === 'error' && (
        <span
          title={errorMsg ?? 'Error al actualizar el estado'}
          className="cursor-help"
          aria-label={errorMsg ?? 'Error'}
        >
          <X size={16} className="text-red-500 shrink-0" />
        </span>
      )}
    </div>
  )
}
