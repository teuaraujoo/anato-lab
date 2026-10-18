import { expect, test } from "@playwright/test";
import { heartContent } from "../../src/content/heart";
import { heartStructureIds } from "../../src/types/heart";

test("o coração renderiza 15 estruturas, alterna corte e mantém os controles", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/coracao");
  await expect(page.locator(".atlas-page")).toHaveAttribute(
    "data-entrance",
    "complete",
  );
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator(".structure-option")).toHaveCount(
    heartContent.length,
  );
  await expect(page.locator(".viewer-toolbar button")).toHaveCount(4);

  const cutaway = page.getByRole("button", {
    name: "Ver interior",
    exact: true,
  });
  await expect(cutaway).toHaveAttribute("aria-pressed", "false");

  const septum = page
    .locator(".structure-option")
    .filter({ hasText: "Septo cardíaco" });
  await septum.click();
  await expect(septum).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "Ver exterior", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Aproximar", exact: true }).click();
  await page.getByRole("button", { name: "Isolar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Mostrar todas", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Mostrar todas", exact: true })
    .click();

  await page.getByRole("button", { name: "Ver exterior", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ver interior", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.locator('.structure-option[aria-pressed="true"]'),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Separar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Reunir", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Restaurar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Separar", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.locator('.structure-option[aria-pressed="true"]'),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("a home encontra o coração e aponta para a miniatura e rota reais", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("coracao");

  const card = page.locator('a[href="/coracao"]');
  await expect(card).toBeVisible();
  await expect(card.locator("img")).toHaveAttribute("src", /coracao-modelo/);
  await expect
    .poll(() =>
      card
        .locator("img")
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);

  await card.click();
  await expect(page).toHaveURL(/\/coracao$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Coração humano",
  );
});

test("o painel e os quatro controles cabem em 320px com movimento reduzido", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/coracao");

  const trigger = page.getByRole("button", { name: /Explorar estruturas/ });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await page
    .getByRole("searchbox", { name: "Buscar estrutura" })
    .fill("mitral");
  await expect(page.locator(".structure-option")).toHaveCount(1);
  await page.locator(".structure-option").click();
  await expect(page.locator(".structure-detail h3")).toHaveText(
    "Válvula mitral",
  );

  await page
    .getByRole("button", { name: "Recolher painel de estruturas" })
    .click();
  await expect(trigger).toBeFocused();

  for (const button of await page.locator(".viewer-toolbar button").all()) {
    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("a lista continua disponível quando WebGL não inicia", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      ...args: Parameters<typeof original>
    ) {
      if (String(args[0]).startsWith("webgl")) return null;
      return original.apply(this, args);
    } as typeof original;
  });

  await page.goto("/coracao");
  await expect(
    page.getByText("Não foi possível iniciar o visualizador 3D."),
  ).toBeVisible();
  await page
    .locator(".structure-option")
    .filter({ hasText: "Válvula aórtica" })
    .click();
  await expect(page.locator(".structure-detail h3")).toHaveText(
    "Válvula aórtica",
  );
});

test("o hook de revisão expõe as 15 peças, materiais e reenquadramento", async ({
  page,
}) => {
  await page.goto("/coracao");
  await page.waitForFunction(() => {
    const review = (
      window as Window & {
        __heartReview?: {
          scene?: unknown;
          camera?: unknown;
          control?: unknown;
          invalidate?: unknown;
          renderer?: unknown;
          store?: unknown;
        };
      }
    ).__heartReview;
    return Boolean(
      review?.scene &&
      review.camera &&
      review.control &&
      review.renderer &&
      review.store,
    );
  });

  const initial = await page.evaluate((ids) => {
    const review = (
      window as Window & {
        __heartReview?: {
          scene: {
            getObjectByName: (name: string) => {
              traverse: (
                callback: (object: { material?: unknown }) => void,
              ) => void;
              visible: boolean;
            } | null;
          };
          camera: { position: { x: number; y: number; z: number } };
          control: { target: { x: number; y: number; z: number } };
          invalidate: () => void;
          renderer: unknown;
          store: { getState: () => { selectedId: string | null } };
        };
      }
    ).__heartReview;
    if (!review) return null;

    const parts = ids.map((id) => {
      const object = review.scene.getObjectByName(id);
      let materialCount = 0;
      object?.traverse((child) => {
        if (child.material) materialCount += 1;
      });
      return {
        id,
        exists: Boolean(object),
        visible: object?.visible,
        materialCount,
      };
    });
    return {
      parts,
      hasRenderer: Boolean(review.renderer),
      hasInvalidate: typeof review.invalidate === "function",
      selectedId: review.store.getState().selectedId,
    };
  }, heartStructureIds);

  expect(initial).not.toBeNull();
  expect(initial?.parts).toHaveLength(heartStructureIds.length);
  expect(initial?.parts.every((part) => part.exists)).toBe(true);
  expect(
    initial?.parts.every((part) => typeof part.visible === "boolean"),
  ).toBe(true);
  expect(initial?.parts.every((part) => part.materialCount > 0)).toBe(true);
  expect(initial?.hasRenderer).toBe(true);
  expect(initial?.hasInvalidate).toBe(true);
  expect(initial?.selectedId).toBeNull();

  await page
    .locator(".structure-option")
    .filter({ hasText: "Septo cardíaco" })
    .click();
  await page.getByRole("button", { name: "Aproximar", exact: true }).click();
  await page.waitForFunction(() =>
    Boolean(
      (
        window as Window & {
          __heartReview?: {
            store?: { getState: () => { selectedId: string | null } };
          };
        }
      ).__heartReview?.store?.getState().selectedId === "septum",
    ),
  );

  const focused = await page.evaluate(() => {
    const review = (
      window as Window & {
        __heartReview?: {
          camera: { position: { x: number; y: number; z: number } };
          control: { target: { x: number; y: number; z: number } };
          store: { getState: () => { cutaway: boolean } };
        };
      }
    ).__heartReview;
    if (!review) return null;
    const values = [
      review.camera.position.x,
      review.camera.position.y,
      review.camera.position.z,
      review.control.target.x,
      review.control.target.y,
      review.control.target.z,
    ];
    return {
      finiteCamera: values.every(Number.isFinite),
      cutaway: review.store.getState().cutaway,
    };
  });
  expect(focused).toEqual({ finiteCamera: true, cutaway: true });
});
