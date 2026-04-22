import type { NextConfig } from "next"

const isGHPages = process.env.GITHUB_PAGES === "true"

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGHPages ? "/neman-ui" : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig