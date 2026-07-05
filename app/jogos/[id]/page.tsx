import { createClient } from "@/lib/supabase/server";
import PalpiteForm from "@/components/PalpiteForm";
import { notFound } from "next/navigation";
import { bandeiraUrl } from "@/lib/bandeiras";

export default async function JogoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: jogo } = await supabase
    .from("jogos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!jogo) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: palpite } = user
    ? await supabase
        .from("palpites")
        .select("gols_time_a, gols_time_b")
        .eq("jogo_id", jogo.id)
        .eq("usuario_id", user.id)
        .maybeSingle()
    : { data: null };

  const dataFormatada = new Date(jogo.data_hora).toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-carvao/50">{jogo.fase}</p>
        <h1 className="flex items-center gap-2 font-display text-lg text-campo">
          <img src={bandeiraUrl(jogo.time_a)} alt="" className="h-5 w-8 rounded-sm object-cover" />
          {jogo.time_a} x {jogo.time_b}
          <img src={bandeiraUrl(jogo.time_b)} alt="" className="h-5 w-8 rounded-sm object-cover" />
        </h1>
        <p className="text-sm text-carvao/60">{dataFormatada}</p>
      </div>

      <PalpiteForm
        jogoId={jogo.id}
        timeA={jogo.time_a}
        timeB={jogo.time_b}
        dataHora={jogo.data_hora}
        encerrado={jogo.encerrado}
        palpiteExistente={palpite ?? null}
      />

      <div className="rounded-card bg-campo/5 p-4 text-xs text-carvao/60">
        <p className="font-semibold text-campo">Como funciona a pontuação:</p>
        <ul className="mt-1 list-disc space-y-1 pl-4">
          <li>Placar exato: 30 pontos</li>
          <li>Acertou o resultado, errou o placar: 14 pontos</li>
          <li>Acertou o resultado + gols de um dos times: 18 pontos</li>
          <li>Errou o resultado: 0 pontos</li>
        </ul>
      </div>
    </div>
  );
}
