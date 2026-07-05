"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { bandeiraUrl } from "@/lib/bandeiras";

export default function EditarJogoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [jogo, setJogo] = useState<any>(null);
  const [golsA, setGolsA] = useState(0);
  const [golsB, setGolsB] = useState(0);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("jogos").select("*").eq("id", id).single();
      if (data) {
        setJogo(data);
        setGolsA(data.gols_time_a ?? 0);
        setGolsB(data.gols_time_b ?? 0);
      }
    })();
  }, [id, supabase]);

  async function lancarResultado() {
    setSalvando(true);
    try {
      // chama a função de Postgres que grava o resultado e recalcula os pontos
      // de todos os palpites daquele jogo (ver supabase/schema.sql)
      const { error } = await supabase.rpc("encerrar_jogo", {
        p_jogo_id: id,
        p_gols_time_a: golsA,
        p_gols_time_b: golsB,
      });

      if (error) {
        toast.error("Não foi possível lançar o resultado.");
        return;
      }

      toast.success("Resultado lançado e pontos recalculados!");
      router.push("/admin");
      router.refresh();
    } finally {
      setSalvando(false);
    }
  }

  if (!jogo) return <p className="text-sm text-carvao/60">Carregando...</p>;

  return (
    <div className="space-y-4">
      <h1 className="flex items-center gap-2 font-display text-xl text-campo">
        <img src={bandeiraUrl(jogo.time_a)} alt="" className="h-5 w-8 rounded-sm object-cover" />
        {jogo.time_a} x {jogo.time_b}
        <img src={bandeiraUrl(jogo.time_b)} alt="" className="h-5 w-8 rounded-sm object-cover" />
      </h1>
      <p className="text-sm text-carvao/60">
        {new Date(jogo.data_hora).toLocaleString("pt-BR")}
      </p>

      <div className="rounded-card border border-campo/10 bg-white p-5">
        <div className="mb-4 flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold">{jogo.time_a}</span>
            <input
              type="number"
              min={0}
              value={golsA}
              onChange={(e) => setGolsA(Math.max(0, Number(e.target.value)))}
              className="marcador w-16 rounded-lg border border-campo/20 py-2 text-center text-xl font-bold"
            />
          </div>
          <span className="pt-6 text-lg font-bold text-carvao/40">x</span>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold">{jogo.time_b}</span>
            <input
              type="number"
              min={0}
              value={golsB}
              onChange={(e) => setGolsB(Math.max(0, Number(e.target.value)))}
              className="marcador w-16 rounded-lg border border-campo/20 py-2 text-center text-xl font-bold"
            />
          </div>
        </div>

        <button
          onClick={lancarResultado}
          disabled={salvando || jogo.encerrado}
          className="w-full rounded-lg bg-campo py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {jogo.encerrado
            ? "Jogo já encerrado"
            : salvando
            ? "Lançando..."
            : "Lançar resultado e calcular pontos"}
        </button>
      </div>
    </div>
  );
}
