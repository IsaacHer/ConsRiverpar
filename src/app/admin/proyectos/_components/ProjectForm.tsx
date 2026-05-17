'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Loader2, Check } from 'lucide-react'
import { createProject } from '../actions'
import type { CommercialStatus, PublicationStatus } from '@/types'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function formatCOP(value: string): string {
  const n = Number(value)
  if (!value || isNaN(n)) return ''
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

const inputCls =
  'w-full border border-rp-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rp-red/20 focus:border-rp-red transition-colors bg-white'
const inputErrCls =
  'w-full border border-red-400 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-colors bg-white'
const labelCls = 'block text-sm font-medium text-rp-gray-700 mb-1.5'
const sectionTitleCls = 'text-xs font-semibold text-rp-gray-500 uppercase tracking-wider'

type Props = { mode: 'create' }

export default function ProjectForm({ mode: _ }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Field state
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [shortDesc, setShortDesc] = useState('')
  const [priceHint, setPriceHint] = useState('')
  const [priceVisible, setPriceVisible] = useState(true)
  const [featured, setFeatured] = useState(false)
  const [commercialStatus, setCommercialStatus] = useState<CommercialStatus>('preventa')
  const [publicationStatus, setPublicationStatus] = useState<PublicationStatus>('borrador')

  // onBlur validation errors
  const [nameErr, setNameErr] = useState<string | null>(null)
  const [slugErr, setSlugErr] = useState<string | null>(null)
  const [cityErr, setCityErr] = useState<string | null>(null)

  function handleNameChange(value: string) {
    setName(value)
    if (nameErr && value.trim()) setNameErr(null)
    if (!slugTouched) setSlug(toSlug(value))
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true)
    setSlug(toSlug(value))
    if (slugErr && value.trim()) setSlugErr(null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    // Validate required fields before submitting
    let hasErr = false
    if (!name.trim()) { setNameErr('El nombre es requerido'); hasErr = true }
    if (!slug.trim()) { setSlugErr('El slug es requerido'); hasErr = true }
    const city = (fd.get('location_city') as string).trim()
    if (!city) { setCityErr('La ciudad es requerida'); hasErr = true }
    if (hasErr) return

    const num = (key: string): number | null => {
      const v = fd.get(key) as string
      return v ? Number(v) : null
    }
    const str = (key: string): string | null => {
      const v = (fd.get(key) as string).trim()
      return v || null
    }

    setSubmitError(null)

    startTransition(async () => {
      const result = await createProject({
        name: name.trim(),
        short_description: shortDesc.trim() || null,
        location_city: city,
        location_zone: str('location_zone'),
        address_reference: str('address_reference'),
        price_base_cop: num('price_base_cop'),
        price_visible: priceVisible,
        bedrooms: num('bedrooms'),
        bathrooms: num('bathrooms'),
        parking_spaces: num('parking_spaces'),
        area_m2: num('area_m2'),
        stratum: num('stratum'),
        commercial_status: commercialStatus,
        publication_status: publicationStatus,
        featured,
      })

      if (result.error) {
        setSubmitError(result.error)
      } else {
        router.push('/admin/proyectos?creado=1')
      }
    })
  }

  const featuredDisabled = publicationStatus !== 'publicado'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Identificación */}
      <section className="bg-white rounded-xl border border-rp-gray-200 p-6 space-y-5">
        <p className={sectionTitleCls}>Identificación</p>

        <div>
          <label className={labelCls}>
            Nombre del proyecto <span className="text-rp-red">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={() => { if (!name.trim()) setNameErr('El nombre es requerido') }}
            className={nameErr ? inputErrCls : inputCls}
            placeholder="Ej. Conjunto Residencial El Nogal"
          />
          {nameErr && <p className="text-xs text-red-500 mt-1">{nameErr}</p>}
        </div>

        <div>
          <label className={labelCls}>
            Slug <span className="text-rp-red">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            onBlur={() => { if (!slug.trim()) setSlugErr('El slug es requerido') }}
            className={slugErr ? inputErrCls : inputCls}
            placeholder="conjunto-residencial-el-nogal"
          />
          {slugErr ? (
            <p className="text-xs text-red-500 mt-1">{slugErr}</p>
          ) : (
            <p className="text-xs text-rp-gray-500 mt-1.5 font-mono">
              /proyectos/<span className="text-rp-black">{slug || '…'}</span>
            </p>
          )}
        </div>

        <div>
          <label className={labelCls}>Descripción corta</label>
          <textarea
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value.slice(0, 200))}
            className={inputCls}
            rows={3}
            placeholder="Breve descripción del proyecto (máx. 200 caracteres)"
          />
          <p className="text-xs text-rp-gray-500 mt-1 text-right">{shortDesc.length}/200</p>
        </div>
      </section>

      {/* Ubicación */}
      <section className="bg-white rounded-xl border border-rp-gray-200 p-6 space-y-5">
        <p className={sectionTitleCls}>Ubicación</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>
              Ciudad <span className="text-rp-red">*</span>
            </label>
            <input
              type="text"
              name="location_city"
              defaultValue="Cúcuta"
              onBlur={(e) => {
                if (!e.target.value.trim()) setCityErr('La ciudad es requerida')
                else setCityErr(null)
              }}
              className={cityErr ? inputErrCls : inputCls}
            />
            {cityErr && <p className="text-xs text-red-500 mt-1">{cityErr}</p>}
          </div>
          <div>
            <label className={labelCls}>Zona / Barrio</label>
            <input
              type="text"
              name="location_zone"
              className={inputCls}
              placeholder="Ej. El Llano"
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Referencia de dirección</label>
          <input
            type="text"
            name="address_reference"
            className={inputCls}
            placeholder="Ej. Calle 10 # 5-30, frente al parque"
          />
        </div>
      </section>

      {/* Especificaciones comerciales */}
      <section className="bg-white rounded-xl border border-rp-gray-200 p-6 space-y-5">
        <p className={sectionTitleCls}>Especificaciones comerciales</p>

        <div className="space-y-3">
          <div>
            <label className={labelCls}>Precio base (COP)</label>
            <input
              type="number"
              name="price_base_cop"
              min="0"
              step="1000000"
              className={inputCls}
              placeholder="150000000"
              onChange={(e) => setPriceHint(formatCOP(e.target.value))}
            />
            {priceHint && (
              <p className="text-xs text-rp-gray-500 mt-1.5 font-mono">{priceHint}</p>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none w-fit rounded-lg px-3 py-2.5 border border-rp-gray-200 hover:border-rp-gray-400 hover:bg-rp-gray-100 transition-colors duration-150">
            <span
              className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors duration-150 ${
                priceVisible ? 'bg-rp-red border-rp-red' : 'bg-white border-rp-gray-300'
              }`}
            >
              {priceVisible && (
                <Check size={12} strokeWidth={3} className="text-white" aria-hidden="true" />
              )}
            </span>

            <input
              type="checkbox"
              checked={priceVisible}
              onChange={(e) => setPriceVisible(e.target.checked)}
              className="sr-only"
              aria-label="Precio visible en vitrina"
            />

            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-rp-gray-700">
                Precio visible en vitrina
              </span>
              <span className="text-xs text-rp-gray-500">
                {priceVisible
                  ? 'El visitante verá el precio en pesos'
                  : 'El visitante verá "Consultar precio"'}
              </span>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div>
            <label className={labelCls}>Habitaciones</label>
            <input type="number" name="bedrooms" min="0" max="20" className={inputCls} placeholder="3" />
          </div>
          <div>
            <label className={labelCls}>Baños</label>
            <input type="number" name="bathrooms" min="0" max="20" className={inputCls} placeholder="2" />
          </div>
          <div>
            <label className={labelCls}>Parqueaderos</label>
            <input type="number" name="parking_spaces" min="0" max="10" className={inputCls} placeholder="1" />
          </div>
          <div>
            <label className={labelCls}>Área (m²)</label>
            <input type="number" name="area_m2" min="0" step="0.01" className={inputCls} placeholder="85.5" />
          </div>
        </div>

        <div className="w-36">
          <label className={labelCls}>Estrato</label>
          <select name="stratum" className={inputCls + ' cursor-pointer'}>
            <option value="">— Sin definir</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Estados */}
      <section className="bg-white rounded-xl border border-rp-gray-200 p-6 space-y-5">
        <p className={sectionTitleCls}>Estados</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Estado comercial</label>
            <select
              value={commercialStatus}
              onChange={(e) => setCommercialStatus(e.target.value as CommercialStatus)}
              className={inputCls + ' cursor-pointer'}
            >
              <option value="preventa">Preventa</option>
              <option value="en_obra">En obra</option>
              <option value="listo_entrega">Listo para entrega</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Estado de publicación</label>
            <select
              value={publicationStatus}
              onChange={(e) => {
                const val = e.target.value as PublicationStatus
                setPublicationStatus(val)
                if (val !== 'publicado') setFeatured(false)
              }}
              className={inputCls + ' cursor-pointer'}
            >
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicado</option>
              <option value="oculto">Oculto</option>
              <option value="archivado">Archivado</option>
            </select>
          </div>
        </div>

        <div
          title={featuredDisabled ? 'Requiere estado Publicado' : undefined}
          className="w-fit"
        >
          <label
            className={`flex items-center gap-3 select-none ${
              featuredDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
          >
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              disabled={featuredDisabled}
              className="w-4 h-4 rounded accent-rp-red disabled:cursor-not-allowed"
            />
            <span className="text-sm font-medium text-rp-gray-700">Destacado en Home</span>
          </label>
        </div>
      </section>

      {/* Submit error callout */}
      {submitError && (
        <div className="flex items-start gap-3 bg-red-50 border-l-4 border-l-rp-red rounded-r-lg px-4 py-3">
          <AlertCircle size={16} className="text-rp-red mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-900">{submitError}</p>
        </div>
      )}

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-10 bg-rp-gray-100 border-t border-rp-gray-200 -mx-8 px-8 py-4">
        <div className="flex items-center gap-5">
          <Link
            href="/admin/proyectos"
            className="text-sm text-rp-gray-500 hover:text-rp-black transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-rp-red text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-rp-red-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {isPending ? 'Guardando…' : 'Guardar proyecto'}
          </button>
        </div>
      </div>
    </form>
  )
}
