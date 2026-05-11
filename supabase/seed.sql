-- ===========================================================
-- Riverpar SAS — Datos de ejemplo MVP
-- Aplicar en: Supabase Dashboard → SQL Editor → Run
--
-- ORDEN: ejecutar completo en una sola pasada.
-- Los project_media deben añadirse manualmente tras subir
-- las imágenes reales al bucket de R2.
-- ===========================================================


-- ── site_settings ─────────────────────────────────────────
-- Insertar solo si la tabla está vacía. Ajustar antes del deploy.
INSERT INTO site_settings (
  company_name,
  contact_whatsapp,
  contact_email,
  address,
  seo_title,
  seo_description
)
SELECT
  'Constructora Riverpar SAS',
  '+573001234567',
  'info@riverpar.com',
  'Cúcuta, Norte de Santander, Colombia',
  'Riverpar SAS — Constructora',
  'Proyectos residenciales de alta calidad en Cúcuta. Encuentra tu hogar ideal con Constructora Riverpar SAS.'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);


-- ── Proyecto 1: Portal del Norte — Preventa, precio visible ─
INSERT INTO projects (
  id, slug, name,
  short_description, description,
  location_city, location_zone,
  price_base_cop, price_visible,
  area_m2, bedrooms, bathrooms, parking_spaces, stratum,
  commercial_status, publication_status, featured,
  published_at
) VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'portal-del-norte',
  'Portal del Norte',
  'Apartamentos modernos en el norte de Cúcuta con acabados de primera y amplios espacios familiares.',
  'Portal del Norte es un proyecto residencial ubicado en el sector norte de Cúcuta, diseñado para familias que buscan calidad de vida, seguridad y excelente ubicación. Cada apartamento cuenta con espacios amplios, ventilación natural y materiales importados. Las zonas comunes incluyen salón comunal, BBQ y vigilancia permanente. A pocos minutos de colegios, centros comerciales y vías principales.',
  'Cúcuta', 'Norte',
  280000000, true,
  78.5, 3, 2, 1, 4,
  'preventa', 'publicado', false,
  now()
);

-- ── Proyecto 2: Torres de la Villa — En obra, consultar precio ─
INSERT INTO projects (
  id, slug, name,
  short_description, description,
  location_city, location_zone,
  price_base_cop, price_visible,
  area_m2, bedrooms, bathrooms, parking_spaces, stratum,
  commercial_status, publication_status, featured,
  published_at
) VALUES (
  'a1b2c3d4-0000-0000-0000-000000000002',
  'torres-de-la-villa',
  'Torres de la Villa',
  'Proyecto residencial de lujo actualmente en construcción en la zona occidental de Cúcuta.',
  'Torres de la Villa es un proyecto de vivienda de lujo para quienes buscan exclusividad y confort. Ubicado en la zona occidental de la ciudad, cuenta con piscina, gimnasio equipado, terraza comunal y un lobby de alto impacto. La arquitectura contemporánea se integra con el entorno verde de la zona. Entrega estimada: segundo semestre. Para conocer precios y disponibilidad, contáctanos directamente.',
  'Cúcuta', 'Occidental',
  null, false,
  95.0, 3, 3, 2, 5,
  'en_obra', 'publicado', false,
  now() - interval '15 days'
);

-- ── Proyecto 3: Residencias Santa Fe — Listo entrega, destacado ─
INSERT INTO projects (
  id, slug, name,
  short_description, description,
  location_city, location_zone,
  price_base_cop, price_visible,
  area_m2, bedrooms, bathrooms, parking_spaces, stratum,
  commercial_status, publication_status, featured,
  published_at
) VALUES (
  'a1b2c3d4-0000-0000-0000-000000000003',
  'residencias-santa-fe',
  'Residencias Santa Fe',
  'Unidades listas para entrega en el corazón del barrio Santa Fe, con cocina integral y closets incluidos.',
  'Residencias Santa Fe es la opción ideal para quienes quieren estrenar sin esperas. Todas las unidades están terminadas y listas para escrituración. Incluyen cocina integral, closets en alcobas, baños con porcelanato, y citófono en cada apartamento. La ubicación central del barrio Santa Fe facilita el acceso a transporte, comercio y servicios de la ciudad.',
  'Cúcuta', 'Santa Fe',
  195000000, true,
  65.0, 2, 2, 1, 3,
  'listo_entrega', 'publicado', true,
  now() - interval '30 days'
);


-- ── Amenidades — Portal del Norte ────────────────────────
INSERT INTO project_amenities (project_id, name, sort_order) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Parqueadero cubierto',  1),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Vigilancia 24/7',       2),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Zona BBQ',              3),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Salón comunal',         4);

-- ── Amenidades — Torres de la Villa ──────────────────────
INSERT INTO project_amenities (project_id, name, sort_order) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Piscina',               1),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Gimnasio equipado',     2),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Parqueadero privado',   3),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Lobby de lujo',         4),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Terraza comunal',       5);

-- ── Amenidades — Residencias Santa Fe ────────────────────
INSERT INTO project_amenities (project_id, name, sort_order) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Cocina integral',       1),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Closets incluidos',     2),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Portería con citófono', 3),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Parqueadero',           4);


-- ── project_media — añadir tras subir imágenes reales a R2 ──
-- Reemplazar <CDN> con el valor de NEXT_PUBLIC_CDN_BASE_URL.
/*
INSERT INTO project_media (project_id, media_type, r2_key, public_url, alt_text, sort_order, is_main, mime_type)
VALUES
  -- Portal del Norte
  ('a1b2c3d4-0000-0000-0000-000000000001', 'imagen',
   'projects/portal-del-norte/main.jpg',
   'https://<CDN>/projects/portal-del-norte/main.jpg',
   'Vista frontal Portal del Norte', 0, true, 'image/jpeg'),

  ('a1b2c3d4-0000-0000-0000-000000000001', 'render',
   'projects/portal-del-norte/interior.jpg',
   'https://<CDN>/projects/portal-del-norte/interior.jpg',
   'Interior tipo Portal del Norte', 1, false, 'image/jpeg'),

  -- Torres de la Villa
  ('a1b2c3d4-0000-0000-0000-000000000002', 'imagen',
   'projects/torres-de-la-villa/main.jpg',
   'https://<CDN>/projects/torres-de-la-villa/main.jpg',
   'Vista frontal Torres de la Villa', 0, true, 'image/jpeg'),

  ('a1b2c3d4-0000-0000-0000-000000000002', 'imagen',
   'projects/torres-de-la-villa/obra.jpg',
   'https://<CDN>/projects/torres-de-la-villa/obra.jpg',
   'Avance de obra Torres de la Villa', 1, false, 'image/jpeg'),

  -- Residencias Santa Fe
  ('a1b2c3d4-0000-0000-0000-000000000003', 'imagen',
   'projects/residencias-santa-fe/main.jpg',
   'https://<CDN>/projects/residencias-santa-fe/main.jpg',
   'Fachada Residencias Santa Fe', 0, true, 'image/jpeg'),

  ('a1b2c3d4-0000-0000-0000-000000000003', 'imagen',
   'projects/residencias-santa-fe/sala.jpg',
   'https://<CDN>/projects/residencias-santa-fe/sala.jpg',
   'Sala tipo Residencias Santa Fe', 1, false, 'image/jpeg');
*/
