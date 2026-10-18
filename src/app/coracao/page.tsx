import { createPageMetadata } from "@/lib/metadata";
import { HeartExperience } from "@/components/heart/HeartExperience";

export const metadata = createPageMetadata({
  title: "Coração humano em 3D: câmaras, válvulas e vasos | Anatolab",
  description:
    "Explore o coração humano em 3D, por fora e por dentro. Descubra câmaras, válvulas, septo e vasos em uma experiência educativa interativa.",
  path: "/coracao",
  image: {
    url: "/catalog/coracao-modelo.png",
    width: 1000,
    height: 1000,
    alt: "Modelo 3D do coração humano com câmaras e vasos na Anatolab",
  },
});

export default function HeartPage() {
  return <HeartExperience />;
}
