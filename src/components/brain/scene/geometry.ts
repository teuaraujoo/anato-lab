import {
  BufferGeometry,
  CatmullRomCurve3,
  Float32BufferAttribute,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { BrainStructureId } from "@/types/brain";

export type Point3 = [number, number, number];
export type BrainPart = {
  id: BrainStructureId;
  hemisphere?: "left-hemisphere" | "right-hemisphere";
  geometry: BufferGeometry;
  offset: Point3;
  internal?: boolean;
};
type Lobe =
  "frontal-lobe" | "parietal-lobe" | "temporal-lobe" | "occipital-lobe";

// Coordenadas anatômicas: +X esquerdo, +Y superior, +Z anterior.
// A malha cortical é contínua antes de ser dividida em regiões didáticas.
function corticalPoint(theta: number, phi: number, side: number) {
  const st = Math.sin(theta),
    sp = Math.sin(phi),
    cp = Math.cos(phi);
  const z = 2.65 * Math.cos(theta);
  let y = 0.38 + 1.9 * st * cp;
  const temporal =
    Math.exp(-Math.pow((y + 0.55) / 0.65, 2)) *
    Math.exp(-Math.pow((z - 0.4) / 1.75, 4));
  const nx = st * sp;
  const lateralDistance = 1.88 * nx;
  // Campo em coordenadas do objeto: evita sulcos convergindo nos polos da malha.
  const phaseA =
    y * 8.3 + 1.6 * Math.sin(z * 3.8) + 0.8 * Math.sin(lateralDistance * 6);
  const phaseB =
    z * 7.2 + 1.5 * Math.sin(lateralDistance * 4.8) + 0.4 * Math.cos(y * 5);
  const crease =
    Math.sin(phaseA) * Math.cos(phaseB) +
    0.24 * Math.sin(y * 15 + z * 11 + lateralDistance * 9);
  const folds = 0.085 * Math.tanh(crease * 2.4);
  const central =
    Math.exp(-Math.pow((z - (0.48 + 0.18 * cp)) / 0.08, 2)) *
    Math.max(0, cp + 0.25);
  const lateral =
    Math.exp(-Math.pow((y - (-0.12 + z * 0.08)) / 0.065, 2)) *
    Math.exp(-Math.pow((z - 0.65) / 1.75, 4));
  const radial = 1 + folds - central * 0.025 - lateral * 0.025;
  const x = side * (0.065 + (1.88 * nx + 0.16 * temporal * sp) * radial);
  y += folds * st * cp;
  return new Vector3(x, y, z + folds * Math.cos(theta));
}

function lobeAt(p: Vector3): Lobe {
  if (p.z < -1.55 + 0.1 * p.y) return "occipital-lobe";
  if (p.y < -0.12 + p.z * 0.08 && p.z < 1.95) return "temporal-lobe";
  return p.z > 0.48 + 0.1 * p.y ? "frontal-lobe" : "parietal-lobe";
}

function cortex(side: number): BrainPart[] {
  const rows = 160,
    columns = 112;
  const points: Vector3[] = [];
  for (let i = 0; i <= rows; i++)
    for (let j = 0; j <= columns; j++)
      points.push(
        corticalPoint((i / rows) * Math.PI, (j / columns) * Math.PI, side),
      );
  const buckets: Record<Lobe, number[]> = {
    "frontal-lobe": [],
    "parietal-lobe": [],
    "temporal-lobe": [],
    "occipital-lobe": [],
  };
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < columns; j++) {
      const a = i * (columns + 1) + j,
        b = a + columns + 1;
      for (const tri of [
        [a, b, a + 1],
        [b, b + 1, a + 1],
      ]) {
        const center = points[tri[0]]
          .clone()
          .add(points[tri[1]])
          .add(points[tri[2]])
          .multiplyScalar(1 / 3);
        // Reflection changes winding; restore it on the contralateral side.
        buckets[lobeAt(center)].push(
          ...(side > 0 ? tri : [tri[0], tri[2], tri[1]]),
        );
      }
    }
  const offsets: Record<Lobe, Point3> = {
    "frontal-lobe": [side * 1.0, 0.25, 1.9],
    "parietal-lobe": [side * 1.1, 1.75, -0.25],
    "temporal-lobe": [side * 1.8, -0.5, 0.2],
    "occipital-lobe": [side * 0.8, 0.35, -1.85],
  };
  return (Object.entries(buckets) as [Lobe, number[]][]).map(
    ([id, indices]) => {
      const positions = points.flatMap((p) => p.toArray());
      // Fechar as bordas com uma superfície interna impede lobos abertos ao separar.
      const edges = new Map<string, [number, number]>();
      for (let i = 0; i < indices.length; i += 3)
        for (let k = 0; k < 3; k++) {
          const a = indices[i + k],
            b = indices[i + ((k + 1) % 3)];
          const key = a < b ? `${a}:${b}` : `${b}:${a}`;
          if (edges.has(key)) edges.delete(key);
          else edges.set(key, [a, b]);
        }
      const anchor = points.length;
      positions.push(side * 0.09, 0.38, 0);
      for (const [a, b] of edges.values()) indices.push(b, a, anchor);
      const remap = new Map<number, number>();
      const compact: number[] = [];
      const compactIndices = indices.map((index) => {
        if (!remap.has(index)) {
          remap.set(index, compact.length / 3);
          compact.push(
            positions[index * 3],
            positions[index * 3 + 1],
            positions[index * 3 + 2],
          );
        }
        return remap.get(index)!;
      });
      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new Float32BufferAttribute(compact, 3));
      geometry.setIndex(compactIndices);
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      return {
        id,
        hemisphere: side > 0 ? "left-hemisphere" : "right-hemisphere",
        geometry,
        offset: offsets[id],
      };
    },
  );
}

function ellipsoid(position: Point3, scale: Point3, folia = false) {
  const g = new SphereGeometry(1, folia ? 80 : 40, folia ? 64 : 28);
  const a = g.getAttribute("position");
  for (let i = 0; i < a.count; i++) {
    const p = new Vector3().fromBufferAttribute(a, i);
    const displacement = folia ? 1 + 0.035 * Math.sin(p.y * 65 + p.z * 5) : 1;
    a.setXYZ(
      i,
      position[0] + p.x * scale[0] * displacement,
      position[1] + p.y * scale[1],
      position[2] + p.z * scale[2] * displacement,
    );
  }
  g.computeVertexNormals();
  return g;
}
function tube(points: Point3[], radius: number, segments = 56) {
  return new TubeGeometry(
    new CatmullRomCurve3(points.map((p) => new Vector3(...p))),
    segments,
    radius,
    10,
    false,
  );
}
function merge(parts: BufferGeometry[]) {
  const g = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  if (!g) throw new Error("Falha na geometria cerebral");
  return g;
}

export function createBrainParts(): BrainPart[] {
  return [
    ...cortex(1),
    ...cortex(-1),
    {
      id: "cerebellum",
      offset: [0, -1.0, -1.5],
      geometry: merge([
        ellipsoid([0.65, -1.35, -1.65], [0.91, 0.72, 0.89], true),
        ellipsoid([-0.65, -1.35, -1.65], [0.91, 0.72, 0.89], true),
      ]),
    },
    {
      id: "brainstem",
      offset: [0, -1.6, 0.25],
      geometry: merge([
        ellipsoid([0, -1.15, -0.72], [0.43, 0.49, 0.46]),
        ellipsoid([0, -2.7, -0.55], [0.25, 0.09, 0.25]),
        tube(
          [
            [0, -0.45, -0.5],
            [0, -1.12, -0.66],
            [0, -1.75, -0.7],
            [0, -2.7, -0.55],
          ],
          0.25,
        ),
      ]),
    },
    {
      id: "corpus-callosum",
      internal: true,
      offset: [0, 1.2, 0.55],
      geometry: tube(
        [
          [0, 0.05, 1.05],
          [0, 0.6, 1.28],
          [0, 1.05, 0.6],
          [0, 1.1, -0.4],
          [0, 0.65, -1.15],
          [0, 0.4, -1.12],
        ],
        0.18,
      ),
    },
    {
      id: "thalamus",
      internal: true,
      offset: [0, 0.0, 1.1],
      geometry: merge([
        ellipsoid([0.32, 0.12, -0.15], [0.27, 0.32, 0.49]),
        ellipsoid([-0.32, 0.12, -0.15], [0.27, 0.32, 0.49]),
      ]),
    },
    {
      id: "hypothalamus",
      internal: true,
      offset: [0, -0.75, 1.25],
      geometry: ellipsoid([0, -0.4, 0.12], [0.3, 0.25, 0.3]),
    },
    // O azul representa o espaço das cavidades; não é tecido sólido.
    {
      id: "ventricles",
      internal: true,
      offset: [0, 0.55, -0.25],
      geometry: merge([
        ...[-1, 1].map((s) =>
          tube(
            [
              [s * 0.3, 0.38, 0.95],
              [s * 0.35, 0.7, 0.45],
              [s * 0.36, 0.65, -0.4],
              [s * 0.45, 0.18, -0.9],
              [s * 0.55, -0.3, -0.3],
            ],
            0.115,
          ),
        ),
        ellipsoid([0, 0.0, -0.18], [0.07, 0.34, 0.3]),
        // Quarto ventrículo: dorsal à ponte, anterior ao cerebelo.
        ellipsoid([0, -1.06, -1.1], [0.15, 0.33, 0.2]),
        tube(
          [
            [0, -0.25, -0.4],
            [0, -0.65, -0.8],
            [0, -1.2, -1.05],
          ],
          0.07,
        ),
      ]),
    },
  ];
}
