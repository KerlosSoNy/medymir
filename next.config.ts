import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a preview build live in its own folder (NEXT_DIST_DIR=.next-preview)
  // so it never clashes with `npm run dev`, which uses .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
