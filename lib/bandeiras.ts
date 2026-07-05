/**
 * Mapa de nome da seleção (em português, como cadastrado em `jogos`) -> código
 * ISO usado pela flagcdn.com para gerar a URL da imagem da bandeira.
 *
 * Usamos imagens (via https://flagcdn.com) em vez de emoji de bandeira porque
 * o Windows não renderiza emoji de bandeira como imagem (mostra as letras do
 * país em vez do desenho) — com uma imagem de verdade funciona igual em
 * qualquer sistema operacional e navegador.
 *
 * Se um time não estiver na lista, cai no fallback de bandeira genérica —
 * é só adicionar a seleção que faltar aqui (o código é o padrão ISO 3166-1
 * alpha-2, em minúsculo).
 */
export const CODIGOS_PAISES: Record<string, string> = {
  "Brasil": "br",
  "Argentina": "ar",
  "Uruguai": "uy",
  "Colômbia": "co",
  "Equador": "ec",
  "Paraguai": "py",
  "Venezuela": "ve",
  "Chile": "cl",
  "Peru": "pe",
  "Bolívia": "bo",

  "México": "mx",
  "Estados Unidos": "us",
  "Canadá": "ca",
  "Costa Rica": "cr",
  "Panamá": "pa",
  "Honduras": "hn",
  "Jamaica": "jm",
  "Haiti": "ht",
  "Curaçao": "cw",
  "Suriname": "sr",
  "Guatemala": "gt",

  "Inglaterra": "gb-eng",
  "Escócia": "gb-sct",
  "País de Gales": "gb-wls",
  "França": "fr",
  "Espanha": "es",
  "Portugal": "pt",
  "Alemanha": "de",
  "Itália": "it",
  "Holanda": "nl",
  "Países Baixos": "nl",
  "Bélgica": "be",
  "Suíça": "ch",
  "Áustria": "at",
  "Croácia": "hr",
  "Dinamarca": "dk",
  "Noruega": "no",
  "Suécia": "se",
  "Polônia": "pl",
  "Ucrânia": "ua",
  "Sérvia": "rs",
  "Turquia": "tr",
  "República Tcheca": "cz",
  "Bósnia e Herzegovina": "ba",
  "Grécia": "gr",
  "Eslováquia": "sk",
  "Eslovênia": "si",
  "Romênia": "ro",
  "Irlanda": "ie",

  "Marrocos": "ma",
  "Egito": "eg",
  "Argélia": "dz",
  "Tunísia": "tn",
  "Senegal": "sn",
  "Gana": "gh",
  "Camarões": "cm",
  "Nigéria": "ng",
  "África do Sul": "za",
  "Costa do Marfim": "ci",
  "Cabo Verde": "cv",
  "Mali": "ml",
  "Angola": "ao",

  "Japão": "jp",
  "Coreia do Sul": "kr",
  "Austrália": "au",
  "Nova Zelândia": "nz",
  "Arábia Saudita": "sa",
  "Irã": "ir",
  "Catar": "qa",
  "Iraque": "iq",
  "Jordânia": "jo",
  "Uzbequistão": "uz",
  "Emirados Árabes Unidos": "ae",
};

/** Retorna a URL da imagem da bandeira (40px de largura) pra usar num <img>. */
export function bandeiraUrl(time: string): string {
  const codigo = CODIGOS_PAISES[time];
  // fallback: bandeira genérica cinza caso o time não esteja no mapa
  return codigo ? `https://flagcdn.com/w40/${codigo}.png` : "https://flagcdn.com/w40/xx.png";
}
