import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bailá Dance Studio",
  description: "Clases de danza para todos los niveles en un estudio cálido y enérgico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
