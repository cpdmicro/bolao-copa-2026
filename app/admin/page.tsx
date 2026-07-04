import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: perfil } = await supabase
    .from("usuarios")
    .select("is_admin")
    .eq("id", user?.id ?? "")
    .single();

  if (!perfil?.is_admin) redirect("/");

  const { data: jogos } = await supabase
    .from("jogos")
    .select("*")
    .order("data_hora", { ascending: true });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl text-campo">Área do admin</h1>
        <Link
          href="/admin/jogos/novo"
          className="rounded-lg bg-campo px-3 py-2 text-xs font-semibold text-white"
        >
          + Novo jogo
        </Link>
      </div>

      <div className="space-y-2">
        {jogos?.map((jogo) => (
          <Link
            key={jogo.id}
            href={`/admin/jogos/${jogo.id}/editar`}
            className="flex items-center justify-between rounded-card border border-campo/10 bg-white p-4 text-sm"
          >
            <div>
              <p className="font-semibold">
                {jogo.time_a} x {jogo.time_b}
              </p>
              <p className="text-xs text-carvao/50">
                {new Date(jogo.data_hora).toLocaleString("pt-BR")}
              </p>
            </div>
            {jogo.encerrado ? (
              <span className="rounded-full bg-campo/10 px-3 py-1 text-xs font-medium text-campo">
                {jogo.gols_time_a} x {jogo.gols_time_b}
              </span>
            ) : (
              <span className="rounded-full bg-ouro/20 px-3 py-1 text-xs font-medium text-ouro-700">
                Lançar resultado
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
