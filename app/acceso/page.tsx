import { AuthForm } from "./auth-form";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AccessPage() {
  const isConfigured = hasSupabaseEnv();

  if (isConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/alumnos");
    }
  }

  return (
    <main className="min-h-screen bg-white pt-24 text-black">
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-black/55">
              Acceso alumnos
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Ingresá o creá tu cuenta para reservar tu recuperación.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-black/65">
              El flujo actual está pensado para que cada alumno elija una fecha, vea solo las
              clases de ese día y anote qué recuperación va a tomar.
            </p>
          </div>
          {isConfigured ? (
            <AuthForm />
          ) : (
            <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-8 text-sm leading-7 text-black/65 shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
              Configurá `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` para activar
              el acceso de alumnos.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
