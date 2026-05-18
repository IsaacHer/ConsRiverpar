'use server'

import { createProject as _createProject } from '@/lib/data/admin'
import type { CreateProjectInput } from '@/lib/data/admin'

export async function createProject(input: CreateProjectInput) {
  return _createProject(input)
}
