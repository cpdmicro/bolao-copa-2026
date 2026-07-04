import { createClient } from "@/lib/supabase/server";
import JogoCard from "@/components/JogoCard";

export default async function HomePage() {
  const supabase = createClient();

  const { data: jogos, error } = await supabase
    .from("jogos")
    .select("*")
    .order("data_hora", { ascending: true });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl text-campo">Jogos da Copa</h1>

      {error && (
        <p className="text-sm text-erro">
          Não foi possível carregar os jogos agora. Tente novamente em instantes.
        </p>
      )}

      {!error && jogos?.length === 0 && (
        <p className="text-sm text-carvao/60">
          Nenhum jogo cadastrado ainda. Volte em breve.
        </p>
      )}

      <div className="space-y-3">
        {jogos?.map((jogo) => (
          <JogoCard key={jogo.id} jogo={jogo} />
        ))}
      </div>
    </div>
  );
}
