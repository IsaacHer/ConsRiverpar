'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2, Info, Loader2, X } from 'lucide-react'
import { saveSiteSettings } from '../actions'
import type { SiteSettings } from '@/types'
import type { SiteSettingsInput } from '@/lib/data/admin'

const inputCls =
  'w-full border border-rp-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rp-red/20 focus:border-rp-red transition-colors bg-white disabled:bg-rp-gray-100 disabled:cursor-not-allowed'
const inputErrCls =
  'w-full border border-red-400 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-colors bg-white'
const labelCls = 'block text-sm font-medium text-rp-gray-700 mb-1.5'
const sectionTitleCls = 'text-xs font-semibold text-rp-gray-500 uppercase tracking-wider'

type Props = {
  settings: SiteSettings | null
}

export default function ConfigForm({ settings }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [companyName, setCompanyName] = useState(settings?.company_name ?? '')
  const [whatsapp, setWhatsapp] = useState(settings?.contact_whatsapp ?? '')
  const [email, setEmail] = useState(settings?.contact_email ?? '')
  const [address, setAddress] = useState(settings?.address ?? '')
  const [seoTitle, setSeoTitle] = useState(settings?.seo_title ?? '')
  const [seoDesc, setSeoDesc] = useState(settings?.seo_description ?? '')

  const [companyNameErr, setCompanyNameErr] = useState<string | null>(null)

  useEffect(() => {
    if (!settings) return
    setCompanyName(settings.company_name ?? '')
    setWhatsapp(settings.contact_whatsapp ?? '')
    setEmail(settings.contact_email ?? '')
    setAddress(settings.address ?? '')
    setSeoTitle(settings.seo_title ?? '')
    setSeoDesc(settings.seo_description ?? '')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.updated_at])

  useEffect(() => {
    if (!savedSuccess) return
    const t = setTimeout(() => setSavedSuccess(false), 5000)
    return () => clearTimeout(t)
  }, [savedSuccess])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!companyName.trim()) {
      setCompanyNameErr('El nombre de la empresa es requerido')
      return
    }
    setSubmitError(null)

    const payload: SiteSettingsInput = {
      company_name: companyName,
      contact_whatsapp: whatsapp || null,
      contact_email: email || null,
      address: address || null,
      seo_title: seoTitle || null,
      seo_description: seoDesc || null,
    }

    startTransition(async () => {
      const result = await saveSiteSettings(settings!.id, payload)
      if (result.error) {
        setSubmitError(result.error)
      } else {
        setSavedSuccess(true)
        router.refresh()
      }
    })
  }

  if (!settings) {
    return (
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
        <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-red-800">
            No se encontró la configuración del sitio.
          </p>
          <p className="text-sm text-red-700 mt-1">
            Contacta al desarrollador para inicializar la tabla site_settings.
          </p>
        </div>
      </div>
    )
  }

  const seoTitleLen = seoTitle.length
  const seoTitleColor =
    seoTitleLen >= 50 && seoTitleLen <= 60 ? 'text-green-600' : 'text-amber-600'

  const seoDescLen = seoDesc.length
  const seoDescColor =
    seoDescLen >= 150 && seoDescLen <= 160 ? 'text-green-600' : 'text-amber-600'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedSuccess && (
        <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="shrink-0" aria-hidden="true" />
            <span>Configuración guardada. Los cambios ya son visibles en el sitio.</span>
          </div>
          <button
            type="button"
            onClick={() => setSavedSuccess(false)}
            aria-label="Cerrar"
            className="text-green-600 hover:text-green-900 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* EMPRESA */}
      <section className="bg-white rounded-xl border border-rp-gray-200 p-6 space-y-5">
        <p className={sectionTitleCls}>Empresa</p>

        <div>
          <label className={labelCls}>
            Nombre de la empresa <span className="text-rp-red">*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value)
              if (companyNameErr && e.target.value.trim()) setCompanyNameErr(null)
            }}
            onBlur={() => {
              if (!companyName.trim()) setCompanyNameErr('El nombre de la empresa es requerido')
            }}
            className={companyNameErr ? inputErrCls : inputCls}
            placeholder="Constructora Riverpar SAS"
            disabled={isPending}
          />
          {companyNameErr ? (
            <p className="text-xs text-red-500 mt-1">{companyNameErr}</p>
          ) : (
            <p className="text-xs text-rp-gray-500 mt-1.5">
              Aparece en el footer, página Nosotros y metadatos SEO.
            </p>
          )}
        </div>
      </section>

      {/* CONTACTO */}
      <section className="bg-white rounded-xl border border-rp-gray-200 p-6 space-y-5">
        <p className={sectionTitleCls}>Contacto</p>

        <div>
          <label className={labelCls}>Número de WhatsApp</label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className={inputCls}
            placeholder="+573001234567"
            disabled={isPending}
          />
          <p className="text-xs text-rp-gray-500 mt-1.5">
            Incluye el código de país. Ej: +573001234567
          </p>
          <div className="flex items-start gap-2 mt-2">
            <Info size={13} className="text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-blue-700">
              Este número se usa en el botón Contactar asesor de todos los proyectos.
            </p>
          </div>
        </div>

        <div>
          <label className={labelCls}>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            placeholder="info@riverpar.com"
            disabled={isPending}
          />
          <p className="text-xs text-rp-gray-500 mt-1.5">Visible en la página de Contacto.</p>
        </div>

        <div>
          <label className={labelCls}>Dirección</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputCls}
            placeholder="Cúcuta, Norte de Santander, Colombia"
            disabled={isPending}
          />
          <p className="text-xs text-rp-gray-500 mt-1.5">
            Aparece en el footer y página de Contacto con enlace a Google Maps.
          </p>
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white rounded-xl border border-rp-gray-200 p-6 space-y-5">
        <p className={sectionTitleCls}>SEO — Posicionamiento en Google</p>

        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <Info size={14} className="text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-blue-700">
            Los cambios de SEO pueden tardar hasta 48 horas en reflejarse en los resultados de Google.
          </p>
        </div>

        <div>
          <label className={labelCls}>Título SEO</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className={inputCls}
            placeholder="Riverpar SAS — Constructora"
            disabled={isPending}
          />
          <div className="flex items-start justify-between gap-4 mt-1.5">
            <p className="text-xs text-rp-gray-500">
              Aparece en la pestaña del navegador y en Google.
            </p>
            <p
              className={`text-xs font-mono shrink-0 ${
                seoTitleLen === 0 ? 'text-rp-gray-400' : seoTitleColor
              }`}
            >
              {seoTitleLen}{' '}
              <span className="text-rp-gray-400">/ 50–60</span>
            </p>
          </div>
        </div>

        <div>
          <label className={labelCls}>Descripción SEO</label>
          <textarea
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
            className={inputCls}
            rows={3}
            placeholder="Proyectos residenciales de alta calidad..."
            disabled={isPending}
          />
          <div className="flex items-start justify-between gap-4 mt-1.5">
            <p className="text-xs text-rp-gray-500">
              Aparece en los resultados de Google bajo el título.
            </p>
            <p
              className={`text-xs font-mono shrink-0 ${
                seoDescLen === 0 ? 'text-rp-gray-400' : seoDescColor
              }`}
            >
              {seoDescLen}{' '}
              <span className="text-rp-gray-400">/ 150–160</span>
            </p>
          </div>
        </div>
      </section>

      {submitError && (
        <div className="flex items-start gap-3 bg-red-50 border-l-4 border-l-rp-red rounded-r-lg px-4 py-3">
          <AlertCircle size={16} className="text-rp-red mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-900">{submitError}</p>
        </div>
      )}

      <div className="flex items-center pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-rp-red text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-rp-red-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
