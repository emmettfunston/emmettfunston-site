import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project so Turbopack doesn't pick up an
    // unrelated lockfile above us and print a "detected multiple lockfiles"
    // warning during dev/build.
    root: path.join(__dirname),
  },
};

export default nextConfig;
