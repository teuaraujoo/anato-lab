# Rim humano: contrato de desenvolvimento

## Estado atual

A preparação do módulo está implementada. Existem tipos, conteúdo educativo,
busca e estado de interação com testes. **Ainda não existem um modelo renderizado,
a rota `/rim` ou um card na home.** Nenhuma imagem de referência será usada como
se fosse uma captura da aplicação.

## Referências locais

As sete imagens estão em `references/rim/`. Servem como referência artística,
não como medidas clínicas ou imagens já convertidas em malhas 3D.

| Arquivo                           | Uso na construção                             |
| --------------------------------- | --------------------------------------------- |
| `rim-base-corte-tres-quartos.png` | Referência principal de volume e corte        |
| `rim-base-corte-interno.png`      | Distribuição das estruturas internas          |
| `rim-base-sistema-coletor.png`    | Ramificações e transição para a pelve         |
| `rim-base-hilo.png`               | Entrada e saída das estruturas na concavidade |
| `rim-base.png`                    | Silhueta externa                              |
| `rim-base-frontal.png`            | Comparação da silhueta                        |
| `rim-base-posterior.png`          | Referência complementar da superfície externa |

As vistas não formam uma sequência fotográfica calibrada. A imagem denominada
posterior não permite estabelecer, sozinha, orientação anatômica e medidas de
profundidade. As partes ocultas precisarão de aproximação explícita.

## Observações e decisões

A referência principal mostra uma silhueta vertical reniforme, convexa à direita
da imagem e côncava à esquerda. A cápsula vermelha envolve uma faixa cortical
salmão. Sete pirâmides visíveis convergem para o sistema coletor claro. A região
central possui tecido amarelo e vasos vermelhos e azuis. Esses são elementos
observados; espessuras e coordenadas da futura malha serão escolhas de modelagem.

O modelo será uma representação didática em corte, construída com TypeScript e
Three.js. Não será uma reconstrução clínica nem uma conversão automática de PNG
para GLB. O número de pirâmides visíveis não representa uma contagem universal.

### Identificadores compartilhados

Use os identificadores de `src/types/kidney.ts` em grupos 3D, conteúdo e seleção.
Cada grupo semântico precisa conter a geometria que sua descrição apresenta.

| Identificador    | Região e representação planejada                             |
| ---------------- | ------------------------------------------------------------ |
| `renal-capsule`  | Casca contínua com espessura e borda do corte                |
| `renal-cortex`   | Faixa periférica com volume                                  |
| `renal-medulla`  | Conjunto das pirâmides; uma única seleção semântica          |
| `renal-columns`  | Extensões corticais entre as pirâmides                       |
| `renal-papillae` | Ápices conectados às pirâmides                               |
| `minor-calyces`  | Cálices abertos envolvendo os ápices                         |
| `major-calyces`  | Ramos que recebem os cálices menores                         |
| `renal-pelvis`   | Funil contínuo entre os ramos e o ureter                     |
| `renal-sinus`    | Região central; destacar o tecido de suporte, não um tampão  |
| `renal-artery`   | Vaso vermelho com ramificações e extremidade aberta          |
| `renal-vein`     | Vaso azul com volume e extremidade aberta                    |
| `ureter`         | Continuação tubular da pelve, com luz visível na extremidade |

As colunas pertencem ao córtex. Medula e pirâmides não serão duas camadas
sobrepostas. Papilas são extremidades das pirâmides, não peças soltas. O hilo é
uma região de passagem e poderá ser encontrado pela busca do seio renal;
não será representado como um órgão adicional.

## Contrato visual

- Construir primeiro a silhueta e a profundidade, depois o interior.
- Usar superfícies orgânicas contínuas, não uma pilha de placas planas.
- Manter cápsula, córtex, pirâmides, tecido adiposo e vasos distinguíveis.
- Usar as cores de `src/content/kidney.ts` como paleta didática inicial.
- Manter os tecidos opacos; transparência não deve esconder falta de volume.
- Conectar papilas, cálices, pelve e ureter sem lacunas visíveis nas junções.
- Modelar aberturas com paredes e interior, não apenas discos escuros.
- Fazer estriações acompanharem a convergência das pirâmides para as papilas.
- Agrupar detalhes com sua estrutura para seleção e futura vista separada.
- Não inferir esquerda/direita anatômica somente pelo nome dos arquivos.

As proporções serão relativas. A vista inicial deve tornar o corte legível,
mantendo margem ao redor do rim, dos vasos e do ureter em desktop e celular.

## Interação e integração previstas

O estado está em `src/store/kidneyStore.ts`. Ele não depende da geometria.

- Selecionar pelo modelo ou pela lista deve atualizar a mesma estrutura.
- Destacar a seleção sem deslocar ou aumentar a peça e romper suas conexões.
- Isolar apenas a estrutura selecionada e permitir restaurar o conjunto.
- Ao trocar uma seleção isolada, mostrar o conjunto e restaurar o enquadramento.
- Não aceitar hover de peças ocultas pelo isolamento.
- Calcular a aproximação pelos limites reais da geometria, sem recortes.
- Manter a lista utilizável quando WebGL não estiver disponível.

A futura página usará `usePageEntrance<HTMLElement>()` e Anime.js, conforme
`AGENTS.md`. Aplicar `data-page-enter="fade"` ao visualizador, sem animar as
geometrias na entrada. Preservar o preloader, movimento reduzido e scrollbar.

Adicionar `/rim` ao catálogo somente depois de validar o modelo. A miniatura
`public/catalog/rim-modelo.png` será uma captura do próprio Canvas, sem painel,
cursor, seleção ativa ou preloader. A página terá título, descrição e URL
canônica próprios; o sitemap já deriva as rotas do catálogo.

## Verificação

Execute os testes da base com:

```sh
npm run test:kidney
npm run lint
npx tsc --noEmit
```

Antes de disponibilizar o módulo completo:

- [ ] Validar a especificação de construção do modelo.
- [ ] Revisar a silhueta e a profundidade em vistas frontal, lateral e posterior.
- [ ] Revisar o corte e as conexões internas em vista de três quartos.
- [ ] Confirmar que todas as 12 estruturas possuem geometria selecionável.
- [ ] Testar seleção, aproximação, isolamento e restauração no navegador.
- [ ] Testar busca, teclado, layout móvel e movimento reduzido.
- [ ] Medir geometria e chamadas de desenho na cena real.
- [ ] Capturar a miniatura, integrar catálogo e metadados, e executar build.

## Conteúdo e limites

Os textos em `src/content/kidney.ts` são sínteses introdutórias próprias com
links para as fontes consultadas. Não substituem revisão por um profissional
de anatomia. Néfrons individuais, histologia, suprarrenal e doenças ficam fora
desta primeira representação macroscópica.

Fontes de consulta:

- [NCBI Bookshelf: anatomia dos rins](https://www.ncbi.nlm.nih.gov/books/NBK482385/).
- [OpenStax: anatomia macroscópica do rim](https://openstax.org/books/anatomy-and-physiology-2e/pages/25-3-gross-anatomy-of-the-kidney).
- [NIDDK: funcionamento dos rins](https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work).
