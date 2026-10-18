import {
  BufferGeometry,
  CatmullRomCurve3,
  Float32BufferAttribute,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { HeartStructureId } from "@/types/heart";

export type Point3 = [number, number, number];
export type HeartPart = {
  id: HeartStructureId;
  geometry: BufferGeometry;
  cutGeometry?: BufferGeometry;
  offset: Point3;
  internal?: boolean;
};

function merged(geometries: BufferGeometry[]) {
  geometries.forEach((g) => g.deleteAttribute("uv"));
  const result = mergeGeometries(geometries);
  if (!result)
    throw new Error("Não foi possível construir a geometria cardíaca");
  geometries.forEach((g) => g.dispose());
  return result;
}

function ellipsoid(position: Point3, scale: Point3) {
  const geometry = new SphereGeometry(1, 40, 28);
  geometry.scale(...scale).translate(...position);
  return geometry;
}

// Coordenadas anatômicas: +X = esquerda do paciente, +Y = superior, +Z = anterior.
// Uma única superfície ventricular é repartida em dois territórios contínuos.
function ventriclePoint(
  t: number,
  phi: number,
  inner: boolean,
  left: boolean,
): Point3 {
  const theta = 0.08 + t * (Math.PI - 0.16);
  const width =
    1.42 * Math.pow(Math.sin(theta), 0.9) * (1 + 0.12 * Math.cos(theta));
  const depth = 0.94 * Math.sin(theta);
  const thickness = inner ? (left ? 0.27 : 0.14) : 0;
  const x = 0.06 + 0.57 * Math.pow(t, 2);
  const y = -0.57 + 1.64 * Math.cos(theta);
  const relief = inner
    ? 0.018 * Math.sin(phi * 17 + theta * 13)
    : 0.008 * Math.sin(phi * 24 + theta * 19);
  return [
    x + Math.max(0.015, width - thickness) * Math.cos(phi) + relief,
    y * (inner ? 0.94 : 1),
    Math.max(0.015, depth - thickness) * Math.sin(phi) + relief,
  ];
}

function ventricularWall(left: boolean, cutaway: boolean) {
  const shift = -Math.atan(0.4),
    angle = Math.acos(0.12 / Math.sqrt(1.16));
  let start = left ? Math.PI * 2 - angle + shift : angle + shift;
  let end = left ? Math.PI * 2 + angle + shift : Math.PI * 2 - angle + shift;
  // A janela anterior remove a metade frontal, preservando paredes e espessura.
  if (cutaway) {
    start = left ? start : Math.PI;
    end = left ? Math.PI * 2 : end;
  }
  const rows = 80,
    cols = 64,
    positions: number[] = [],
    indices: number[] = [];
  for (const inner of [false, true])
    for (let i = 0; i <= rows; i++)
      for (let j = 0; j <= cols; j++)
        positions.push(
          ...ventriclePoint(
            i / rows,
            start + (j / cols) * (end - start),
            inner,
            left,
          ),
        );
  const layer = (rows + 1) * (cols + 1);
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      const a = i * (cols + 1) + j,
        b = a + cols + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
      indices.push(
        a + layer,
        a + 1 + layer,
        b + layer,
        b + layer,
        a + 1 + layer,
        b + 1 + layer,
      );
    }
  const rim = (a: number, b: number) =>
    indices.push(a, a + layer, b, b, a + layer, b + layer);
  for (let i = 0; i < rows; i++) {
    rim(i * (cols + 1), (i + 1) * (cols + 1));
    rim((i + 1) * (cols + 1) + cols, i * (cols + 1) + cols);
  }
  for (let j = 0; j < cols; j++) {
    rim(j + 1, j);
    rim(rows * (cols + 1) + j, rows * (cols + 1) + j + 1);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(positions, 3));
  for (let i = 0; i < indices.length; i += 3)
    [indices[i], indices[i + 2]] = [indices[i + 2], indices[i]];
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function atrialWall(position: Point3, scale: Point3, cutaway: boolean) {
  const rows = 40,
    cols = 64,
    positions: number[] = [],
    indices: number[] = [];
  const start = cutaway ? Math.PI : 0,
    end = Math.PI * 2;
  for (const inner of [false, true])
    for (let i = 0; i <= rows; i++)
      for (let j = 0; j <= cols; j++) {
        const theta = 0.04 + (i / rows) * (Math.PI - 0.08),
          phi = start + (j / cols) * (end - start);
        const thickness = inner ? 0.1 : 0;
        positions.push(
          position[0] +
            (scale[0] - thickness) * Math.sin(theta) * Math.cos(phi),
          position[1] + (scale[1] - thickness) * Math.cos(theta),
          position[2] +
            (scale[2] - thickness) * Math.sin(theta) * Math.sin(phi),
        );
      }
  const layer = (rows + 1) * (cols + 1);
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      const a = i * (cols + 1) + j,
        b = a + cols + 1;
      indices.push(
        a,
        b,
        a + 1,
        b,
        b + 1,
        a + 1,
        a + layer,
        a + 1 + layer,
        b + layer,
        b + layer,
        a + 1 + layer,
        b + 1 + layer,
      );
    }
  for (let i = 0; i < rows; i++)
    for (const j of [0, cols]) {
      const a = i * (cols + 1) + j,
        b = (i + 1) * (cols + 1) + j;
      indices.push(a, a + layer, b, b, a + layer, b + layer);
    }
  for (const i of [0, rows])
    for (let j = 0; j < cols; j++) {
      const a = i * (cols + 1) + j,
        b = a + 1;
      indices.push(a, b, a + layer, b, b + layer, a + layer);
    }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(positions, 3));
  for (let i = 0; i < indices.length; i += 3)
    [indices[i], indices[i + 2]] = [indices[i + 2], indices[i]];
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function curve(points: Point3[], radius: number, segments = 48) {
  return new TubeGeometry(
    new CatmullRomCurve3(points.map((p) => new Vector3(...p))),
    segments,
    radius,
    10,
    false,
  );
}

function vessel(points: Point3[], radius: number) {
  const path = new CatmullRomCurve3(points.map((p) => new Vector3(...p)));
  const outer = new TubeGeometry(path, 56, radius, 18, false);
  const inner = new TubeGeometry(path, 56, radius - 0.055, 18, false);
  // Tubo oco: inverter o lado interno e fechar apenas o anel das extremidades.
  const insideIndex = inner.getIndex()!;
  for (let i = 0; i < insideIndex.count; i += 3) {
    const a = insideIndex.getX(i);
    insideIndex.setX(i, insideIndex.getX(i + 2));
    insideIndex.setX(i + 2, a);
  }
  inner.computeVertexNormals();
  const rings: BufferGeometry[] = [];
  for (const t of [0, 1]) {
    const center = path.getPointAt(t),
      tangent = path.getTangentAt(t);
    const ring = new TorusGeometry(radius - 0.0275, 0.0275, 6, 18);
    // align via look-at basis; cilindros podem apontar em qualquer direção.
    const n =
      Math.abs(tangent.y) < 0.9 ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0);
    const u = new Vector3().crossVectors(n, tangent).normalize();
    const v = new Vector3().crossVectors(tangent, u);
    const attr = ring.getAttribute("position");
    for (let i = 0; i < attr.count; i++) {
      const p = new Vector3().fromBufferAttribute(attr, i);
      const q = center
        .clone()
        .addScaledVector(u, p.x)
        .addScaledVector(v, p.y)
        .addScaledVector(tangent, p.z);
      attr.setXYZ(i, q.x, q.y, q.z);
    }
    ring.computeVertexNormals();
    rings.push(ring);
  }
  return merged([outer, inner, ...rings]);
}

function valve(
  position: Point3,
  radius: number,
  count: number,
  semilunar = false,
) {
  const rim = new TorusGeometry(radius, 0.035, 8, 48);
  rim.rotateX(Math.PI / 2).translate(...position);
  const leaflets: BufferGeometry[] = [];
  for (let leaf = 0; leaf < count; leaf++) {
    const points: number[] = [],
      indices: number[] = [];
    const steps = 16,
      layers = 8;
    for (let i = 0; i <= layers; i++)
      for (let j = 0; j <= steps; j++) {
        const t = i / layers,
          a = ((leaf + j / steps) / count) * Math.PI * 2;
        const r = radius * (1 - t * (semilunar ? 0.8 : 0.7));
        points.push(
          position[0] + r * Math.cos(a),
          position[1] - t * (semilunar ? 0.14 : 0.25),
          position[2] + r * Math.sin(a),
        );
      }
    for (let i = 0; i < layers; i++)
      for (let j = 0; j < steps; j++) {
        const a = i * (steps + 1) + j,
          b = a + steps + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(points, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    // mergeGeometries exige atributos compatíveis; as válvulas não precisam UV.
    g.setAttribute(
      "uv",
      new Float32BufferAttribute(new Float32Array((points.length / 3) * 2), 2),
    );
    leaflets.push(g);
  }
  return merged([rim, ...leaflets]);
}

export function createHeartParts(): HeartPart[] {
  const papillaryMuscles = (x: number) =>
    [-0.17, 0.17].flatMap((offset) => [
      curve(
        [
          [x + offset, -1.4, -0.48],
          [x + offset, -1.2, -0.3],
          [x + offset, -0.95, -0.08],
        ],
        0.085,
        20,
      ),
      ellipsoid([x + offset, -0.95, -0.08], [0.085, 0.1, 0.085]),
    ]);
  const chords: BufferGeometry[] = [];
  for (const [x, radius, count] of [
    [-0.55, 0.42, 3],
    [0.65, 0.42, 2],
  ]) {
    for (let cusp = 0; cusp < count; cusp++)
      for (let branch = 0; branch < 4; branch++) {
        const a = ((cusp + (branch + 1) / 5) / count) * Math.PI * 2;
        chords.push(
          curve(
            [
              [
                x + radius * 0.3 * Math.cos(a),
                0.1,
                0.08 + radius * 0.3 * Math.sin(a),
              ],
              [x + radius * 0.4 * Math.cos(a), -0.5, -0.05],
              [x + (cusp % 2 ? 0.17 : -0.17), -0.95, -0.08],
            ],
            0.014,
            12,
          ),
        );
      }
  }
  const coronaryFront = [
    curve(
      [
        [0.24, 0.95, 0.12],
        [0.05, 0.7, 0.65],
        [-0.12, 0.45, 0.98],
        [0.14, -0.3, 0.98],
        [0.46, -1.18, 0.78],
        [0.64, -1.95, 0.38],
      ],
      0.036,
    ),
    curve(
      [
        [0.12, 0.95, -0.08],
        [-0.4, 0.75, 0.35],
        [-0.9, 0.62, 0.56],
        [-1.25, 0.1, 0.6],
        [-1.1, -0.65, 0.45],
      ],
      0.038,
    ),
    curve(
      [
        [0.12, 0.15, 0.98],
        [0.63, -0.14, 0.88],
        [1.2, -0.55, 0.55],
      ],
      0.024,
    ),
  ];
  const coronaryBack = curve(
    [
      [0.65, 0.95, -0.08],
      [0.95, 0.65, -0.5],
      [0.5, 0.45, -0.9],
      [0.45, -0.4, -0.96],
      [0.6, -1.4, -0.62],
    ],
    0.03,
  );
  return [
    {
      id: "right-atrium",
      offset: [-1.3, 0.9, 0],
      geometry: atrialWall([-0.95, 0.85, -0.06], [0.67, 0.72, 0.64], false),
      cutGeometry: atrialWall([-0.95, 0.85, -0.06], [0.67, 0.72, 0.64], true),
    },
    {
      id: "left-atrium",
      offset: [1.3, 0.9, -0.2],
      geometry: atrialWall([0.58, 1.0, -0.5], [0.75, 0.64, 0.64], false),
      cutGeometry: atrialWall([0.58, 1.0, -0.5], [0.75, 0.64, 0.64], true),
    },
    {
      id: "right-ventricle",
      offset: [-1.3, -0.8, 0.4],
      geometry: merged([
        ventricularWall(false, false),
        ...papillaryMuscles(-0.55),
      ]),
      cutGeometry: merged([
        ventricularWall(false, true),
        ...papillaryMuscles(-0.55),
      ]),
    },
    {
      id: "left-ventricle",
      offset: [1.4, -0.8, 0.2],
      geometry: merged([
        ventricularWall(true, false),
        ...papillaryMuscles(0.65),
      ]),
      cutGeometry: merged([
        ventricularWall(true, true),
        ...papillaryMuscles(0.65),
      ]),
    },
    {
      id: "septum",
      internal: true,
      offset: [0, -0.2, 1.4],
      geometry: ellipsoid([0.16, -0.45, -0.08], [0.15, 1.43, 0.72]),
    },
    {
      id: "tricuspid-valve",
      internal: true,
      offset: [-1.3, 0.5, 1.4],
      geometry: valve([-0.55, 0.35, 0.08], 0.42, 3),
    },
    {
      id: "mitral-valve",
      internal: true,
      offset: [1.3, 0.5, 1.4],
      geometry: valve([0.65, 0.35, 0.08], 0.42, 2),
    },
    {
      id: "pulmonary-valve",
      internal: true,
      offset: [-0.7, 1.5, 1.6],
      geometry: valve([-0.25, 0.85, 0.55], 0.23, 3, true),
    },
    {
      id: "aortic-valve",
      internal: true,
      offset: [0.7, 1.5, 1.6],
      geometry: valve([0.5, 0.85, -0.15], 0.24, 3, true),
    },
    {
      id: "aorta",
      offset: [0.8, 1.6, -0.4],
      geometry: merged([
        vessel(
          [
            [0.5, 0.5, -0.15],
            [0.3, 1.6, -0.15],
            [0.45, 2.25, -0.2],
            [1, 2.25, -0.45],
            [1.25, 1.5, -0.85],
            [1.05, 0, -1.02],
          ],
          0.3,
        ),
        ...[0, 1, 2].map((i) =>
          vessel(
            [
              [0.36 + i * 0.26, 2.2 + i * 0.04, -0.25],
              [0.12 + i * 0.45, 2.9 - i * 0.04, -0.25],
            ],
            0.12,
          ),
        ),
      ]),
    },
    {
      id: "pulmonary-arteries",
      offset: [-0.2, 1.6, 0.8],
      geometry: merged([
        vessel(
          [
            [-0.25, 0.55, 0.55],
            [-0.35, 1.2, 0.65],
            [0.05, 1.85, 0.45],
            [0.3, 1.9, 0.16],
          ],
          0.29,
        ),
        vessel(
          [
            [0.2, 1.9, 0.25],
            [1, 1.95, 0.1],
            [1.85, 1.9, -0.06],
          ],
          0.21,
        ),
        vessel(
          [
            [0.2, 1.9, 0.15],
            [-0.5, 1.72, -0.45],
            [-1.75, 1.6, -0.55],
          ],
          0.2,
        ),
      ]),
    },
    {
      id: "vena-cavae",
      offset: [-1.6, 0.6, -0.4],
      geometry: merged([
        vessel(
          [
            [-1.08, 0.8, -0.16],
            [-1.12, 1.55, -0.12],
            [-1.12, 2.55, -0.1],
          ],
          0.28,
        ),
        vessel(
          [
            [-1.18, 0.5, -0.35],
            [-1.55, 0.05, -0.7],
            [-1.65, -0.8, -0.75],
          ],
          0.27,
        ),
      ]),
    },
    {
      id: "pulmonary-veins",
      offset: [1.6, 0.7, -0.7],
      geometry: merged(
        [-1, 1].flatMap((s) =>
          [0.7, 1.15].map((y) =>
            vessel(
              [
                [0.6, y, -0.65],
                [s * 1.1, y + 0.05, -0.8],
                [s * 1.9, y + 0.15, -0.72],
              ],
              0.16,
            ),
          ),
        ),
      ),
    },
    {
      id: "coronary-arteries",
      offset: [0, -0.15, 1.65],
      geometry: merged([...coronaryFront, coronaryBack.clone()]),
      cutGeometry: coronaryBack,
    },
    {
      id: "chordae-tendineae",
      internal: true,
      offset: [0, -1.3, 1.35],
      geometry: merged(chords),
    },
  ];
}
