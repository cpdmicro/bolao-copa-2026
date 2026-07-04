import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Bolão da Copa 2026",
  description: "Registre seus palpites da Copa do Mundo 2026 e dispute o ranking com a galera.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen font-body">
        <Navbar />
        <main className="mx-auto max-w-md px-4 pb-24 pt-4 sm:max-w-2xl">
          {children}
        </main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
