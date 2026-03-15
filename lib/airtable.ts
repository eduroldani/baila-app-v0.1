const fallbackClassesByDay = [
  {
    day: "Lunes",
    classes: [
      {
        name: "Salsa Inicial",
        type: "Salsa",
        level: "Principiante",
        teacher: "Ana Torres",
        time: "18:00-19:00",
        location: "Ven Street Center",
        isAvailable: true,
        availableSpots: 12,
      },
    ],
  },
  {
    day: "Martes",
    classes: [
      {
        name: "Bachata Open",
        type: "Bachata",
        level: "Todos los niveles",
        teacher: "Carlos Medina",
        time: "19:00-20:00",
        location: "Ven Street Center",
        isAvailable: true,
        availableSpots: 10,
      },
    ],
  },
  {
    day: "Miércoles",
    classes: [
      {
        name: "Heels Technique",
        type: "Heels",
        level: "Intermedio",
        teacher: "Lucia Gomez",
        time: "20:00-21:00",
        location: "Ven Street Center",
        isAvailable: true,
        availableSpots: 8,
      },
    ],
  },
  {
    day: "Jueves",
    classes: [
      {
        name: "Reggaeton Basics",
        type: "Reggaeton",
        level: "Principiante",
        teacher: "Diego Ramirez",
        time: "18:00-19:00",
        location: "Ven Street Center",
        isAvailable: true,
        availableSpots: 14,
      },
    ],
  },
  {
    day: "Viernes",
    classes: [
      {
        name: "Contemporaneo Flow",
        type: "Contemporáneo",
        level: "Intermedio",
        teacher: "Sofia Alvarez",
        time: "19:00-20:30",
        location: "Ven Street Center",
        isAvailable: true,
        availableSpots: 6,
      },
    ],
  },
] as const;

const fallbackPricingByPaymentMethod = {
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

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

type AirtableResponse = {
  offset?: string;
  records?: AirtableRecord[];
};

type ClassItem = {
  day: string;
  name: string;
  type: string;
  level: string;
  teacher: string;
  time: string;
  location: string;
  isAvailable: boolean;
  availableSpots: number | null;
};

export type ClassesByDay = {
  day: string;
  classes: {
    name: string;
    type: string;
    level: string;
    teacher: string;
    time: string;
    location: string;
    isAvailable: boolean;
    availableSpots: number | null;
  }[];
};

export type StudioStats = {
  classCount: number;
  teacherCount: number;
  disciplineCount: number;
  daysCount: number;
};

export type PaymentMethod = "transferencia" | "efectivo";

export type PricingPlan = {
  name: string;
  price: string;
  description: string;
};

export type PricingByPaymentMethod = Record<PaymentMethod, PricingPlan[]>;

const dayOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const normalizedDays: Record<string, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  miércoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  sábado: "Sábado",
  domingo: "Domingo",
};

function firstString(fields: Record<string, unknown>, candidates: string[]) {
  for (const candidate of candidates) {
    const value = fields[candidate];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function firstNumber(fields: Record<string, unknown>, candidates: string[]) {
  for (const candidate of candidates) {
    const value = fields[candidate];
    if (typeof value === "number") {
      return value;
    }
  }

  return null;
}

function firstBoolean(fields: Record<string, unknown>, candidates: string[]) {
  for (const candidate of candidates) {
    const value = fields[candidate];
    if (typeof value === "boolean") {
      return value;
    }
  }

  return true;
}

function formatPrice(value: string | number) {
  if (typeof value === "number") {
    return `$${new Intl.NumberFormat("es-AR").format(value)}`;
  }

  return value.startsWith("$") ? value : `$${value}`;
}

async function fetchAirtableRecords(tableId: string, view?: string) {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId || !tableId) {
    return null;
  }

  const records: AirtableRecord[] = [];
  let offset = "";

  do {
    const query = new URLSearchParams();
    if (view) {
      query.set("view", view);
    }
    if (offset) {
      query.set("offset", offset);
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as AirtableResponse;
    records.push(...(data.records ?? []));
    offset = data.offset ?? "";
  } while (offset);

  return records;
}

function sortByTime(a: { time: string }, b: { time: string }) {
  return a.time.localeCompare(b.time);
}

function normalizeClass(record: AirtableRecord): ClassItem | null {
  const name = firstString(record.fields, ["NombreClase", "Clase", "Nombre", "name", "className"]);
  const type = firstString(record.fields, ["Tipo", "type"]);
  const level = firstString(record.fields, ["Nivel", "level"]);
  const teacher = firstString(record.fields, ["Profesor", "teacher"]);
  const rawDay = firstString(record.fields, ["Día", "Dia", "day"]);
  const time = firstString(record.fields, ["Horario", "Hora", "time", "schedule"]);
  const location = firstString(record.fields, ["Ubicacion", "Ubicación", "Location", "location"]);
  const day = normalizedDays[rawDay.toLowerCase()] ?? rawDay;
  const availableSpots = firstNumber(record.fields, ["CuposDisponibles", "availableSpots"]);
  const isAvailableField = firstBoolean(record.fields, ["Disponible", "available"]);
  const isAvailable = availableSpots !== null ? availableSpots > 0 && isAvailableField : isAvailableField;

  if (!name || !day || !time) {
    return null;
  }

  return {
    name,
    type,
    level,
    teacher,
    day,
    time,
    location,
    isAvailable,
    availableSpots,
  };
}

function groupClassesByDay(classes: ClassItem[]): ClassesByDay[] {
  const grouped = new Map<
    string,
    {
      name: string;
      type: string;
      level: string;
      teacher: string;
      time: string;
      location: string;
      isAvailable: boolean;
      availableSpots: number | null;
    }[]
  >();

  for (const danceClass of classes) {
    const existing = grouped.get(danceClass.day) ?? [];
    existing.push({
      name: danceClass.name,
      type: danceClass.type,
      level: danceClass.level,
      teacher: danceClass.teacher,
      time: danceClass.time,
      location: danceClass.location,
      isAvailable: danceClass.isAvailable,
      availableSpots: danceClass.availableSpots,
    });
    grouped.set(danceClass.day, existing);
  }

  return [...grouped.entries()]
    .sort((a, b) => dayOrder.indexOf(a[0]) - dayOrder.indexOf(b[0]))
    .map(([day, dayClasses]) => ({
      day,
      classes: dayClasses.sort(sortByTime),
    }));
}

export function getFallbackClassesByDay(): ClassesByDay[] {
  return fallbackClassesByDay.map((dayGroup) => ({
    day: dayGroup.day,
    classes: [...dayGroup.classes],
  }));
}

export function flattenClasses(classesByDay: ClassesByDay[]) {
  return classesByDay.flatMap((dayGroup) =>
    dayGroup.classes.map((danceClass) => ({
      day: dayGroup.day,
      ...danceClass,
    })),
  );
}

export function getStudioStats(classesByDay: ClassesByDay[]): StudioStats {
  const classes = flattenClasses(classesByDay);
  const teachers = new Set(classes.map((danceClass) => danceClass.teacher).filter(Boolean));
  const disciplines = new Set(classes.map((danceClass) => danceClass.type).filter(Boolean));

  return {
    classCount: classes.length,
    teacherCount: teachers.size,
    disciplineCount: disciplines.size,
    daysCount: classesByDay.length,
  };
}

export async function getClassesByDay(): Promise<ClassesByDay[]> {
  const tableId = process.env.AIRTABLE_TABLE_ID;
  const view = process.env.AIRTABLE_VIEW;

  if (!tableId) {
    return getFallbackClassesByDay();
  }

  try {
    const records = await fetchAirtableRecords(tableId, view);

    if (!records) {
      return getFallbackClassesByDay();
    }

    const classes = records.map(normalizeClass).filter((value): value is ClassItem => value !== null);

    if (classes.length === 0) {
      return getFallbackClassesByDay();
    }

    return groupClassesByDay(classes);
  } catch {
    return getFallbackClassesByDay();
  }
}

function normalizePricingPlan(record: AirtableRecord) {
  const name = firstString(record.fields, ["Plan", "Nombre", "name"]);
  const description = firstString(record.fields, ["Descripcion", "Descripción", "description"]);
  const efectivoNumericPrice = firstNumber(record.fields, ["PrecioEfectivo", "Precio", "price", "Valor"]);
  const efectivoStringPrice = firstString(record.fields, ["PrecioEfectivo", "PrecioTexto", "Precio", "priceLabel"]);
  const transferenciaNumericPrice = firstNumber(record.fields, [
    "PrecioTransferencia",
    "precioTransferencia",
    "Transferencia",
    "priceTransferencia",
  ]);
  const transferenciaStringPrice = firstString(record.fields, [
    "PrecioTransferencia",
    "precioTransferencia",
    "Transferencia",
    "priceTransferencia",
  ]);

  const efectivoPrice = efectivoNumericPrice ?? efectivoStringPrice;
  const transferenciaPrice = transferenciaNumericPrice ?? transferenciaStringPrice;

  if (!name || efectivoPrice === null || efectivoPrice === "" || transferenciaPrice === null || transferenciaPrice === "") {
    return null;
  }

  return {
    efectivo: {
      name,
      price: formatPrice(efectivoPrice),
      description: description || "Consultá el detalle del plan con el estudio.",
    },
    transferencia: {
      name,
      price: formatPrice(transferenciaPrice),
      description: description || "Consultá el detalle del plan con el estudio.",
    },
  };
}

export function getFallbackPricingByPaymentMethod(): PricingByPaymentMethod {
  return {
    transferencia: [...fallbackPricingByPaymentMethod.transferencia],
    efectivo: [...fallbackPricingByPaymentMethod.efectivo],
  };
}

export async function getPricingByPaymentMethod(): Promise<PricingByPaymentMethod> {
  const tableId = process.env.AIRTABLE_PRICING_TABLE_ID;
  const view = process.env.AIRTABLE_PRICING_VIEW;

  if (!tableId) {
    return getFallbackPricingByPaymentMethod();
  }

  try {
    const records = await fetchAirtableRecords(tableId, view);

    if (!records) {
      return getFallbackPricingByPaymentMethod();
    }

    const normalizedPlans = records
      .map(normalizePricingPlan)
      .filter((value): value is NonNullable<ReturnType<typeof normalizePricingPlan>> => value !== null);

    if (normalizedPlans.length === 0) {
      return getFallbackPricingByPaymentMethod();
    }

    const grouped: PricingByPaymentMethod = {
      transferencia: [],
      efectivo: [],
    };

    for (const item of normalizedPlans) {
      grouped.efectivo.push(item.efectivo);
      grouped.transferencia.push(item.transferencia);
    }

    if (grouped.transferencia.length === 0 || grouped.efectivo.length === 0) {
      return getFallbackPricingByPaymentMethod();
    }

    return grouped;
  } catch {
    return getFallbackPricingByPaymentMethod();
  }
}
