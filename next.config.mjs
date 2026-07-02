import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// When deploying to GitHub Pages under https://<user>.github.io/<repo>, the site
// is served from a sub-path. The deploy workflow injects that sub-path via
// NEXT_PUBLIC_BASE_PATH (from actions/configure-pages). Empty locally.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a fully static site into ./out for GitHub Pages (no Node server).
  output: "export",
  // GitHub Pages serves each route as a folder/index.html.
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  // Pin the workspace root (multiple lockfiles exist on this machine).
  outputFileTracingRoot: __dirname,
  images: {
    // next/image optimization needs a server; static export can't provide one.
    unoptimized: true,
    // Allow remote provider logos/photos if entries store external image URLs in details.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
