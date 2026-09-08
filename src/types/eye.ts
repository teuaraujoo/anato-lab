export const eyeStructureIds = [
  "sclera",
  "cornea",
  "iris",
  "pupil",
  "lens",
  "ciliary-body",
  "zonular-fibers",
  "aqueous-humor",
  "vitreous-humor",
  "retina",
  "choroid",
  "optic-disc",
  "optic-nerve",
] as const;

export type EyeStructureId = (typeof eyeStructureIds)[number];

export type EyeStructureContent = {
  id: EyeStructureId;
  name: string;
  color: string;
  summary: string;
  structure: string;
  function: string;
  related: EyeStructureId[];
  source: { title: string; url: string };
};
