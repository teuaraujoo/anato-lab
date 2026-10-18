import { expect, test } from "@playwright/test";
import {
  brainContent,
  brainContentById,
  searchBrainStructures,
} from "../src/content/brain";
import { useBrainStore } from "../src/store/brainStore";
import { brainStructureIds, type BrainStructureId } from "../src/types/brain";

const internalStructureIds = [
  "corpus-callosum",
  "thalamus",
  "hypothalamus",
  "ventricles",
] as const satisfies readonly BrainStructureId[];

const externalStructureId = brainStructureIds.find(
  (id) => !(internalStructureIds as readonly string[]).includes(id),
) as BrainStructureId;

test.beforeEach(() => useBrainStore.getState().reset());

test("cada estrutura cerebral tem conteúdo único e relações válidas", () => {
  expect(brainContent).toHaveLength(12);
  expect(brainContent.map((entry) => entry.id)).toEqual([...brainStructureIds]);
  expect(new Set(brainContent.map((entry) => entry.id)).size).toBe(12);

  for (const entry of brainContent) {
    expect(brainContentById[entry.id]).toBe(entry);
    expect(entry.color).toMatch(/^#[a-f\d]{6}$/i);
    expect(entry.summary.trim()).not.toBe("");
    expect(entry.structure.trim()).not.toBe("");
    expect(entry.function.trim()).not.toBe("");
    expect(new URL(entry.source.url).protocol).toBe("https:");
    for (const related of entry.related) {
      expect(brainStructureIds).toContain(related);
      expect(related).not.toBe(entry.id);
    }
  }
});

test("busca cerebral ignora acentos, espaços e retorna todos sem consulta", () => {
  expect(searchBrainStructures("  ")).toHaveLength(12);

  const thalamus = brainContentById.thalamus;
  expect(searchBrainStructures(thalamus.name)).toEqual(
    expect.arrayContaining([thalamus]),
  );
  expect(searchBrainStructures("talamo").map((entry) => entry.id)).toContain(
    "thalamus",
  );
  expect(
    searchBrainStructures("ventriculo").map((entry) => entry.id),
  ).toContain("ventricles");
  expect(searchBrainStructures("estrutura inexistente")).toEqual([]);
});

test.describe("estado de interação do cérebro", () => {
  test("selecionar estruturas internas abre o corte e fechá-lo limpa a seleção", () => {
    const store = useBrainStore.getState();

    for (const id of internalStructureIds) {
      store.reset();
      store.select(id);
      expect(useBrainStore.getState()).toMatchObject({
        selectedId: id,
        cutaway: true,
      });

      store.toggleCutaway();
      expect(useBrainStore.getState()).toMatchObject({
        selectedId: null,
        cutaway: false,
      });
    }
  });

  test("trocar de uma estrutura interna para uma externa fecha o corte", () => {
    const store = useBrainStore.getState();

    store.select("thalamus");
    expect(useBrainStore.getState().cutaway).toBe(true);
    store.select(externalStructureId);

    expect(useBrainStore.getState()).toMatchObject({
      selectedId: externalStructureId,
      isolatedId: null,
      cutaway: false,
    });

    store.reset();
    expect(useBrainStore.getState()).toMatchObject({
      selectedId: null,
      hoveredId: null,
      isolatedId: null,
      exploded: false,
      cutaway: false,
    });
  });

  test("foco, isolamento, separação e restauração respeitam a interação", () => {
    const store = useBrainStore.getState();
    const before = useBrainStore.getState();

    store.focusSelection();
    store.toggleIsolation();
    expect(useBrainStore.getState()).toMatchObject({
      focusVersion: before.focusVersion,
      isolatedId: null,
    });

    store.select(externalStructureId);
    store.hover(externalStructureId);
    const selected = useBrainStore.getState();
    store.focusSelection();
    expect(useBrainStore.getState().focusVersion).toBe(
      selected.focusVersion + 1,
    );

    store.toggleIsolation();
    expect(useBrainStore.getState()).toMatchObject({
      selectedId: externalStructureId,
      isolatedId: externalStructureId,
      hoveredId: null,
      focusVersion: selected.focusVersion + 2,
    });

    store.hover("thalamus");
    expect(useBrainStore.getState().hoveredId).toBeNull();
    store.hover(externalStructureId);
    expect(useBrainStore.getState().hoveredId).toBe(externalStructureId);

    const resetVersion = useBrainStore.getState().resetVersion;
    store.toggleExploded();
    expect(useBrainStore.getState()).toMatchObject({
      selectedId: externalStructureId,
      isolatedId: null,
      hoveredId: null,
      exploded: true,
      resetVersion: resetVersion + 1,
    });

    store.toggleExploded();
    expect(useBrainStore.getState().exploded).toBe(false);
    store.reset();
    expect(useBrainStore.getState()).toMatchObject({
      selectedId: null,
      isolatedId: null,
      hoveredId: null,
      exploded: false,
      cutaway: false,
    });
  });
});
