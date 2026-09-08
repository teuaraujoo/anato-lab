import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";

// Uma casca aberta no polo anterior permite estudar o interior sem ocultá-lo.
export function makeEyeShell(
  radius: number,
  depth: number,
  rear: number,
  front: number,
  columns = 96,
  rows = 40,
) {
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let row = 0; row <= rows; row++) {
    const v = row / rows;
    const z = rear + (front - rear) * v;
    const normalizedZ = Math.max(-0.999, Math.min(0.999, z / depth));
    const ringRadius =
      radius * Math.sqrt(Math.max(0.02, 1 - normalizedZ * normalizedZ));
    for (let column = 0; column <= columns; column++) {
      const angle = (column / columns) * Math.PI * 2;
      vertices.push(
        Math.cos(angle) * ringRadius,
        Math.sin(angle) * ringRadius,
        z,
      );
    }
  }
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const a = row * (columns + 1) + column;
      const b = a + columns + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function makeZonule(angle: number) {
  const direction = new Vector3(Math.cos(angle), Math.sin(angle), 0);
  const inner = direction
    .clone()
    .multiplyScalar(0.72)
    .add(new Vector3(0, 0, 1.18));
  const outer = direction
    .clone()
    .multiplyScalar(1.26)
    .add(new Vector3(0, 0, 0.78));
  return [
    inner,
    inner
      .clone()
      .lerp(outer, 0.45)
      .add(new Vector3(0, 0, 0.1)),
    outer,
  ];
}
