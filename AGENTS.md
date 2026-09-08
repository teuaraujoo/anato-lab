<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Padrão de animação das páginas

- Use Anime.js e o hook compartilhado `usePageEntrance`, localizado em
  `src/components/motion/usePageEntrance.ts`, nas novas páginas da aplicação.
- Associe o `ref` retornado ao elemento raiz do componente de página.
  Para um `<main>`, use `usePageEntrance<HTMLElement>()`.
- Marque os blocos na ordem de leitura com `data-page-enter="up"` (fade e
  subida), `"down"` (fade e descida) ou `"fade"` (sem deslocamento).
  Evite marcar simultaneamente um elemento e seus descendentes.
- Use `"fade"` no contêiner de visualizadores 3D para preservar coordenadas,
  câmera e posicionamento dos controles. Não anime geometrias nesta entrada.
- Preserve a espera pelo término real do preloader, movimento reduzido,
  conteúdo acessível sem JavaScript, scrollbar estável e limpeza ao desmontar.
- Não reinicie a entrada em buscas, seleções, zoom ou abertura de painéis.
  Interações devem continuar tendo prioridade sobre as animações.
- Faça commits semânticos em português, incluindo apenas alterações da tarefa.
