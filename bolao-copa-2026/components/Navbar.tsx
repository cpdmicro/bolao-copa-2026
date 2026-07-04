"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/", label: "Jogos" },
  { href: "/meus-palpites", label: "Meus palpites" },
  { href: "/ranking", label: "Ranking" },
];

export default function Navbar() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/cadastro") return null;

  return (
    <>
      {/* topo */}
      <header className="sticky top-0 z-10 border-b border-campo/10 bg-marfim/90 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3 sm:max-w-2xl">
          <span className="font-display text-lg tracking-tight text-campo">
            BOLÃO 2026
          </span>
          <span className="rounded-full bg-ouro/20 px-2 py-1 text-xs font-semibold text-ouro-700">
            ⚽ Copa do Mundo
          </span>
        </div>
      </header>

      {/* navegação inferior (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-campo/10 bg-white">
        <div className="mx-auto flex max-w-md justify-around sm:max-w-2xl">
          {ITENS.map((item) => {
            const ativo = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                  ativo ? "text-campo" : "text-carvao/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
