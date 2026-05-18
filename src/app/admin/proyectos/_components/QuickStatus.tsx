'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { changeStatus } from '../actions'
import type { PublicationStatus } from '@/types'

const SELECT_CLS: Record<PublicationStatus, string> = {
  publicado: 'bg-green-100 text-green-700 border-green-200',
  borrador: 'bg-rp-gray-100 text-rp-gray-700 border-rp-gray-200',
  oculto: 'bg-amber-100 text-amber-700 border-amber-200',
  archivado: 'bg-red-100 text-red-700 border-red-200',
}

export default function QuickStatus({
  id,
  status: initial,
}: {
  id: string
  status: PublicationStatus
}) {
  const router = useRouter()
  const [status, setStatus] = useState(initial)
  const [isPending, startTransition] = useTransition()

  function handleChange(val: PublicationStatus) {
    const prev = status
    setStatus(val)
    startTransition(async () => {
      const { error } = await changeStatus(id, 'publication_status', val)
      if (error) setStatus(prev)
      else router.refresh()
    })
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as PublicationStatus)}
      disabled={isPending}
      className={`text-xs font-semibold rounded-full px-2.5 py-0.5 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-rp-red/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${SELECT_CLS[status]}`}
    >
      <option value="borrador">Borrador</option>
      <option value="publicado">Publicado</option>
      <option value="oculto">Oculto</option>
      <option value="archivado">Archivado</option>
    </select>
  )
}
