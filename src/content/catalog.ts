import { organelleIds } from "@/types/cell";

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
