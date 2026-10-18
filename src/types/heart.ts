export const heartStructureIds = [
  "right-atrium",
  "left-atrium",
  "right-ventricle",
  "left-ventricle",
  "septum",
  "tricuspid-valve",
  "mitral-valve",
  "pulmonary-valve",
  "aortic-valve",
  "aorta",
  "pulmonary-arteries",
  "vena-cavae",
  "pulmonary-veins",
  "coronary-arteries",
  "chordae-tendineae",
] as const;

export type HeartStructureId = (typeof heartStructureIds)[number];

export type HeartStructureContent = {
  id: HeartStructureId;
  name: string;
  color: `#${string}`;
  summary: string;
  structure: string;
  function: string;
  related: readonly HeartStructureId[];
  keywords?: readonly string[];
  source: { title: string; url: string };
};
