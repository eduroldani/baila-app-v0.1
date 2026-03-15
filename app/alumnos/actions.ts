"use server";

import { revalidatePath } from "next/cache";
import { getSpanishDayNameFromDate, isRecoveryDateAllowed } from "@/lib/recoveries";
import { createClient } from "@/lib/supabase/server";
import { getClassesByDay } from "@/lib/airtable";
import { getCurrentUserDependents, getCurrentUserWithProfile } from "@/lib/supabase/queries";

type FormState = {
  error: string | null;
};

async function ensureCurrentProfile(fullName?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null };
  }

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? "",
      full_name: fullName ?? user.user_metadata.full_name ?? "",
    },
    { onConflict: "id" },
  );

  return { supabase, user };
}

export async function createRecovery(
  _previousState: FormState,
  formData: FormData,
) {
  const airtableClassId = String(formData.get("airtable_class_id") || "");
  const recoveryDate = String(formData.get("recovery_date") || "");
  const attendeeKind = String(formData.get("attendee_kind") || "self");
  const dependentId = Number(formData.get("dependent_id") || 0);

  if (!airtableClassId || !recoveryDate) {
    return { error: "Elegí una fecha y una clase para anotar la recuperación." };
  }

  if (!isRecoveryDateAllowed(recoveryDate)) {
    return { error: "Las recuperaciones se reservan con al menos 2 días de anticipación." };
  }

  const { supabase, user } = await ensureCurrentProfile();
  const { profile } = await getCurrentUserWithProfile();

  if (!user || !profile) {
    return { error: "Necesitás iniciar sesión para reservar una recuperación." };
  }

  const classesByDay = await getClassesByDay();
  const selectedDay = getSpanishDayNameFromDate(recoveryDate);
  const availableClasses = classesByDay.find((dayGroup) => dayGroup.day === selectedDay)?.classes ?? [];
  const selectedClass = availableClasses.find((danceClass) => danceClass.id === airtableClassId);

  if (!selectedClass) {
    return { error: "La clase elegida no corresponde al día seleccionado." };
  }

  if (!selectedClass.isAvailable) {
    return { error: "La clase elegida ya no está disponible para recuperar." };
  }

  let attendeeName = profile.full_name?.trim() || user.email || "";
  let attendeeAge: number | null = null;
  let attendeeDependentId: number | null = null;

  if (attendeeKind === "dependent") {
    const { dependents } = await getCurrentUserDependents();
    const dependent = dependents.find((item) => item.id === dependentId);

    if (!dependent) {
      return { error: "Elegí correctamente qué persona va a recuperar." };
    }

    attendeeName = dependent.full_name;
    attendeeAge = dependent.age;
    attendeeDependentId = dependent.id;
  } else if (!attendeeName) {
    return { error: "Completá tu nombre antes de reservar una recuperación." };
  }

  const { error } = await supabase.from("class_recoveries").upsert(
    {
      student_id: user.id,
      airtable_class_id: airtableClassId,
      recovery_date: recoveryDate,
      attendee_type: attendeeKind === "dependent" ? "dependent" : "self",
      attendee_name: attendeeName,
      attendee_age: attendeeAge,
      attendee_dependent_id: attendeeDependentId,
      status: "active",
    },
    {
      onConflict: "student_id,recovery_date,airtable_class_id,attendee_type,attendee_name",
    },
  );

  if (error) {
    return { error: "No pudimos guardar la recuperación. Intentá de nuevo." };
  }

  revalidatePath("/alumnos");
  revalidatePath("/admin");

  return { error: null };
}

export async function updateHouseholdProfile(_previousState: FormState, formData: FormData) {
  const fullName = String(formData.get("full_name") || "").trim();
  const { user } = await getCurrentUserWithProfile();

  if (!user) {
    return { error: "Necesitás iniciar sesión para actualizar tu perfil." };
  }

  if (!fullName) {
    return { error: "Completá tu nombre para guardar el perfil." };
  }

  const { supabase } = await ensureCurrentProfile(fullName);
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (error) {
    return { error: "No pudimos guardar tu nombre." };
  }

  revalidatePath("/alumnos");

  return { error: null };
}

export async function addDependent(_previousState: FormState, formData: FormData) {
  const fullName = String(formData.get("full_name") || "").trim();
  const ageRaw = String(formData.get("age") || "").trim();
  const age = ageRaw ? Number(ageRaw) : null;
  const { user } = await getCurrentUserWithProfile();

  if (!user) {
    return { error: "Necesitás iniciar sesión para agregar personas a cargo." };
  }

  if (!fullName) {
    return { error: "Completá el nombre de la persona a cargo." };
  }

  if (ageRaw && (!Number.isFinite(age) || age! < 0)) {
    return { error: "La edad tiene que ser un número válido." };
  }

  const { supabase } = await ensureCurrentProfile();
  const { error } = await supabase.from("dependents").insert({
    guardian_id: user.id,
    full_name: fullName,
    age,
  });

  if (error) {
    return { error: "No pudimos guardar esta persona a cargo." };
  }

  revalidatePath("/alumnos");

  return { error: null };
}

export async function removeDependent(formData: FormData) {
  const dependentId = Number(formData.get("dependent_id"));
  const { user } = await getCurrentUserWithProfile();

  if (!user || !dependentId) {
    return;
  }

  const supabase = await createClient();
  await supabase.from("dependents").delete().eq("id", dependentId).eq("guardian_id", user.id);
  revalidatePath("/alumnos");
}

export async function cancelRecovery(formData: FormData) {
  const recoveryId = Number(formData.get("recovery_id"));

  if (!recoveryId) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { error } = await supabase
    .from("class_recoveries")
    .delete()
    .eq("id", recoveryId)
    .eq("student_id", user.id);

  if (error) {
    return;
  }

  revalidatePath("/alumnos");
  revalidatePath("/admin");
}
