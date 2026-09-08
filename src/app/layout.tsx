import type { Metadata } from "next";
import { AppPreloader } from "@/components/branding/AppPreloader";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Anatolab | Explore o corpo humano em 3D",
    template: "%s | Anatolab",
  },
  description:
    "Um acervo educacional para explorar o corpo humano em 3D. Comece pela célula animal e descubra suas estruturas e funções.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <AppPreloader>{children}</AppPreloader>
      </body>
    </html>
  );
}
