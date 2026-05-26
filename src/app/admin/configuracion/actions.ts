"use server"

import { revalidatePath } from "next/cache"
import {
  getSiteSettingsAdmin,
  updateSiteSettings,
  type SiteSettingsInput
} from "@/lib/data/admin"

export async function saveSiteSettings(
  id: string,
  input: SiteSettingsInput
) {
  const result = await updateSiteSettings(id, input)
  if (!result.error) {
    // Revalida la vitrina publica para que refleje
    // inmediatamente los nuevos datos de contacto y SEO
    revalidatePath("/", "layout")
    revalidatePath("/admin/configuracion", "page")
  }
  return result
}

export { getSiteSettingsAdmin }
