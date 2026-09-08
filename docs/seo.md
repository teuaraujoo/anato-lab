# SEO da Anatolab

A home e a página `/celula` têm títulos, descrições, URLs canônicas e metadados de compartilhamento próprios. O favicon usa o símbolo da Anatolab, com versões de 96 × 96 e 180 × 180 pixels.

## Alterar o domínio

O endereço provisório é `https://anatolab.vercel.app`. Essa configuração não registra nem reserva o domínio na Vercel.

Para substituir o endereço sem editar o código, crie um arquivo `.env.local` na raiz do projeto, seguindo `.env.example`:

```dotenv
SITE_URL=https://seu-dominio.vercel.app
```

Use somente a origem completa, com `https://`, sem caminhos ou parâmetros. Reinicie o servidor local após alterar a variável. Na hospedagem, configure `SITE_URL` no ambiente de produção e gere um novo build/deploy.

O valor padrão também pode ser alterado diretamente em `src/config/site.ts`. A variável `SITE_URL`, quando definida, tem prioridade. Essa única configuração atualiza as URLs canônicas, as imagens de compartilhamento e os endereços do sitemap e do robots.txt.

## Adicionar páginas

- Exporte `metadata` usando `createPageMetadata` de `src/lib/metadata.ts`, como em `src/app/celula/page.tsx`.
- Defina um título e uma descrição exclusivos e fiéis ao conteúdo, além da rota e de uma imagem com dimensões e texto alternativo corretos.
- Mantenha um título principal visível (`h1`) e links internos para a nova página.
- Adicione explorações prontas ao catálogo em `src/content/catalog.ts`. O sitemap inclui automaticamente essas rotas e a home. Não inclua estruturas ainda indisponíveis.

## Conferir

Execute `npm run lint` e `npm run build`. Confira `/sitemap.xml`, `/robots.txt`, `/icon` e `/apple-icon`, além do título, descrição e canonical no HTML de cada página.

Os ícones, o sitemap e o robots.txt são gerados pelo Next.js; não precisam de banco de dados ou serviço externo. O sitemap omite datas de atualização para não informar datas artificiais a cada build.

Após publicar no domínio definitivo, você poderá enviar o sitemap ao Google Search Console. Esta configuração permite rastreamento, mas não garante indexação ou posição nos resultados.
