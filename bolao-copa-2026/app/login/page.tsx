"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { telefoneParaEmail } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: telefoneParaEmail(telefone),
        password: senha,
      });

      if (error) {
        toast.error("Telefone ou senha incorretos.");
        return;
      }

      router.push("/");
      router.refresh();
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center">
      <h1 className="mb-1 font-display text-2xl text-campo">Bolão 2026</h1>
      <p className="mb-6 text-sm text-carvao/60">Entre com seu telefone e senha.</p>

      <form onSubmit={entrar} className="space-y-3">
        <input
          type="tel"
          placeholder="Telefone (ex: 11999999999)"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
          className="w-full rounded-lg border border-campo/20 px-4 py-3 text-sm"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full rounded-lg border border-campo/20 px-4 py-3 text-sm"
        />
        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-lg bg-campo py-3 text-sm font-semibold text-white transition hover:bg-campoClaro disabled:opacity-60"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-carvao/60">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-campo">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
