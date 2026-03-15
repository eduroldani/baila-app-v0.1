const sections = [
  {
    title: "Abonos y pagos",
    items: [
      "Los abonos son mes calendario.",
      "Vencen al cambiar el mes. Se paga del 1 al 10.",
      "No tienen devolución ni se pueden compartir.",
      "Solo tu primer mes, si arrancás corrido, pagás las clases que tomás.",
      "El valor de la clase de prueba se descuenta del abono del mes en curso.",
      "Si elegís pagar clase suelta debés hacerlo antes de tomar la clase. Si no, consideramos que venís el mes completo.",
      "Hay una matrícula anual para reservar tu lugar de marzo a diciembre.",
      "Los meses de julio y diciembre se abonan completo.",
    ],
  },
  {
    title: "Recuperos y uso de clases",
    items: [
      "Si faltás o cae feriado podés recuperar tu clase.",
      "La recuperación puede hacerse en cualquier disciplina acorde a edad y nivel, con previo aviso y dentro del mes.",
      "En la grilla de adultos, podés moverte libre según tus horarios.",
      "Si te quedan clases pendientes no las podés utilizar el mes siguiente.",
      "Las clases que están fuera del abono son: Ritmos Caribeños y Tango.",
      "Si hacés 2 clases en un día cuenta como 2 veces por semana.",
      "Podés combinar disciplinas.",
    ],
  },
  {
    title: "Asistencia y materiales",
    items: [
      "Traé tu botella, toalla y, si hacés yoga, tu mat.",
      "Si no tenés mat, te prestamos.",
      "Usá vestimenta y calzado adecuado.",
      "No se baila en crocs ni con sandalias.",
      "Pedimos puntualidad para comenzar las clases.",
      "Es obligatorio presentar certificado de aptitud física.",
    ],
  },
  {
    title: "Imagen y descuentos",
    items: [
      "Solemos hacer fotos y videos de las clases para subir a nuestras redes sociales y medios institucionales.",
      "Hay descuento por familia: 10% en la segunda cuota.",
      "El descuento se aplica en la cuota de menor valor.",
      "Los pases libres y las clases sueltas no cuentan para descuentos.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white pt-24 text-black">
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-black/55">
            Información general
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Condiciones generales de Baila
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-black/65">
            Estas condiciones ayudan a ordenar inscripciones, pagos, recuperos y documentación
            dentro del estudio.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-8 shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-black/55">
            Para tener en cuenta
          </p>
          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
              >
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-black/70">
                  {section.items.map((item) => (
                    <li key={item} className="border-b border-black/5 pb-3 last:border-b-0 last:pb-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
