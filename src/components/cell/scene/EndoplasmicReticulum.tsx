"use client";

import { useMemo } from "react";
import { Vector3 } from "three";
import { cellBlueprint } from "@/data/cellBlueprint";
import { makeSurface, makeTube, roughERPoint } from "./geometry";
import { Selectable, Surface } from "./Selectable";

export function EndoplasmicReticulum() {
  const rough = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        sheet: makeSurface((u, v) => roughERPoint(i, u, v * 2 - 1), 100, 8),
        edge: makeTube(
          Array.from({ length: 80 }, (_, j) => roughERPoint(i, j / 79, 1)),
          0.035,
          false,
          100,
        ),
      })),
    [],
  );
  const smooth = useMemo(() => {
    const paths = Array.from({ length: 5 }, (_, i) =>
      makeTube(
        Array.from({ length: 12 }, (_, j) => {
          const t = j / 11;
          return new Vector3(
            -0.65 + t * 1.3,
            -0.36 + i * 0.18 + 0.12 * Math.sin(t * 10 + i * 0.7),
            0.1 * Math.cos(t * 8 + i),
          );
        }),
        0.07,
        false,
        60,
      ),
    );
    for (let i = 0; i < 3; i++)
      paths.push(
        makeTube(
          [
            new Vector3(-0.45 + i * 0.4, -0.35, 0),
            new Vector3(-0.55 + i * 0.4, 0.02, 0.09),
            new Vector3(-0.42 + i * 0.4, 0.43, 0),
          ],
          0.068,
          false,
          24,
        ),
      );
    return paths;
  }, []);
  return (
    <>
      <Selectable id="rough-er">
        {rough.map(({ sheet, edge }, i) => (
          <group key={i}>
            <mesh geometry={sheet}>
              <Surface id="rough-er" />
            </mesh>
            <mesh geometry={edge}>
              <Surface id="rough-er" color="#7eb5f2" />
            </mesh>
          </group>
        ))}
      </Selectable>
      <Selectable id="smooth-er">
        <group
          position={cellBlueprint.smoothER.position}
          rotation={[0, 0, -0.16]}
        >
          {smooth.map((geometry, i) => (
            <mesh key={i} geometry={geometry}>
              <Surface id="smooth-er" />
            </mesh>
          ))}
        </group>
      </Selectable>
    </>
  );
}
