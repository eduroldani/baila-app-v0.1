"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserWithProfile } from "@/lib/supabase/queries";

type AdminRecoveryActionState = {
  error: string | null;
  success: string | null;
};

async function ensureAdmin() {
  const { user, profile } = await getCurrentUserWithProfile();

  if (!user || profile?.role !== "admin") {
    return null;
  }

  return user;
}

export async function cancelAdminRecovery(
  _previousState: AdminRecoveryActionState,
  formData: FormData,
) {
  const recoveryId = Number(formData.get("recovery_id"));

  if (!recoveryId) {
    return { error: "No encontramos la recuperación a cancelar.", success: null };
  }

  const adminUser = await ensureAdmin();

  if (!adminUser) {
    return { error: "Necesitás entrar como admin para cancelar recuperaciones.", success: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("class_recoveries").delete().eq("id", recoveryId);

  if (error) {
    return { error: "No pudimos cancelar esta recuperación.", success: null };
  }

  revalidatePath("/admin");
  revalidatePath("/alumnos");

  return { error: null, success: "Recuperación cancelada." };
}
