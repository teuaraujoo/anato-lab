import { expect, test } from "@playwright/test";
import { organelleIds } from "../src/types/cell";
import { cellSeparationOffsets } from "../src/components/cell/scene/separation";
import { useCellStore } from "../src/store/cellStore";

test.beforeEach(() => useCellStore.getState().reset());

test("todas as estruturas da célula têm offsets finitos", () => {
  expect(Object.keys(cellSeparationOffsets).sort()).toEqual(
    [...organelleIds].sort(),
  );
  for (const offset of Object.values(cellSeparationOffsets)) {
    expect(offset).toHaveLength(3);
    expect(offset.every(Number.isFinite)).toBe(true);
  }
});

test("separar preserva a seleção, limpa o isolamento e reenquadra", () => {
  const store = useCellStore.getState();
  store.select("nucleus");
  store.toggleIsolation();
  store.hover("nucleus");
  const resetVersion = useCellStore.getState().resetVersion;

  store.toggleExploded();

  expect(useCellStore.getState()).toMatchObject({
    selectedOrganelleId: "nucleus",
    isolatedOrganelleId: null,
    hoveredOrganelleId: null,
    exploded: true,
    resetVersion: resetVersion + 1,
  });
  store.toggleExploded();
  expect(useCellStore.getState()).toMatchObject({
    selectedOrganelleId: "nucleus",
    exploded: false,
  });
});

test("restaurar reúne e limpa a interação", () => {
  const store = useCellStore.getState();
  store.toggleExploded();
  store.select("nucleolus");
  store.toggleIsolation();
  store.reset();

  expect(useCellStore.getState()).toMatchObject({
    selectedOrganelleId: null,
    hoveredOrganelleId: null,
    isolatedOrganelleId: null,
    exploded: false,
  });
});
