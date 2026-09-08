import {
  BufferGeometry,
  CatmullRomCurve3,
  Float32BufferAttribute,
  SphereGeometry,
  Vector3,
} from "three";

// Unidades relativas: altura 5,7. A concavidade fica em -X, sem declarar lateralidade clínica.
export function kidneyOutline(angle: number, scale = 1) {
  return new Vector3(
    (1.88 * Math.cos(angle) + Math.exp(-(((angle - Math.PI) / 0.47) ** 2))) *
      scale,
    2.85 * Math.sin(angle) * scale,
    0.15,
  );
}

export function surface(
  point: (u: number, v: number) => Vector3,
  columns = 96,
  rows = 24,
) {
  const positions: number[] = [],
    indices: number[] = [],
    uvs: number[] = [];
  for (let row = 0; row <= rows; row++)
    for (let col = 0; col <= columns; col++) {
      positions.push(...point(col / columns, row / rows).toArray());
      uvs.push(col / columns, row / rows);
    }
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < columns; col++) {
      const a = row * (columns + 1) + col,
        b = a + columns + 1;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function kidneyBowl(scale: number, depth: number) {
  return surface((u, v) => {
    const a = u * Math.PI * 2,
      t = (v * Math.PI) / 2,
      r = Math.sin(t);
    const p = kidneyOutline(a, scale);
    return new Vector3(
      p.x * r + 0.15 * (1 - r),
      p.y * r,
      0.15 - depth * Math.cos(t),
    );
  });
}

export function kidneyRim(outer: number, inner: number) {
  // Seção arredondada fechada: mantém espessura também quando a região é isolada.
  return surface(
    (u, v) => {
      const a = v * Math.PI * 2;
      const scale = (outer + inner) / 2 + ((outer - inner) / 2) * Math.cos(a);
      const p = kidneyOutline(u * Math.PI * 2, scale);
      p.z += 0.09 * Math.sin(a) - 0.025;
      return p;
    },
    96,
    8,
  );
}

export type Point3 = [number, number, number];
export const pyramidLayout = [
  { base: [-0.95, 1.8, 0.16], tip: [-0.38, 0.98, 0.26], width: 0.43 },
  { base: [0, 2.4, 0.16], tip: [0.02, 1.17, 0.26], width: 0.53 },
  { base: [1.08, 1.75, 0.16], tip: [0.35, 0.72, 0.26], width: 0.58 },
  { base: [1.53, 0.55, 0.16], tip: [0.45, 0.16, 0.26], width: 0.51 },
  { base: [1.48, -0.85, 0.16], tip: [0.4, -0.48, 0.26], width: 0.57 },
  { base: [0.8, -2.13, 0.16], tip: [0.15, -1.08, 0.26], width: 0.51 },
  { base: [-0.42, -2.19, 0.16], tip: [-0.38, -1.1, 0.26], width: 0.51 },
] satisfies { base: Point3; tip: Point3; width: number }[];

export function pyramid(index: number) {
  const { base, tip, width } = pyramidLayout[index];
  const start = new Vector3(...tip),
    end = new Vector3(...base);
  const axis = end.clone().sub(start).normalize(),
    side = new Vector3(-axis.y, axis.x, 0);
  return surface(
    (u, t) => {
      const a = u * Math.PI * 2;
      const closing =
        t < 0.82 ? 1 : Math.sqrt(Math.max(0, 1 - ((t - 0.82) / 0.18) ** 2));
      const r =
        (0.07 + width * t ** 0.65) *
        closing *
        (1 + 0.014 * Math.sin(a * 24) * Math.sin(t * Math.PI));
      return start
        .clone()
        .lerp(end, t)
        .addScaledVector(side, Math.cos(a) * r)
        .add(new Vector3(0, 0, Math.sin(a) * r * 0.66));
    },
    72,
    20,
  );
}

// Paredes e anéis terminais: o lúmen não é um disco pintado.
export function hollowTube(
  points: Point3[],
  startRadius: number,
  endRadius = startRadius,
  wall = 0.035,
) {
  const path = new CatmullRomCurve3(points.map((p) => new Vector3(...p)));
  const segments = 16,
    sides = 12;
  const frames = path.computeFrenetFrames(segments, false);
  const point = (u: number, v: number, inner: boolean) => {
    const a = u * Math.PI * 2,
      idx = Math.min(segments, Math.round(v * segments));
    const r = startRadius + (endRadius - startRadius) * v - (inner ? wall : 0);
    return path
      .getPointAt(v)
      .addScaledVector(frames.normals[idx], Math.cos(a) * r)
      .addScaledVector(frames.binormals[idx], Math.sin(a) * r);
  };
  return [
    surface((u, v) => point(u, v, false), sides, segments),
    surface((u, v) => point(1 - u, v, true), sides, segments),
    ...[0, 1].map((t) =>
      surface(
        (u, v) =>
          point(t ? u : 1 - u, t, false).lerp(point(t ? u : 1 - u, t, true), v),
        sides,
        1,
      ),
    ),
  ];
}

export function ellipsoid(center: Point3, scale: Point3) {
  return new SphereGeometry(1, 20, 12).scale(...scale).translate(...center);
}

export function sinusTissue() {
  const geometry = new SphereGeometry(1, 40, 24);
  const positions = geometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i),
      y = positions.getY(i),
      z = positions.getZ(i);
    const lobule =
      1 + 0.09 * Math.sin(x * 19 + y * 13) * Math.cos(z * 17 - y * 11);
    positions.setXYZ(
      i,
      x * 0.71 * lobule - 0.03,
      y * 1.64 * lobule,
      z * 0.4 * lobule - 0.25,
    );
  }
  geometry.computeVertexNormals();
  return geometry;
}
