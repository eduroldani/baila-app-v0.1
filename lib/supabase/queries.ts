import { createClient } from "./server";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "student" | "admin";
  created_at: string;
};

export type Dependent = {
  id: number;
  guardian_id: string;
  full_name: string;
  age: number | null;
  created_at: string;
};

export type Recovery = {
  id: number;
  student_id: string;
  airtable_class_id: string;
  recovery_date: string;
  attendee_type: "self" | "dependent";
  attendee_name: string;
  attendee_age: number | null;
  attendee_dependent_id: number | null;
  status: "active" | "cancelled";
  created_at: string;
};

export type AdminRecovery = Recovery & {
  profiles: {
    full_name: string | null;
    email: string;
  } | null;
};

export async function getCurrentUserWithProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, profileError: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return {
    user,
    profile: profile ?? null,
    profileError,
  };
}

export async function getCurrentUserDependents() {
  const { user } = await getCurrentUserWithProfile();

  if (!user) {
    return {
      dependents: [],
      error: null,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dependents")
    .select("id, guardian_id, full_name, age, created_at")
    .eq("guardian_id", user.id)
    .order("created_at", { ascending: true });

  return {
    dependents: (data as Dependent[] | null) ?? [],
    error,
  };
}

export async function getCurrentUserRecoveries() {
  const { user } = await getCurrentUserWithProfile();

  if (!user) {
    return {
      recoveries: [],
      error: null,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("class_recoveries")
    .select(
      "id, student_id, airtable_class_id, recovery_date, attendee_type, attendee_name, attendee_age, attendee_dependent_id, status, created_at",
    )
    .eq("student_id", user.id)
    .eq("status", "active")
    .order("recovery_date", { ascending: true })
    .order("created_at", { ascending: false });

  return {
    recoveries: (data as Recovery[] | null) ?? [],
    error,
  };
}

export async function getAllRecoveries() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("class_recoveries")
    .select(
      "id, student_id, airtable_class_id, recovery_date, attendee_type, attendee_name, attendee_age, attendee_dependent_id, status, created_at, profiles(full_name, email)",
    )
    .eq("status", "active")
    .order("recovery_date", { ascending: true })
    .order("created_at", { ascending: false });

  return {
    recoveries: (data as AdminRecovery[] | null) ?? [],
    error,
  };
}
