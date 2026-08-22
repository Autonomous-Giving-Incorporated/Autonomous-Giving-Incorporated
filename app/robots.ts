import type { MetadataRoute } from "next";
import { ROBOTS_DISALLOW_PATHS, robotsSitemapUrl } from "@/site-public";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...ROBOTS_DISALLOW_PATHS],
    },
    sitemap: robotsSitemapUrl(),
  };
}
