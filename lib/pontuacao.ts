/**
 * Lógica de pontuação do Bolão da Copa do Mundo 2026.
 *
 * Regras:
 * 1. Placar exato ................................................ 30 pontos
 * 2. Acertou o resultado (vencedor ou empate), placar errado ..... 14 pontos
 * 3. Idem acima + acertou os gols de PELO MENOS uma das equipes .. 14 + 4 = 18 pontos
 * 4. Errou o resultado ............................................. 0 pontos
 *    (mesmo acertando os gols de um time isoladamente)
 *
 * Esta mesma regra está implementada em SQL na função `calcular_pontos`
 * (ver supabase/schema.sql), que é a fonte da verdade usada pelo banco
 * quando o admin encerra um jogo. Esta versão em TypeScript existe para:
 *  - mostrar prévia de pontuação possível no front (opcional/cosmético)
 *  - ser testada unitariamente (ver pontuacao.test.ts)
 */

export type Placar = {
  golsA: number;
  golsB: number;
};

function resultado({ golsA, golsB }: Placar): 1 | 0 | -1 {
  if (golsA > golsB) return 1;
  if (golsA < golsB) return -1;
  return 0;
}

export function calcularPontuacao(palpite: Placar, real: Placar): number {
  // placar exato
  if (palpite.golsA === real.golsA && palpite.golsB === real.golsB) {
    return 30;
  }

  const resultadoPalpite = resultado(palpite);
  const resultadoReal = resultado(real);

  // errou o resultado -> 0 pontos, mesmo acertando gols de 1 time
  if (resultadoPalpite !== resultadoReal) {
    return 0;
  }

  // acertou o resultado
  let pontos = 14;

  // bônus: acertou os gols de pelo menos uma das equipes
  if (palpite.golsA === real.golsA || palpite.golsB === real.golsB) {
    pontos += 4;
  }

  return pontos;
}
