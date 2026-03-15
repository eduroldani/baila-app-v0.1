# Supabase Setup

Para activar login de alumnos y recuperaciones en esta rama:

## Variables de entorno

Agregá en `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Y en Vercel cargá esas mismas variables para `Preview` o `Production`.

## Auth

La base actual usa:

- `/acceso` para login y alta de cuenta
- `/alumnos` como página protegida
- `/alumnos` para registrar recuperaciones por fecha
- `middleware.ts` para refrescar sesión

## Configuración mínima en Supabase

1. Creá un proyecto.
2. En `Authentication` activá `Email`.
3. Si vas a usar email y contraseña sin confirmación, desactivá email confirmation.
4. Copiá `Project URL` y `anon public key`.
5. En el SQL editor ejecutá el contenido de `supabase/schema.sql`.

## Próximo paso sugerido

La base actual ya contempla:

- `profiles`
- `class_recoveries`
- `dependents`

El flujo actual del alumno permite:

- iniciar sesión
- guardar el nombre del titular
- cargar personas a cargo con nombre y edad
- elegir una fecha de recuperación con 2 días de anticipación
- elegir quién recupera: el titular o una persona a cargo
- ver solo las clases de Airtable que corresponden a ese día
- guardar una recuperación
- cancelar una recuperación futura

## Rol admin

El rol por defecto es `student`.

Para convertir un usuario en admin:

```sql
update public.profiles
set role = 'admin'
where email = 'tu-email@dominio.com';
```

## Rutas

- `/acceso` login y registro
- `/alumnos` panel protegido para recuperar clases
- `/admin` panel protegido solo para `role = 'admin'`, con listado de recuperaciones
