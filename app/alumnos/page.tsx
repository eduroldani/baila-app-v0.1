import Link from "next/link";
import { flattenClasses, getClassesByDay } from "@/lib/airtable";
import { cancelEnrollment, enrollInClass } from "./actions";
import { hasSupabaseEnv } from "@/lib/supabase/server";
import { getCurrentUserEnrollments, getCurrentUserWithProfile } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { SignOutButton } from "./sign-out-button";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="min-h-screen bg-white pt-24 text-black">
        <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-8 text-sm leading-7 text-black/65 shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
            Configurá Supabase para habilitar el panel de alumnos.
          </div>
        </section>
      </main>
    );
  }

  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/acceso");
  }

  const classesByDay = await getClassesByDay();
  const availableClasses = flattenClasses(classesByDay);
  const { enrollments } = await getCurrentUserEnrollments();
  const enrollmentMap = new Map(enrollments.map((enrollment) => [enrollment.airtable_class_id, enrollment]));
  const myClasses = availableClasses.filter((danceClass) => enrollmentMap.has(danceClass.id));
  const openClasses = availableClasses.filter((danceClass) => !enrollmentMap.has(danceClass.id));

  return (
    <main className="min-h-screen bg-white pt-24 text-black">
      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-black/10 bg-stone-50 p-8 shadow-[0_14px_40px_rgba(0,0,0,0.04)] md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-black/55">
              Panel alumno
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Hola, {user.user_metadata.full_name || user.email}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-black/65">
              Esta es la base del espacio privado. Desde acá podemos seguir con inscripción a
              clases, historial de pagos y documentación.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-black">
                Rol: {profile?.role || "sin perfil"}
              </span>
              {profile?.role === "admin" ? (
                <Link
                  href="/admin"
                  className="rounded-full bg-[#F797A5] px-3 py-1 text-xs font-semibold text-white"
                >
                  Ir al panel admin
                </Link>
              ) : null}
            </div>
          </div>
          <SignOutButton />
        </div>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Mis clases</h2>
            <span className="text-sm text-black/55">{myClasses.length} activas</span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {myClasses.length > 0 ? (
              myClasses.map((danceClass) => {
                const enrollment = enrollmentMap.get(danceClass.id)!;

                return (
                  <article
                    key={`my-${danceClass.id}`}
                    className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
                  >
                    <p className="text-sm text-black/50">
                      {danceClass.day} · {danceClass.time}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">{danceClass.name}</h3>
                    <p className="mt-3 text-sm text-black/65">{danceClass.teacher}</p>
                    {danceClass.location ? <p className="mt-1 text-sm text-black/50">{danceClass.location}</p> : null}
                    <form action={cancelEnrollment} className="mt-5">
                      <input type="hidden" name="enrollment_id" value={enrollment.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition hover:bg-stone-100"
                      >
                        Cancelar inscripción
                      </button>
                    </form>
                  </article>
                );
              })
            ) : (
              <article className="rounded-3xl border border-black/10 bg-white p-6 text-sm leading-7 text-black/65 shadow-[0_10px_30px_rgba(0,0,0,0.04)] md:col-span-2">
                Todavía no estás anotado en ninguna clase.
              </article>
            )}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Clases disponibles</h2>
            <span className="text-sm text-black/55">{openClasses.length} opciones</span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {openClasses.map((danceClass) => (
              <article
                key={danceClass.id}
                className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-black/50">
                      {danceClass.day} · {danceClass.time}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">{danceClass.name}</h3>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-black">
                    {danceClass.level || "Nivel a definir"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm text-black/65">
                  {danceClass.type ? <span className="rounded-full bg-stone-100 px-3 py-1">{danceClass.type}</span> : null}
                  {danceClass.teacher ? (
                    <span className="rounded-full bg-stone-100 px-3 py-1">{danceClass.teacher}</span>
                  ) : null}
                </div>

                {danceClass.location ? <p className="mt-4 text-sm text-black/50">{danceClass.location}</p> : null}

                <form action={enrollInClass} className="mt-5">
                  <input type="hidden" name="airtable_class_id" value={danceClass.id} />
                  <button
                    type="submit"
                    disabled={!danceClass.isAvailable}
                    className="rounded-full bg-[#F797A5] px-5 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:bg-[#f27f92] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {danceClass.isAvailable ? "Inscribirme a esta clase" : "Clase sin cupo"}
                  </button>
                </form>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
