import type { EyeStructureId } from "@/types/eye";

// Deslocamentos didáticos, não posições anatômicas. A montagem usa sempre zero.
export const eyeSeparationOffsets: Record<
  EyeStructureId,
  [number, number, number]
> = {
  sclera: [-2, 0, -5],
  choroid: [-1, 0, -2.5],
  retina: [0, 0, 0],
  "vitreous-humor": [3.8, -2.6, 0],
  "ciliary-body": [0, 0, 1.4],
  "zonular-fibers": [0, 2.7, 2.5],
  lens: [0, 0, 3.1],
  iris: [0, 0, 4.6],
  pupil: [0, 2.1, 5.3],
  "aqueous-humor": [0, -2.8, 5.8],
  cornea: [0, 0, 7.2],
  "optic-disc": [0, 2.4, -2.4],
  "optic-nerve": [0, 0, -4.4],
};
