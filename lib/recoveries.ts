const spanishWeekDays = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
  const nextDate = startOfLocalDay(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function parseDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

export function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getMinimumRecoveryDate(today = new Date()) {
  return addDays(today, 2);
}

export function isRecoveryDateAllowed(value: string, today = new Date()) {
  const selectedDate = parseDateInput(value);

  if (!selectedDate) {
    return false;
  }

  return startOfLocalDay(selectedDate) >= getMinimumRecoveryDate(today);
}

export function getSpanishDayNameFromDate(value: string) {
  const selectedDate = parseDateInput(value);

  if (!selectedDate) {
    return null;
  }

  return spanishWeekDays[selectedDate.getDay()] ?? null;
}

export function formatRecoveryDate(value: string) {
  const selectedDate = parseDateInput(value);

  if (!selectedDate) {
    return value;
  }

  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(selectedDate);
}

export function isRecoveryCompleted(value: string, today = new Date()) {
  const selectedDate = parseDateInput(value);

  if (!selectedDate) {
    return false;
  }

  return startOfLocalDay(selectedDate) < startOfLocalDay(today);
}
