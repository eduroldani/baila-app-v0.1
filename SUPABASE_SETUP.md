# Supabase Setup

Para activar login de alumnos en esta rama:

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
- `class_enrollments`

El flujo actual del alumno permite:

- iniciar sesión
- ver clases disponibles traídas desde Airtable
- inscribirse a una clase
- ver sus clases activas
- cancelar una inscripción

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
- `/alumnos` panel protegido
- `/admin` panel protegido solo para `role = 'admin'`
