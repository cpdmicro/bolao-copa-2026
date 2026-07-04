"use client";

import Link from "next/link";

export type Jogo = {
  id: string;
  fase: string;
  time_a: string;
  time_b: string;
  data_hora: string;
  gols_time_a: number | null;
  gols_time_b: number | null;
  encerrado: boolean;
};

function palpitesLiberados(dataHoraJogo: string) {
  const limite = new Date(dataHoraJogo).getTime() - 10 * 60 * 1000;
  return Date.now() < limite;
}

export default function JogoCard({ jogo }: { jogo: Jogo }) {
  const liberado = palpitesLiberados(jogo.data_hora);
  const dataFormatada = new Date(jogo.data_hora).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      href={`/jogos/${jogo.id}`}
      className="block rounded-card border border-campo/10 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between text-xs text-carvao/50">
        <span className="uppercase tracking-wide">{jogo.fase}</span>
        <span>{dataFormatada}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="w-2/5 truncate text-sm font-semibold">{jogo.time_a}</span>

        <span className="marcador text-lg font-bold text-campo">
          {jogo.encerrado
            ? `${jogo.gols_time_a} - ${jogo.gols_time_b}`
            : "vs"}
        </span>

        <span className="w-2/5 truncate text-right text-sm font-semibold">
          {jogo.time_b}
        </span>
      </div>

      <div className="mt-3 text-center">
        {jogo.encerrado ? (
          <span className="rounded-full bg-campo/10 px-3 py-1 text-xs font-medium text-campo">
            Encerrado
          </span>
        ) : liberado ? (
          <span className="rounded-full bg-ouro/20 px-3 py-1 text-xs font-medium text-ouro-700">
            Palpites abertos
          </span>
        ) : (
          <span className="rounded-full bg-erro/10 px-3 py-1 text-xs font-medium text-erro">
            Palpites encerrados
          </span>
        )}
      </div>
    </Link>
  );
}
