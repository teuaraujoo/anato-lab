export const organelleIds = [
  "membrane",
  "cytoplasm",
  "nucleus",
  "nucleolus",
  "mitochondria",
  "rough-er",
  "smooth-er",
  "golgi",
  "ribosomes",
  "lysosomes",
  "centrosome",
] as const;

export type OrganelleId = (typeof organelleIds)[number];

export type Vector3 = [number, number, number];

export type OrganelleContent = {
  id: OrganelleId;
  name: string;
  color: string;
  summary: string;
  structure: string;
  function: string;
  related: OrganelleId[];
  source: { title: string; url: string };
};
