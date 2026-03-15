"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold text-black shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition hover:bg-stone-100"
    >
      Cerrar sesión
    </button>
  );
}
