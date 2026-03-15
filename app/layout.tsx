import { Footer } from "@/components/footer";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baila Dance Studio",
  description: "Clases de danza para todos los niveles en un estudio cálido y enérgico.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accessHref = "/acceso";
  const accessLabel = "Acceso";

  return (
    <html lang="es">
      <body>
        <Navbar accessHref={accessHref} accessLabel={accessLabel} />
        {children}
        <Footer accessHref={accessHref} accessLabel={accessLabel} />
      </body>
    </html>
  );
}
