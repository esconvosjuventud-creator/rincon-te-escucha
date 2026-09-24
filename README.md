# Rincón Te Escucha

Web institucional y herramienta de relevamiento juvenil para la **Oficina de la Juventud – Intendencia Departamental de Flores (Uruguay)**.

La experiencia fue diseñada con enfoque mobile-first y toma como referencia directa las piezas gráficas oficiales de la campaña **Rincón Te Escucha** y el logo **#ES CON VOS** incluidos en `src/assets/`.

## Qué incluye

- Home institucional juvenil y responsive.
- Formulario de propuestas en 3 pasos, anónimo por defecto.
- Validación, límite de caracteres, honeypot y bloqueo breve de doble envío.
- Guardado real de propuestas en Supabase.
- Recursos, guías, tips del día, FAQ y contacto administrables desde Supabase.
- Privacidad por diseño: no se solicita cédula, dirección ni fecha de nacimiento exacta.
- Panel `/admin` protegido con Supabase Auth.
- Autorización del panel mediante la tabla institucional `profiles` existente: perfiles activos con rol `admin` o `equipo`.
- Dashboard con filtros y estadísticas agregadas.
- Gestión de estado y notas internas de cada propuesta.
- RLS: visitantes pueden insertar propuestas pero nunca leerlas, modificarlas ni borrarlas.
- GitHub Actions para lint, typecheck, build y deploy automático a GitHub Pages.
- SEO básico, Open Graph y fallback para SPA en GitHub Pages.

## Tecnologías

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Postgres + Auth + RLS)
- Lucide React
- React Router
- GitHub Pages + GitHub Actions

## Requisitos

- Node.js 22+
- npm 10+
- Un proyecto Supabase
- Un repositorio GitHub

## Instalación local

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Configurar `.env.local`:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICABLE_O_ANON
VITE_BASE_PATH=/
```

> Nunca uses `service_role` ni una clave secreta de Supabase en el frontend.

## Base de datos

Ejecutar primero:

```text
supabase/schema.sql
```

Luego:

```text
supabase/seed.sql
```

### Nota sobre nombres de tablas

El proyecto institucional de Supabase ya contiene una tabla `public.resources` para otra función. Para no alterar ni romper datos existentes, el contenido de Rincón Te Escucha usa:

- `rte_resources`
- `rte_tips`
- `rte_faq`
- `rte_site_settings`

La tabla principal solicitada sí se denomina:

- `youth_proposals`

## Seguridad y RLS

`youth_proposals` tiene Row Level Security activado.

### Visitantes (`anon`)

Pueden únicamente:

- `INSERT` de propuestas con `status = 'new'`, `source = 'web'`, sin notas administrativas y sin archivado.

No tienen políticas de:

- `SELECT`
- `UPDATE`
- `DELETE`

Por lo tanto, una persona que envía el formulario no puede leer propuestas propias ni ajenas.

### Equipo autenticado

La función `rte_is_staff()` autoriza usuarios que ya existen en `public.profiles` y cumplen:

- `active = true`
- `role` = `admin` o `equipo`

Esos perfiles pueden leer y actualizar las propuestas y administrar los contenidos de Rincón Te Escucha.

## Panel administrativo

Ruta:

```text
/admin
```

Funciones:

- inicio de sesión por email y contraseña con Supabase Auth;
- total de propuestas;
- estados: Nueva, En revisión, Considerada, Implementada y Archivada;
- filtros por texto, fecha, edad, localidad, categoría y estado;
- propuestas por categoría, edad y localidad;
- evolución mensual;
- indicador de temas más mencionados;
- detalle de propuesta;
- cambio de estado;
- notas internas.

Los gráficos nunca usan información personal.

## Contacto institucional

Los datos se administran en `rte_site_settings` con las claves:

- `location`
- `hours`
- `whatsapp`
- `email`
- `instagram`

El seed deja los valores vacíos para evitar publicar información no verificada.

## GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` se ejecuta en cada push a `main`.

### 1. Configurar GitHub Pages

En el repositorio:

`Settings → Pages → Build and deployment → Source → GitHub Actions`

### 2. Crear secretos del repositorio

En:

`Settings → Secrets and variables → Actions → New repository secret`

Crear:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

La clave debe ser la **publishable key** o la legacy `anon`; nunca una clave secreta/service role.

### 3. Base path

El workflow define automáticamente:

```text
VITE_BASE_PATH=/<nombre-del-repositorio>/
```

Esto permite que Vite funcione correctamente en GitHub Project Pages.

## Rutas SPA en GitHub Pages

`public/404.html` redirige rutas directas como `/admin` al SPA sin perder la URL. En desarrollo local, React Router funciona con base `/`.

## Comandos de calidad

```bash
npm run lint
npm run typecheck
npm run build
npm run preview
```

## Estructura

```text
src/
  assets/
  components/
  data/
  lib/
  pages/
  sections/
  services/
  types/
supabase/
  schema.sql
  seed.sql
.github/workflows/
  deploy-pages.yml
```

## Bienestar

La plataforma utiliza lenguaje general de orientación y acompañamiento y muestra el aviso:

> Rincón Te Escucha es un espacio de participación y orientación juvenil. No sustituye servicios profesionales o de emergencia.

No se agregan teléfonos o datos de emergencia no verificados.

## Identidad institucional

Los archivos gráficos originales incluidos en el proyecto se utilizan sin rediseñar el logo institucional. La interfaz extiende la identidad visual de campaña mediante azul institucional, celeste, amarillo, fondos claros, trazos, corazones, globos de diálogo y tarjetas redondeadas.
