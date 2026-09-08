import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { catalog } from "@/content/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...new Set(["/", ...catalog.map((entry) => entry.href)])].map(
    (path) => ({ url: absoluteUrl(path) }),
  );
}
