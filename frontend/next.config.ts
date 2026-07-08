import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server bundle so the Docker image only
  // ships the files the server actually needs (see Dockerfile runner stage).
  output: "standalone",
};

export default nextConfig;
