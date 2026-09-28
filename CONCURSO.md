# Concurso Mujeres Rurales 2026

Integración en Rincón Te Escucha. No reemplaza Home, el formulario de ideas, Auth ni el panel del equipo.

## Configuración y publicación

- `src/contest/config.ts`: título, fechas con zona horaria de Uruguay, premio, jurado, enlaces, estado, límites y versión de bases. Se comparte con la función de recepción del servidor.
- La recepción abre el 28/09/2026 y cierra al terminar las 23:59 del 09/10/2026 en Uruguay. El servidor vuelve a verificar el plazo después de subir los archivos.
- Un cambio en esta configuración requiere compilar el sitio **y desplegar de nuevo** `rural-women-submit`. Para regenerar las bases: `python scripts/build-contest-bases.py` desde la raíz, con Python + reportlab y Node 22.18+ disponibles.
- Las bases HTML provienen de la Parte II del documento institucional aportado. Se completaron el enlace de inscripción y los datos variables desde la configuración. El PDF contiene las mismas 19 cláusulas y la matriz de evaluación.
- Los logos en `public/contest/` son los archivos originales sin transformación.
- La navegación mantiene BrowserRouter, el prefijo de GitHub Pages y el mecanismo existente de recuperación de rutas de `404.html`.
- El workflow existente publica al integrar en `main`. El nuevo workflow de pull request comprueba lint, tipos, pruebas y build sin publicar.

## Supabase

Proyecto existente: `yjpyszgxloerkmfgtuzd` (JUVENTUD FLORES – GESTIÓN).

Ya se aplicaron las migraciones `rural_women_contest_2026` y `rural_women_explicit_privileges`. `supabase/contest.sql` es una instalación consolidada para entornos nuevos; **no ejecutarla de nuevo sobre el proyecto actual**.

La función `supabase/functions/rural-women-submit/index.ts` está desplegada. En el despliegue deben incluirse su archivo y `src/contest/config.ts`, conservando las rutas relativas. Verifica la API key pública del proyecto dentro de la función; `verify_jwt=false` permite participar sin crear una cuenta. No se usa ninguna clave privilegiada en el navegador.

La recepción valida campos, consentimiento, menores, IA, URLs HTTP(S), tamaño, MIME y firma inicial de archivos; admite hasta 10 MB por archivo y 22 MB por petición. El bucket es privado. Los nombres de archivo no provienen del usuario. Solo el servidor inserta inscripciones y archivos; los visitantes no pueden consultar o modificar propuestas. El equipo accede con el permiso existente `rte_is_staff()` y genera enlaces firmados por 120 segundos.

Los reintentos utilizan un UUID de idempotencia conservado mientras permanece abierto el formulario. El código se asigna en servidor mediante secuencia, formato MR-2026-XXXX. La secuencia admite 9999 códigos; cargas fallidas pueden dejar huecos. Se consumieron los códigos 0001 y 0002 durante la verificación; sus registros y archivos fueron eliminados.

El límite de recepción es 20 intentos/hora por hash de IP calculado con secreto del servidor. La IP original no se guarda en las tablas de la aplicación; los contadores de límite con más de un día se eliminan en posteriores solicitudes. Los contadores analíticos guardan solo evento y fecha, no personas; son orientativos y no representan visitas únicas.

## Administración

El concurso aparece dentro del `/admin` existente, tras la autorización habitual. Incluye indicadores, filtros, CSV, detalle, archivos, estado y notas internas. El CSV neutraliza fórmulas de hojas de cálculo.

Cada integrante del jurado debe tener una cuenta institucional individual autorizada por el sistema existente. La matriz se guarda por cuenta y propuesta; RLS oculta calificaciones ajenas hasta que el equipo habilite la puesta en común. No se crearon cuentas ni se modificaron perfiles existentes.

La sección “Resultado público y puesta en común” permite guardar nombre de propuesta, autoría autorizada, URL HTTPS pública del diseño, fundamentación y menciones. La publicación requiere marcar explícitamente “Publicar resultado” y guardar. Nunca publica automáticamente una inscripción ni usa enlaces privados firmados como imagen permanente. No hay galería pública de propuestas.

## Verificación realizada

- Lint sin errores ni advertencias; TypeScript correcto.
- Siete pruebas automáticas: límites horarios, cumpleaños, menores con edad editada, enlace válido, IA/consentimientos/extensión, matriz e invalidación de fechas.
- Build de producción con `/rincon-te-escucha/`. En este entorno Windows se utilizó `npm run build -- --configLoader native` para evitar una restricción de lectura del cargador de configuración predeterminado. El workflow Linux mantiene `npm run build`.
- Navegador: escritorio 1440 px y móvil 390 px, sin desbordamiento horizontal ni errores JavaScript; flujo hasta revisión; error de envío conserva datos; Home y acceso a `/admin` preservados.
- Recuperación de enlace profundo de GitHub Pages comprobada, con query y ancla preservados.
- API real: entrega por enlace, entrega PNG, rechazo de firma de archivo incorrecta, autorización obligatoria para menor y reintento sin duplicación.
- RLS real: consultas públicas a inscripciones/evaluaciones/límites denegadas; resultado no publicado oculto; cuenta sin autorización ve cero filas y cero archivos; cuenta del equipo puede ver propuestas y archivos.
- PDF de tres páginas renderizado y revisado visualmente.

La inspección global de Supabase reportó avisos preexistentes en funciones de otros módulos y en configuración de contraseñas. No se modificaron esos módulos. La tabla de límites del concurso tiene RLS sin políticas de cliente deliberadamente, porque es exclusiva del servidor.

No se probó un inicio de sesión real con contraseña del jurado, porque no se solicitaron credenciales; la autorización se verificó en la base con roles y en el navegador con el acceso existente.
