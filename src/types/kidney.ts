export const kidneyStructureIds = [
  "renal-capsule",
  "renal-cortex",
  "renal-medulla",
  "renal-columns",
  "renal-papillae",
  "minor-calyces",
  "major-calyces",
  "renal-pelvis",
  "renal-sinus",
  "renal-artery",
  "renal-vein",
  "ureter",
] as const;

export type KidneyStructureId = (typeof kidneyStructureIds)[number];

export type KidneyStructureContent = {
  id: KidneyStructureId;
  name: string;
  color: `#${string}`;
  summary: string;
  structure: string;
  function: string;
  related: readonly KidneyStructureId[];
  keywords: readonly string[];
  source: { title: string; url: string };
};
