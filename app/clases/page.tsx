import { getClassesByDay } from "@/lib/airtable";

export default async function ClassesPage() {
  const classesByDay = await getClassesByDay();

  return (
    <main className="min-h-screen bg-white pt-24 text-black">
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
          <div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Clases disponibles</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-black/65">
              Agenda semanal conectada a Airtable. Cada bloque muestra la clase, el horario, el
              nivel y el profesor asignado.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="mt-10 space-y-8">
          {classesByDay.map((dayGroup) => (
            <section key={dayGroup.day} className="overflow-hidden rounded-3xl border border-black/10">
              <div className="border-b border-black/10 bg-black px-6 py-4 text-white">
                <h2 className="text-2xl font-semibold tracking-tight">{dayGroup.day}</h2>
              </div>

              <div className="bg-white px-5 py-3 sm:px-6">
                <div className="space-y-3">
                  {dayGroup.classes.map((danceClass) => (
                    <article key={`${dayGroup.day}-${danceClass.name}`} className="rounded-2xl border border-black/10 px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-medium text-black sm:text-lg">{danceClass.name}</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                              {danceClass.level || "Nivel a definir"}
                            </span>
                            {danceClass.type ? (
                              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-black/70">
                                {danceClass.type}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <p className="shrink-0 text-sm font-medium text-black/65">{danceClass.time}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-4">
                        <p className="text-sm text-black/65">
                          Profesor: <span className="font-medium text-black">{danceClass.teacher || "A confirmar"}</span>
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            danceClass.isAvailable && (danceClass.availableSpots ?? 1) > 0
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {danceClass.isAvailable && (danceClass.availableSpots ?? 1) > 0
                            ? danceClass.availableSpots !== null
                              ? `Cupo libre · ${danceClass.availableSpots}`
                              : "Cupo libre"
                            : "Lleno"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
