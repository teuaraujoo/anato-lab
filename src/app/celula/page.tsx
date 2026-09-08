import type { Metadata } from "next";
import { CellExperience } from "@/components/cell/CellExperience";

export const metadata: Metadata = {
  title: "Célula animal",
  description: "Explore uma célula animal em 3D e descubra suas 11 estruturas.",
};

export default function CellPage() {
  return <CellExperience />;
}
