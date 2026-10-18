import { expect, test } from "@playwright/test";
import {
  heartContent,
  heartContentById,
  searchHeartStructures,
} from "../src/content/heart";
import { heartStructureIds, type HeartStructureId } from "../src/types/heart";
import { useHeartStore } from "../src/store/heartStore";

const internalStructureIds: readonly HeartStructureId[] = [
  "septum",
  "tricuspid-valve",
  "mitral-valve",
  "pulmonary-valve",
  "aortic-valve",
  "chordae-tendineae",
];

test("cada estrutura do coração tem conteúdo único e relações válidas", () => {
  expect(heartContent).toHaveLength(15);
  expect(heartContent.map((entry) => entry.id)).toEqual([...heartStructureIds]);
  expect(new Set(heartContent.map((entry) => entry.id)).size).toBe(15);

  for (const entry of heartContent) {
    expect(heartContentById[entry.id]).toBe(entry);
    expect(entry.color).toMatch(/^#[a-f\d]{6}$/i);
    expect(entry.summary.trim()).not.toBe("");
    expect(entry.structure.trim()).not.toBe("");
    expect(entry.function.trim()).not.toBe("");
    expect(new URL(entry.source.url).protocol).toBe("https:");
    for (const related of entry.related) {
      expect(heartStructureIds).toContain(related);
      expect(related).not.toBe(entry.id);
    }
  }
});

test("busca lida com acentos, sinônimos, espaços e múltiplos termos", () => {
  expect(searchHeartStructures("  ")).toHaveLength(15);
  expect(
    searchHeartStructures(" VÁLVULA MITRAL ").map((entry) => entry.id),
  ).toEqual(["mitral-valve"]);
  expect(searchHeartStructures("valva mitral")).toEqual(
    searchHeartStructures("válvula mitral"),
  );
  expect(searchHeartStructures("septo").map((entry) => entry.id)).toEqual([
    "septum",
  ]);
  expect(
    searchHeartStructures("cordas tendineas").map((entry) => entry.id),
  ).toEqual(["chordae-tendineae"]);
  expect(searchHeartStructures("sem cordas").map((entry) => entry.id)).toEqual([
    "pulmonary-valve",
    "aortic-valve",
  ]);
  expect(searchHeartStructures("inexistente")).toEqual([]);
});

test.describe("estado de interação do coração", () => {
  test.beforeEach(() => useHeartStore.getState().reset());

  test("não aproxima nem isola sem seleção", () => {
    const before = useHeartStore.getState();
    before.focusSelection();
    before.toggleIsolation();

    expect(useHeartStore.getState()).toMatchObject({
      selectedId: null,
      isolatedId: null,
      cutaway: false,
      focusVersion: before.focusVersion,
    });
  });

  test("selecionar uma estrutura interna abre o corte e elimina hover anterior", () => {
    const before = useHeartStore.getState();
    before.hover("aorta");
    before.select("septum");

    expect(useHeartStore.getState()).toMatchObject({
      selectedId: "septum",
      hoveredId: null,
      isolatedId: null,
      cutaway: true,
      exploded: false,
      resetVersion: before.resetVersion + 1,
    });
  });

  test("todas as estruturas internas mantêm o corte aberto ao serem selecionadas", () => {
    for (const id of internalStructureIds) {
      useHeartStore.getState().select(id);
      expect(useHeartStore.getState()).toMatchObject({
        selectedId: id,
        cutaway: true,
      });
    }
  });

  test("isolar aproxima a seleção e ignora hover de peças ocultas", () => {
    const before = useHeartStore.getState();
    before.select("mitral-valve");
    before.toggleIsolation();
    before.hover("aortic-valve");

    expect(useHeartStore.getState()).toMatchObject({
      selectedId: "mitral-valve",
      isolatedId: "mitral-valve",
      hoveredId: null,
      cutaway: true,
      focusVersion: before.focusVersion + 1,
    });

    before.hover("mitral-valve");
    expect(useHeartStore.getState().hoveredId).toBe("mitral-valve");
  });

  test("selecionar outra peça encerra o isolamento sem fechar o corte", () => {
    const before = useHeartStore.getState();
    before.select("septum");
    before.toggleIsolation();
    const isolated = useHeartStore.getState();

    isolated.select("chordae-tendineae");
    expect(useHeartStore.getState()).toMatchObject({
      selectedId: "chordae-tendineae",
      isolatedId: null,
      cutaway: true,
      resetVersion: isolated.resetVersion + 1,
    });
  });

  test("separar limpa isolamento, conserva seleção e reúne ao alternar novamente", () => {
    const before = useHeartStore.getState();
    before.select("left-ventricle");
    before.toggleIsolation();
    const isolated = useHeartStore.getState();

    isolated.toggleExploded();
    expect(useHeartStore.getState()).toMatchObject({
      selectedId: "left-ventricle",
      isolatedId: null,
      hoveredId: null,
      exploded: true,
      resetVersion: isolated.resetVersion + 1,
    });

    useHeartStore.getState().toggleExploded();
    expect(useHeartStore.getState().exploded).toBe(false);
  });

  test("fechar o corte limpa seleção interna e reúne o modelo", () => {
    const before = useHeartStore.getState();
    before.select("tricuspid-valve");
    before.toggleExploded();
    const separated = useHeartStore.getState();

    separated.toggleCutaway();
    expect(useHeartStore.getState()).toMatchObject({
      selectedId: null,
      hoveredId: null,
      isolatedId: null,
      cutaway: false,
      exploded: false,
    });
    expect(useHeartStore.getState().resetVersion).toBeGreaterThan(
      separated.resetVersion,
    );
  });

  test("aproximar emite pedidos sem alterar a seleção ou o modo de corte", () => {
    const before = useHeartStore.getState();
    before.select("left-ventricle");
    const selected = useHeartStore.getState();
    selected.focusSelection();
    selected.focusSelection();

    expect(useHeartStore.getState()).toMatchObject({
      selectedId: "left-ventricle",
      cutaway: false,
      focusVersion: selected.focusVersion + 2,
      resetVersion: selected.resetVersion,
    });
  });

  test("restaurar limpa seleção, corte, separação e isolamento", () => {
    const before = useHeartStore.getState();
    before.select("aortic-valve");
    before.toggleIsolation();
    before.toggleExploded();
    const changed = useHeartStore.getState();

    changed.reset();
    expect(useHeartStore.getState()).toMatchObject({
      selectedId: null,
      hoveredId: null,
      isolatedId: null,
      exploded: false,
      cutaway: false,
      resetVersion: changed.resetVersion + 1,
    });
  });
});
