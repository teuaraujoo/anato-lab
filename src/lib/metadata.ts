import type { Metadata } from "next";
import { absoluteUrl } from "@/config/site";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  image: { url: string; width: number; height: number; alt: string };
};

export function createPageMetadata({
  title,
  description,
  path,
  image,
}: PageMetadata): Metadata {
  const images = [{ ...image, url: absoluteUrl(image.url) }];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "Anatolab",
      title,
      description,
      url: absoluteUrl(path),
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
