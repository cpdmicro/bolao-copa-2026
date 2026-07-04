# Bolão da Copa do Mundo 2026 ⚽

App web para grupos de amigos apostarem palpites nos jogos da Copa, com
pontuação calculada automaticamente e ranking geral.

**Stack:** Next.js 14 (App Router) · Supabase (Postgres + Auth + RLS) · Tailwind CSS

## Regras de pontuação

| Situação | Pontos |
|---|---|
| Placar exato | 30 |
| Acertou o resultado (vencedor/empate), errou o placar | 14 |
| Acertou o resultado + gols de pelo menos um dos times | 14 + 4 = 18 |
| Errou o resultado | 0 |

A regra vive em duas camadas, sempre com o banco como fonte da verdade:
- `supabase/schema.sql` → função `calcular_pontos` (usada de fato pelo sistema)
- `lib/pontuacao.ts` → mesma lógica em TS, coberta por testes (`lib/pontuacao.test.ts`), útil para prévia no front

Palpites ficam bloqueados 10 minutos antes do horário do jogo — essa regra é
validada tanto na interface quanto nas **policies de RLS** do Supabase (não dá
pra burlar manipulando o front).

## 1. Configurar o Supabase (gratuito)

1. Crie um projeto em [supabase.com](https://supabase.com) (plano Free).
2. Vá em **SQL Editor** → cole todo o conteúdo de `supabase/schema.sql` → **Run**.
   Isso cria as tabelas, a view de ranking, a função de pontuação e as policies de RLS.
3. Em **Project Settings → API**, copie:
   - `Project URL`
   - `anon public key`
4. Em **Authentication → Providers**, deixe **Email** habilitado (é o que o app
   usa por baixo dos panos — veja a nota sobre telefone abaixo).
5. Em **Authentication → Settings**, desative a confirmação por e-mail
   ("Confirm email"), já que os e-mails são fictícios (gerados a partir do
   telefone) e ninguém vai checar caixa de entrada.

> **Sobre o login por telefone:** o Supabase Auth exige um e-mail. Para manter
> o cadastro simples com "nome + senha" e telefone como identificador, o app
> gera internamente um e-mail fake a partir do telefone
> (`lib/auth.ts` → `telefoneParaEmail`). O usuário nunca vê nem digita esse e-mail.

## 2. Rodar localmente

```bash
npm install
cp .env.local.example .env.local
# preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Acesse `http://localhost:3000`.

## 3. Criar o primeiro admin

1. Cadastre-se normalmente pelo app (`/cadastro`).
2. No Supabase, vá em **Table Editor → usuarios**, encontre seu registro e
   marque `is_admin` como `true` (ou rode via SQL Editor):

```sql
update usuarios set is_admin = true where telefone = '5511999999999';
```

3. Acesse `/admin` para cadastrar os jogos da Copa e depois lançar os resultados.

## 4. Rodar os testes da lógica de pontuação

```bash
npm run test
```

## 5. Deploy

**Banco:** já está no Supabase (free tier), nada a fazer além do passo 1.

**Frontend (Vercel, free tier):**
1. Suba este projeto para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com), importe o repositório.
3. Configure as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) no painel do projeto na Vercel.
4. Deploy. A Vercel te dá uma URL pública para compartilhar com a galera do bolão.

## Estrutura do projeto

```
app/
  login/            tela de login
  cadastro/          tela de cadastro
  jogos/[id]/         detalhe do jogo + palpite
  meus-palpites/     histórico de palpites e pontos
  ranking/           ranking geral
  admin/             CRUD de jogos e lançamento de resultado
components/          Navbar, JogoCard, PalpiteForm
lib/
  supabase/          clientes Supabase (browser e server)
  auth.ts            conversão telefone <-> email interno
  pontuacao.ts        lógica de pontuação (+ testes)
supabase/schema.sql   schema completo: tabelas, RLS, função de pontuação, view de ranking
middleware.ts         protege rotas e mantém sessão
```

## Próximos passos sugeridos

- Popular `jogos` com a tabela completa da Copa 2026 (fase de grupos definida).
- Tela de detalhe de jogo mostrando quem acertou o quê, depois de encerrado.
- Notificação (e-mail/WhatsApp) lembrando de palpitar antes do prazo.
