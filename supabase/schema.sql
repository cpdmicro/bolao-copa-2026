-- =========================================================
-- BOLÃO DA COPA DO MUNDO 2026 — SCHEMA COMPLETO (Supabase)
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase.
-- =========================================================

-- Extensão para gen_random_uuid()
create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- 1. USUÁRIOS
-- ---------------------------------------------------------
create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text unique not null,
  senha_hash text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 2. JOGOS
-- ---------------------------------------------------------
create table if not exists jogos (
  id uuid primary key default gen_random_uuid(),
  fase text not null,                 -- 'Grupos', 'Oitavas', 'Quartas', 'Semifinal', 'Final'...
  time_a text not null,
  time_b text not null,
  data_hora timestamptz not null,
  gols_time_a int,                    -- nulo até o admin lançar o resultado
  gols_time_b int,
  encerrado boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_jogos_data_hora on jogos (data_hora);

-- ---------------------------------------------------------
-- 3. PALPITES
-- ---------------------------------------------------------
create table if not exists palpites (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id) on delete cascade,
  jogo_id uuid not null references jogos(id) on delete cascade,
  gols_time_a int not null check (gols_time_a >= 0),
  gols_time_b int not null check (gols_time_b >= 0),
  pontos int,                         -- calculado após o jogo encerrar
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (usuario_id, jogo_id)
);

create index if not exists idx_palpites_jogo on palpites (jogo_id);
create index if not exists idx_palpites_usuario on palpites (usuario_id);

-- trigger simples para manter updated_at em dia
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_palpites_updated_at on palpites;
create trigger trg_palpites_updated_at
before update on palpites
for each row execute function set_updated_at();

-- =========================================================
-- 4. FUNÇÃO DE CÁLCULO DE PONTUAÇÃO
--    Regras:
--    - Placar exato .......................................... 30 pts
--    - Acertou o resultado (vencedor/empate), placar errado .. 14 pts
--    - Idem acima + acertou os gols de pelo menos 1 time ..... 14 + 4 = 18 pts
--    - Errou o resultado ........................................ 0 pts
-- =========================================================
create or replace function calcular_pontos(
  palpite_a int, palpite_b int,
  real_a int, real_b int
) returns int
language plpgsql
immutable
as $$
declare
  resultado_palpite int; -- 1 = time A vence, -1 = time B vence, 0 = empate
  resultado_real int;
  pontos int := 0;
begin
  if palpite_a is null or palpite_b is null or real_a is null or real_b is null then
    return 0;
  end if;

  -- placar exato
  if palpite_a = real_a and palpite_b = real_b then
    return 30;
  end if;

  resultado_palpite := case when palpite_a > palpite_b then 1
                             when palpite_a < palpite_b then -1
                             else 0 end;
  resultado_real := case when real_a > real_b then 1
                          when real_a < real_b then -1
                          else 0 end;

  -- errou o resultado -> 0 pontos, mesmo que acerte gols de 1 time isoladamente
  if resultado_palpite <> resultado_real then
    return 0;
  end if;

  -- acertou o resultado
  pontos := 14;

  -- bônus: acertou os gols de pelo menos uma das equipes
  if palpite_a = real_a or palpite_b = real_b then
    pontos := pontos + 4;
  end if;

  return pontos;
end;
$$;

-- =========================================================
-- 5. FUNÇÃO PARA ENCERRAR UM JOGO E RECALCULAR OS PALPITES
--    Chamada pelo admin ao lançar o resultado real.
-- =========================================================
create or replace function encerrar_jogo(
  p_jogo_id uuid,
  p_gols_time_a int,
  p_gols_time_b int
) returns void
language plpgsql
security definer
as $$
begin
  update jogos
     set gols_time_a = p_gols_time_a,
         gols_time_b = p_gols_time_b,
         encerrado = true
   where id = p_jogo_id;

  update palpites p
     set pontos = calcular_pontos(p.gols_time_a, p.gols_time_b, p_gols_time_a, p_gols_time_b)
   where p.jogo_id = p_jogo_id;
end;
$$;

-- =========================================================
-- 6. VIEW DE RANKING
-- =========================================================
create or replace view ranking as
select
  u.id as usuario_id,
  u.nome,
  coalesce(sum(p.pontos), 0) as pontos_totais,
  count(p.id) filter (where p.pontos is not null) as jogos_pontuados
from usuarios u
left join palpites p on p.usuario_id = u.id
group by u.id, u.nome
order by pontos_totais desc, u.nome asc;

-- =========================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =========================================================
alter table usuarios enable row level security;
alter table jogos enable row level security;
alter table palpites enable row level security;

-- --- USUARIOS -----------------------------------------------------
-- cada usuário lê/edita só o próprio registro; admin lê todos.
drop policy if exists "usuarios_select_proprio_ou_admin" on usuarios;
create policy "usuarios_select_proprio_ou_admin" on usuarios
  for select using (
    id = auth.uid()
    or exists (select 1 from usuarios adm where adm.id = auth.uid() and adm.is_admin)
  );

drop policy if exists "usuarios_update_proprio" on usuarios;
create policy "usuarios_update_proprio" on usuarios
  for update using (id = auth.uid());

-- --- JOGOS ----------------------------------------------------------
-- leitura pública (qualquer usuário autenticado), escrita só admin.
drop policy if exists "jogos_select_publico" on jogos;
create policy "jogos_select_publico" on jogos
  for select using (true);

drop policy if exists "jogos_insert_admin" on jogos;
create policy "jogos_insert_admin" on jogos
  for insert with check (
    exists (select 1 from usuarios adm where adm.id = auth.uid() and adm.is_admin)
  );

drop policy if exists "jogos_update_admin" on jogos;
create policy "jogos_update_admin" on jogos
  for update using (
    exists (select 1 from usuarios adm where adm.id = auth.uid() and adm.is_admin)
  );

-- --- PALPITES ---------------------------------------------------------
-- leitura: o próprio usuário sempre; palpites de outros só depois que o jogo encerrar
-- (assim ninguém "espia" o palpite alheio antes do jogo começar).
drop policy if exists "palpites_select" on palpites;
create policy "palpites_select" on palpites
  for select using (
    usuario_id = auth.uid()
    or exists (select 1 from jogos j where j.id = jogo_id and j.encerrado)
    or exists (select 1 from usuarios adm where adm.id = auth.uid() and adm.is_admin)
  );

-- inserção: só o próprio usuário, e só se faltar mais de 10 minutos para o jogo
drop policy if exists "palpites_insert" on palpites;
create policy "palpites_insert" on palpites
  for insert with check (
    usuario_id = auth.uid()
    and exists (
      select 1 from jogos j
      where j.id = jogo_id
        and j.encerrado = false
        and now() < (j.data_hora - interval '10 minutes')
    )
  );

-- atualização: mesma regra do insert (permite editar o palpite antes do prazo)
drop policy if exists "palpites_update" on palpites;
create policy "palpites_update" on palpites
  for update using (
    usuario_id = auth.uid()
    and exists (
      select 1 from jogos j
      where j.id = jogo_id
        and j.encerrado = false
        and now() < (j.data_hora - interval '10 minutes')
    )
  );

-- =========================================================
-- 8. USUÁRIO ADMIN INICIAL (opcional)
--    Ajuste telefone/senha_hash depois de criar a conta pelo app,
--    então rode um UPDATE para marcar is_admin = true, ex:
--    update usuarios set is_admin = true where telefone = '5511999999999';
-- =========================================================
