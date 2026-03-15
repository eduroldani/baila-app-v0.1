"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function enrollInClass(formData: FormData) {
  const airtableClassId = String(formData.get("airtable_class_id") || "");

  if (!airtableClassId) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase.from("class_enrollments").upsert(
    {
      student_id: user.id,
      airtable_class_id: airtableClassId,
      status: "active",
    },
    {
      onConflict: "student_id,airtable_class_id",
    },
  );

  revalidatePath("/alumnos");
}

export async function cancelEnrollment(formData: FormData) {
  const enrollmentId = Number(formData.get("enrollment_id"));

  if (!enrollmentId) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase
    .from("class_enrollments")
    .delete()
    .eq("id", enrollmentId)
    .eq("student_id", user.id);

  revalidatePath("/alumnos");
}
