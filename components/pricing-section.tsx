"use client";

import { useState } from "react";

const pricingByPaymentMethod = {
  transferencia: [
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
  ],
  efectivo: [
    {
      name: "Clase Suelta",
      price: "$8.000",
      description: "Valor promocional abonando en recepción el mismo día.",
    },
    {
      name: "Plan Mensual",
      price: "$30.000",
      description: "Ocho clases por mes con descuento por pago en efectivo.",
    },
    {
      name: "Plan Ilimitado",
      price: "$46.000",
      description: "Todas las clases grupales con la tarifa más baja del estudio.",
    },
  ],
} as const;

type PaymentMethod = keyof typeof pricingByPaymentMethod;

const paymentTabs: { id: PaymentMethod; label: string }[] = [
  { id: "transferencia", label: "Transferencia" },
  { id: "efectivo", label: "Efectivo" },
];

export function PricingSection() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("transferencia");
  const plans = pricingByPaymentMethod[paymentMethod];

  return (
    <section id="precios" className="mx-auto max-w-5xl px-6 pb-24 lg:px-8">
      <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-700">Precios</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Elegí el plan que mejor se adapte a vos.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-black/65">
              Tenemos dos listas de precios según el medio de pago. Cambiá entre
              <span className="font-semibold text-black"> transferencia </span>
              y
              <span className="font-semibold text-black"> efectivo </span>
              para ver el valor correspondiente.
            </p>
          </div>
          <div className="inline-flex rounded-2xl border border-black/10 bg-white p-1.5 shadow-sm">
            {paymentTabs.map((tab) => {
              const isActive = paymentMethod === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPaymentMethod(tab.id)}
                  className={`min-w-[148px] rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-violet-700 text-white shadow-sm"
                      : "text-black/55 hover:bg-stone-100 hover:text-black"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-violet-200 bg-violet-50 px-5 py-4">
          <p className="text-sm font-medium text-violet-900">
            Viendo precios para:{" "}
            <span className="font-semibold">
              {paymentMethod === "transferencia" ? "Transferencia" : "Efectivo"}
            </span>
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-3xl border border-black/10 bg-white p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-violet-700">{plan.name}</p>
              <p className="mt-4 text-4xl font-semibold text-black">{plan.price}</p>
              <p className="mt-4 text-sm leading-6 text-black/65">{plan.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
