import type { Vector3 } from "@/types/cell";

export type Placement = { position: Vector3; rotation: Vector3; scale: number };

// Espaço local: X à direita, Y acima, corte aberto voltado para +Z.
// Posições editoriais fixas: as vistas geradas por IA não são câmeras calibradas.
export const cellBlueprint = {
  nucleus: { position: [-0.65, 0.42, 0.08] as Vector3, radius: 0.94 },
  nucleolus: { position: [-0.76, 0.38, 0.57] as Vector3, radius: 0.3 },
  golgi: { position: [1.23, -0.4, 0.18] as Vector3 },
  smoothER: { position: [-0.65, -1.2, 0.05] as Vector3 },
  centrosome: { position: [0.43, -0.38, 0.52] as Vector3 },
  mitochondria: [
    { position: [-2.06, 0.04, 0.36], rotation: [0, 0.15, -0.35], scale: 0.82 },
    { position: [0.37, 1.78, 0.36], rotation: [0.15, 0.2, 1.13], scale: 0.88 },
    {
      position: [2.05, 0.76, 0.36],
      rotation: [-0.15, -0.2, 0.55],
      scale: 0.88,
    },
    { position: [0.78, -1.8, 0.36], rotation: [0.12, 0.1, 1.28], scale: 0.92 },
    {
      position: [-1.85, -1.39, 0.36],
      rotation: [-0.1, -0.15, 0.65],
      scale: 0.76,
    },
  ] satisfies Placement[],
  lysosomes: [
    [-2.05, 1.2, 0.02],
    [1.28, 1.05, 0.28],
    [-0.4, -2.03, 0],
    [2.1, -0.97, 0.09],
  ] as Vector3[],
};
