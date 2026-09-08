"use client";
import { useEffect, useMemo, useRef } from "react";
import {
  type BufferGeometry,
  Box3,
  Color,
  DoubleSide,
  Group,
  Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { kidneyContentById } from "@/content/kidney";
import type { KidneyStructureId } from "@/types/kidney";
import { useKidneyStore } from "@/store/kidneyStore";
import {
  ellipsoid,
  hollowTube,
  kidneyBowl,
  kidneyRim,
  pyramid,
  pyramidLayout,
  sinusTissue,
  type Point3,
} from "./geometry";
import { createTissueMaps, kidneyMaterial, type TissueMaps } from "./materials";

type Part = { id: KidneyStructureId; geometries: BufferGeometry[] };

function createKidneyParts(): Part[] {
  const branches: Point3[] = [
    [-0.12, 0.86, 0.25],
    [0.24, -0.05, 0.25],
    [-0.15, -0.93, 0.25],
  ];
  const minor = pyramidLayout.flatMap(({ tip }) => {
    const parent = branches[tip[1] > 0.55 ? 0 : tip[1] < -0.55 ? 2 : 1];
    return hollowTube(
      [parent, [(parent[0] + tip[0]) / 2, (parent[1] + tip[1]) / 2, 0.26], tip],
      0.1,
      0.2,
      0.035,
    );
  });
  const parts: Part[] = [
    {
      id: "renal-capsule",
      geometries: [kidneyBowl(1, 1.4), kidneyRim(1, 0.955)],
    },
    {
      id: "renal-cortex",
      geometries: [kidneyBowl(0.955, 1.3), kidneyRim(0.955, 0.8)],
    },
    { id: "renal-columns", geometries: [kidneyRim(0.8, 0.4)] },
    {
      id: "renal-medulla",
      geometries: pyramidLayout.map((_, i) => pyramid(i)),
    },
    {
      id: "renal-papillae",
      geometries: pyramidLayout.map(({ tip }) =>
        ellipsoid(tip, [0.13, 0.14, 0.14]),
      ),
    },
    { id: "minor-calyces", geometries: minor },
    {
      id: "major-calyces",
      geometries: branches.flatMap((b) =>
        hollowTube(
          [[-0.25, -0.2, 0.25], [(b[0] - 0.25) / 2, (b[1] - 0.2) / 2, 0.25], b],
          0.21,
          0.13,
        ),
      ),
    },
    {
      id: "renal-pelvis",
      geometries: hollowTube(
        [
          [-0.05, 0.05, 0.25],
          [-0.35, -0.25, 0.25],
          [-0.72, -0.65, 0.25],
        ],
        0.3,
        0.16,
      ),
    },
    { id: "renal-sinus", geometries: [sinusTissue()] },
    {
      id: "renal-artery",
      geometries: [
        ...hollowTube(
          [
            [-0.8, 0.55, 0.15],
            [-1.4, 0.6, 0.3],
            [-2.05, 0.7, 0.35],
          ],
          0.18,
        ),
        ...hollowTube(
          [
            [-0.85, 0.55, 0.15],
            [-0.42, 0.67, 0.15],
            [0.14, 1.55, 0.04],
          ],
          0.12,
          0.055,
          0.02,
        ),
        ...hollowTube(
          [
            [-0.85, 0.55, 0.15],
            [-0.3, 0.0, 0.0],
            [0.65, -1.3, 0.04],
          ],
          0.1,
          0.045,
          0.018,
        ),
      ],
    },
    {
      id: "renal-vein",
      geometries: [
        ...hollowTube(
          [
            [-0.8, 0.2, 0.4],
            [-1.5, 0.25, 0.5],
            [-2.1, 0.32, 0.5],
          ],
          0.21,
        ),
        ...hollowTube(
          [
            [-0.85, 0.2, 0.4],
            [-0.4, 0.45, 0.35],
            [-0.02, 1.5, 0.18],
          ],
          0.13,
          0.06,
          0.025,
        ),
        ...hollowTube(
          [
            [-0.85, 0.2, 0.4],
            [-0.28, -0.2, 0.32],
            [0.55, -1.45, 0.18],
          ],
          0.12,
          0.055,
          0.02,
        ),
      ],
    },
    {
      id: "ureter",
      geometries: hollowTube(
        [
          [-0.63, -0.53, 0.25],
          [-1.2, -1.1, 0.25],
          [-1.3, -1.8, 0.25],
        ],
        0.16,
        0.13,
      ),
    },
  ];
  return parts.map(({ id, geometries }) => {
    // Unir apenas geometrias da MESMA estrutura preserva seleção e separação.
    const merged = mergeGeometries(geometries);
    if (!merged) throw new Error(`Não foi possível construir ${id}`);
    geometries.forEach((geometry) => geometry.dispose());
    return { id, geometries: [merged] };
  });
}

function KidneyPart({
  id,
  geometries,
  maps,
  index,
}: Part & { maps: TissueMaps; index: number }) {
  const selected = useKidneyStore((s) => s.selectedId === id);
  const hovered = useKidneyStore((s) => s.hoveredId === id);
  const hidden = useKidneyStore((s) =>
    Boolean(s.isolatedId && s.isolatedId !== id),
  );
  const material = kidneyMaterial(id);
  const dimmed = useKidneyStore((s) =>
    Boolean(s.selectedId && s.selectedId !== id),
  );
  const exploded = useKidneyStore((s) => s.exploded);
  const color = useMemo(
    () =>
      new Color(kidneyContentById[id].color).multiplyScalar(dimmed ? 0.28 : 1),
    [id, dimmed],
  );
  const offset = useMemo(() => {
    const bounds = new Box3();
    geometries.forEach((g) => {
      g.computeBoundingBox();
      if (g.boundingBox) bounds.union(g.boundingBox);
    });
    const center = bounds.getCenter(new Vector3()).multiplyScalar(0.8);
    // Camadas concêntricas precisam de separação em profundidade, além da radial.
    center.z += (index - 5.5) * 0.52;
    return center.toArray();
  }, [geometries, index]);
  return (
    <group
      name={id}
      visible={!hidden}
      position={exploded ? offset : [0, 0, 0]}
      userData={{ structureId: id }}
      onClick={(event) => {
        if (event.delta > 4) return;
        event.stopPropagation();
        useKidneyStore.getState().select(id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        useKidneyStore.getState().hover(id);
      }}
      onPointerOut={() => useKidneyStore.getState().hover(null)}
    >
      {geometries.map((geometry, index) => (
        <mesh
          key={index}
          name={id + "-" + index}
          geometry={geometry}
          userData={{ explodeWithParent: true }}
        >
          <meshStandardMaterial
            color={color}
            roughness={material.roughness}
            side={DoubleSide}
            map={material.tissue ? maps.albedo : null}
            roughnessMap={material.tissue ? maps.roughness : null}
            bumpMap={material.tissue ? maps.height : null}
            bumpScale={id === "renal-medulla" ? 0.006 : 0.014}
            emissive={kidneyContentById[id].color}
            emissiveIntensity={selected ? 0.35 : hovered ? 0.12 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

export function KidneyModel() {
  const root = useRef<Group>(null);
  const parts = useMemo(() => createKidneyParts(), []);
  const maps = useMemo(() => createTissueMaps(), []);
  useEffect(
    () => () =>
      parts.forEach((part) => part.geometries.forEach((g) => g.dispose())),
    [parts],
  );
  useEffect(
    () => () => Object.values(maps).forEach((map) => map.dispose()),
    [maps],
  );
  useEffect(() => {
    const group = root.current;
    if (!group) return;
    group.userData.sculptRuntime = {
      nodes: new Map(group.children.map((child) => [child.name, child])),
      destructionGroups: parts.map((part) => ({
        id: part.id,
        nodeIds: [part.id],
        mode: "teaching-separation",
      })),
    };
    return () => {
      delete group.userData.sculptRuntime;
    };
  }, [parts]);
  return (
    <group ref={root} name="root" userData={{ modelId: "human-kidney" }}>
      {parts.map((part, index) => (
        <KidneyPart key={part.id} {...part} index={index} maps={maps} />
      ))}
    </group>
  );
}
