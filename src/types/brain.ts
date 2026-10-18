export const brainStructureIds = [
  "left-hemisphere",
  "right-hemisphere",
  "frontal-lobe",
  "parietal-lobe",
  "temporal-lobe",
  "occipital-lobe",
  "cerebellum",
  "brainstem",
  "corpus-callosum",
  "thalamus",
  "hypothalamus",
  "ventricles",
] as const;

export type BrainStructureId = (typeof brainStructureIds)[number];

export type BrainStructureContent = {
  id: BrainStructureId;
  name: string;
  color: `#${string}`;
  summary: string;
  structure: string;
  function: string;
  related: readonly BrainStructureId[];
  keywords: readonly string[];
  source: { title: string; url: string };
};
