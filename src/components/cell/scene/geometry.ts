import {
  BufferGeometry,
  Float32BufferAttribute,
  CatmullRomCurve3,
  TubeGeometry,
  Vector3,
} from "three";

// Geometrias determinísticas, sem assets externos nem aleatoriedade por render.
export function organicRadius(angle: number) {
  return 1 + 0.035 * Math.sin(angle * 5 + 0.4) + 0.022 * Math.cos(angle * 3);
}

export function makeSurface(
  point: (u: number, v: number) => Vector3,
  columns = 64,
  rows = 24,
) {
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= columns; col++)
      vertices.push(...point(col / columns, row / rows).toArray());
  }
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < columns; col++) {
      const a = row * (columns + 1) + col;
      const b = a + columns + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function makeBowl(
  width: number,
  height: number,
  depth: number,
  rimZ: number,
  organic = false,
) {
  return makeSurface((u, v) => {
    const a = u * Math.PI * 2;
    const t = (v * Math.PI) / 2;
    const radius = organic ? organicRadius(a) : 1;
    return new Vector3(
      Math.cos(a) * Math.sin(t) * width * radius,
      Math.sin(a) * Math.sin(t) * height * radius,
      rimZ - Math.cos(t) * depth,
    );
  });
}

export function makeTube(
  points: Vector3[],
  radius = 0.05,
  closed = false,
  segments = 64,
) {
  return new TubeGeometry(
    new CatmullRomCurve3(points, closed, "catmullrom", 0.45),
    segments,
    radius,
    8,
    closed,
  );
}

export function rimPoints(
  width: number,
  height: number,
  z: number,
  organic = false,
) {
  return Array.from({ length: 96 }, (_, i) => {
    const a = (i / 96) * Math.PI * 2;
    const radius = organic ? organicRadius(a) : 1;
    return new Vector3(
      Math.cos(a) * width * radius,
      Math.sin(a) * height * radius,
      z,
    );
  });
}

export function roughERPoint(layer: number, t: number, width = 0) {
  const angle = 0.22 + t * Math.PI * 1.57;
  const radius = 1.07 + layer * 0.18 + width * 0.105;
  return new Vector3(
    -0.65 + Math.cos(angle) * radius,
    0.42 + Math.sin(angle) * radius * 0.91,
    -0.12 + width * 0.1 + 0.07 * Math.sin(t * 24 + layer),
  );
}
