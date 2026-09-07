"use client";

import { useMemo } from "react";
import { makeBowl, makeTube, rimPoints } from "./geometry";
import { Selectable, Surface } from "./Selectable";

export function CellEnvelope() {
  const shell = useMemo(() => makeBowl(3.12, 2.64, 1.35, 0.02, true), []);
  const cytosol = useMemo(() => makeBowl(2.98, 2.52, 0.7, -0.08, true), []);
  const rim = useMemo(
    () => makeTube(rimPoints(3.12, 2.64, 0.02, true), 0.06, true, 160),
    [],
  );
  const innerRim = useMemo(
    () => makeTube(rimPoints(3.02, 2.56, 0.025, true), 0.025, true, 160),
    [],
  );
  return (
    <>
      <Selectable id="membrane">
        <mesh geometry={shell}>
          <Surface id="membrane" opacity={0.46} />
        </mesh>
        <mesh geometry={rim}>
          <Surface id="membrane" />
        </mesh>
        <mesh geometry={innerRim}>
          <Surface id="membrane" color="#b4ece1" />
        </mesh>
      </Selectable>
      <Selectable id="cytoplasm">
        <mesh geometry={cytosol}>
          <Surface id="cytoplasm" opacity={0.46} roughness={0.65} />
        </mesh>
      </Selectable>
    </>
  );
}
