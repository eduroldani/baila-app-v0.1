"use client";

import { useActionState } from "react";
import type { Dependent, Profile } from "@/lib/supabase/queries";
import { addDependent, removeDependent, updateHouseholdProfile } from "./actions";

type FormState = {
  error: string | null;
};

const initialState: FormState = {
  error: null,
};

export function HouseholdManager({
  profile,
  dependents,
}: {
  profile: Profile | null;
  dependents: Dependent[];
}) {
  const [profileState, profileAction, isSavingProfile] = useActionState(updateHouseholdProfile, initialState);
  const [dependentState, dependentAction, isSavingDependent] = useActionState(addDependent, initialState);

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <h2 className="text-2xl font-semibold tracking-tight">Titular de la cuenta</h2>
        <p className="mt-2 text-sm leading-7 text-black/65">
          Guardá tu nombre para poder elegirte como persona que recupera.
        </p>

        <form action={profileAction} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-black/70">Tu nombre</span>
            <input
              type="text"
              name="full_name"
              defaultValue={profile?.full_name || ""}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
              placeholder="Edu"
              required
            />
          </label>

          {profileState.error ? (
            <p className="rounded-2xl border border-[#F797A5]/25 bg-[#FFF3F5] px-4 py-3 text-sm text-[#9f4054]">
              {profileState.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSavingProfile}
            className="rounded-full bg-[#F797A5] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:bg-[#f27f92] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingProfile ? "Guardando..." : "Guardar titular"}
          </button>
        </form>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <h2 className="text-2xl font-semibold tracking-tight">Personas a cargo</h2>
        <p className="mt-2 text-sm leading-7 text-black/65">
          Podés sumar hijos u otras personas a cargo para elegir quién recupera en cada reserva.
        </p>

        <form action={dependentAction} className="mt-5 grid gap-4 md:grid-cols-[1fr_140px_auto] md:items-end">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-black/70">Nombre</span>
            <input
              type="text"
              name="full_name"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
              placeholder="Juan"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-black/70">Edad</span>
            <input
              type="number"
              name="age"
              min="0"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
              placeholder="8"
            />
          </label>

          <button
            type="submit"
            disabled={isSavingDependent}
            className="rounded-full bg-[#F797A5] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:bg-[#f27f92] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingDependent ? "Guardando..." : "Agregar"}
          </button>
        </form>

        {dependentState.error ? (
          <p className="mt-4 rounded-2xl border border-[#F797A5]/25 bg-[#FFF3F5] px-4 py-3 text-sm text-[#9f4054]">
            {dependentState.error}
          </p>
        ) : null}

        <div className="mt-5 space-y-3">
          {dependents.length > 0 ? (
            dependents.map((dependent) => (
              <article
                key={dependent.id}
                className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-black">{dependent.full_name}</p>
                  <p className="mt-1 text-sm text-black/55">
                    {dependent.age !== null ? `${dependent.age} años` : "Edad sin cargar"}
                  </p>
                </div>
                <form action={removeDependent}>
                  <input type="hidden" name="dependent_id" value={dependent.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition hover:bg-stone-100"
                  >
                    Quitar
                  </button>
                </form>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/65">
              Todavía no cargaste personas a cargo.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
