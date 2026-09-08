import { createPageMetadata } from "@/lib/metadata";
import { KidneyExperience } from "@/components/kidney/KidneyExperience";

export const metadata = createPageMetadata({
  title: "Rim humano em 3D: anatomia e estruturas | Anatolab",
  description:
    "Explore o rim humano em corte 3D. Conheça córtex, pirâmides, cálices, pelve renal e vasos em uma experiência educativa interativa.",
  path: "/rim",
  image: {
    url: "/catalog/rim-modelo.png",
    width: 1000,
    height: 1000,
    alt: "Modelo 3D do rim humano em corte na Anatolab",
  },
});

export default function KidneyPage() {
  return <KidneyExperience />;
}
