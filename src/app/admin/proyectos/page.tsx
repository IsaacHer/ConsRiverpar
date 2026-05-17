import Link from 'next/link'
import { Star, Pencil, ExternalLink, Plus } from 'lucide-react'
import { getAdminProjects } from '@/lib/data/admin'
import Badge from '@/components/ui/Badge'
import SuccessBanner from './_components/SuccessBanner'
import type { PublicationStatus } from '@/types'

const PILL: Record<PublicationStatus, string> = {
  publicado: 'bg-green-100 text-green-700',
  borrador: 'bg-rp-gray-100 text-rp-gray-700',
  oculto: 'bg-amber-100 text-amber-700',
  archivado: 'bg-red-100 text-red-700',
}
const PILL_LABEL: Record<PublicationStatus, string> = {
  publicado: 'Publicado',
  borrador: 'Borrador',
  oculto: 'Oculto',
  archivado: 'Archivado',
}

const TABS: { label: string; value: PublicationStatus | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Publicado', value: 'publicado' },
  { label: 'Borrador', value: 'borrador' },
  { label: 'Oculto', value: 'oculto' },
  { label: 'Archivado', value: 'archivado' },
]

const VALID_ESTADOS = ['publicado', 'borrador', 'oculto', 'archivado'] as const
type ValidEstado = (typeof VALID_ESTADOS)[number]

function isValidEstado(s: string | undefined): s is ValidEstado {
  return s !== undefined && (VALID_ESTADOS as readonly string[]).includes(s)
}

export default async function ProyectosPage({
  searchParams,
}: {
  searchParams: { estado?: string; creado?: string }
}) {
  const proyectos = await getAdminProjects()
  const estadoFiltro = isValidEstado(searchParams.estado) ? searchParams.estado : undefined
  const creado = searchParams.creado === '1'

  const filtrados = estadoFiltro
    ? proyectos.filter((p) => p.publication_status === estadoFiltro)
    : proyectos

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-rp-black">Proyectos</h1>
        <Link
          href="/admin/proyectos/nuevo"
          className="inline-flex items-center gap-2 bg-rp-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rp-red-dark transition-colors"
        >
          <Plus size={15} />
          Nuevo proyecto
        </Link>
      </div>

      {/* Success banner */}
      {creado && <SuccessBanner message="Proyecto creado correctamente." />}

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(({ label, value }) => {
          const active = (estadoFiltro ?? 'todos') === value
          const href =
            value === 'todos' ? '/admin/proyectos' : `/admin/proyectos?estado=${value}`
          return (
            <Link
              key={value}
              href={href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active
                  ? 'bg-rp-black text-white'
                  : 'bg-white border border-rp-gray-200 text-rp-gray-700 hover:border-rp-black'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* Table */}
      {filtrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-rp-gray-200 p-12 text-center space-y-4">
          <p className="text-rp-gray-500">No hay proyectos en esta categoría.</p>
          <Link
            href="/admin/proyectos/nuevo"
            className="inline-flex items-center gap-2 bg-rp-red text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-rp-red-dark transition-colors"
          >
            <Plus size={15} />
            Crear primer proyecto
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-rp-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-rp-gray-100 text-rp-gray-500 text-left">
                  <th className="px-5 py-3 font-medium">Proyecto</th>
                  <th className="px-4 py-3 font-medium">Estado comercial</th>
                  <th className="px-4 py-3 font-medium">Publicación</th>
                  <th className="px-4 py-3 font-medium text-center">★</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rp-gray-200">
                {filtrados.map((p) => {
                  const deleted = p.deleted_at !== null
                  const fecha = new Date(p.created_at).toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-rp-gray-100/40 transition-colors ${deleted ? 'opacity-50' : ''}`}
                    >
                      <td className="px-5 py-3">
                        <p className="font-medium text-rp-black">{p.name}</p>
                        <p className="text-xs text-rp-gray-500 font-mono">{p.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={p.commercial_status} />
                      </td>
                      <td className="px-4 py-3">
                        {deleted ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Eliminado
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PILL[p.publication_status]}`}
                          >
                            {PILL_LABEL[p.publication_status]}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {p.featured && (
                          <Star size={14} className="text-amber-400 fill-amber-400 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-rp-gray-500">{fecha}</td>
                      <td className="px-4 py-3">
                        {deleted ? null : (
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/admin/proyectos/${p.id}/editar`}
                              className="inline-flex items-center gap-1 text-rp-gray-500 hover:text-rp-black transition-colors"
                            >
                              <Pencil size={13} />
                              Editar
                            </Link>
                            <Link
                              href={`/proyectos/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-rp-gray-500 hover:text-rp-black transition-colors"
                            >
                              <ExternalLink size={13} />
                              Ver en vitrina
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
