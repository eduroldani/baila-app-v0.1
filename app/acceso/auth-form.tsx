"use client";

import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "login" | "signup";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      if (!hasSupabaseEnv()) {
        setMessage("Supabase no está configurado todavía.");
        return;
      }

      const supabase = createClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        router.push("/alumnos");
        router.refresh();
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Cuenta creada. Revisá tu email si tenés confirmación activada.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-black/10 bg-stone-50 p-8 shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
      <div className="inline-flex rounded-2xl border border-black/10 bg-white p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`min-w-[120px] rounded-xl px-5 py-3 text-sm font-semibold transition ${
            mode === "login"
              ? "bg-[#F797A5] text-white shadow-[0_6px_18px_rgba(0,0,0,0.08)]"
              : "text-black/55 hover:bg-stone-100 hover:text-black"
          }`}
        >
          Ingresar
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`min-w-[120px] rounded-xl px-5 py-3 text-sm font-semibold transition ${
            mode === "signup"
              ? "bg-[#F797A5] text-white shadow-[0_6px_18px_rgba(0,0,0,0.08)]"
              : "text-black/55 hover:bg-stone-100 hover:text-black"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "signup" ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-black/70">Nombre completo</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
              placeholder="Tu nombre"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-black/70">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
            placeholder="nombre@email.com"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-black/70">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
            placeholder="********"
            required
          />
        </label>

        {message ? (
          <p className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/65">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#F797A5] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:bg-[#f27f92] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? "Procesando..."
            : mode === "login"
              ? "Ingresar"
              : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}
