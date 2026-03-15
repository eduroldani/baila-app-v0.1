import Link from "next/link";
import { PricingSection } from "@/components/pricing-section";
import { flattenClasses, getClassesByDay, getStudioStats } from "@/lib/airtable";

export default async function Home() {
  const classesByDay = await getClassesByDay();
  const featuredClasses = flattenClasses(classesByDay).slice(0, 3);
  const stats = getStudioStats(classesByDay);

  return (
    <main className="min-h-screen bg-white pt-24 text-black">
      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-700">
              Estudio de danza
            </p>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
              Un MVP claro para vender clases, horarios y experiencia de estudio.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">
              Baila App v1 presenta la propuesta del estudio de forma simple: clases agrupadas por
              día, precios claros y contenido conectado a Airtable para que el equipo pueda
              actualizar horarios sin tocar código.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/clases"
                className="rounded-full bg-violet-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-violet-800"
              >
                Ver cronograma
              </Link>
              <a
                href="#precios"
                className="rounded-full border border-black px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                Ver precios
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <article className="rounded-3xl border border-black/10 bg-stone-50 p-5">
                <p className="text-3xl font-semibold">{stats.classCount}</p>
                <p className="mt-1 text-sm text-black/60">clases activas</p>
              </article>
              <article className="rounded-3xl border border-black/10 bg-stone-50 p-5">
                <p className="text-3xl font-semibold">{stats.teacherCount}</p>
                <p className="mt-1 text-sm text-black/60">profes en agenda</p>
              </article>
              <article className="rounded-3xl border border-black/10 bg-stone-50 p-5">
                <p className="text-3xl font-semibold">{stats.daysCount}</p>
                <p className="mt-1 text-sm text-black/60">días con clases</p>
              </article>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-700">
                  Próximas clases
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Agenda destacada</h2>
              </div>
              <Link href="/clases" className="text-sm font-semibold text-violet-700">
                Ver todo
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {featuredClasses.map((danceClass) => (
                <article
                  key={`${danceClass.day}-${danceClass.name}`}
                  className="rounded-3xl border border-black/10 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-black/50">
                        {danceClass.day} · {danceClass.time}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold">{danceClass.name}</h3>
                    </div>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                      {danceClass.level}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-black/65">
                    <span className="rounded-full bg-stone-100 px-3 py-1">{danceClass.type}</span>
                    <span className="rounded-full bg-stone-100 px-3 py-1">{danceClass.teacher}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="clases" className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-700">
              Propuesta
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Una base sólida para mostrar la oferta del estudio con contenido real.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-black/10 p-6">
              <h3 className="text-lg font-semibold">Horario actualizado</h3>
              <p className="mt-3 text-sm leading-6 text-black/65">
                Las clases se leen desde Airtable, así que cualquier cambio de día, horario o profe
                se refleja en la web sin editar el código.
              </p>
            </article>
            <article className="rounded-3xl border border-black/10 p-6">
              <h3 className="text-lg font-semibold">Presentación clara</h3>
              <p className="mt-3 text-sm leading-6 text-black/65">
                El sitio prioriza lo que un cliente necesita ver rápido: clases, niveles, docentes
                y una acción directa para consultar precios o inscribirse.
              </p>
            </article>
            <article className="rounded-3xl border border-black/10 p-6 sm:col-span-2">
              <h3 className="text-lg font-semibold">Disciplinas activas</h3>
              <p className="mt-3 text-sm leading-6 text-black/65">
                Actualmente el estudio muestra {stats.disciplineCount} disciplinas activas en la
                agenda, combinando propuestas para principiantes, niveles intermedios y clases open.
              </p>
            </article>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {featuredClasses.map((danceClass) => (
            <article key={`${danceClass.day}-${danceClass.name}-summary`} className="rounded-3xl border border-black/10 p-6">
              <p className="text-sm text-black/50">{danceClass.day}</p>
              <h3 className="mt-2 text-xl font-semibold">{danceClass.name}</h3>
              <p className="mt-3 text-sm text-black/65">{danceClass.teacher}</p>
              <p className="mt-1 text-sm text-black/65">{danceClass.time}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20 lg:px-8">
        <div className="rounded-[2rem] border border-black/10 bg-violet-50 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p>
              <span className="block text-sm font-medium uppercase tracking-[0.3em] text-violet-700">
                Siguiente paso
              </span>
              <span className="mt-3 block max-w-2xl text-2xl font-semibold tracking-tight text-black">
                Si esto ya va para cliente, el próximo salto es conectar inscripción real y mensajes
                automáticos.
              </span>
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/clases"
                className="rounded-full bg-violet-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-violet-800"
              >
                Explorar clases
              </Link>
              <a
                href="#precios"
                className="rounded-full border border-black px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                Revisar precios
              </a>
            </div>
          </div>
        </div>
      </section>

      <PricingSection />
    </main>
  );
}
