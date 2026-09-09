import { expect, test } from "@playwright/test";
import { brainContent, brainContentById } from "../../src/content/brain";

const internalIds = [
  "corpus-callosum",
  "thalamus",
  "hypothalamus",
  "ventricles",
] as const;

test("o cérebro expõe as 12 estruturas, modos de corte e controles didáticos", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/cerebro");
  await expect(page.locator(".atlas-page")).toHaveAttribute(
    "data-entrance",
    "complete",
  );
  await expect(page.locator("canvas")).toBeVisible();

  const options = page.locator(".structure-option");
  await expect(options).toHaveCount(brainContent.length);

  const viewSwitch = page.locator(".brain-view-switch button");
  await expect(viewSwitch).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".stage-badge")).toBeVisible();

  for (const [index, structure] of brainContent.entries()) {
    const option = options.nth(index);
    await option.click();
    await expect(option).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".structure-detail h3")).toHaveText(
      structure.name,
    );
  }
  await page.getByRole("button", { name: "Restaurar", exact: true }).click();
  await expect(viewSwitch).toHaveAttribute("aria-pressed", "false");
  await viewSwitch.click();
  await expect(viewSwitch).toHaveAttribute("aria-pressed", "true");
  await expect(viewSwitch).toHaveText(/Ver exterior/);

  await viewSwitch.click();
  await expect(viewSwitch).toHaveAttribute("aria-pressed", "false");
  await expect(viewSwitch).toHaveText(/Ver interior/);

  const internal = brainContentById.thalamus;
  const internalOption = options.nth(
    brainContent.findIndex((entry) => entry.id === internal.id),
  );
  await internalOption.click();
  await expect(internalOption).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".structure-detail h3")).toHaveText(internal.name);

  await viewSwitch.click();
  await expect(viewSwitch).toHaveAttribute("aria-pressed", "false");
  await expect(viewSwitch).toHaveText(/Ver interior/);
  await expect(
    page.locator('.structure-option[aria-pressed="true"]'),
  ).toHaveCount(0);

  const external = brainContent.find(
    (entry) => !(internalIds as readonly string[]).includes(entry.id),
  );
  expect(external).toBeDefined();
  const externalOption = options.nth(
    brainContent.findIndex((entry) => entry.id === external!.id),
  );
  await externalOption.click();
  await page.getByRole("button", { name: "Aproximar", exact: true }).click();
  await page.getByRole("button", { name: "Isolar", exact: true }).click();
  await expect(page.locator(".stage-badge")).toHaveText("ESTRUTURA ISOLADA");
  await page
    .getByRole("button", { name: "Mostrar todas", exact: true })
    .click();

  await page.getByRole("button", { name: "Separar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Reunir", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Reunir", exact: true }).click();
  await expect(page.locator(".stage-badge")).toHaveText(/VISÃO|CORTE|EXTERIOR/);
  await page.getByRole("button", { name: "Restaurar", exact: true }).click();
  await expect(
    page.locator('.structure-option[aria-pressed="true"]'),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("o cérebro não transborda no celular e conserva os modos acessíveis", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cerebro");

  await page.getByRole("button", { name: "Separar", exact: true }).click();
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

  const viewSwitch = page.getByRole("button", {
    name: "Ver interior",
    exact: true,
  });
  await viewSwitch.click();
  await expect(
    page.getByRole("button", { name: "Ver exterior", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Ver exterior", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ver interior", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");

  await page.getByRole("button", { name: "Restaurar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Separar", exact: true }),
  ).toBeVisible();
});

test("o conteúdo do cérebro continua disponível sem WebGL", async ({
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

  await page.goto("/cerebro");
  await expect(
    page.getByText("Não foi possível iniciar o visualizador 3D."),
  ).toBeVisible();
  const thalamus = brainContentById.thalamus;
  await page
    .locator(".structure-option")
    .nth(brainContent.findIndex((entry) => entry.id === thalamus.id))
    .click();
  await expect(page.locator(".structure-detail h3")).toHaveText(thalamus.name);
});
