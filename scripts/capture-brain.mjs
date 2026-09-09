import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

// Execute com a aplicação local iniciada. A imagem vem do Canvas real, sem IA.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const output = path.resolve("public/catalog/cerebro-modelo.png");
const browser = await chromium.launch({
  channel: "chrome",
  headless: Boolean(process.env.CI),
});

try {
  const page = await browser.newPage({
    viewport: { width: 1100, height: 1100 },
    deviceScaleFactor: 1,
  });
  await page.goto(`${baseURL}/cerebro`);
  await page.locator('.atlas-page[data-entrance="complete"]').waitFor();
  await page.locator("canvas").waitFor();
  await page.mouse.move(1090, 1090);
  await page.addStyleTag({
    content: `
    .scene-container {
      position: fixed !important;
      inset: 0 !important;
      width: 1000px !important;
      height: 1000px !important;
      z-index: 9999;
      background: #10252f;
    }
    .stage-caption { visibility: hidden; }
  `,
  });
  await page.waitForFunction(() => {
    const canvas = document.querySelector("canvas");
    return canvas?.clientWidth === 1000 && canvas?.clientHeight === 1000;
  });
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
      ),
  );
  await mkdir(path.dirname(output), { recursive: true });
  await page.locator(".scene-container").screenshot({ path: output });
  console.log(`Miniatura do modelo capturada em ${output}`);
} finally {
  await browser.close();
}
