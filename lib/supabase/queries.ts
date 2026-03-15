import { createClient } from "./server";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "student" | "admin";
  created_at: string;
};

export type Enrollment = {
  id: number;
  student_id: string;
  airtable_class_id: string;
  status: "active" | "cancelled" | "completed";
  created_at: string;
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

export async function getAllProfiles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false });

  return {
    profiles: (data as Profile[] | null) ?? [],
    error,
  };
}

export async function getCurrentUserEnrollments() {
  const { user } = await getCurrentUserWithProfile();

  if (!user) {
    return {
      enrollments: [],
      error: null,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("class_enrollments")
    .select("id, student_id, airtable_class_id, status, created_at")
    .eq("student_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return {
    enrollments: (data as Enrollment[] | null) ?? [],
    error,
  };
}
