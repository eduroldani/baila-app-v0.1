import { getClassesByDay } from "@/lib/airtable";
import { isRecoveryCompleted } from "@/lib/recoveries";
import {
  getAllRecoveries,
  getCurrentUserRecoveries,
  type AdminRecovery,
  type Recovery,
} from "@/lib/supabase/queries";

type AirtableClassSnapshot = {
  id: string;
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

export type StudentClassRecovery = Recovery & {
  danceClass: AirtableClassSnapshot;
  completed: boolean;
};

export type AdminClassRecovery = AdminRecovery & {
  danceClass: AirtableClassSnapshot;
  completed: boolean;
};

function buildClassesMap(classesByDay: Awaited<ReturnType<typeof getClassesByDay>>) {
  return new Map(
    classesByDay.flatMap((dayGroup) =>
      dayGroup.classes.map((danceClass) => [danceClass.id, { ...danceClass, day: dayGroup.day }] as const),
    ),
  );
}

function mergeRecoveryWithClass<T extends { airtable_class_id: string; recovery_date: string }>(
  recoveries: T[],
  classesMap: Map<string, AirtableClassSnapshot>,
) {
  return recoveries
    .map((recovery) => {
      const danceClass = classesMap.get(recovery.airtable_class_id);

      if (!danceClass) {
        return null;
      }

      return {
        ...recovery,
        danceClass,
        completed: isRecoveryCompleted(recovery.recovery_date),
      };
    })
    .filter((value): value is T & { danceClass: AirtableClassSnapshot; completed: boolean } => value !== null);
}

export async function getCurrentUserClassRecoveries() {
  const [classesByDay, { recoveries, error }] = await Promise.all([
    getClassesByDay(),
    getCurrentUserRecoveries(),
  ]);

  return {
    recoveries: mergeRecoveryWithClass(recoveries, buildClassesMap(classesByDay)) as StudentClassRecovery[],
    error,
  };
}

export async function getAdminClassRecoveries() {
  const [classesByDay, { recoveries, error }] = await Promise.all([
    getClassesByDay(),
    getAllRecoveries(),
  ]);

  return {
    recoveries: mergeRecoveryWithClass(recoveries, buildClassesMap(classesByDay)) as AdminClassRecovery[],
    error,
  };
}
