export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-4 text-sm text-black/60 md:flex-row md:items-center md:justify-between">
          <p>Baila Dance Studio</p>
          <div className="flex items-center gap-5">
            <a href="/acceso" className="text-black/70 transition hover:text-black">
              Login
            </a>
            <a href="/condiciones-generales" className="text-black/70 transition hover:text-black">
              Condiciones generales
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-black transition hover:text-[#F797A5]"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5ZM17.5 6.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-black/45">
          <p className="inline">
            All rights reserved.{" "}
          </p>
          <a
            href="https://www.linkedin.com/in/eduroldani/"
            target="_blank"
            rel="noreferrer"
            className="inline text-black/55 transition hover:text-[#F797A5]"
          >
            Created by Edu
          </a>
        </div>
      </div>
    </footer>
  );
}
