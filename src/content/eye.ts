import type { EyeStructureContent, EyeStructureId } from "@/types/eye";

const nei = {
  title: "National Eye Institute · How eyes work",
  url: "https://www.nei.nih.gov/learn-about-eye-health/healthy-vision/how-eyes-work",
};
const anatomy = {
  title: "National Eye Institute · Parts of the eye",
  url: "https://www.nei.nih.gov/sites/default/files/2019-06/parts-of-the-eye.pdf",
};

// Conteúdo introdutório para estudo. O modelo é didático e não representa escala clínica.
export const eyeContent: EyeStructureContent[] = [
  {
    id: "sclera",
    name: "Esclera",
    color: "#e8e7df",
    summary:
      "A camada externa resistente que dá forma e proteção ao globo ocular.",
    structure:
      "Tecido conjuntivo denso, contínuo anteriormente com a córnea e posteriormente com as bainhas do nervo óptico.",
    function:
      "Protege as estruturas internas e serve de inserção para músculos que movimentam o olho.",
    related: ["cornea", "choroid", "optic-nerve"],
    source: anatomy,
  },
  {
    id: "cornea",
    name: "Córnea",
    color: "#67dbe8",
    summary: "A superfície transparente anterior que inicia o foco da luz.",
    structure:
      "Uma cúpula transparente formada por camadas organizadas e sem vasos sanguíneos no centro.",
    function:
      "Desvia a luz e, junto com o cristalino, ajuda a formar uma imagem nítida na retina.",
    related: ["iris", "lens", "aqueous-humor"],
    source: nei,
  },
  {
    id: "iris",
    name: "Íris",
    color: "#a8c879",
    summary: "O diafragma colorido que regula a abertura da pupila.",
    structure:
      "Um anel de tecido pigmentado situado atrás da córnea e à frente do cristalino.",
    function:
      "Controla a quantidade de luz que entra no olho ao alterar o diâmetro da pupila.",
    related: ["pupil", "ciliary-body", "lens"],
    source: nei,
  },
  {
    id: "pupil",
    name: "Pupila",
    color: "#1b2930",
    summary: "A abertura central por onde a luz entra no olho.",
    structure:
      "Não é uma estrutura sólida: é o espaço central delimitado pela íris.",
    function: "Permite a passagem da luz para o cristalino e para a retina.",
    related: ["iris", "cornea"],
    source: nei,
  },
  {
    id: "lens",
    name: "Cristalino",
    color: "#f0c982",
    summary: "A lente transparente que ajusta o foco da visão.",
    structure:
      "Estrutura biconvexa e elástica, suspensa atrás da íris por fibras zonulares.",
    function:
      "Muda sua curvatura para focalizar objetos em diferentes distâncias na retina.",
    related: ["zonular-fibers", "ciliary-body", "vitreous-humor"],
    source: nei,
  },
  {
    id: "ciliary-body",
    name: "Corpo ciliar",
    color: "#d78d78",
    summary:
      "A região que participa do ajuste do cristalino e da produção do humor aquoso.",
    structure:
      "Anel de tecido na transição entre a íris e a coroide, com músculo e processos ciliares.",
    function:
      "Modula a tensão das fibras zonulares e contribui para a formação do humor aquoso.",
    related: ["iris", "zonular-fibers", "aqueous-humor"],
    source: anatomy,
  },
  {
    id: "zonular-fibers",
    name: "Fibras zonulares",
    color: "#f1e2c8",
    summary: "Fios delicados que conectam o cristalino ao corpo ciliar.",
    structure:
      "Conjunto de fibras radiais finas distribuídas ao redor do equador do cristalino.",
    function:
      "Transmite a ação do corpo ciliar e mantém o cristalino suspenso e alinhado.",
    related: ["lens", "ciliary-body"],
    source: anatomy,
  },
  {
    id: "aqueous-humor",
    name: "Humor aquoso",
    color: "#4b9fe3",
    summary: "O líquido transparente das câmaras anteriores do olho.",
    structure:
      "Fluido entre a córnea e o cristalino, dividido em câmara anterior e posterior pela íris.",
    function:
      "Nutre córnea e cristalino e ajuda a manter a pressão e a forma da parte anterior do olho.",
    related: ["cornea", "iris", "ciliary-body"],
    source: anatomy,
  },
  {
    id: "vitreous-humor",
    name: "Humor vítreo",
    color: "#e6c8b6",
    summary: "O gel transparente que ocupa a maior cavidade do olho.",
    structure:
      "Material gelatinoso entre o cristalino e a retina, com alta proporção de água e fibras de colágeno.",
    function:
      "Preenche o globo, ajuda a manter sua forma e permite a passagem da luz até a retina.",
    related: ["lens", "retina", "optic-disc"],
    source: anatomy,
  },
  {
    id: "retina",
    name: "Retina",
    color: "#e99b70",
    summary:
      "A camada sensível à luz que transforma estímulos luminosos em sinais nervosos.",
    structure:
      "Tecido neural que reveste a face interna posterior do olho e contém fotorreceptores.",
    function:
      "Converte a luz em sinais elétricos que seguem para o cérebro pelo nervo óptico.",
    related: ["choroid", "optic-disc", "vitreous-humor"],
    source: nei,
  },
  {
    id: "choroid",
    name: "Coroide",
    color: "#7b4c55",
    summary: "A camada vascular entre a esclera e a retina.",
    structure:
      "Tecido pigmentado e rico em vasos sanguíneos, situado entre as camadas externa e neural.",
    function:
      "Fornece oxigênio e nutrientes à retina externa e ajuda a absorver luz dispersa.",
    related: ["retina", "sclera", "ciliary-body"],
    source: anatomy,
  },
  {
    id: "optic-disc",
    name: "Disco óptico",
    color: "#ee765b",
    summary:
      "A região posterior onde as fibras da retina convergem para sair do olho.",
    structure:
      "Área da retina atravessada por fibras nervosas e vasos, sem fotorreceptores.",
    function:
      "Reúne os axônios das células ganglionares para formar o nervo óptico.",
    related: ["retina", "optic-nerve"],
    source: anatomy,
  },
  {
    id: "optic-nerve",
    name: "Nervo óptico",
    color: "#e8b58b",
    summary: "O feixe que leva sinais visuais do olho ao cérebro.",
    structure:
      "Conjunto de fibras nervosas que deixam o globo pela região posterior.",
    function:
      "Transmite ao cérebro os sinais produzidos pelo processamento da retina.",
    related: ["optic-disc", "retina", "sclera"],
    source: nei,
  },
];

export const eyeContentById = Object.fromEntries(
  eyeContent.map((item) => [item.id, item]),
) as Record<EyeStructureId, EyeStructureContent>;

export function searchEyeStructures(query: string) {
  const normalized = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return eyeContent.filter((item) =>
    item.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .includes(normalized),
  );
}
