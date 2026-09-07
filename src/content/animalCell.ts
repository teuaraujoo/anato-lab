import type { OrganelleContent, OrganelleId } from "@/types/cell";

const eukaryotes = {
  title: "OpenStax · Células eucarióticas",
  url: "https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells",
};
const endomembranes = {
  title: "OpenStax · Sistema de endomembranas",
  url: "https://openstax.org/books/biology-2e/pages/4-4-the-endomembrane-system-and-proteins",
};
const cell = {
  title: "The Cell · Organização celular",
  url: "https://www.ncbi.nlm.nih.gov/books/NBK9841/",
};
const nucleolus = {
  title: "The Cell · O nucléolo",
  url: "https://www.ncbi.nlm.nih.gov/books/NBK9939/",
};

// Textos didáticos introdutórios. Cores, escala e quantidades do modelo são ilustrativas.
export const animalCellContent: OrganelleContent[] = [
  {
    id: "membrane",
    name: "Membrana plasmática",
    color: "#69dbd7",
    summary: "Uma fronteira seletiva entre a célula e seu ambiente.",
    structure: "Bicamada de fosfolipídios com proteínas associadas.",
    function: "Controla trocas com o meio e participa da comunicação celular.",
    related: ["cytoplasm", "smooth-er"],
    source: cell,
  },
  {
    id: "cytoplasm",
    name: "Citoplasma",
    color: "#c7ab62",
    summary: "A região entre a membrana plasmática e o envoltório nuclear.",
    structure:
      "Inclui o citosol, as organelas e o citoesqueleto; não é apenas o líquido celular.",
    function: "Abriga estruturas e reações metabólicas.",
    related: ["ribosomes", "centrosome"],
    source: eukaryotes,
  },
  {
    id: "nucleus",
    name: "Núcleo",
    color: "#aa80e8",
    summary: "Guarda a maior parte da informação genética da célula.",
    structure:
      "O DNA encontra-se associado a proteínas. Um envoltório separa esse compartimento do citoplasma.",
    function:
      "Abriga a replicação do DNA e a síntese de RNA, que participa da expressão dos genes.",
    related: ["nucleolus", "rough-er"],
    source: cell,
  },
  {
    id: "nucleolus",
    name: "Nucléolo",
    color: "#c98df1",
    summary: "Uma região dentro do núcleo dedicada à formação dos ribossomos.",
    structure:
      "Não possui membrana própria. Reúne RNA, proteínas e regiões de DNA ligadas à produção de RNA ribossômico.",
    function:
      "Produz e processa RNA ribossômico e monta subunidades ribossômicas, depois exportadas ao citoplasma.",
    related: ["nucleus", "ribosomes"],
    source: nucleolus,
  },
  {
    id: "mitochondria",
    name: "Mitocôndrias",
    color: "#f08a73",
    summary: "Convertem energia dos nutrientes em ATP pela respiração celular.",
    structure:
      "Possuem duas membranas; a interna forma dobras chamadas cristas.",
    function: "Produzem ATP que sustenta diversas atividades celulares.",
    related: ["cytoplasm"],
    source: eukaryotes,
  },
  {
    id: "rough-er",
    name: "Retículo endoplasmático rugoso",
    color: "#6197e4",
    summary: "Uma rede de membranas associada à produção de proteínas.",
    structure:
      "Cisternas conectadas ao envoltório nuclear, com ribossomos na face citoplasmática.",
    function:
      "Recebe, dobra e inicia modificações em proteínas destinadas à secreção e a membranas.",
    related: ["ribosomes", "golgi", "nucleus"],
    source: endomembranes,
  },
  {
    id: "smooth-er",
    name: "Retículo endoplasmático liso",
    color: "#e5b85c",
    summary: "A porção do retículo sem ribossomos aderidos.",
    structure: "Rede de túbulos membranosos conectada ao retículo rugoso.",
    function:
      "Sintetiza lipídios, armazena cálcio e participa da desintoxicação, conforme o tipo celular.",
    related: ["rough-er", "membrane"],
    source: endomembranes,
  },
  {
    id: "golgi",
    name: "Complexo de Golgi",
    color: "#50cabc",
    summary: "Uma estação de processamento e distribuição de moléculas.",
    structure:
      "Pilha de cisternas achatadas, acompanhadas de vesículas de transporte.",
    function:
      "Modifica e encaminha proteínas e lipídios recebidos do retículo.",
    related: ["rough-er", "lysosomes"],
    source: endomembranes,
  },
  {
    id: "ribosomes",
    name: "Ribossomos",
    color: "#f0ce78",
    summary: "Leem o RNA mensageiro para montar proteínas.",
    structure:
      "Duas subunidades de RNA ribossômico e proteínas, livres ou associadas ao retículo.",
    function: "Conectam aminoácidos na sequência indicada pelo RNA.",
    related: ["nucleolus", "rough-er"],
    source: eukaryotes,
  },
  {
    id: "lysosomes",
    name: "Lisossomos",
    color: "#e895bd",
    summary: "Compartimentos de digestão e reciclagem intracelular.",
    structure: "Vesículas membranosas com enzimas que atuam em meio ácido.",
    function:
      "Degradam macromoléculas e componentes celulares para reaproveitamento.",
    related: ["golgi", "cytoplasm"],
    source: endomembranes,
  },
  {
    id: "centrosome",
    name: "Centrossomo",
    color: "#eeaa4f",
    summary: "Um centro organizador de microtúbulos em muitas células animais.",
    structure: "Contém um par de centríolos e material pericentriolar.",
    function:
      "Organiza microtúbulos, inclusive durante a formação do fuso mitótico.",
    related: ["cytoplasm", "nucleus"],
    source: eukaryotes,
  },
];

export const contentById = Object.fromEntries(
  animalCellContent.map((item) => [item.id, item]),
) as Record<OrganelleId, OrganelleContent>;

export function searchStructures(query: string) {
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const search = normalize(query.trim());
  return animalCellContent.filter((item) =>
    normalize(item.name).includes(search),
  );
}
