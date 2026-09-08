import { expect, test } from "@playwright/test";
import { kidneyContent } from "../../src/content/kidney";

test("as 12 regiões podem ser selecionadas, aproximadas e isoladas", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/rim");
  await expect(page.locator(".atlas-page")).toHaveAttribute(
    "data-entrance",
    "complete",
  );
  await expect(page.locator("canvas")).toBeVisible();
  const options = page.locator(".structure-option");
  await expect(options).toHaveCount(12);
  for (const structure of kidneyContent) {
    const option = options.filter({ hasText: structure.name });
    await option.click();
    await expect(option).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".structure-detail h3")).toHaveText(
      structure.name,
    );
    await page.getByRole("button", { name: "Aproximar", exact: true }).click();
    await page.getByRole("button", { name: "Isolar", exact: true }).click();
    await expect(page.locator(".stage-badge")).toHaveText("ESTRUTURA ISOLADA");
    await page
      .getByRole("button", { name: "Mostrar todas", exact: true })
      .click();
  }
  await page.keyboard.press("Escape");
  await expect(
    page.locator('.structure-option[aria-pressed="true"]'),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Aproximar", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Separar", exact: true }).click();
  await expect(page.locator(".stage-badge")).toHaveText("SEPARAÇÃO DIDÁTICA");
  await page.getByRole("button", { name: "Reunir", exact: true }).click();
  await expect(page.locator(".stage-badge")).toHaveText("VISÃO EM CORTE");
  expect(errors).toEqual([]);
});

test("a home encontra o rim e aponta para a miniatura e rota reais", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("renal");
  const card = page.locator('a[href="/rim"]');
  await expect(card).toBeVisible();
  await expect(card.locator("img")).toHaveAttribute("src", /rim-modelo/);
  await expect
    .poll(() =>
      card
        .locator("img")
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await card.click();
  await expect(page).toHaveURL(/\/rim$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Rim humano",
  );
});

test("busca sem acentos e painel móvel com movimento reduzido", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rim");
  const trigger = page.getByRole("button", { name: /Explorar estruturas/ });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await page
    .getByRole("searchbox", { name: "Buscar estrutura" })
    .fill("cortex");
  await expect(page.locator(".structure-option")).toHaveCount(1);
  await page.locator(".structure-option").click();
  await expect(page.locator(".structure-detail h3")).toHaveText("Córtex renal");
  await page
    .getByRole("button", { name: "Recolher painel de estruturas" })
    .click();
  await expect(trigger).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("o conteúdo continua disponível sem WebGL", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      ...args: Parameters<typeof original>
    ) {
      if (String(args[0]).startsWith("webgl")) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto("/rim");
  await expect(
    page.getByText("Não foi possível iniciar o visualizador 3D."),
  ).toBeVisible();
  await page.locator(".structure-option").filter({ hasText: "Ureter" }).click();
  await expect(page.locator(".structure-detail h3")).toHaveText("Ureter");
});
