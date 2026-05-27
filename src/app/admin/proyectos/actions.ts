'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createProject as _createProject,
  updateProject as _updateProject,
  updateProjectStatus as _updateProjectStatus,
  archiveProject as _archiveProject,
  restoreProject as _restoreProject,
  permanentlyDeleteProject as _permanentlyDelete,
} from '@/lib/data/admin'
import type { CreateProjectInput } from '@/lib/data/admin'

function revalidateAdminPaths(id?: string) {
  revalidatePath('/admin/proyectos', 'page')
  revalidatePath('/admin', 'page')
  if (id) {
    revalidatePath(`/admin/proyectos/${id}/editar`, 'page')
  }
}

export async function createProject(input: CreateProjectInput) {
  return _createProject(input)
}

export async function updateProject(id: string, input: CreateProjectInput) {
  const result = await _updateProject(id, input)
  if (!result.error) revalidateAdminPaths(id)
  return result
}

export async function changeStatus(
  id: string,
  field: 'publication_status' | 'commercial_status' | 'featured',
  value: string | boolean
) {
  const result = await _updateProjectStatus(id, field, value)
  if (!result.error) revalidateAdminPaths(id)
  return result
}

export async function archiveProjectAction(id: string) {
  const result = await _archiveProject(id)
  if (!result.error) redirect('/admin/proyectos?estado=eliminado')
  return result
}

export async function restoreProjectAction(id: string) {
  const result = await _restoreProject(id)
  if (!result.error) redirect('/admin/proyectos?estado=eliminado&restaurado=1')
  return result
}

export async function permanentlyDeleteAction(id: string) {
  const result = await _permanentlyDelete(id)
  if (!result.error) redirect('/admin/proyectos?estado=eliminado&borrado=1')
  return result
}
