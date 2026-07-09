import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server bundle so the Docker image only
  // ships the files the server actually needs (see Dockerfile runner stage).
  output: "standalone",
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
