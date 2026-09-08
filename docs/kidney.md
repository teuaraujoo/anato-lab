# Rim humano

## Estado atual

A primeira versão está disponível em `/rim`, com modelo 3D procedural,
12 regiões selecionáveis, conteúdo educativo e card na home. A miniatura
`public/catalog/rim-modelo.png` é uma captura do Canvas da aplicação.

O modelo é **didático e estilizado**, não um escaneamento ou uma malha clínica.
As junções do sistema coletor e a continuidade das superfícies ainda precisam
de refinamento. A avaliação geométrica não está integralmente aprovada.

## Organização

- `src/types/kidney.ts`: identificadores das 12 estruturas.
- `src/content/kidney.ts`: textos, cores, relações, fontes e busca.
- `src/store/kidneyStore.ts`: seleção, hover, isolamento e separação.
- `src/components/kidney/KidneyExperience.tsx`: página e painel de estudo.
- `src/components/kidney/KidneyScene.tsx`: Canvas, câmera e iluminação.
- `src/components/kidney/scene/geometry.ts`: superfícies paramétricas e tubos.
- `src/components/kidney/scene/materials.ts`: mapas procedurais determinísticos.
- `src/components/kidney/scene/KidneyModel.tsx`: montagem e interação por região.
- `src/app/rim/page.tsx`: rota e metadados.
- `src/content/catalog.ts`: card, busca e inclusão automática no sitemap.

Tudo funciona no front-end. Não há Blender, GLB externo, conversão automática
de PNG em malha, serviços de geração em execução ou backend.

## Referências

As sete imagens em `references/rim/` orientam a forma e a distribuição visual:

| Arquivo                           | Uso                             |
| --------------------------------- | ------------------------------- |
| `rim-base-corte-tres-quartos.png` | Volume e corte principais       |
| `rim-base-corte-interno.png`      | Distribuição das estruturas     |
| `rim-base-sistema-coletor.png`    | Cálices e pelve                 |
| `rim-base-hilo.png`               | Passagem dos vasos              |
| `rim-base.png`                    | Silhueta externa                |
| `rim-base-frontal.png`            | Comparação frontal              |
| `rim-base-posterior.png`          | Superfície externa complementar |

As imagens não são vistas calibradas. Profundidade, espessuras e partes ocultas
são aproximações de modelagem. Não se afirma lateralidade anatômica.

O corte contém cápsula, córtex, medula com sete pirâmides ilustrativas, colunas,
papilas, cálices menores e maiores, pelve, seio renal, artéria, veia e ureter.
As colunas são extensões corticais; as papilas representam ápices das pirâmides.
O tecido central representa a região do seio renal, não um reservatório de urina.
A quantidade de pirâmides visíveis não é uma contagem universal.

## Interação

Selecione pelo modelo ou pela lista. O restante do modelo escurece sem tornar
os tecidos transparentes ou deslocar a seleção. **Aproximar** usa os limites
reais da região; **Isolar** oculta as demais.

**Separar** afasta os grupos para estudo e reenquadra a câmera. Essa separação
não representa movimento anatômico. **Reunir**, **Restaurar** e a tecla
`Escape` permitem recuperar o conjunto.

A busca aceita acentos e sinônimos. A lista continua disponível sem WebGL.
A entrada usa Anime.js e o hook compartilhado `usePageEntrance`, respeitando
o preloader e a preferência por movimento reduzido.

## Gerar uma nova miniatura

Inicie a aplicação com `npm run dev`. Em outro terminal, execute:

```sh
npm run capture:rim
```

O script abre o Chrome e captura o modelo sem painel, legenda, seleção ou
preloader. A imagem tem 1000 × 1000 pixels. Execute novamente após mudar o modelo.
Use `PLAYWRIGHT_BASE_URL` se a aplicação estiver em outro endereço local.

## Verificação

```sh
npm run test:kidney
npm run test:browser
npm run lint
npx tsc --noEmit
npm run build
```

Os testes de navegador usam Chrome instalado e iniciam o servidor de
desenvolvimento quando necessário. `PLAYWRIGHT_BASE_URL` permite testar um
servidor já iniciado. Em CI, o navegador executa sem janela.

Na revisão desta versão:

- 10 testes de conteúdo e estado passaram.
- 4 testes no navegador cobriram as 12 seleções, aproximação, isolamento,
  restauração, separação, catálogo, busca, layout móvel e fallback sem WebGL.
- O clique direto no vaso azul selecionou a veia renal.
- O renderer registrou 53.592 triângulos e 12 chamadas de desenho.
- Foram revisadas vistas frontal, laterais e posterior, além da página móvel.
- O modelo preserva 12 grupos selecionáveis e separáveis, sem meshes anônimas.

A renderização ocorre sob demanda, com DPR limitado a 1,5. O custo de desenho
foi reduzido unindo somente geometrias da mesma região. Não há promessa de FPS
mínimo em dispositivos não testados.

## Limites da avaliação visual

A especificação e o histórico estão em `.img2threejs/`. As capturas e os
diagnósticos locais estão em `.artifacts/kidney/`, fora do versionamento.

O comparador genérico de cores usa apenas cinco grupos de cores para a imagem
inteira e reprovou regiões pequenas. Por isso, a paleta passou a ser medida no
albedo sem iluminação, preservando os mapas e usando a diferença entre o quadro
completo e o quadro com cada região oculta. O maior delta E 76 foi 2,79, com o
mesmo limite de 20. Isso verifica a paleta definida no código, **não** a fidelidade
cromática clínica ou fotográfica.

A checagem amostral de auto-interseções sinalizou superfícies da cápsula,
córtex, sistema coletor, seio e vasos. Há sobreposições de montagem e a malha
não é uma união sólida estanque. Esses achados não foram marcados como
resolvidos. O ciclo de certificação geométrica foi interrompido nesta versão;
junções mais contínuas e sua nova validação permanecem pendentes.

Não use este modelo para impressão 3D, simulação de fluidos, medidas,
planejamento clínico ou diagnóstico. Néfrons individuais, histologia,
suprarrenal e doenças estão fora desta representação macroscópica.

## Fontes do conteúdo

Os textos são sínteses introdutórias próprias e não substituem revisão por um
profissional de anatomia.

- [NCBI Bookshelf: anatomia dos rins](https://www.ncbi.nlm.nih.gov/books/NBK482385/).
- [OpenStax: anatomia macroscópica do rim](https://openstax.org/books/anatomy-and-physiology-2e/pages/25-3-gross-anatomy-of-the-kidney).
- [NIDDK: funcionamento dos rins](https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work).
