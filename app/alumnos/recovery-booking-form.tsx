"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import type { ClassesByDay } from "@/lib/airtable";
import type { Dependent, Profile } from "@/lib/supabase/queries";
import {
  formatDateInput,
  formatRecoveryDate,
  getMinimumRecoveryDate,
  getSpanishDayNameFromDate,
} from "@/lib/recoveries";
import { createRecovery } from "./actions";

type RecoveryBookingFormProps = {
  classesByDay: ClassesByDay[];
  profile: Profile | null;
  dependents: Dependent[];
};

const initialState = {
  error: null as string | null,
};

export function RecoveryBookingForm({ classesByDay, profile, dependents }: RecoveryBookingFormProps) {
  const minimumDate = useMemo(() => formatDateInput(getMinimumRecoveryDate()), []);
  const [selectedDate, setSelectedDate] = useState(minimumDate);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [attendeeKind, setAttendeeKind] = useState<"self" | "dependent">("self");
  const [selectedDependentId, setSelectedDependentId] = useState("");
  const [state, formAction, isPending] = useActionState(createRecovery, initialState);
  const accountHolderName = profile?.full_name?.trim() || "Titular de la cuenta";

  const selectedDay = getSpanishDayNameFromDate(selectedDate);
  const classesForSelectedDay = useMemo(
    () =>
      (classesByDay.find((dayGroup) => dayGroup.day === selectedDay)?.classes ?? []).filter(
        (danceClass) => danceClass.isAvailable,
      ),
    [classesByDay, selectedDay],
  );

  useEffect(() => {
    if (!classesForSelectedDay.some((danceClass) => danceClass.id === selectedClassId)) {
      setSelectedClassId(classesForSelectedDay[0]?.id ?? "");
    }
  }, [classesForSelectedDay, selectedClassId]);

  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Anotar recuperación</h3>
        <p className="text-sm leading-7 text-black/65">
          Elegí una fecha con mínimo 2 días de anticipación. Después te mostramos solo las clases
          disponibles para ese día.
        </p>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-black/70">Quién recupera</span>
          <select
            name="attendee_kind"
            value={attendeeKind}
            onChange={(event) => setAttendeeKind(event.target.value as "self" | "dependent")}
            className="w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-black/30"
          >
            <option value="self">{accountHolderName}</option>
            {dependents.length > 0 ? <option value="dependent">Persona a cargo</option> : null}
          </select>
        </label>

        {attendeeKind === "dependent" ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-black/70">Persona a cargo</span>
            <select
              name="dependent_id"
              value={selectedDependentId}
              onChange={(event) => setSelectedDependentId(event.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-black/30"
              required
            >
              <option value="">Elegí una persona</option>
              {dependents.map((dependent) => (
                <option key={dependent.id} value={dependent.id}>
                  {dependent.full_name}
                  {dependent.age !== null ? ` · ${dependent.age} años` : ""}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <input type="hidden" name="dependent_id" value="" />
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-black/70">Fecha de recuperación</span>
          <input
            type="date"
            name="recovery_date"
            min={minimumDate}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-black/30"
            required
          />
        </label>

        <div className="rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-sm text-black/65">
          {selectedDay ? (
            <>Vas a recuperar el {formatRecoveryDate(selectedDate)}.</>
          ) : (
            <>Elegí una fecha válida para ver las clases disponibles.</>
          )}
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-black/70">Clase disponible ese día</span>
          <select
            name="airtable_class_id"
            value={selectedClassId}
            onChange={(event) => setSelectedClassId(event.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-black/30"
            required
            disabled={classesForSelectedDay.length === 0}
          >
            {classesForSelectedDay.length === 0 ? (
              <option value="">No hay clases disponibles para ese día</option>
            ) : null}
            {classesForSelectedDay.map((danceClass) => (
              <option key={danceClass.id} value={danceClass.id}>
                {danceClass.time} · {danceClass.name}
                {danceClass.teacher ? ` · ${danceClass.teacher}` : ""}
              </option>
            ))}
          </select>
        </label>

        {state.error ? (
          <p className="rounded-2xl border border-[#F797A5]/25 bg-[#FFF3F5] px-4 py-3 text-sm text-[#9f4054]">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={
            isPending ||
            classesForSelectedDay.length === 0 ||
            !selectedClassId ||
            (attendeeKind === "dependent" && !selectedDependentId)
          }
          className="rounded-full bg-[#F797A5] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:bg-[#f27f92] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Guardando..." : "Guardar recuperación"}
        </button>
      </form>
    </div>
  );
}
