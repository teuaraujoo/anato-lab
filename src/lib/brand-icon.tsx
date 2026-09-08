import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export async function createBrandIcon(size: number) {
  const symbol = await readFile(
    join(process.cwd(), "public/branding/anatolab-symbol.png"),
  );
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#091720",
        borderRadius: size * 0.2,
      }}
    >
      {/* A imagem original é preservada; apenas seu tamanho de exibição muda. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/png;base64,${symbol.toString("base64")}`}
        alt=""
        width={size * 0.8}
        height={(size * 0.8 * 336) / 382}
      />
    </div>,
    { width: size, height: size },
  );
}
