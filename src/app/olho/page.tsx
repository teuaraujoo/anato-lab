import { createPageMetadata } from "@/lib/metadata";
import { EyeExperience } from "@/components/eye/EyeExperience";

export const metadata = createPageMetadata({
  title: "Olho humano em 3D: estruturas e funções | Anatolab",
  description:
    "Explore o olho humano em 3D e entenda como córnea, íris, cristalino, retina e nervo óptico participam da visão.",
  path: "/olho",
  image: {
    url: "/catalog/olho-modelo.png",
    width: 928,
    height: 550,
    alt: "Modelo 3D interativo de um olho humano em corte",
  },
});

export default function EyePage() {
  return <EyeExperience />;
}
