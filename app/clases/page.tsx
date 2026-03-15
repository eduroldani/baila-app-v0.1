import Link from "next/link";

const classesByDay = [
  {
    day: "Lunes",
    classes: [
      {
        name: "Urbano Inicial",
        type: "Urbano",
        level: "Inicial",
        teacher: "Sofía Martínez",
        time: "19:00 a 20:15",
        price: "$8.500",
      },
      {
        name: "Stretch & Flow",
        type: "Movilidad",
        level: "Todos los niveles",
        teacher: "Julieta Mora",
        time: "20:30 a 21:15",
        price: "$7.500",
      },
    ],
  },
  {
    day: "Martes",
    classes: [
      {
        name: "Jazz Fusión",
        type: "Jazz",
        level: "Intermedio",
        teacher: "Camila Rojas",
        time: "18:30 a 19:45",
        price: "$9.000",
      },
    ],
  },
  {
    day: "Miércoles",
    classes: [
      {
        name: "Técnica de Giros",
        type: "Técnica",
        level: "Inicial",
        teacher: "Lucía Herrera",
        time: "17:30 a 18:30",
        price: "$7.500",
      },
      {
        name: "Urbano Core",
        type: "Urbano",
        level: "Intermedio",
        teacher: "Nicolás Vega",
        time: "19:00 a 20:15",
        price: "$9.000",
      },
    ],
  },
  {
    day: "Jueves",
    classes: [
      {
        name: "Heels Choreo",
        type: "Heels",
        level: "Intermedio",
        teacher: "Valentina Cruz",
        time: "19:30 a 20:45",
        price: "$9.500",
      },
    ],
  },
  {
    day: "Viernes",
    classes: [
      {
        name: "Ritmos Latinos",
        type: "Latino",
        level: "Todos los niveles",
        teacher: "Lucas Fernández",
        time: "20:00 a 21:15",
        price: "$8.500",
      },
    ],
  },
  {
    day: "Sábado",
    classes: [
      {
        name: "Urbano Avanzado",
        type: "Urbano",
        level: "Avanzado",
        teacher: "Nicolás Vega",
        time: "11:00 a 12:30",
        price: "$10.000",
      },
    ],
  },
];

export default function ClassesPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="text-sm font-medium uppercase tracking-[0.3em] text-violet-700">
            Bailá Dance Studio
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/clases"
              className="rounded-full border border-black px-5 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              Clases
            </Link>
            <a
              href="/#precios"
              className="rounded-full bg-violet-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              Inscribirme
            </a>
          </nav>
        </div>
      </header>

      <section className="border-b border-black/10">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
          <div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Clases disponibles</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <p className="max-w-2xl text-base leading-7 text-black/70">
          Elegí la clase que mejor se adapte a tu nivel y horario. Los datos son mock por ahora,
          pero la estructura ya está lista para conectarla a contenido real.
        </p>

        <div className="mt-10 space-y-8">
          {classesByDay.map((dayGroup) => (
            <section key={dayGroup.day} className="overflow-hidden rounded-3xl border border-black/10">
              <div className="border-b border-black/10 bg-black px-6 py-4 text-white">
                <h2 className="text-2xl font-semibold tracking-tight">{dayGroup.day}</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse bg-white">
                  <thead>
                    <tr className="border-b border-black/10 text-left text-sm text-black/50">
                      <th className="px-6 py-4 font-medium">Clase</th>
                      <th className="px-6 py-4 font-medium">Tipo</th>
                      <th className="px-6 py-4 font-medium">Nivel</th>
                      <th className="px-6 py-4 font-medium">Profesor</th>
                      <th className="px-6 py-4 font-medium">Horario</th>
                      <th className="px-6 py-4 font-medium">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayGroup.classes.map((danceClass) => (
                      <tr key={`${dayGroup.day}-${danceClass.name}`} className="border-b border-black/10">
                        <td className="px-6 py-4 font-medium text-black">{danceClass.name}</td>
                        <td className="px-6 py-4 text-black/70">{danceClass.type}</td>
                        <td className="px-6 py-4 text-black/70">{danceClass.level}</td>
                        <td className="px-6 py-4 text-black/70">{danceClass.teacher}</td>
                        <td className="px-6 py-4 text-black/70">{danceClass.time}</td>
                        <td className="px-6 py-4 font-medium text-black">{danceClass.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
