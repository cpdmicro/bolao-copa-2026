"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { telefoneParaEmail, normalizarTelefone } from "@/lib/auth";

export default function CadastroPage() {
  const router = useRouter();
  const supabase = createClient();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();

    if (senha.length < 6) {
      toast.error("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: telefoneParaEmail(telefone),
        password: senha,
      });

      if (error || !data.user) {
        toast.error(
          error?.message.includes("already registered")
            ? "Já existe uma conta com esse telefone."
            : "Não foi possível criar a conta. Verifique os dados."
        );
        return;
      }

      const { error: erroPerfil } = await supabase.from("usuarios").insert({
        id: data.user.id,
        nome,
        telefone: normalizarTelefone(telefone),
        senha_hash: "gerenciado-pelo-supabase-auth",
      });

      if (erroPerfil) {
        toast.error("Conta criada, mas houve um erro ao salvar seu perfil.");
        return;
      }

      toast.success("Conta criada! Bem-vindo(a) ao bolão.");
      router.push("/");
      router.refresh();
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center">
      <h1 className="mb-1 font-display text-2xl text-campo">Criar conta</h1>
      <p className="mb-6 text-sm text-carvao/60">
        Entre no bolão da galera em menos de 1 minuto.
      </p>

      <form onSubmit={cadastrar} className="space-y-3">
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="w-full rounded-lg border border-campo/20 px-4 py-3 text-sm"
        />
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
          placeholder="Crie uma senha (mín. 6 caracteres)"
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
          {carregando ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-carvao/60">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-campo">
          Entrar
        </Link>
      </p>
    </div>
  );
}
