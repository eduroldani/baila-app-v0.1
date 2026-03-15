import Link from "next/link";
import { getClassesByDay } from "@/lib/airtable";
import { getCurrentUserClassRecoveries } from "@/lib/class-recoveries";
import { formatRecoveryDate, isRecoveryCompleted } from "@/lib/recoveries";
import { hasSupabaseEnv } from "@/lib/supabase/server";
import { getCurrentUserDependents, getCurrentUserWithProfile } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { cancelRecovery } from "./actions";
import { HouseholdManager } from "./household-manager";
import { RecoveryBookingForm } from "./recovery-booking-form";
import { SignOutButton } from "./sign-out-button";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="min-h-screen bg-white pt-24 text-black">
        <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-8 text-sm leading-7 text-black/65 shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
            Configurá Supabase para habilitar el panel de recuperaciones.
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
  const [{ recoveries }, { dependents }] = await Promise.all([
    getCurrentUserClassRecoveries(),
    getCurrentUserDependents(),
  ]);

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
              Desde acá cada alumno elige qué día quiere recuperar y selecciona la clase disponible
              de esa fecha.
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

        <HouseholdManager profile={profile} dependents={dependents} />

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <RecoveryBookingForm classesByDay={classesByDay} profile={profile} dependents={dependents} />

          <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Mis recuperaciones</h2>
              <span className="text-sm text-black/55">{recoveries.length} registradas</span>
            </div>

            <div className="mt-5 space-y-4">
              {recoveries.length > 0 ? (
                recoveries.map((recovery) => {
                  const completed = isRecoveryCompleted(recovery.recovery_date);

                  return (
                    <article
                      key={recovery.id}
                      className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.04)]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-black/50">
                          {formatRecoveryDate(recovery.recovery_date)}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            completed
                              ? "bg-stone-200 text-black/70"
                              : "bg-[#FFF3F5] text-[#9f4054]"
                          }`}
                        >
                          {completed ? "Ya recuperada" : "Programada"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium text-black">
                        Recupera: {recovery.attendee_name}
                        {recovery.attendee_age !== null ? ` · ${recovery.attendee_age} años` : ""}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold">{recovery.danceClass.name}</h3>
                      <p className="mt-2 text-sm text-black/65">
                        {recovery.danceClass.day} · {recovery.danceClass.time}
                      </p>
                      {recovery.danceClass.teacher ? (
                        <p className="mt-1 text-sm text-black/55">{recovery.danceClass.teacher}</p>
                      ) : null}
                      {recovery.danceClass.location ? (
                        <p className="mt-1 text-sm text-black/50">{recovery.danceClass.location}</p>
                      ) : null}

                      {!completed ? (
                        <form action={cancelRecovery} className="mt-5">
                          <input type="hidden" name="recovery_id" value={recovery.id} />
                          <button
                            type="submit"
                            className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition hover:bg-stone-100"
                          >
                            Cancelar recuperación
                          </button>
                        </form>
                      ) : null}
                    </article>
                  );
                })
              ) : (
                <article className="rounded-3xl border border-black/10 bg-white p-6 text-sm leading-7 text-black/65 shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
                  Todavía no registraste ninguna recuperación.
                </article>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
