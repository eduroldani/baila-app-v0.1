"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

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
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 lg:px-8">
        <Link href="/" className="text-sm font-medium uppercase tracking-[0.3em] text-violet-700">
          Baila App v1
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/clases"
            className="rounded-full border border-black px-5 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
          >
            Clases
          </Link>
          <a
            href="/#precios"
            className="rounded-full bg-violet-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            Inscribirme
          </a>
        </nav>
      </div>
    </header>
  );
}
