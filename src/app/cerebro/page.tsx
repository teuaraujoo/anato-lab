import { createPageMetadata } from "@/lib/metadata";
import { BrainExperience } from "@/components/brain/BrainExperience";

export const metadata = createPageMetadata({
  title: "Cérebro humano em 3D: lobos e estruturas | Anatolab",
  description:
    "Explore o cérebro humano em 3D. Descubra hemisférios, lobos, cerebelo, tronco encefálico e estruturas internas em uma experiência educativa interativa.",
  path: "/cerebro",
  image: {
    url: "/catalog/cerebro-modelo.png",
    width: 1000,
    height: 1000,
    alt: "Modelo 3D do cérebro humano com regiões coloridas na Anatolab",
  },
});

export default function BrainPage() {
  return <BrainExperience />;
}
