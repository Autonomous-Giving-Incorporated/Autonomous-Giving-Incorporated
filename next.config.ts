import type { NextConfig } from "next";

// Production is the custom domain (https://autogive.app) at site root
// (Cloudflare Workers static assets; Vercel until DNS cutover).
// Opt into the legacy project-site path only when explicitly requested:
//   GITHUB_PAGES_BASE_PATH=1 npm run build
const useProjectPath =
  process.env.GITHUB_PAGES_BASE_PATH === "1" ||
  process.env.GITHUB_PAGES_BASE_PATH === "true";
const basePath = useProjectPath ? "/Autonomous-Giving-Incorporated" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
export default nextConfig;
