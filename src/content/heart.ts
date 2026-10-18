import type { HeartStructureContent, HeartStructureId } from "@/types/heart";

const nhlbiAnatomy = {
  title: "NHLBI · How the Heart Works: What the Heart Looks Like",
  url: "https://www.nhlbi.nih.gov/health/heart/anatomy",
};
const nhlbiBloodFlow = {
  title: "NHLBI · How the Heart Works: How Blood Flows through the Heart",
  url: "https://www.nhlbi.nih.gov/health/heart/blood-flow",
};
const openStaxHeart = {
  title: "OpenStax · 19.1 Heart Anatomy",
  url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy",
};
const ncbiChordae = {
  title: "NCBI MeSH · Chordae Tendineae",
  url: "https://www.ncbi.nlm.nih.gov/mesh/68002815",
};

// Conteúdo introdutório para estudo. As cores são didáticas e não representam escala clínica.
export const heartContent: readonly HeartStructureContent[] = [
  {
    id: "right-atrium",
    name: "Átrio direito",
    color: "#b87195",
    summary: "A câmara superior que recebe sangue com pouco oxigênio do corpo.",
    structure:
      "Câmara superior do lado direito anatômico; recebe as veias cavas e encaminha o sangue ao ventrículo direito pela válvula tricúspide. Em uma vista anterior, o lado direito do paciente aparece à esquerda de quem observa.",
    function:
      "Recebe o retorno venoso da circulação sistêmica e o conduz ao ventrículo direito.",
    related: ["vena-cavae", "tricuspid-valve", "right-ventricle", "septum"],
    keywords: [
      "átrio",
      "aurícula",
      "retorno venoso",
      "sangue pobre em oxigênio",
    ],
    source: nhlbiBloodFlow,
  },
  {
    id: "left-atrium",
    name: "Átrio esquerdo",
    color: "#cf7f75",
    summary:
      "A câmara superior que recebe sangue rico em oxigênio dos pulmões.",
    structure:
      "Câmara superior do lado esquerdo anatômico; recebe as veias pulmonares e se comunica com o ventrículo esquerdo pela válvula mitral.",
    function:
      "Recebe o sangue oxigenado da circulação pulmonar e o encaminha ao ventrículo esquerdo.",
    related: ["pulmonary-veins", "mitral-valve", "left-ventricle", "septum"],
    keywords: [
      "átrio",
      "aurícula",
      "sangue rico em oxigênio",
      "retorno pulmonar",
    ],
    source: nhlbiBloodFlow,
  },
  {
    id: "right-ventricle",
    name: "Ventrículo direito",
    color: "#bf617d",
    summary:
      "A câmara inferior que envia sangue com pouco oxigênio aos pulmões.",
    structure:
      "Câmara muscular abaixo do átrio direito; sua saída segue pelo tronco pulmonar e pela válvula pulmonar até as artérias pulmonares.",
    function:
      "Bombeia sangue para a circulação pulmonar, onde ocorre a troca de oxigênio e dióxido de carbono.",
    related: [
      "right-atrium",
      "tricuspid-valve",
      "pulmonary-valve",
      "pulmonary-arteries",
      "chordae-tendineae",
      "septum",
    ],
    keywords: [
      "ventrículo",
      "circuito pulmonar",
      "sangue pobre em oxigênio",
      "bombeamento",
    ],
    source: openStaxHeart,
  },
  {
    id: "left-ventricle",
    name: "Ventrículo esquerdo",
    color: "#d57b73",
    summary:
      "A câmara de bombeamento que envia sangue rico em oxigênio à aorta.",
    structure:
      "Câmara inferior esquerda anatômica, com parede muscular mais espessa que a do ventrículo direito; sua saída passa pela válvula aórtica.",
    function:
      "Bombeia sangue para a circulação sistêmica, que o distribui aos tecidos do corpo.",
    related: [
      "left-atrium",
      "mitral-valve",
      "aortic-valve",
      "aorta",
      "chordae-tendineae",
      "septum",
    ],
    keywords: [
      "ventrículo",
      "circulação sistêmica",
      "sangue rico em oxigênio",
      "bombeamento",
    ],
    source: openStaxHeart,
  },
  {
    id: "septum",
    name: "Septo cardíaco",
    color: "#e4b3a1",
    summary:
      "A parede interna que separa os lados direito e esquerdo do coração.",
    structure:
      "Parede de tecido com porções entre os átrios e entre os ventrículos, formando a separação interna entre os dois lados do coração.",
    function:
      "Mantém os compartimentos direito e esquerdo separados e organiza os dois circuitos de circulação.",
    related: [
      "right-atrium",
      "left-atrium",
      "right-ventricle",
      "left-ventricle",
      "coronary-arteries",
    ],
    keywords: ["septo", "tabique", "parede interna", "interventricular"],
    source: nhlbiAnatomy,
  },
  {
    id: "tricuspid-valve",
    name: "Válvula tricúspide",
    color: "#e9d6af",
    summary:
      "A válvula atrioventricular entre o átrio direito e o ventrículo direito.",
    structure:
      "Geralmente formada por três cúspides revestidas por endocárdio e ligadas por cordas tendíneas a músculos papilares.",
    function:
      "Permite a passagem do átrio para o ventrículo e ajuda a impedir o retorno do sangue durante a contração ventricular.",
    related: ["right-atrium", "right-ventricle", "chordae-tendineae"],
    keywords: [
      "válvula tricúspide",
      "valva tricúspide",
      "atrioventricular",
      "cúspides",
    ],
    source: nhlbiBloodFlow,
  },
  {
    id: "mitral-valve",
    name: "Válvula mitral",
    color: "#f2deb7",
    summary:
      "A válvula atrioventricular entre o átrio esquerdo e o ventrículo esquerdo.",
    structure:
      "Formada por duas cúspides, também chamada bicúspide, ligadas por cordas tendíneas a músculos papilares do ventrículo esquerdo.",
    function:
      "Permite a passagem do átrio para o ventrículo e ajuda a impedir o retorno do sangue durante a contração ventricular.",
    related: ["left-atrium", "left-ventricle", "chordae-tendineae"],
    keywords: [
      "válvula mitral",
      "valva mitral",
      "bicúspide",
      "atrioventricular",
      "cúspides",
    ],
    source: nhlbiBloodFlow,
  },
  {
    id: "pulmonary-valve",
    name: "Válvula pulmonar",
    color: "#a2d7cf",
    summary: "A válvula semilunar na saída do ventrículo direito.",
    structure:
      "Válvula de três folhetos em forma de bolsas, entre o ventrículo direito e o tronco pulmonar; não possui cordas tendíneas nem músculos papilares.",
    function:
      "Abre para a ejeção do sangue às artérias pulmonares e fecha para ajudar a impedir seu retorno ao ventrículo.",
    related: ["right-ventricle", "pulmonary-arteries"],
    keywords: [
      "válvula pulmonar",
      "valva pulmonar",
      "semilunar",
      "semilunares",
      "sem cordas",
    ],
    source: openStaxHeart,
  },
  {
    id: "aortic-valve",
    name: "Válvula aórtica",
    color: "#ecd39b",
    summary: "A válvula semilunar na saída do ventrículo esquerdo.",
    structure:
      "Válvula normalmente formada por três folhetos em bolsas, entre o ventrículo esquerdo e a aorta; não possui cordas tendíneas nem músculos papilares.",
    function:
      "Abre para a ejeção do sangue à aorta e fecha para ajudar a impedir seu retorno ao ventrículo.",
    related: ["left-ventricle", "aorta"],
    keywords: [
      "válvula aórtica",
      "valva aórtica",
      "semilunar",
      "semilunares",
      "sem cordas",
    ],
    source: openStaxHeart,
  },
  {
    id: "aorta",
    name: "Aorta",
    color: "#da7266",
    summary:
      "A grande artéria que recebe sangue do ventrículo esquerdo e o distribui ao corpo.",
    structure:
      "Vaso que começa depois da válvula aórtica e dá origem a ramos da circulação sistêmica; as artérias coronárias saem de seu segmento inicial.",
    function:
      "Conduz sangue rico em oxigênio do coração para os tecidos e também fornece a origem da circulação coronariana.",
    related: ["left-ventricle", "aortic-valve", "coronary-arteries"],
    keywords: [
      "aorta",
      "artéria principal",
      "circulação sistêmica",
      "sangue rico em oxigênio",
    ],
    source: nhlbiBloodFlow,
  },
  {
    id: "pulmonary-arteries",
    name: "Artérias pulmonares",
    color: "#72b7d1",
    summary:
      "Os vasos que levam sangue com pouco oxigênio do coração aos pulmões.",
    structure:
      "O tronco pulmonar sai do ventrículo direito e se divide em artérias pulmonares direita e esquerda, que seguem para os pulmões.",
    function:
      "Conduzem sangue com pouco oxigênio aos capilares pulmonares, onde ocorre a troca gasosa.",
    related: ["right-ventricle", "pulmonary-valve", "pulmonary-veins"],
    keywords: [
      "artérias pulmonares",
      "tronco pulmonar",
      "circulação pulmonar",
      "sangue pobre em oxigênio",
    ],
    source: nhlbiBloodFlow,
  },
  {
    id: "vena-cavae",
    name: "Veias cavas",
    color: "#779bc9",
    summary:
      "As veias superior e inferior que devolvem sangue sistêmico ao átrio direito.",
    structure:
      "A veia cava superior drena regiões acima do diafragma e a inferior drena regiões abaixo dele; ambas desembocam no átrio direito.",
    function:
      "Retornam ao coração o sangue com pouco oxigênio vindo da circulação sistêmica.",
    related: ["right-atrium"],
    keywords: [
      "veias cavas",
      "veia cava superior",
      "veia cava inferior",
      "retorno sistêmico",
      "sangue pobre em oxigênio",
    ],
    source: openStaxHeart,
  },
  {
    id: "pulmonary-veins",
    name: "Veias pulmonares",
    color: "#e58c85",
    summary: "As veias que trazem sangue rico em oxigênio dos pulmões.",
    structure:
      "Conjunto de veias que retorna dos pulmões e desemboca no átrio esquerdo após a troca gasosa nos capilares pulmonares.",
    function:
      "Conduzem sangue rico em oxigênio da circulação pulmonar ao átrio esquerdo.",
    related: ["left-atrium", "pulmonary-arteries"],
    keywords: [
      "veias pulmonares",
      "retorno pulmonar",
      "circulação pulmonar",
      "sangue rico em oxigênio",
    ],
    source: nhlbiBloodFlow,
  },
  {
    id: "coronary-arteries",
    name: "Artérias coronárias",
    color: "#e4ae76",
    summary: "Os vasos que levam sangue e oxigênio ao músculo do coração.",
    structure:
      "Ramos que surgem do segmento inicial da aorta e se distribuem pela superfície e pelo tecido cardíaco, incluindo ramos para o septo.",
    function:
      "Fornecem sangue rico em oxigênio e nutrientes ao miocárdio e a outras estruturas do coração.",
    related: [
      "aorta",
      "right-atrium",
      "left-atrium",
      "right-ventricle",
      "left-ventricle",
      "septum",
    ],
    keywords: [
      "artérias coronárias",
      "circulação coronariana",
      "miocárdio",
      "irrigação cardíaca",
    ],
    source: nhlbiBloodFlow,
  },
  {
    id: "chordae-tendineae",
    name: "Cordas tendíneas",
    color: "#f2dfc0",
    summary:
      "Cordões de tecido conjuntivo que ligam as cúspides AV aos músculos papilares.",
    structure:
      "Fibras resistentes situadas nos ventrículos e conectadas às cúspides das válvulas atrioventriculares; aparecem apenas associadas às válvulas tricúspide e mitral.",
    function:
      "Mantêm as cúspides atrioventriculares posicionadas durante a contração dos ventrículos e ajudam a limitar sua inversão.",
    related: [
      "tricuspid-valve",
      "mitral-valve",
      "right-ventricle",
      "left-ventricle",
    ],
    keywords: [
      "cordas tendíneas",
      "cordas tendineas",
      "cordas",
      "músculos papilares",
      "atrioventricular",
    ],
    source: ncbiChordae,
  },
];

export const heartContentById = Object.fromEntries(
  heartContent.map((item) => [item.id, item]),
) as Record<HeartStructureId, HeartStructureContent>;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function searchHeartStructures(query: string) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return heartContent.filter((item) => {
    const searchable = normalize(
      [item.name, ...(item.keywords ?? [])].join(" "),
    );
    return terms.every((term) => searchable.includes(term));
  });
}
