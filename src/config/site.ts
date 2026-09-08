// Endereço provisório. SITE_URL permite alterá-lo sem editar o código.
export const siteUrl = new URL(
  process.env.SITE_URL || "https://anatolab.vercel.app",
);

if (
  !["http:", "https:"].includes(siteUrl.protocol) ||
  siteUrl.pathname !== "/" ||
  siteUrl.search ||
  siteUrl.hash ||
  siteUrl.username ||
  siteUrl.password
) {
  throw new Error(
    "SITE_URL deve ser um domínio HTTP(S) absoluto, sem caminho, credenciais ou parâmetros.",
  );
}

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
