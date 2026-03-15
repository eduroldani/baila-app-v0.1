import Link from "next/link";
import { PricingSection } from "@/components/pricing-section";
import { flattenClasses, getClassesByDay, getPricingByPaymentMethod } from "@/lib/airtable";

export default async function Home() {
  const classesByDay = await getClassesByDay();
  const pricingByPaymentMethod = await getPricingByPaymentMethod();
  const featuredClasses = flattenClasses(classesByDay).slice(0, 3);

  return (
    <main className="min-h-screen bg-white pt-24 text-black">
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-black">
              Baila Dance Studio
            </p>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
              Clases de baile con horarios claros, profes reales y una propuesta fácil de elegir.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">
              Un estudio pensado para quienes quieren empezar, retomar o entrenar con más
              constancia. Encontrá la clase que mejor se adapte a tu nivel y revisá precios en un
              solo lugar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/clases"
                className="rounded-full bg-[#F797A5] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#f27f92]"
              >
                Ver clases disponibles
              </Link>
              <a
                href="#precios"
                className="rounded-full border border-black px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                Ver precios
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="clases" className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-black">
              Sobre el estudio
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Un espacio simple, cuidado y enfocado en que cada clase se disfrute.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-black/65">
            Encontrá clases con nivel, profesor y horario actualizado. La propuesta está pensada
            para que elegir sea rápido y claro, sin cargar la experiencia con información de más.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {featuredClasses.map((danceClass) => (
            <article
              key={`${danceClass.day}-${danceClass.name}-summary`}
              className="rounded-3xl border border-black/10 p-6"
            >
              <p className="text-sm text-black/50">{danceClass.day}</p>
              <h3 className="mt-2 text-xl font-semibold">{danceClass.name}</h3>
              <p className="mt-3 text-sm text-black/65">{danceClass.teacher}</p>
              <p className="mt-1 text-sm text-black/65">{danceClass.time}</p>
              {danceClass.location ? <p className="mt-1 text-sm text-black/50">{danceClass.location}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <PricingSection pricingByPaymentMethod={pricingByPaymentMethod} />

      <section id="alumnos" className="mx-auto max-w-5xl px-6 pb-20 pt-6 lg:px-8">
        <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-8">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-black">
                Área alumnos
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Un espacio aparte para enviar documentación rápida.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-3xl border border-black/10 bg-white p-6">
                <h3 className="text-lg font-semibold">Subir comprobante</h3>
                <p className="mt-3 text-sm leading-6 text-black/65">
                  Si ya sos alumno, podés enviar tu comprobante de pago para validar la inscripción.
                </p>
                <a
                  href="https://wa.me/5490000000000?text=Hola%2C%20quiero%20enviar%20mi%20comprobante%20de%20pago."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex rounded-full border border-black px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
                >
                  Enviar comprobante
                </a>
              </article>
              <article className="rounded-3xl border border-black/10 bg-white p-6">
                <h3 className="text-lg font-semibold">Subir certificado médico</h3>
                <p className="mt-3 text-sm leading-6 text-black/65">
                  También podés enviar tu certificado médico para mantener tu ficha actualizada.
                </p>
                <a
                  href="https://wa.me/5490000000000?text=Hola%2C%20quiero%20enviar%20mi%20certificado%20m%C3%A9dico."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex rounded-full border border-black px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
                >
                  Enviar certificado
                </a>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
