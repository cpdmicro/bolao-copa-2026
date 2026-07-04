import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function MeusPalpitesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: palpites } = await supabase
    .from("palpites")
    .select("gols_time_a, gols_time_b, pontos, jogos(id, time_a, time_b, data_hora, gols_time_a, gols_time_b, encerrado)")
    .eq("usuario_id", user?.id ?? "")
    .order("jogos(data_hora)", { ascending: true });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl text-campo">Meus palpites</h1>

      {palpites?.length === 0 && (
        <p className="text-sm text-carvao/60">
          Você ainda não fez nenhum palpite.{" "}
          <Link href="/" className="font-semibold text-campo">
            Ver jogos
          </Link>
        </p>
      )}

      <div className="space-y-3">
        {palpites?.map((p: any) => (
          <div
            key={p.jogos.id}
            className="rounded-card border border-campo/10 bg-white p-4"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">
                {p.jogos.time_a} {p.gols_time_a} x {p.gols_time_b} {p.jogos.time_b}
              </span>
              {p.jogos.encerrado ? (
                <span className="rounded-full bg-ouro/20 px-3 py-1 text-xs font-semibold text-ouro-700">
                  {p.pontos ?? 0} pts
                </span>
              ) : (
                <span className="rounded-full bg-campo/10 px-3 py-1 text-xs font-medium text-campo">
                  Aguardando jogo
                </span>
              )}
            </div>
            {p.jogos.encerrado && (
              <p className="mt-1 text-xs text-carvao/50">
                Resultado real: {p.jogos.time_a} {p.jogos.gols_time_a} x{" "}
                {p.jogos.gols_time_b} {p.jogos.time_b}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
