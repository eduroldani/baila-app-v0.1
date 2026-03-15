"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M19.05 4.94A9.9 9.9 0 0 0 12 2a9.94 9.94 0 0 0-8.7 14.75L2 22l5.4-1.26A9.94 9.94 0 1 0 19.05 4.94ZM12 20.13a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.2.75.77-3.12-.2-.32A8.13 8.13 0 1 1 12 20.13Zm4.46-6.1c-.24-.12-1.4-.7-1.62-.77-.22-.08-.38-.12-.54.11-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.18-1.4-1.32-1.64-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.15 1.52.09.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b border-black/10 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur" : "bg-white/65"
      }`}
    >
      <div className="mx-auto max-w-5xl px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-medium uppercase tracking-[0.3em] text-black">
            Baila Dance Studio
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="/#precios" className="text-sm font-medium text-black/70 transition hover:text-black">
              Precios
            </a>
            <a href="/#alumnos" className="text-sm font-medium text-black/70 transition hover:text-black">
              Alumnos
            </a>
            <Link
              href="/condiciones-generales"
              className="text-sm font-medium text-black/70 transition hover:text-black"
            >
              Condiciones
            </Link>
            <a
              href="https://wa.me/5490000000000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-black/70 transition hover:text-black"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
            <Link
              href="/clases"
              className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold text-black transition hover:bg-stone-100"
            >
              Ver clases
            </Link>
            <a
              href="/#precios"
              className="rounded-full bg-[#F797A5] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#f27f92]"
            >
              Inscribirme
            </a>
          </nav>
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-label="Abrir menú"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 md:hidden"
          >
            <span className="flex w-5 flex-col gap-1">
              <span className="h-0.5 w-full bg-black" />
              <span className="h-0.5 w-full bg-black" />
              <span className="h-0.5 w-full bg-black" />
            </span>
          </button>
        </div>

        {isMenuOpen ? (
          <nav className="mt-4 grid gap-2 rounded-3xl border border-black/10 bg-white p-3 md:hidden">
            <a
              href="/#precios"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-black transition hover:bg-stone-100"
            >
              Precios
            </a>
            <a
              href="/#alumnos"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-black transition hover:bg-stone-100"
            >
              Área alumnos
            </a>
            <Link
              href="/condiciones-generales"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-black transition hover:bg-stone-100"
            >
              Condiciones generales
            </Link>
            <a
              href="https://wa.me/5490000000000"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-black transition hover:bg-stone-100"
            >
              <WhatsAppIcon />
              Hablar por WhatsApp
            </a>
            <Link
              href="/clases"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-black transition hover:bg-stone-100"
            >
              Ver clases
            </Link>
            <a
              href="/#precios"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl bg-[#F797A5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#f27f92]"
            >
              Inscribirme
            </a>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
