/**
 * Mapa de nome da seleção (em português, como cadastrado em `jogos`) -> emoji de bandeira.
 * Emojis de bandeira funcionam nativamente em iOS, Android, Windows e Mac — não precisa
 * de nenhuma imagem/ícone externo.
 *
 * Se um time não estiver na lista, cai no fallback "🏳️" (bandeira branca) — é só
 * adicionar a seleção que faltar aqui.
 */
export const BANDEIRAS: Record<string, string> = {
  "Brasil": "🇧🇷",
  "Argentina": "🇦🇷",
  "Uruguai": "🇺🇾",
  "Colômbia": "🇨🇴",
  "Equador": "🇪🇨",
  "Paraguai": "🇵🇾",
  "Venezuela": "🇻🇪",
  "Chile": "🇨🇱",
  "Peru": "🇵🇪",
  "Bolívia": "🇧🇴",

  "México": "🇲🇽",
  "Estados Unidos": "🇺🇸",
  "Canadá": "🇨🇦",
  "Costa Rica": "🇨🇷",
  "Panamá": "🇵🇦",
  "Honduras": "🇭🇳",
  "Jamaica": "🇯🇲",
  "Haiti": "🇭🇹",
  "Curaçao": "🇨🇼",
  "Suriname": "🇸🇷",
  "Guatemala": "🇬🇹",

  "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Escócia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "França": "🇫🇷",
  "Espanha": "🇪🇸",
  "Portugal": "🇵🇹",
  "Alemanha": "🇩🇪",
  "Itália": "🇮🇹",
  "Holanda": "🇳🇱",
  "Países Baixos": "🇳🇱",
  "Bélgica": "🇧🇪",
  "Suíça": "🇨🇭",
  "Áustria": "🇦🇹",
  "Croácia": "🇭🇷",
  "Dinamarca": "🇩🇰",
  "Noruega": "🇳🇴",
  "Suécia": "🇸🇪",
  "Polônia": "🇵🇱",
  "Ucrânia": "🇺🇦",
  "Sérvia": "🇷🇸",
  "Turquia": "🇹🇷",
  "República Tcheca": "🇨🇿",
  "Bósnia e Herzegovina": "🇧🇦",
  "Grécia": "🇬🇷",
  "Eslováquia": "🇸🇰",
  "Eslovênia": "🇸🇮",
  "Romênia": "🇷🇴",
  "Irlanda": "🇮🇪",
  "País de Gales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",

  "Marrocos": "🇲🇦",
  "Egito": "🇪🇬",
  "Argélia": "🇩🇿",
  "Tunísia": "🇹🇳",
  "Senegal": "🇸🇳",
  "Gana": "🇬🇭",
  "Camarões": "🇨🇲",
  "Nigéria": "🇳🇬",
  "África do Sul": "🇿🇦",
  "Costa do Marfim": "🇨🇮",
  "Cabo Verde": "🇨🇻",
  "Mali": "🇲🇱",
  "Angola": "🇦🇴",

  "Japão": "🇯🇵",
  "Coreia do Sul": "🇰🇷",
  "Austrália": "🇦🇺",
  "Nova Zelândia": "🇳🇿",
  "Arábia Saudita": "🇸🇦",
  "Irã": "🇮🇷",
  "Catar": "🇶🇦",
  "Iraque": "🇮🇶",
  "Jordânia": "🇯🇴",
  "Uzbequistão": "🇺🇿",
  "Emirados Árabes Unidos": "🇦🇪",
};

export function bandeira(time: string): string {
  return BANDEIRAS[time] ?? "🏳️";
}
