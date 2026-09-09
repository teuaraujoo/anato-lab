# Exploração 3D do corpo humano

Projeto educacional que une tecnologia, biologia e visualização 3D para tornar
o estudo do corpo humano mais acessível, interativo e visual.

A primeira etapa é uma célula animal: um modelo que pode ser girado, ampliado
e explorado por partes, com explicações sobre cada estrutura. A célula é apenas
o ponto de partida, não o limite nem o nome definitivo da aplicação.

## Objetivo e proposta

Meu objetivo é construir um diretório interativo do corpo humano, reunindo
diferentes estruturas e conteúdos em um só lugar. A proposta é facilitar o
ensino e o aprendizado de anatomia humana, permitindo visualizar partes do
corpo, entender suas funções e explorar como elas se relacionam.

Quero desenvolver essa experiência com foco em programação, criando os modelos
3D por código e evoluindo o projeto aos poucos.

## Origem do projeto

Este projeto também nasceu com o objetivo de testar o novo modelo da OpenAI,
o **ChatGPT Astra 6**, em um desenvolvimento prático: da estruturação do
front-end à criação de modelos 3D e interações educacionais.

A IA faz parte do processo de desenvolvimento. A aplicação não utiliza uma API
de IA durante a navegação e não exige uma chave de acesso da OpenAI.

## O que já está disponível

- Célula animal em 3D, construída por código, com 11 tipos de estruturas.
- Olho e rim humanos em 3D, com suas estruturas externas e internas.
- Cérebro humano em `/cerebro`, com 12 estruturas, visão externa e vista medial.
- Rotação, zoom, seleção, aproximação e isolamento das estruturas.
- Separação didática e destaque da estrutura selecionada.
- Painel flutuante com busca, explicações, relações e fontes de estudo.
- Interface responsiva, com navegação por teclado.
- Acesso aos textos mesmo quando o navegador não consegue exibir o modelo 3D.

Nesta etapa, o projeto é exclusivamente front-end. Os conteúdos ficam em
arquivos locais, sem backend, banco de dados ou cadastro de usuários.

## Tecnologias

- **TypeScript, React e Next.js:** aplicação e interface.
- **Three.js, React Three Fiber e Drei:** modelos e interação 3D.
- **Zustand:** estado da exploração.
- **CSS e Tailwind CSS:** estilos, com fonte Poppins e ícones Lucide.

## Executar localmente

Tenha Node.js e npm instalados. A versão mínima declarada no projeto é
Node.js 20.9.0.

Na pasta do projeto, execute:

```sh
npm ci
npm run dev
```

Abra [localhost:3000](http://localhost:3000), ou o endereço indicado no terminal.
Não é necessário configurar variáveis de ambiente.

Para verificar o código e gerar a versão de produção:

```sh
npm run lint
npm run build
```

## Evolução futura

Pretendo adicionar outras partes do corpo humano e ampliar progressivamente
esse diretório, com modelos, explicações e conteúdos que facilitem a
visualização e o ensino de anatomia humana.

Entre as possibilidades estão pele, ossos, pulmões e coração.
Também quero explorar cortes anatômicos, diferentes níveis de detalhe e
animações didáticas dos processos do corpo.

Essas são possibilidades para as próximas etapas; ainda não estão implementadas.

## Conteúdo educacional

Os modelos são representações didáticas estilizadas. Cores, proporções e
quantidades são ilustrativas. As imagens geradas por IA servem como referência
visual, não como uma reconstrução anatômica exata.

As explicações têm fontes de estudo, disponíveis no painel e no
[arquivo de conteúdo](src/content/animalCell.ts), mas ainda não passaram por
revisão especializada. O projeto é voltado ao aprendizado, não ao uso clínico.

A exploração do cérebro também inclui cerebelo e tronco encefálico, formando
uma visão geral simplificada do encéfalo. Os sulcos e os limites dos lobos são
ilustrativos; os ventrículos em azul representam cavidades preenchidas por líquido.
Os textos e as fontes estão em [src/content/brain.ts](src/content/brain.ts).

Para verificar o cérebro: `npx playwright test tests/brain.spec.ts` e
`npm run test:browser -- tests/browser/brain.spec.ts`. Com o servidor local
iniciado, `node scripts/capture-brain.mjs` atualiza a miniatura do card a partir
do modelo real. As referências em `references/cerebro` não são necessárias
para executar a aplicação.

## Licença

O código e a documentação deste projeto estão sob a [licença MIT](LICENSE).
Dependências e materiais de terceiros mantêm suas respectivas licenças.
