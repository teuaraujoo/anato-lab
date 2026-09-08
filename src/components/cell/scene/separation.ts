import type { OrganelleId } from "@/types/cell";

// Deslocamentos didáticos, aplicados aos grupos semânticos sem alterar as
// geometrias nem suas posições locais quando o modelo é reunido.
export const cellSeparationOffsets: Record<
  OrganelleId,
  [number, number, number]
> = {
  // O envelope se abre lateralmente; o restante da célula é escalonado em
  // profundidade para que o volume da separação fique legível em perspectiva.
  membrane: [-1.8, 0.18, 0.9],
  cytoplasm: [1.8, -0.16, 1.2],
  nucleus: [-1.36, 0.84, 1.9],
  nucleolus: [-1.36, 0.84, 1.9],
  mitochondria: [1.84, -0.56, 2.35],
  "rough-er": [-1.72, 1.44, 2.8],
  "smooth-er": [1.36, -1.72, 3.15],
  golgi: [1.92, -1.24, 3.55],
  ribosomes: [0.72, 1.92, 4],
  lysosomes: [-1.56, 1.64, 3.35],
  centrosome: [1.92, -1.8, 3.8],
};
