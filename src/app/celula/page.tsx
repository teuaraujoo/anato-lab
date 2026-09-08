import { createPageMetadata } from "@/lib/metadata";
import { organelleIds } from "@/types/cell";
import { CellExperience } from "@/components/cell/CellExperience";

export const metadata = createPageMetadata({
  title: "Célula animal em 3D: organelas e funções | Anatolab",
  description: `Explore uma célula animal em 3D e conheça suas ${organelleIds.length} estruturas e funções. Gire o modelo, aproxime e selecione as organelas para aprender biologia celular.`,
  path: "/celula",
  image: {
    url: "/catalog/celula.png",
    width: 708,
    height: 557,
    alt: "Célula animal em corte com suas organelas visíveis em 3D",
  },
});

export default function CellPage() {
  return <CellExperience />;
}
