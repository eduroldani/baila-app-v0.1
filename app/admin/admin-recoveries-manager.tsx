"use client";

import { useActionState } from "react";
import type { AdminClassRecovery } from "@/lib/class-recoveries";
import { formatRecoveryDate } from "@/lib/recoveries";
import { cancelAdminRecovery } from "./actions";

type ActionState = {
  error: string | null;
  success: string | null;
};

const initialState: ActionState = {
  error: null,
  success: null,
};

function AdminRecoveryCard({ recovery }: { recovery: AdminClassRecovery }) {
  const [cancelState, cancelAction, isCancelling] = useActionState(cancelAdminRecovery, initialState);

  return (
    <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-black/50">{formatRecoveryDate(recovery.recovery_date)}</p>
          <h3 className="mt-2 text-xl font-semibold text-black">
            {recovery.profiles?.full_name || "Sin nombre"}
          </h3>
          <p className="mt-1 text-sm text-black/55">{recovery.profiles?.email || "Sin email"}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            recovery.completed ? "bg-stone-200 text-black/70" : "bg-[#FFF3F5] text-[#9f4054]"
          }`}
        >
          {recovery.completed ? "Ya recuperó" : "Pendiente"}
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-sm text-black/65">
        <p className="font-medium text-black">
          Recupera: {recovery.attendee_name}
          {recovery.attendee_age !== null ? ` · ${recovery.attendee_age} años` : ""}
        </p>
        <p className="font-medium text-black">{recovery.danceClass.name}</p>
        <p className="mt-1">
          {recovery.danceClass.day} · {recovery.danceClass.time}
          {recovery.danceClass.teacher ? ` · ${recovery.danceClass.teacher}` : ""}
        </p>
      </div>

      <form action={cancelAction} className="mt-4">
        <input type="hidden" name="recovery_id" value={recovery.id} />
        <button
          type="submit"
          disabled={isCancelling}
          className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCancelling ? "Cancelando..." : "Cancelar recuperación"}
        </button>
      </form>

      {(cancelState.error || cancelState.success) ? (
        <p
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
            cancelState.error
              ? "border-[#F797A5]/25 bg-[#FFF3F5] text-[#9f4054]"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {cancelState.error || cancelState.success}
        </p>
      ) : null}
    </article>
  );
}

export function AdminRecoveriesManager({ recoveries }: { recoveries: AdminClassRecovery[] }) {
  return (
    <div className="grid gap-5">
      {recoveries.map((recovery) => (
        <AdminRecoveryCard key={recovery.id} recovery={recovery} />
      ))}
    </div>
  );
}
