"use client";

import { useMemo, useLayoutEffect, useRef } from "react";
import { InstancedMesh, Object3D, Vector3 } from "three";
import { cellBlueprint } from "@/data/cellBlueprint";
import { makeTube, roughERPoint } from "./geometry";
import { Selectable, Surface } from "./Selectable";

export function GolgiApparatus() {
  const sacs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) =>
        makeTube(
          Array.from({ length: 18 }, (_, j) => {
            const t = j / 17;
            return new Vector3(
              -0.42 + t * (1.04 - i * 0.065),
              -0.58 + i * 0.21 + 0.22 * (2 * t - 1) ** 2,
              Math.sin(t * Math.PI) * 0.11,
            );
          }),
          0.1,
          false,
          44,
        ),
      ),
    [],
  );
  return (
    <Selectable id="golgi">
      <group
        position={cellBlueprint.golgi.position}
        rotation={[0.18, -0.3, -0.3]}
      >
        {sacs.map((geometry, i) => (
          <mesh key={i} geometry={geometry} scale={[1, 1, 1.8]}>
            <Surface id="golgi" />
          </mesh>
        ))}
        {[-0.45, 0, 0.45].map((y, i) => (
          <mesh key={y} position={[0.72, y, 0.08]}>
            <sphereGeometry args={[0.095 + i * 0.022, 16, 12]} />
            <Surface id="golgi" />
          </mesh>
        ))}
      </group>
    </Selectable>
  );
}

export function Lysosomes() {
  return (
    <Selectable id="lysosomes">
      {cellBlueprint.lysosomes.map((position, i) => (
        <group key={i} position={position}>
          <mesh>
            <sphereGeometry args={[0.21 + i * 0.008, 24, 18]} />
            <Surface id="lysosomes" roughness={0.55} />
          </mesh>
          {Array.from({ length: 10 }, (_, j) => {
            const a = j * 2.4;
            return (
              <mesh
                key={j}
                position={[Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0.18]}
              >
                <sphereGeometry args={[0.026, 8, 6]} />
                <Surface id="lysosomes" color="#b55b91" />
              </mesh>
            );
          })}
        </group>
      ))}
    </Selectable>
  );
}

export function Centrosome() {
  return (
    <Selectable id="centrosome">
      <group
        position={cellBlueprint.centrosome.position}
        rotation={[0.3, 0.15, -0.2]}
      >
        {[0, 1].map((index) => (
          <group
            key={index}
            position={[index * 0.16, -index * 0.2, 0]}
            rotation={[0, 0, (index * Math.PI) / 2]}
          >
            {Array.from({ length: 9 }, (_, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos((i / 9) * Math.PI * 2) * 0.09,
                  0,
                  Math.sin((i / 9) * Math.PI * 2) * 0.09,
                ]}
              >
                <cylinderGeometry args={[0.024, 0.024, 0.42, 7]} />
                <Surface id="centrosome" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </Selectable>
  );
}

export function Ribosomes() {
  const ref = useRef<InstancedMesh>(null);
  const positions = useMemo(() => {
    const free = Array.from({ length: 130 }, (_, i) => {
      const a = i * 2.399963;
      const radius = 0.67 + (((i * 37) % 100) / 100) * 0.27;
      return new Vector3(
        Math.cos(a) * radius * 3,
        Math.sin(a) * radius * 2.5,
        -0.19,
      );
    });
    const attached = Array.from({ length: 116 }, (_, i) => {
      const point = roughERPoint(
        i % 4,
        Math.floor(i / 4) / 28,
        ((i % 3) - 1) * 0.5,
      );
      point.z += 0.055;
      return point;
    });
    return [...free, ...attached];
  }, []);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const dummy = new Object3D();
    positions.forEach((position, i) => {
      dummy.position.copy(position);
      dummy.scale.setScalar(0.032 + (i % 3) * 0.006);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [positions]);
  return (
    <Selectable id="ribosomes">
      <instancedMesh ref={ref} args={[undefined, undefined, positions.length]}>
        <sphereGeometry args={[1, 10, 8]} />
        <Surface id="ribosomes" />
      </instancedMesh>
    </Selectable>
  );
}
