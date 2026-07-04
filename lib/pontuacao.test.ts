import { describe, it, expect } from "vitest";
import { calcularPontuacao } from "./pontuacao";

describe("calcularPontuacao", () => {
  it("placar exato -> 30 pontos", () => {
    expect(calcularPontuacao({ golsA: 2, golsB: 1 }, { golsA: 2, golsB: 1 })).toBe(30);
  });

  it("placar exato em empate -> 30 pontos", () => {
    expect(calcularPontuacao({ golsA: 1, golsB: 1 }, { golsA: 1, golsB: 1 })).toBe(30);
  });

  it("acertou vencedor, errou placar, nenhum time com gols certos -> 14 pontos", () => {
    expect(calcularPontuacao({ golsA: 3, golsB: 0 }, { golsA: 2, golsB: 1 })).toBe(14);
  });

  it("acertou vencedor + gols do time A certos -> 18 pontos", () => {
    expect(calcularPontuacao({ golsA: 2, golsB: 0 }, { golsA: 2, golsB: 1 })).toBe(18);
  });

  it("acertou vencedor + gols do time B certos -> 18 pontos", () => {
    expect(calcularPontuacao({ golsA: 3, golsB: 1 }, { golsA: 2, golsB: 1 })).toBe(18);
  });

  it("acertou empate, errou placar -> 14 pontos", () => {
    expect(calcularPontuacao({ golsA: 0, golsB: 0 }, { golsA: 1, golsB: 1 })).toBe(14);
  });

  it("errou o resultado -> 0 pontos mesmo acertando gols de 1 time isoladamente", () => {
    // palpite: time A vence 2x1 | real: time B vence 0x1 (gols do time B batem, mas resultado é outro)
    expect(calcularPontuacao({ golsA: 2, golsB: 1 }, { golsA: 0, golsB: 1 })).toBe(0);
  });

  it("errou completamente -> 0 pontos", () => {
    expect(calcularPontuacao({ golsA: 3, golsB: 0 }, { golsA: 0, golsB: 2 })).toBe(0);
  });
});
