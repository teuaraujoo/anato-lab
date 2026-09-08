import { expect, test } from "@playwright/test";
import { kidneyStructureIds } from "../src/types/kidney";
import {
  kidneyContent,
  kidneyContentById,
  searchKidneyStructures,
} from "../src/content/kidney";
import { useKidneyStore } from "../src/store/kidneyStore";

test("cada estrutura tem conteúdo único e relações válidas", () => {
  expect(kidneyContent).toHaveLength(12);
  expect(kidneyContent.map((entry) => entry.id)).toEqual([
    ...kidneyStructureIds,
  ]);
  expect(new Set(kidneyContent.map((entry) => entry.id)).size).toBe(12);
  for (const entry of kidneyContent) {
    expect(kidneyContentById[entry.id]).toBe(entry);
    expect(entry.color).toMatch(/^#[a-f\d]{6}$/i);
    expect(entry.summary.trim()).not.toBe("");
    expect(entry.structure.trim()).not.toBe("");
    expect(entry.function.trim()).not.toBe("");
    expect(new URL(entry.source.url).protocol).toBe("https:");
    for (const related of entry.related) {
      expect(kidneyStructureIds).toContain(related);
      expect(related).not.toBe(entry.id);
    }
  }
});

test("busca lida com acentos, espaços, sinônimos e múltiplos termos", () => {
  expect(searchKidneyStructures("  ")).toHaveLength(12);
  expect(searchKidneyStructures(" CORTEX ").map((entry) => entry.id)).toEqual([
    "renal-cortex",
  ]);
  expect(searchKidneyStructures("córtex")).toEqual(
    searchKidneyStructures("cortex"),
  );
  expect(searchKidneyStructures("bertin").map((entry) => entry.id)).toEqual([
    "renal-columns",
  ]);
  expect(searchKidneyStructures("bacinete").map((entry) => entry.id)).toEqual([
    "renal-pelvis",
  ]);
  expect(searchKidneyStructures("piramides").map((entry) => entry.id)).toEqual([
    "renal-medulla",
  ]);
  expect(
    searchKidneyStructures("coletor menor").map((entry) => entry.id),
  ).toEqual(["minor-calyces"]);
  expect(searchKidneyStructures("inexistente")).toEqual([]);
  expect(kidneyContent).toHaveLength(12);
});

test.describe("estado de interação do rim", () => {
  test.beforeEach(() => useKidneyStore.getState().reset());

  test("não aproxima nem isola sem seleção", () => {
    const before = useKidneyStore.getState();
    before.focusSelection();
    before.toggleIsolation();
    expect(useKidneyStore.getState().focusVersion).toBe(before.focusVersion);
    expect(useKidneyStore.getState().isolatedId).toBeNull();
  });

  test("seleção simples não restaura câmera e elimina hover anterior", () => {
    const before = useKidneyStore.getState();
    before.hover("renal-artery");
    before.select("renal-cortex");
    expect(useKidneyStore.getState()).toMatchObject({
      selectedId: "renal-cortex",
      hoveredId: null,
      resetVersion: before.resetVersion,
    });
  });

  test("isolar aproxima a seleção e ignora hover de peças ocultas", () => {
    const before = useKidneyStore.getState();
    before.select("renal-cortex");
    before.toggleIsolation();
    before.hover("renal-vein");
    expect(useKidneyStore.getState()).toMatchObject({
      selectedId: "renal-cortex",
      isolatedId: "renal-cortex",
      hoveredId: null,
      focusVersion: before.focusVersion + 1,
    });
    before.hover("renal-cortex");
    expect(useKidneyStore.getState().hoveredId).toBe("renal-cortex");
  });

  test("selecionar outra peça isolada mostra o conjunto", () => {
    const before = useKidneyStore.getState();
    before.select("renal-cortex");
    before.toggleIsolation();
    before.select("ureter");
    expect(useKidneyStore.getState()).toMatchObject({
      selectedId: "ureter",
      isolatedId: null,
      resetVersion: before.resetVersion + 1,
    });
  });

  test("repetir a seleção preserva o isolamento e limpar o desfaz", () => {
    const before = useKidneyStore.getState();
    before.select("ureter");
    before.toggleIsolation();
    before.select("ureter");
    expect(useKidneyStore.getState().isolatedId).toBe("ureter");
    expect(useKidneyStore.getState().resetVersion).toBe(before.resetVersion);
    before.select(null);
    expect(useKidneyStore.getState()).toMatchObject({
      selectedId: null,
      isolatedId: null,
      resetVersion: before.resetVersion + 1,
    });
  });

  test("desativar isolamento e restaurar recuperam o estado esperado", () => {
    const before = useKidneyStore.getState();
    before.select("renal-pelvis");
    before.toggleIsolation();
    before.toggleIsolation();
    expect(useKidneyStore.getState()).toMatchObject({
      selectedId: "renal-pelvis",
      isolatedId: null,
      resetVersion: before.resetVersion + 1,
    });
    before.hover("renal-pelvis");
    before.reset();
    expect(useKidneyStore.getState()).toMatchObject({
      selectedId: null,
      hoveredId: null,
      isolatedId: null,
      resetVersion: before.resetVersion + 2,
    });
  });

  test("aproximar emite um novo pedido sem mudar a seleção", () => {
    const before = useKidneyStore.getState();
    before.select("renal-artery");
    before.focusSelection();
    before.focusSelection();
    expect(useKidneyStore.getState()).toMatchObject({
      selectedId: "renal-artery",
      focusVersion: before.focusVersion + 2,
      resetVersion: before.resetVersion,
    });
  });
});
