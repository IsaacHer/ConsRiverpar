'use client'

import { useRef, useState, useCallback } from 'react'
import { Upload, CheckCircle2, X, AlertCircle, RefreshCw } from 'lucide-react'
import type { ProjectMedia } from '@/types'

type UploadStep = 'idle' | 'presigning' | 'uploading' | 'confirming' | 'success' | 'error'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

const STEP_LABELS: Record<'presigning' | 'uploading' | 'confirming', string> = {
  presigning: 'Preparando...',
  uploading: 'Subiendo...',
  confirming: 'Registrando...',
}

const STEP_WIDTH: Record<'presigning' | 'uploading' | 'confirming', string> = {
  presigning: 'w-1/3',
  uploading: 'w-2/3',
  confirming: 'w-full',
}

type Props = {
  projectId: string
  onUploadComplete: (media: Pick<ProjectMedia, 'id' | 'public_url' | 'is_main' | 'sort_order'>) => void
  disabled?: boolean
}

export default function ImageUploader({ projectId, onUploadComplete, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<UploadStep>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Solo se permiten imágenes JPEG, PNG o WebP.'
    }
    if (file.size > MAX_SIZE) {
      return 'El archivo supera el límite de 5 MB.'
    }
    return null
  }

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setErrorMsg(validationError)
        setStep('error')
        return
      }

      setErrorMsg(null)
      setPreviewUrl(URL.createObjectURL(file))

      try {
        // Step 1: get presigned URL
        setStep('presigning')
        const presignRes = await fetch('/api/admin/uploads/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, mimeType: file.type, sizeBytes: file.size }),
        })
        const presignData = await presignRes.json()
        if (!presignRes.ok) throw new Error(presignData.error ?? 'Error al preparar la subida')
        const { uploadUrl, r2Key } = presignData as { uploadUrl: string; r2Key: string }

        // Step 2: PUT to R2 via XHR for real progress
        setStep('uploading')
        setUploadProgress(0)
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('PUT', uploadUrl)
          xhr.setRequestHeader('Content-Type', file.type)
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setUploadProgress(Math.round((e.loaded / e.total) * 100))
            }
          }
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve()
            else reject(new Error(`Error al subir el archivo (${xhr.status})`))
          }
          xhr.onerror = () => reject(new Error('Error de red al subir el archivo'))
          xhr.send(file)
        })

        // Step 3: confirm in DB
        setStep('confirming')
        const confirmRes = await fetch('/api/admin/uploads/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, r2Key, mimeType: file.type, sizeBytes: file.size }),
        })
        const confirmData = await confirmRes.json()
        if (!confirmRes.ok) throw new Error(confirmData.error ?? 'Error al registrar la imagen')

        setStep('success')
        onUploadComplete(confirmData.media)
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Error desconocido')
        setStep('error')
      }
    },
    [projectId, onUploadComplete]
  )

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function reset() {
    setStep('idle')
    setErrorMsg(null)
    setUploadProgress(0)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
  }

  const isActive = step === 'presigning' || step === 'uploading' || step === 'confirming'
  const isDisabled = disabled || isActive

  if (step === 'success' && previewUrl) {
    return (
      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-green-200 bg-green-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Imagen subida" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <CheckCircle2 className="text-white" size={36} />
        </div>
        <button
          onClick={reset}
          className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1 transition-colors"
          title="Subir otra imagen"
        >
          <X size={14} className="text-rp-black" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => !isDisabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!isDisabled) setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={!isDisabled ? handleDrop : undefined}
        className={`relative flex flex-col items-center justify-center gap-2 w-full h-40 rounded-xl border-2 border-dashed transition-colors ${
          isDisabled
            ? 'border-rp-gray-200 bg-rp-gray-100 cursor-not-allowed'
            : isDragOver
            ? 'border-rp-red bg-red-50 cursor-copy'
            : 'border-rp-gray-300 bg-white hover:border-rp-red hover:bg-red-50 cursor-pointer'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleInputChange}
          disabled={isDisabled}
        />

        {isActive ? (
          <div className="flex flex-col items-center gap-3 w-full px-8">
            <p className="text-sm text-rp-gray-500">
              {STEP_LABELS[step as 'presigning' | 'uploading' | 'confirming']}
            </p>
            <div className="w-full h-1.5 bg-rp-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-rp-red rounded-full transition-all duration-300 ${
                  step === 'uploading'
                    ? ''
                    : STEP_WIDTH[step as 'presigning' | 'confirming']
                }`}
                style={step === 'uploading' ? { width: `${uploadProgress}%` } : undefined}
              />
            </div>
            {step === 'uploading' && (
              <p className="text-xs text-rp-gray-400">{uploadProgress}%</p>
            )}
          </div>
        ) : (
          <>
            <Upload size={24} className="text-rp-gray-400" />
            <div className="text-center">
              <p className="text-sm text-rp-gray-600 font-medium">
                Arrastra una imagen o haz clic
              </p>
              <p className="text-xs text-rp-gray-400">JPEG, PNG, WebP · máx. 5 MB</p>
            </div>
          </>
        )}
      </div>

      {step === 'error' && errorMsg && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={14} className="shrink-0" />
          <span className="flex-1">{errorMsg}</span>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 underline"
          >
            <RefreshCw size={12} />
            Reintentar
          </button>
        </div>
      )}
    </div>
  )
}
