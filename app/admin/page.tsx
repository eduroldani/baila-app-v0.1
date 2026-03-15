import Link from "next/link";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/server";
import { getAllProfiles, getCurrentUserWithProfile } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="min-h-screen bg-white pt-24 text-black">
        <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-8 text-sm leading-7 text-black/65 shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
            Configurá Supabase para habilitar el panel de administración.
          </div>
        </section>
      </main>
    );
  }

  const { user, profile, profileError } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/acceso");
  }

  if (profileError) {
    return (
      <main className="min-h-screen bg-white pt-24 text-black">
        <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-8 shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
            <h1 className="text-3xl font-semibold tracking-tight">Falta configurar perfiles</h1>
            <p className="mt-4 text-sm leading-7 text-black/65">
              Para usar el panel admin necesitás crear la tabla `profiles` en Supabase y cargar el
              esquema inicial.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (profile?.role !== "admin") {
    redirect("/alumnos");
  }

  const { profiles, error } = await getAllProfiles();

  return (
    <main className="min-h-screen bg-white pt-24 text-black">
      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-black/10 bg-stone-50 p-8 shadow-[0_14px_40px_rgba(0,0,0,0.04)] md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-black/55">
              Panel admin
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Gestión de alumnos
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-black/65">
              Desde acá el rol admin puede revisar estudiantes registrados y luego seguir con
              inscripciones, pagos y documentación.
            </p>
          </div>
          <Link
            href="/alumnos"
            className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold text-black shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition hover:bg-stone-100"
          >
            Ir al panel alumno
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
          <div className="border-b border-black/10 px-6 py-4">
            <h2 className="text-xl font-semibold">Estudiantes</h2>
          </div>

          {error ? (
            <div className="px-6 py-6 text-sm text-black/65">
              No se pudo cargar la lista de perfiles.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-black/10 text-left text-sm text-black/55">
                    <th className="px-6 py-4 font-medium">Nombre</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Rol</th>
                    <th className="px-6 py-4 font-medium">Alta</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((student) => (
                    <tr key={student.id} className="border-b border-black/10 text-sm">
                      <td className="px-6 py-4 font-medium text-black">
                        {student.full_name || "Sin nombre"}
                      </td>
                      <td className="px-6 py-4 text-black/65">{student.email}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-black">
                          {student.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-black/65">
                        {new Date(student.created_at).toLocaleDateString("es-AR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
