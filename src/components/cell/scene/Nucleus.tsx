"use client";

import { useMemo } from "react";
import { Vector3 } from "three";
import { cellBlueprint } from "@/data/cellBlueprint";
import { makeBowl, makeTube, rimPoints } from "./geometry";
import { Selectable, Surface } from "./Selectable";

export function Nucleus() {
  const shell = useMemo(() => makeBowl(0.94, 0.94, 0.9, 0.5), []);
  const rim = useMemo(
    () => makeTube(rimPoints(0.94, 0.94, 0.5), 0.035, true),
    [],
  );
  const chromatin = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        makeTube(
          Array.from({ length: 28 }, (_, j) => {
            const a = (j / 28) * Math.PI * 2;
            const r = 0.3 + i * 0.072;
            return new Vector3(
              Math.cos(a + i) * r,
              Math.sin(a * 2 + i) * r * 0.75,
              0.1 + 0.06 * Math.sin(a * 3 + i),
            );
          }),
          0.013,
          true,
        ),
      ),
    [],
  );
  return (
    <Selectable id="nucleus">
      <group position={cellBlueprint.nucleus.position}>
        <mesh geometry={shell}>
          <Surface id="nucleus" />
        </mesh>
        <mesh geometry={rim}>
          <Surface id="nucleus" color="#d2b6f2" />
        </mesh>
        {chromatin.map((geometry, i) => (
          <mesh key={i} geometry={geometry}>
            <Surface id="nucleus" color="#d7b3f4" />
          </mesh>
        ))}
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.83, Math.sin(a) * 0.83, 0.31]}
            >
              <torusGeometry args={[0.045, 0.014, 6, 14]} />
              <Surface id="nucleus" color="#7450a4" />
            </mesh>
          );
        })}
        <Selectable id="nucleolus" nested>
          <mesh
            position={[
              cellBlueprint.nucleolus.position[0] -
                cellBlueprint.nucleus.position[0],
              cellBlueprint.nucleolus.position[1] -
                cellBlueprint.nucleus.position[1],
              cellBlueprint.nucleolus.position[2] -
                cellBlueprint.nucleus.position[2],
            ]}
          >
            <sphereGeometry args={[0.3, 32, 24]} />
            <Surface id="nucleolus" color="#7546a5" roughness={0.72} />
          </mesh>
        </Selectable>
      </group>
    </Selectable>
  );
}
