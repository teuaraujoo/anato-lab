import { expect, test } from "@playwright/test";
import { useEyeStore } from "../src/store/eyeStore";
import { eyeStructureIds } from "../src/types/eye";
import { eyeSeparationOffsets } from "../src/components/eye/scene/separation";

test.beforeEach(() => useEyeStore.getState().reset());

test("todas as estruturas do olho têm deslocamentos finitos e distintos", () => {
  expect(Object.keys(eyeSeparationOffsets).sort()).toEqual(
    [...eyeStructureIds].sort(),
  );
  expect(new Set(Object.values(eyeSeparationOffsets).map(String)).size).toBe(
    eyeStructureIds.length,
  );
  for (const offset of Object.values(eyeSeparationOffsets))
    expect(offset.every(Number.isFinite)).toBe(true);
});

test("separar preserva seleção, sai do isolamento e pede reenquadramento", () => {
  const store = useEyeStore.getState();
  store.select("lens");
  store.toggleIsolation();
  store.hover("lens");
  const resetVersion = useEyeStore.getState().resetVersion;
  store.toggleExploded();
  expect(useEyeStore.getState()).toMatchObject({
    selectedId: "lens",
    isolatedId: null,
    hoveredId: null,
    exploded: true,
    resetVersion: resetVersion + 1,
  });
  store.select("iris");
  expect(useEyeStore.getState().exploded).toBe(true);
  store.select(null);
  expect(useEyeStore.getState().exploded).toBe(true);
  store.toggleExploded();
  expect(useEyeStore.getState().exploded).toBe(false);
});

test("restaurar reúne e limpa interação; isolamento ignora hover oculto", () => {
  const store = useEyeStore.getState();
  store.toggleExploded();
  store.select("cornea");
  store.toggleIsolation();
  store.hover("iris");
  expect(useEyeStore.getState().hoveredId).toBeNull();
  store.reset();
  expect(useEyeStore.getState()).toMatchObject({
    exploded: false,
    selectedId: null,
    isolatedId: null,
    hoveredId: null,
  });
});
