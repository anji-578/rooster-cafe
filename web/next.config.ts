import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Repo has a lockfile at the parent folder; pin tracing to this app.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
