import { organelleIds } from "@/types/cell";
import { kidneyStructureIds } from "@/types/kidney";
import { brainStructureIds } from "@/types/brain";

export type CatalogEntry = {
  id: string;
  title: string;
  category: string;
  description: string;
  href: `/${string}`;
  image: string;
  imageAlt: string;
  structureCount: number;
  keywords: readonly string[];
};

// Inclua somente explorações implementadas, com uma rota e uma miniatura reais.
export const catalog: readonly CatalogEntry[] = [
  {
    id: "human-brain",
    title: "Cérebro humano",
    category: "Anatomia humana",
    description:
      "Descubra os hemisférios, os lobos e as estruturas que conectam o sistema nervoso.",
    href: "/cerebro",
    image: "/catalog/cerebro-modelo.png",
    imageAlt:
      "Modelo 3D do cérebro humano, com lobos coloridos, cerebelo e tronco encefálico.",
    structureCount: brainStructureIds.length,
    keywords: [
      "cérebro",
      "encefalo",
      "cerebelo",
      "neuroanatomia",
      "nervoso",
      "lobos",
      "tálamo",
      "anatomia",
    ],
  },
  {
    id: "animal-cell",
    title: "Célula animal",
    category: "Biologia celular",
    description:
      "Explore as estruturas que trabalham juntas para tornar a vida possível.",
    href: "/celula",
    image: "/catalog/celula.png",
    imageAlt:
      "Modelo 3D de uma célula animal em corte, com suas organelas visíveis.",
    structureCount: organelleIds.length,
    keywords: ["célula", "animal", "eucariótica", "organelas", "biologia"],
  },
  {
    id: "human-eye",
    title: "Olho humano",
    category: "Anatomia humana",
    description:
      "Descubra o caminho da luz e as estruturas que tornam a visão possível.",
    href: "/olho",
    image: "/catalog/olho-modelo.png",
    imageAlt:
      "Modelo 3D de um olho humano em corte, com suas estruturas internas visíveis.",
    structureCount: 13,
    keywords: ["olho", "visão", "córnea", "retina", "cristalino", "anatomia"],
  },
  {
    id: "human-kidney",
    title: "Rim humano",
    category: "Anatomia humana",
    description:
      "Explore o interior do rim e descubra como suas estruturas conduzem a urina.",
    href: "/rim",
    image: "/catalog/rim-modelo.png",
    imageAlt:
      "Modelo 3D do rim humano em corte, com pirâmides, cálices e vasos visíveis.",
    structureCount: kidneyStructureIds.length,
    keywords: [
      "rim",
      "rins",
      "renal",
      "urinário",
      "urina",
      "córtex",
      "pelve",
      "anatomia",
    ],
  },
];

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function searchCatalog(query: string): readonly CatalogEntry[] {
  const terms = normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return catalog;

  return catalog.filter((entry) => {
    const searchable = normalizeSearch(
      [entry.title, entry.category, ...entry.keywords].join(" "),
    );
    return terms.every((term) => searchable.includes(term));
  });
}
