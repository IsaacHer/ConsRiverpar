# Riverpar SAS — Vitrina Digital

Vitrina pública de proyectos residenciales para Constructora Riverpar SAS.
Permite a los visitantes explorar el catálogo de proyectos, filtrarlos y contactar a un asesor vía WhatsApp.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router, Server Components) |
| Lenguaje | TypeScript strict |
| Estilos | Tailwind CSS 3 |
| Base de datos | Supabase (PostgreSQL) |
| Almacenamiento de media | Cloudflare R2 + CDN custom |
| Iconos | lucide-react |
| Fuentes | DM Sans + Playfair Display (next/font/google) |
| Deploy | Vercel |

---

## Variables de entorno

Copia `.env.example` a `.env.local` y rellena cada valor:

```bash
cp .env.example .env.local
```

| Variable | Descripción | Requerida |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Sí |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave anon/pública de Supabase | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo servidor) | Sí |
| `NEXT_PUBLIC_CDN_BASE_URL` | URL base del CDN de R2 (ej. `https://cdn.riverpar.com`) | Sí |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio sin barra final (ej. `https://riverpar.com`) | Sí |
| `R2_ACCOUNT_ID` | ID de cuenta de Cloudflare | Para subida de media |
| `R2_ACCESS_KEY_ID` | Clave de acceso R2 | Para subida de media |
| `R2_SECRET_ACCESS_KEY` | Clave secreta R2 | Para subida de media |
| `R2_BUCKET_NAME` | Nombre del bucket R2 | Para subida de media |

> `SUPABASE_SERVICE_ROLE_KEY` nunca debe quedar expuesta al navegador ni en el repositorio.

---

## Correr localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con los valores reales

# 3. Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:3000`.

```bash
# Verificar TypeScript
npm run type-check

# Build de producción local
npm run build && npm start
```

---

## Aplicar el esquema SQL en Supabase

1. Abre el **SQL Editor** en el dashboard de Supabase (`supabase.com/dashboard`).
2. Si es un proyecto nuevo, aplica primero el esquema de tablas (archivo `supabase/schema.sql` si existe).
3. Para cargar los datos de ejemplo del MVP, ejecuta:

```sql
-- En Supabase Dashboard → SQL Editor → New query
-- Pegar el contenido de supabase/seed.sql y ejecutar
```

4. Tras subir las imágenes reales a R2, descomenta y ejecuta el bloque `project_media` del mismo archivo, reemplazando `<CDN>` con el valor de `NEXT_PUBLIC_CDN_BASE_URL`.

---

## Deploy en Vercel

### Primera vez

1. Importa el repositorio en [vercel.com/new](https://vercel.com/new).
2. Vercel detecta Next.js automáticamente. El archivo `vercel.json` ya tiene la configuración correcta.
3. Antes de hacer clic en **Deploy**, ve a **Environment Variables** y añade todas las variables de la tabla anterior.
4. Haz clic en **Deploy**.

### Variables de entorno en Vercel

```
NEXT_PUBLIC_SUPABASE_URL          → Settings → Environment Variables → Production
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY         → marcar como "Sensitive" / "Secret"
NEXT_PUBLIC_CDN_BASE_URL
NEXT_PUBLIC_SITE_URL              → https://riverpar.com (dominio final)
```

### Actualizaciones posteriores

```bash
git push origin main
# Vercel despliega automáticamente al hacer push a main
```

El ISR (Incremental Static Regeneration) revalida el catálogo y las páginas de detalle cada 3600 segundos (1 hora), por lo que los cambios en Supabase se reflejan sin necesidad de re-deploy.

---

## Decisiones de alcance del MVP

Las siguientes funcionalidades están **fuera del MVP** por decisión de alcance acordada con el cliente:

### RF-12 — Formulario de contacto
El formulario "Envíanos un mensaje" no está implementado.  
**Motivo:** Requiere un backend de envío de correo (Resend, SendGrid, etc.) y una tabla de leads en Supabase. Para el MVP, el canal de contacto es exclusivamente WhatsApp, que es más rápido y tiene mayor tasa de conversión para el perfil de clientes de Riverpar.  
**Reemplazado por:** Tarjeta "Escríbenos por WhatsApp" en la página `/contacto` con botón directo a `wa.me`.

### RF-05 a RF-08 — CMS / Panel de administración
No existe panel para que el equipo de Riverpar gestione proyectos, media ni site_settings desde el navegador.  
**Motivo:** El CMS es una fase futura (Fase 2). Actualmente los proyectos se gestionan directamente en el dashboard de Supabase, lo cual es suficiente para el volumen inicial de 3-10 proyectos.  
**Flujo actual:** Crear proyecto en Supabase → subir imágenes a R2 → insertar filas en `project_media`.

### Autenticación de visitantes
No se implementó registro ni login para visitantes.  
**Motivo:** La ERS no lo requiere. Los datos personales no se almacenan (RNF-08 cumplido).

### Paginación del catálogo
El catálogo carga todos los proyectos publicados sin paginación.  
**Motivo:** El volumen esperado en el MVP es de 3-15 proyectos. Si el catálogo supera los 20 proyectos se recomienda añadir paginación o scroll infinito.

---

## Estructura de carpetas

```
src/
├── app/
│   ├── (public)/          # Rutas públicas con Navbar + Footer
│   │   ├── page.tsx       # Home
│   │   ├── proyectos/     # Catálogo + detalle [slug]
│   │   ├── nosotros/
│   │   └── contacto/
│   ├── layout.tsx         # Root layout, metadata global
│   ├── not-found.tsx      # Página 404
│   ├── sitemap.ts         # Sitemap dinámico
│   └── robots.ts
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── projects/          # ProjectCard, ProjectGallery, CatalogFilter, …
│   └── ui/                # Button, Badge, Container, …
├── lib/
│   ├── supabase/          # server.ts, client.ts
│   ├── data/projects.ts   # Queries de Supabase
│   └── utils.ts
└── types/index.ts
supabase/
└── seed.sql               # Datos de ejemplo MVP
```
