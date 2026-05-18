'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle2 } from 'lucide-react'

export default function SuccessBanner({ message }: { message: string }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 4000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={15} className="shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Cerrar"
        className="text-green-600 hover:text-green-900 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}
