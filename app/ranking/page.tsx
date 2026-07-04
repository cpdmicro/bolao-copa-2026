import { createClient } from "@/lib/supabase/server";

export default async function RankingPage() {
  const supabase = createClient();

  const { data: ranking } = await supabase
    .from("ranking") // view criada em supabase/schema.sql
    .select("*");

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl text-campo">Ranking geral</h1>

      <div className="overflow-hidden rounded-card border border-campo/10 bg-white">
        {ranking?.map((linha, i) => (
          <div
            key={linha.usuario_id}
            className={`flex items-center justify-between px-4 py-3 text-sm ${
              i !== ranking.length - 1 ? "border-b border-campo/5" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  i === 0
                    ? "bg-ouro text-white"
                    : i === 1
                    ? "bg-carvao/20 text-carvao"
                    : i === 2
                    ? "bg-ouro/30 text-ouro-700"
                    : "bg-campo/5 text-carvao/50"
                }`}
              >
                {i + 1}
              </span>
              <span className="font-medium">{linha.nome}</span>
            </div>
            <span className="font-display text-campo">{linha.pontos_totais} pts</span>
          </div>
        ))}

        {ranking?.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-carvao/60">
            Ninguém pontuou ainda. O ranking aparece assim que o primeiro jogo encerrar.
          </p>
        )}
      </div>
    </div>
  );
}
