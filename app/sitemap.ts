import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "@/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-08");
  return [
    {
      url: absoluteSiteUrl(),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteSiteUrl("/legal"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteSiteUrl("/legal/privacy"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteSiteUrl("/legal/terms"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
