import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ProjectForm from '../_components/ProjectForm'

export default function NuevoProyectoPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-rp-gray-500 mb-3">
          <Link href="/admin" className="hover:text-rp-black transition-colors">Admin</Link>
          <ChevronRight size={12} />
          <Link href="/admin/proyectos" className="hover:text-rp-black transition-colors">Proyectos</Link>
          <ChevronRight size={12} />
          <span className="text-rp-black">Nuevo</span>
        </nav>
        <h1 className="text-2xl font-semibold text-rp-black">Nuevo proyecto</h1>
      </div>

      <ProjectForm mode="create" />
    </div>
  )
}
