import { expect, test } from "@playwright/test";

for (const route of ["celula", "olho"]) {
  test(`${route}: separar, selecionar, isolar e restaurar sem reiniciar entrada`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/${route}`);
    await expect(page.locator(".atlas-page")).toHaveAttribute(
      "data-entrance",
      "complete",
    );
    await expect(page.locator("canvas")).toBeVisible();
    await page.getByRole("button", { name: "Separar", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Reunir", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    const options = page.locator(".structure-option");
    for (let i = 0; i < (await options.count()); i++) {
      await options.nth(i).click();
      await expect(options.nth(i)).toHaveAttribute("aria-pressed", "true");
      await page
        .getByRole("button", { name: "Aproximar", exact: true })
        .click();
    }
    await page.getByRole("button", { name: "Isolar", exact: true }).click();
    await page.getByRole("button", { name: "Reunir", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Isolar", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
    await page.getByRole("button", { name: "Separar", exact: true }).click();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Separar", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
    await expect(
      page.locator('.structure-option[aria-pressed="true"]'),
    ).toHaveCount(0);
    await expect(page.locator(".atlas-page")).toHaveAttribute(
      "data-entrance",
      "complete",
    );
    expect(errors).toEqual([]);
  });

  test(`${route}: quatro controles cabem no celular com movimento reduzido`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 780 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${route}`);
    await page.getByRole("button", { name: "Separar", exact: true }).click();
    for (const button of await page.locator(".viewer-toolbar button").all()) {
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Restaurar", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Separar", exact: true }),
    ).toBeVisible();
  });
}
