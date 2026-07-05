"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { bandeira } from "@/lib/bandeiras";

type Props = {
  jogoId: string;
  timeA: string;
  timeB: string;
  dataHora: string;
  encerrado: boolean;
  palpiteExistente: { gols_time_a: number; gols_time_b: number } | null;
};

export default function PalpiteForm({
  jogoId,
  timeA,
  timeB,
  dataHora,
  encerrado,
  palpiteExistente,
}: Props) {
  const supabase = createClient();
  const [golsA, setGolsA] = useState(palpiteExistente?.gols_time_a ?? 0);
  const [golsB, setGolsB] = useState(palpiteExistente?.gols_time_b ?? 0);
  const [salvando, setSalvando] = useState(false);
  const [liberado, setLiberado] = useState(true);

  useEffect(() => {
    const limite = new Date(dataHora).getTime() - 10 * 60 * 1000;

    function checar() {
      setLiberado(Date.now() < limite);
    }

    checar();
    const id = setInterval(checar, 15_000); // revalida a cada 15s
    return () => clearInterval(id);
  }, [dataHora]);

  const bloqueado = encerrado || !liberado;

  async function salvarPalpite() {
    setSalvando(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Sua sessão expirou. Faça login novamente.");
        return;
      }

      const { error } = await supabase.from("palpites").upsert(
        {
          usuario_id: user.id,
          jogo_id: jogoId,
          gols_time_a: golsA,
          gols_time_b: golsB,
        },
        { onConflict: "usuario_id,jogo_id" }
      );

      if (error) {
        // a policy de RLS barra o insert/update fora do prazo -> cai aqui
        toast.error("Não foi possível salvar. Os palpites podem ter encerrado.");
        return;
      }

      toast.success("Palpite salvo!");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="rounded-card border border-campo/10 bg-white p-5">
      <div className="mb-4 flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl leading-none">{bandeira(timeA)}</span>
          <span className="text-sm font-semibold">{timeA}</span>
          <input
            type="number"
            min={0}
            value={golsA}
            disabled={bloqueado}
            onChange={(e) => setGolsA(Math.max(0, Number(e.target.value)))}
            className="marcador w-16 rounded-lg border border-campo/20 py-2 text-center text-xl font-bold disabled:bg-carvao/5"
          />
        </div>

        <span className="pt-9 text-lg font-bold text-carvao/40">x</span>

        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl leading-none">{bandeira(timeB)}</span>
          <span className="text-sm font-semibold">{timeB}</span>
          <input
            type="number"
            min={0}
            value={golsB}
            disabled={bloqueado}
            onChange={(e) => setGolsB(Math.max(0, Number(e.target.value)))}
            className="marcador w-16 rounded-lg border border-campo/20 py-2 text-center text-xl font-bold disabled:bg-carvao/5"
          />
        </div>
      </div>

      {bloqueado ? (
        <p className="text-center text-sm font-medium text-erro">
          {encerrado
            ? "Este jogo já foi encerrado."
            : "Os palpites encerram 10 minutos antes do jogo começar."}
        </p>
      ) : (
        <button
          onClick={salvarPalpite}
          disabled={salvando}
          className="w-full rounded-lg bg-campo py-3 text-sm font-semibold text-white transition hover:bg-campoClaro disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar palpite"}
        </button>
      )}
    </div>
  );
}
