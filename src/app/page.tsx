import { HomeCatalog } from "@/components/home/HomeCatalog";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Anatolab | Anatomia e biologia celular em 3D",
  description:
    "Descubra a Anatolab, um acervo educacional do corpo humano em 3D. Comece pela célula animal interativa e explore suas organelas e funções no seu ritmo.",
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
