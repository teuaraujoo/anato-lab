import type { KidneyStructureContent, KidneyStructureId } from "@/types/kidney";

const anatomy = {
  title: "NCBI Bookshelf · Anatomy, Abdomen and Pelvis: Kidneys",
  url: "https://www.ncbi.nlm.nih.gov/books/NBK482385/",
};
const textbook = {
  title: "OpenStax · Gross Anatomy of the Kidney",
  url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/25-3-gross-anatomy-of-the-kidney",
};
const functionSource = {
  title: "NIDDK · Your Kidneys & How They Work",
  url: "https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work",
};

// Sínteses educativas próprias. Cores didáticas, sem correspondência clínica.
export const kidneyContent: readonly KidneyStructureContent[] = [
  {
    id: "renal-capsule",
    name: "Cápsula renal",
    color: "#b53c46",
    summary: "O revestimento que envolve diretamente o rim.",
    structure: "Camada de tecido conjuntivo fibroso sobre o córtex.",
    function: "Protege o órgão e contribui para manter sua forma.",
    related: ["renal-cortex"],
    keywords: ["cápsula fibrosa", "revestimento"],
    source: textbook,
  },
  {
    id: "renal-cortex",
    name: "Córtex renal",
    color: "#ec987d",
    summary: "A região periférica do tecido renal.",
    structure: "Contém corpúsculos renais e túbulos contorcidos.",
    function: "Abriga estruturas que filtram o sangue e modificam o filtrado.",
    related: ["renal-capsule", "renal-columns", "renal-medulla"],
    keywords: ["cortical", "néfron", "glomérulo"],
    source: textbook,
  },
  {
    id: "renal-medulla",
    name: "Medula e pirâmides renais",
    color: "#ab4f46",
    summary: "A região interna, organizada em pirâmides.",
    structure:
      "Reúne segmentos tubulares e ductos coletores com disposição longitudinal.",
    function:
      "Participa da concentração da urina e de sua condução às papilas.",
    related: ["renal-cortex", "renal-columns", "renal-papillae"],
    keywords: ["medular", "pirâmide", "pirâmides", "alça de Henle"],
    source: textbook,
  },
  {
    id: "renal-columns",
    name: "Colunas renais",
    color: "#f1b49a",
    summary: "Extensões do córtex entre as pirâmides.",
    structure: "Faixas de tecido cortical; não são partes da medula.",
    function: "Separam as pirâmides e acomodam vasos em seu trajeto.",
    related: ["renal-cortex", "renal-medulla", "renal-artery"],
    keywords: ["Bertin", "coluna", "septo cortical"],
    source: anatomy,
  },
  {
    id: "renal-papillae",
    name: "Papilas renais",
    color: "#d78068",
    summary: "As extremidades das pirâmides voltadas aos cálices.",
    structure: "Ápices com aberturas dos ductos papilares.",
    function: "Entregam a urina aos cálices menores.",
    related: ["renal-medulla", "minor-calyces"],
    keywords: ["papila", "ápice", "ductos papilares"],
    source: anatomy,
  },
  {
    id: "minor-calyces",
    name: "Cálices menores",
    color: "#f6dfaa",
    summary: "Pequenas cavidades que recebem as papilas.",
    structure: "Ramificações iniciais do sistema coletor.",
    function: "Recebem urina e a encaminham aos cálices maiores.",
    related: ["renal-papillae", "major-calyces"],
    keywords: ["cálice menor", "coletor"],
    source: anatomy,
  },
  {
    id: "major-calyces",
    name: "Cálices maiores",
    color: "#e7c180",
    summary: "Ramos que reúnem os cálices menores.",
    structure: "Canais convergentes do sistema coletor.",
    function: "Conduzem urina à pelve renal.",
    related: ["minor-calyces", "renal-pelvis"],
    keywords: ["cálice maior", "coletor"],
    source: anatomy,
  },
  {
    id: "renal-pelvis",
    name: "Pelve renal",
    color: "#f4cf8f",
    summary: "O funil que conecta os cálices ao ureter.",
    structure: "Dilatação do início da via urinária de saída.",
    function: "Reúne urina e a direciona ao ureter.",
    related: ["major-calyces", "ureter", "renal-sinus"],
    keywords: ["bacinete", "pelvis", "coletor"],
    source: anatomy,
  },
  {
    id: "renal-sinus",
    name: "Seio renal",
    color: "#c79c49",
    summary: "O espaço interno que se comunica com o hilo.",
    structure: "Contém tecido adiposo, vasos e partes do sistema coletor.",
    function: "Acomoda essas estruturas; não é um reservatório de urina.",
    related: ["renal-pelvis", "renal-artery", "renal-vein"],
    keywords: ["hilo", "gordura", "adiposo"],
    source: anatomy,
  },
  {
    id: "renal-artery",
    name: "Artéria renal",
    color: "#ec4f59",
    summary: "O vaso que leva sangue ao rim.",
    structure: "Divide-se em ramos progressivamente menores dentro do órgão.",
    function: "Fornece o sangue que chega às unidades de filtração.",
    related: ["renal-cortex", "renal-vein"],
    keywords: ["arterial", "sangue", "vascular"],
    source: functionSource,
  },
  {
    id: "renal-vein",
    name: "Veia renal",
    color: "#459bdb",
    summary: "O vaso pelo qual o sangue deixa o rim.",
    structure: "Reúne o retorno da circulação renal.",
    function: "Devolve o sangue à circulação após sua passagem pelo órgão.",
    related: ["renal-artery", "renal-sinus"],
    keywords: ["venoso", "sangue", "vascular"],
    source: functionSource,
  },
  {
    id: "ureter",
    name: "Ureter",
    color: "#efd8b5",
    summary: "O tubo que liga o rim à bexiga.",
    structure: "Via de saída contínua com a pelve renal.",
    function: "Transporta a urina até a bexiga, onde ela é armazenada.",
    related: ["renal-pelvis", "major-calyces"],
    keywords: ["urina", "via urinária", "bexiga"],
    source: functionSource,
  },
];

export const kidneyContentById = Object.fromEntries(
  kidneyContent.map((item) => [item.id, item]),
) as Record<KidneyStructureId, KidneyStructureContent>;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function searchKidneyStructures(query: string) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return kidneyContent.filter((item) => {
    const searchable = normalize([item.name, ...item.keywords].join(" "));
    return terms.every((term) => searchable.includes(term));
  });
}
