import {
  DataTexture,
  LinearFilter,
  RepeatWrapping,
  RGBAFormat,
  SRGBColorSpace,
} from "three";
import type { KidneyStructureId } from "@/types/kidney";

// Ruído determinístico, sem baixar imagens e sem incorporar iluminação à cor.
function noise(x: number, y: number, seed: number) {
  let n = Math.imul(x + seed, 374761393) + Math.imul(y, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

function texture(sample: (x: number, y: number) => number, color = false) {
  const size = 1024;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const value = Math.round(sample(x, y) * 255);
      pixels[i] = pixels[i + 1] = pixels[i + 2] = value;
      pixels[i + 3] = 255;
    }
  const result = new DataTexture(pixels, size, size, RGBAFormat);
  result.wrapS = result.wrapT = RepeatWrapping;
  result.magFilter = LinearFilter;
  result.minFilter = LinearFilter;
  if (color) result.colorSpace = SRGBColorSpace;
  result.needsUpdate = true;
  return result;
}

export function createTissueMaps() {
  return {
    albedo: texture((x, y) => 0.96 + 0.04 * noise(x >> 1, y >> 1, 42), true),
    roughness: texture((x, y) => 0.78 + 0.22 * noise(x >> 2, y >> 2, 97)),
    height: texture(
      (x, y) =>
        0.5 +
        0.23 * Math.sin(x * 0.57 + Math.sin(y * 0.83)) +
        0.22 * (noise(x >> 2, y >> 2, 151) - 0.5),
    ),
  };
}

export type TissueMaps = ReturnType<typeof createTissueMaps>;

export function kidneyMaterial(id: KidneyStructureId) {
  const vessel = id === "renal-artery" || id === "renal-vein";
  const collecting = [
    "minor-calyces",
    "major-calyces",
    "renal-pelvis",
    "ureter",
  ].includes(id);
  return {
    tissue: !vessel && !collecting,
    roughness: vessel ? 0.3 : collecting ? 0.34 : 0.62,
  };
}
