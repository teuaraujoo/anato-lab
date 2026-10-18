import type { BrainStructureContent, BrainStructureId } from "@/types/brain";

const nindsBrainBasics = {
  title: "NINDS · Brain Basics: Know Your Brain",
  url: "https://www.ninds.nih.gov/health-information/public-education/brain-basics/brain-basics-know-your-brain",
};
const brainTextbook = {
  title: "OpenStax · The Brain: Structure and Function",
  url: "https://openstax.org/books/introduction-behavioral-neuroscience/pages/1-4-the-brain-structure-and-function",
};
const centralNervousSystem = {
  title: "OpenStax · Anatomy and Physiology 2e: The Central Nervous System",
  url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/13-2-the-central-nervous-system",
};
const ventricularSystem = {
  title: "OpenStax · Organization of the Nervous System",
  url: "https://openstax.org/books/introduction-behavioral-neuroscience/pages/1-2-organization-of-the-nervous-system",
};

// Sínteses educacionais próprias. As cores são didáticas e não indicam atividade ou risco clínico.
export const brainContent: readonly BrainStructureContent[] = [
  {
    id: "left-hemisphere",
    name: "Hemisfério cerebral esquerdo",
    color: "#d3b3c3",
    summary:
      "Uma das duas grandes metades do cérebro, separada da direita pela fissura longitudinal.",
    structure:
      "É formado por córtex, substância branca e núcleos profundos; contém os lobos frontal, parietal, temporal e occipital.",
    function:
      "Trabalha com o hemisfério direito na percepção, linguagem, memória e movimento; em muitas pessoas, redes de linguagem têm maior participação à esquerda, mas isso varia.",
    related: [
      "right-hemisphere",
      "corpus-callosum",
      "frontal-lobe",
      "parietal-lobe",
      "temporal-lobe",
      "occipital-lobe",
    ],
    keywords: [
      "hemisfério esquerdo",
      "hemisfério cerebral",
      "córtex cerebral",
      "cérebro",
      "encéfalo",
      "fissura longitudinal",
      "linguagem",
      "movimento contralateral",
    ],
    source: nindsBrainBasics,
  },
  {
    id: "right-hemisphere",
    name: "Hemisfério cerebral direito",
    color: "#b8c4dc",
    summary:
      "A outra grande metade do cérebro, espelhada à esquerda em torno da fissura longitudinal.",
    structure:
      "É formado por córtex, substância branca e núcleos profundos; contém os lobos frontal, parietal, temporal e occipital.",
    function:
      "Trabalha com o hemisfério esquerdo na percepção, linguagem, memória e movimento; em muitas pessoas, redes visuoespaciais têm maior participação à direita, mas isso varia.",
    related: [
      "left-hemisphere",
      "corpus-callosum",
      "frontal-lobe",
      "parietal-lobe",
      "temporal-lobe",
      "occipital-lobe",
    ],
    keywords: [
      "hemisfério direito",
      "hemisfério cerebral",
      "córtex cerebral",
      "cérebro",
      "encéfalo",
      "fissura longitudinal",
      "visuoespacial",
      "movimento contralateral",
    ],
    source: nindsBrainBasics,
  },
  {
    id: "frontal-lobe",
    name: "Lobo frontal",
    color: "#e8a08d",
    summary: "A região anterior do córtex cerebral, atrás da testa.",
    structure:
      "Ocupa a parte anterior de cada hemisfério e inclui áreas pré-frontais, pré-motoras e o córtex motor primário.",
    function:
      "Participa do planejamento, atenção, tomada de decisão, controle de movimentos voluntários e aspectos da linguagem.",
    related: [
      "parietal-lobe",
      "temporal-lobe",
      "left-hemisphere",
      "right-hemisphere",
      "thalamus",
    ],
    keywords: [
      "lobo frontal",
      "córtex pré-frontal",
      "córtex motor",
      "planejamento",
      "decisão",
      "movimento voluntário",
      "testa",
    ],
    source: brainTextbook,
  },
  {
    id: "parietal-lobe",
    name: "Lobo parietal",
    color: "#e9c982",
    summary: "A região superior e posterior ao lobo frontal.",
    structure:
      "Fica entre o sulco central e as regiões occipital e temporal, incluindo o córtex somatossensorial.",
    function:
      "Integra tato, temperatura e posição corporal e contribui para a atenção e a representação espacial do corpo e do ambiente.",
    related: [
      "frontal-lobe",
      "occipital-lobe",
      "temporal-lobe",
      "left-hemisphere",
      "right-hemisphere",
      "thalamus",
    ],
    keywords: [
      "lobo parietal",
      "córtex somatossensorial",
      "tato",
      "temperatura",
      "propriocepção",
      "orientação espacial",
      "corpo",
    ],
    source: brainTextbook,
  },
  {
    id: "temporal-lobe",
    name: "Lobo temporal",
    color: "#bba6df",
    summary:
      "A região lateral e inferior do córtex, sob os lobos frontal e parietal.",
    structure:
      "Estende-se ao longo da lateral do cérebro e inclui o córtex auditivo e áreas de associação multimodal.",
    function:
      "Participa da audição, memória, reconhecimento e compreensão da linguagem, em redes distribuídas pelo cérebro.",
    related: [
      "frontal-lobe",
      "parietal-lobe",
      "occipital-lobe",
      "left-hemisphere",
      "right-hemisphere",
      "thalamus",
    ],
    keywords: [
      "lobo temporal",
      "córtex auditivo",
      "audição",
      "memória",
      "linguagem",
      "reconhecimento",
      "associação multimodal",
    ],
    source: brainTextbook,
  },
  {
    id: "occipital-lobe",
    name: "Lobo occipital",
    color: "#8ac7b6",
    summary:
      "A região posterior do córtex cerebral, na parte de trás da cabeça.",
    structure:
      "Ocupa a porção posterior de cada hemisfério e contém o córtex visual primário e áreas visuais associativas.",
    function:
      "Processa aspectos da visão, como forma, cor e movimento, integrando sinais visuais em redes com outras regiões.",
    related: [
      "parietal-lobe",
      "temporal-lobe",
      "left-hemisphere",
      "right-hemisphere",
      "thalamus",
    ],
    keywords: [
      "lobo occipital",
      "córtex visual",
      "visão",
      "imagem",
      "cor",
      "movimento visual",
    ],
    source: brainTextbook,
  },
  {
    id: "cerebellum",
    name: "Cerebelo",
    color: "#d4a17e",
    summary:
      "A estrutura dobrada na parte posterior, atrás do tronco encefálico.",
    structure:
      "Possui um córtex próprio e núcleos profundos; fica inferior aos lobos occipitais e posterior ao tronco encefálico.",
    function:
      "Compara comandos motores com o retorno sensorial e contribui para equilíbrio, postura, coordenação, precisão e aprendizagem motora.",
    related: ["brainstem", "frontal-lobe", "ventricles"],
    keywords: [
      "cerebelo",
      "coordenação",
      "equilíbrio",
      "postura",
      "movimento",
      "aprendizagem motora",
    ],
    source: centralNervousSystem,
  },
  {
    id: "brainstem",
    name: "Tronco encefálico",
    color: "#8ebbd5",
    summary: "A porção que conecta o cérebro à medula espinhal.",
    structure:
      "É formado por mesencéfalo, ponte e medula oblonga; o cerebelo se liga a ele, mas é uma região separada.",
    function:
      "Conduz vias entre cérebro, cerebelo e medula, abriga núcleos de nervos cranianos e participa da respiração, circulação e vigília.",
    related: ["cerebellum", "thalamus", "hypothalamus", "ventricles"],
    keywords: [
      "tronco encefálico",
      "tronco cerebral",
      "mesencéfalo",
      "ponte",
      "bulbo",
      "medula oblonga",
      "respiração",
      "frequência cardíaca",
    ],
    source: centralNervousSystem,
  },
  {
    id: "corpus-callosum",
    name: "Corpo caloso",
    color: "#f1ddb0",
    summary: "O grande feixe de fibras que conecta os dois hemisférios.",
    structure:
      "É uma comissura de substância branca situada profundamente na fissura longitudinal, formada por axônios que cruzam a linha média.",
    function:
      "Permite a troca de informações e a coordenação entre os hemisférios durante tarefas integradas.",
    related: ["left-hemisphere", "right-hemisphere", "ventricles"],
    keywords: [
      "corpo caloso",
      "comissura cerebral",
      "substância branca",
      "fibras nervosas",
      "hemisférios",
      "linha média",
    ],
    source: nindsBrainBasics,
  },
  {
    id: "thalamus",
    name: "Tálamo",
    color: "#d7a0be",
    summary: "Um par de núcleos profundos no centro do diencéfalo.",
    structure:
      "Fica acima do tronco encefálico e forma grande parte das paredes laterais do terceiro ventrículo.",
    function:
      "Seleciona e retransmite a maior parte das informações sensoriais ao córtex, exceto a olfação, e também participa de circuitos motores, atenção e vigília.",
    related: [
      "hypothalamus",
      "brainstem",
      "ventricles",
      "occipital-lobe",
      "temporal-lobe",
    ],
    keywords: [
      "tálamo",
      "diencéfalo",
      "retransmissão sensorial",
      "sensibilidade",
      "atenção",
      "vigília",
      "núcleos",
      "terceiro ventrículo",
    ],
    source: centralNervousSystem,
  },
  {
    id: "hypothalamus",
    name: "Hipotálamo",
    color: "#eea967",
    summary:
      "A região sob o tálamo que ajuda a manter o equilíbrio interno do corpo.",
    structure:
      "É formado por núcleos do diencéfalo, relacionados ao assoalho do terceiro ventrículo e conectados à hipófise.",
    function:
      "Coordena aspectos da homeostase, dos sistemas nervoso autônomo e endócrino, incluindo temperatura, fome, sede e ciclos sono-vigília.",
    related: ["thalamus", "brainstem", "ventricles"],
    keywords: [
      "hipotálamo",
      "diencéfalo",
      "homeostase",
      "pituitária",
      "hipófise",
      "sistema endócrino",
      "sistema autônomo",
      "temperatura",
      "sede",
      "sono-vigília",
    ],
    source: centralNervousSystem,
  },
  {
    id: "ventricles",
    name: "Ventrículos encefálicos",
    color: "#78cddd",
    summary:
      "Cavidades interconectadas que contêm líquido cefalorraquidiano; não são tecido nervoso.",
    structure:
      "Incluem dois ventrículos laterais, o terceiro e o quarto, conectados por passagens; são revestidos por células e associados ao plexo coroide.",
    function:
      "Acomodam e ajudam a circular o líquido cefalorraquidiano, que amortece o encéfalo e participa das trocas de materiais.",
    related: [
      "left-hemisphere",
      "right-hemisphere",
      "corpus-callosum",
      "thalamus",
      "hypothalamus",
      "brainstem",
      "cerebellum",
    ],
    keywords: [
      "ventrículos",
      "ventrículo lateral",
      "terceiro ventrículo",
      "quarto ventrículo",
      "líquido cefalorraquidiano",
      "líquor",
      "LCR",
      "plexo coroide",
      "cavidade",
    ],
    source: ventricularSystem,
  },
];

export const brainContentById = Object.fromEntries(
  brainContent.map((item) => [item.id, item]),
) as Record<BrainStructureId, BrainStructureContent>;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function searchBrainStructures(query: string) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return brainContent.filter((item) => {
    const searchable = normalize([item.name, ...item.keywords].join(" "));
    return terms.every((term) => searchable.includes(term));
  });
}
