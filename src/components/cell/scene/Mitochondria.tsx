"use client";

import { useMemo } from "react";
import { Vector3 } from "three";
import { cellBlueprint } from "@/data/cellBlueprint";
import { makeBowl, makeTube, rimPoints } from "./geometry";
import { Selectable, Surface } from "./Selectable";

export function Mitochondria() {
  const shell = useMemo(() => makeBowl(0.37, 0.68, 0.28, 0.16), []);
  const rim = useMemo(
    () => makeTube(rimPoints(0.37, 0.68, 0.16), 0.038, true),
    [],
  );
  const cristae = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const y = -0.49 + i * 0.14;
        const width = 0.29 * Math.sqrt(1 - (y / 0.65) ** 2);
        return makeTube(
          [
            new Vector3(-width, y, 0.1),
            new Vector3(-width * 0.5, y + 0.06, 0.16),
            new Vector3(width * 0.2, y - 0.03, 0.16),
            new Vector3(width, y + 0.025, 0.09),
          ],
          0.033,
          false,
          24,
        );
      }),
    [],
  );
  return (
    <Selectable id="mitochondria">
      {cellBlueprint.mitochondria.map((placement, i) => (
        <group key={i} {...placement}>
          <mesh geometry={shell}>
            <Surface id="mitochondria" color="#c9594b" />
          </mesh>
          <mesh geometry={rim}>
            <Surface id="mitochondria" />
          </mesh>
          {cristae.map((geometry, j) => (
            <mesh key={j} geometry={geometry}>
              <Surface id="mitochondria" color="#f7ae92" />
            </mesh>
          ))}
        </group>
      ))}
    </Selectable>
  );
}
