import Link from 'next/link'
import { Globe, TrendingUp, HardHat, Star } from 'lucide-react'
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-rp-black">Dashboard</h1>
        <p className="text-sm text-rp-gray-500 capitalize mt-1">{fecha}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          label="Proyectos publicados"
          value={stats.porPublicacion.publicado}
          icon={<Globe size={20} className="text-rp-red" />}
        />
        <MetricCard
          label="En preventa"
          value={stats.porEstado.preventa}
          icon={<TrendingUp size={20} className="text-rp-red" />}
        />
        <MetricCard
          label="En obra"
          value={stats.porEstado.en_obra}
          icon={<HardHat size={20} className="text-rp-red" />}
        />
        <MetricCard
          label="Destacados en Home"
          value={stats.destacados}
          icon={<Star size={20} className="text-rp-red" />}
        />
      </div>

      <div className="bg-white rounded-xl border border-rp-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-rp-gray-200">
          <h2 className="font-semibold text-rp-black">Estado de proyectos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-rp-gray-100 text-rp-gray-500">
                <th className="text-left px-6 py-3 font-medium">Estado comercial</th>
                <th className="text-center px-4 py-3 font-medium">Publicados</th>
                <th className="text-center px-4 py-3 font-medium">Ocultos</th>
                <th className="text-center px-4 py-3 font-medium">Borradores</th>
                <th className="text-center px-4 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rp-gray-200">
              {stats.tabla.map((row) => (
                <tr key={row.commercial_status} className="hover:bg-rp-gray-100/50">
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

      <div>
        <Link
          href="/admin/proyectos"
          className="inline-flex items-center gap-2 bg-rp-red text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-rp-red-dark transition-colors"
        >
          Ir a proyectos →
        </Link>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-rp-gray-200 p-6 flex items-start gap-4">
      <div className="p-2 bg-rp-red-light rounded-lg shrink-0">{icon}</div>
      <div>
        <p className="text-3xl font-bold text-rp-red">{value}</p>
        <p className="text-sm text-rp-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}
