import Link from "next/link";
import type { AdminClassRecovery } from "@/lib/class-recoveries";
import {
  addDays,
  addMonths,
  formatDateInput,
  formatMonthInput,
  formatMonthLabel,
  parseMonthInput,
} from "@/lib/recoveries";

const weekDays = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

function getCalendarDays(month: string) {
  const monthDate = parseMonthInput(month) ?? new Date();
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const gridStart = addDays(firstDay, -offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    return {
      date,
      value: formatDateInput(date),
      isCurrentMonth: date.getMonth() === monthDate.getMonth(),
    };
  });
}

export function RecoveriesCalendar({
  recoveries,
  month,
  selectedDate,
}: {
  recoveries: AdminClassRecovery[];
  month: string;
  selectedDate: string | null;
}) {
  const monthDate = parseMonthInput(month) ?? new Date();
  const previousMonth = formatMonthInput(addMonths(monthDate, -1));
  const nextMonth = formatMonthInput(addMonths(monthDate, 1));
  const counts = new Map<string, number>();

  for (const recovery of recoveries) {
    counts.set(recovery.recovery_date, (counts.get(recovery.recovery_date) ?? 0) + 1);
  }

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-4 border-b border-black/10 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Calendario de recuperaciones</h2>
          <p className="mt-1 text-sm text-black/55">
            Mirá cuántas personas recuperan por día y abrí el detalle de una fecha puntual.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin?month=${previousMonth}`}
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black transition hover:bg-stone-100"
          >
            Mes anterior
          </Link>
          <span className="min-w-[160px] text-center text-sm font-semibold capitalize text-black">
            {formatMonthLabel(month)}
          </span>
          <Link
            href={`/admin?month=${nextMonth}`}
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black transition hover:bg-stone-100"
          >
            Mes siguiente
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-black/10">
        {weekDays.map((weekDay) => (
          <div key={weekDay} className="bg-stone-50 px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
            {weekDay}
          </div>
        ))}

        {getCalendarDays(month).map((day) => {
          const count = counts.get(day.value) ?? 0;
          const isSelected = selectedDate === day.value;

          return (
            <div
              key={day.value}
              className={`min-h-[124px] bg-white p-3 transition ${
                day.isCurrentMonth ? "text-black" : "text-black/30"
              } ${isSelected ? "ring-2 ring-inset ring-[#F797A5]" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold">{day.date.getDate()}</span>
                {count > 0 ? (
                  <span className="rounded-full bg-[#FFF3F5] px-2 py-1 text-xs font-semibold text-[#9f4054]">
                    {count}
                  </span>
                ) : null}
              </div>

              <div className="mt-4">
                {count > 0 ? (
                  <Link
                    href={`/admin?month=${month}&date=${day.value}#detalle-dia`}
                    className="inline-flex rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-stone-100"
                  >
                    Ver mas
                  </Link>
                ) : (
                  <span className="text-xs text-black/35">Sin recuperaciones</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
