/**
 * O Supabase Auth exige um e-mail para login/senha. Como o app usa telefone
 * como identificador (mais simples pra galera do grupo), geramos um e-mail
 * "interno" a partir do telefone normalizado. O usuário nunca vê/usa esse email.
 */
export function normalizarTelefone(telefone: string): string {
  return telefone.replace(/\D/g, ""); // mantém só dígitos
}

export function telefoneParaEmail(telefone: string): string {
  return `${normalizarTelefone(telefone)}@bolao2026.app`;
}
