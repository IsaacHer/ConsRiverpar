import Link from 'next/link'
import { Globe, TrendingUp, HardHat, Star, AlertCircle, Plus } from 'lucide-react'
import { getAdminStats } from '@/lib/data/admin'
import type { CommercialStatus } from '@/types'

const ESTADO_LABELS: Record<CommercialStatus, string> = {
  preventa: 'Preventa',
  en_obra: 'En obra',
  listo_entrega: 'Listo para entrega',
  vendido: 'Vendido',
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  const fecha = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const empty = stats.total === 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-rp-black">Dashboard</h1>
          <p className="text-sm text-rp-gray-500 capitalize mt-1">{fecha}</p>
        </div>
        <Link
          href="/admin/proyectos/nuevo"
          className="inline-flex items-center gap-2 bg-rp-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rp-red-dark transition-colors shrink-0"
        >
          <Plus size={15} />
          Nuevo proyecto
        </Link>
      </div>

      {/* Empty state */}
      {empty && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Aún no hay proyectos</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Crea tu primer proyecto para comenzar a gestionar el catálogo.
            </p>
            <Link
              href="/admin/proyectos/nuevo"
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-800 underline underline-offset-2 mt-2"
            >
              Crear primer proyecto →
            </Link>
          </div>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Proyectos publicados"
          value={stats.porPublicacion.publicado}
          icon={<Globe size={18} className="text-green-600" />}
          iconBg="bg-green-100"
        />
        <MetricCard
          label="En preventa"
          value={stats.porEstado.preventa}
          icon={<TrendingUp size={18} className="text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <MetricCard
          label="En obra"
          value={stats.porEstado.en_obra}
          icon={<HardHat size={18} className="text-amber-600" />}
          iconBg="bg-amber-100"
        />
        <MetricCard
          label="Destacados en Home"
          value={stats.destacados}
          icon={<Star size={18} className="text-rp-red" />}
          iconBg="bg-rp-red-light"
        />
      </div>

      {/* Summary table */}
      <div className="bg-white rounded-xl border border-rp-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-rp-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-rp-black">Estado de proyectos</h2>
          <Link
            href="/admin/proyectos"
            className="text-sm text-rp-gray-500 hover:text-rp-black transition-colors"
          >
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-rp-gray-100 text-left">
                <th className="px-6 py-3 font-medium text-rp-gray-500">Estado comercial</th>
                <th className="px-4 py-3 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Publicados
                  </span>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    Ocultos
                  </span>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rp-gray-100 text-rp-gray-700">
                    Borradores
                  </span>
                </th>
                <th className="px-4 py-3 text-center font-medium text-rp-gray-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rp-gray-200">
              {stats.tabla.map((row) => (
                <tr key={row.commercial_status} className="hover:bg-rp-gray-100/40 transition-colors">
                  <td className="px-6 py-3 font-medium text-rp-black">
                    {ESTADO_LABELS[row.commercial_status]}
                  </td>
                  <td className="px-4 py-3 text-center text-rp-gray-700">{row.publicado}</td>
                  <td className="px-4 py-3 text-center text-rp-gray-700">{row.oculto}</td>
                  <td className="px-4 py-3 text-center text-rp-gray-700">{row.borrador}</td>
                  <td className="px-4 py-3 text-center font-semibold text-rp-black">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
  iconBg,
}: {
  label: string
  value: number
  icon: React.ReactNode
  iconBg: string
}) {
  return (
    <div className="bg-white rounded-xl border border-rp-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-start gap-4">
      <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>
      <div>
        <p className="text-3xl font-bold text-rp-red">{value}</p>
        <p className="text-sm text-rp-gray-500 mt-1">{label}</p>
      </div>
    </div>
  )
}
