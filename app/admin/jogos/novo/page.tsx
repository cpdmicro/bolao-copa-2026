"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

const FASES = ["Grupos", "Oitavas", "Quartas", "Semifinal", "3º lugar", "Final"];

export default function NovoJogoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fase, setFase] = useState(FASES[0]);
  const [timeA, setTimeA] = useState("");
  const [timeB, setTimeB] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      const { error } = await supabase.from("jogos").insert({
        fase,
        time_a: timeA,
        time_b: timeB,
        data_hora: new Date(dataHora).toISOString(),
      });

      if (error) {
        toast.error("Não foi possível salvar o jogo.");
        return;
      }

      toast.success("Jogo cadastrado!");
      router.push("/admin");
      router.refresh();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl text-campo">Novo jogo</h1>

      <form onSubmit={salvar} className="space-y-3">
        <select
          value={fase}
          onChange={(e) => setFase(e.target.value)}
          className="w-full rounded-lg border border-campo/20 px-4 py-3 text-sm"
        >
          {FASES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Time A (ex: Brasil)"
          value={timeA}
          onChange={(e) => setTimeA(e.target.value)}
          required
          className="w-full rounded-lg border border-campo/20 px-4 py-3 text-sm"
        />
        <input
          type="text"
          placeholder="Time B (ex: Argentina)"
          value={timeB}
          onChange={(e) => setTimeB(e.target.value)}
          required
          className="w-full rounded-lg border border-campo/20 px-4 py-3 text-sm"
        />
        <input
          type="datetime-local"
          value={dataHora}
          onChange={(e) => setDataHora(e.target.value)}
          required
          className="w-full rounded-lg border border-campo/20 px-4 py-3 text-sm"
        />

        <button
          type="submit"
          disabled={salvando}
          className="w-full rounded-lg bg-campo py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar jogo"}
        </button>
      </form>
    </div>
  );
}
