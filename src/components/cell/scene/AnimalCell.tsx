"use client";

import { CellEnvelope } from "./CellEnvelope";
import { Nucleus } from "./Nucleus";
import { Mitochondria } from "./Mitochondria";
import { EndoplasmicReticulum } from "./EndoplasmicReticulum";
import {
  Centrosome,
  GolgiApparatus,
  Lysosomes,
  Ribosomes,
} from "./OtherOrganelles";

export function AnimalCell() {
  return (
    <group
      name="cell-root"
      rotation={[-0.12, -0.12, -0.08]}
      userData={{ modelId: "animal-cell" }}
    >
      <CellEnvelope />
      <Nucleus />
      <Mitochondria />
      <EndoplasmicReticulum />
      <GolgiApparatus />
      <Lysosomes />
      <Centrosome />
      <Ribosomes />
    </group>
  );
}
