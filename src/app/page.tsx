import { HomeCatalog } from "@/components/home/HomeCatalog";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Anatolab | Anatomia e biologia celular em 3D",
  description:
    "Explore célula animal, olho, rim e cérebro humano em 3D na Anatolab. Conheça estruturas, funções e conexões em um acervo educacional interativo.",
  path: "/",
  image: {
    url: "/branding/anatolab-logo.png",
    width: 1536,
    height: 1024,
    alt: "Anatolab — acervo educacional do corpo humano em 3D",
  },
});

export default function Home() {
  return <HomeCatalog />;
}
