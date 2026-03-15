import Link from "next/link";

const pricingPlans = [
  {
    name: "Clase Suelta",
    price: "$8.500",
    description: "Para venir cuando quieras, sin compromiso mensual.",
  },
  {
    name: "Plan Mensual",
    price: "$32.000",
    description: "Ocho clases por mes para sostener tu ritmo de entrenamiento.",
  },
  {
    name: "Plan Ilimitado",
    price: "$49.000",
    description: "Acceso libre a todas las clases grupales del estudio.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-700">
            Bailá Dance Studio
          </p>
          <div className="mt-12 max-w-3xl">
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              Clases de danza en un estudio simple, cálido y enfocado en progresar.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">
              Entrená técnica, coordinación y presencia escénica con clases grupales para
              distintos niveles.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/clases"
                className="rounded-full bg-violet-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-violet-800"
              >
                Ver clases disponibles
              </Link>
              <a
                href="#precios"
                className="rounded-full border border-black px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                Inscribirme
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="clases" className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-700">
              Sobre el estudio
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Un espacio para aprender, practicar y disfrutar cada clase.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-black/70">
            <p>
              En Bailá trabajamos con grupos reducidos, atención personalizada y una propuesta
              clara para que cada alumno avance a su propio ritmo.
            </p>
            <p>
              Hay clases de urbano, jazz y ritmos latinos, con horarios pensados para quienes
              recién empiezan y también para quienes ya entrenan con frecuencia.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-black/10 p-6">
            <p className="text-sm text-black/50">Lunes y miércoles</p>
            <h3 className="mt-2 text-xl font-semibold">Urbano</h3>
            <p className="mt-2 text-sm text-black/70">19:00 a 20:15</p>
          </article>
          <article className="rounded-3xl border border-black/10 p-6">
            <p className="text-sm text-black/50">Martes y jueves</p>
            <h3 className="mt-2 text-xl font-semibold">Jazz</h3>
            <p className="mt-2 text-sm text-black/70">18:30 a 19:45</p>
          </article>
          <article className="rounded-3xl border border-black/10 p-6">
            <p className="text-sm text-black/50">Viernes</p>
            <h3 className="mt-2 text-xl font-semibold">Ritmos latinos</h3>
            <p className="mt-2 text-sm text-black/70">20:00 a 21:15</p>
          </article>
        </div>
      </section>

      <section id="precios" className="mx-auto max-w-5xl px-6 pb-24 lg:px-8">
        <div className="rounded-[2rem] border border-black bg-black p-8 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-400">Precios</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Elegí el plan que mejor se adapte a vos.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/70">
              Todos los planes incluyen una clase de prueba para conocer el estudio antes de
              arrancar.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article key={plan.name} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-violet-300">{plan.name}</p>
                <p className="mt-4 text-4xl font-semibold">{plan.price}</p>
                <p className="mt-4 text-sm leading-6 text-white/70">{plan.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
