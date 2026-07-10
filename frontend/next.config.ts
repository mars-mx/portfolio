import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server bundle so the Docker image only
  // ships the files the server actually needs (see Dockerfile runner stage).
  output: "standalone",
  poweredByHeader: false,
  async rewrites() {
    return {
      // Pfade mit Punkt umgehen den Proxy-Matcher (siehe src/proxy.ts) und
      // landen sonst als "Locale" im [locale]-Segment, wo die Seiten im
      // Prod-Build mit 500 statt 404 antworten. afterFiles greift erst nach
      // den echten Dateirouten (sitemap.xml, llms.txt, profil.pdf, Assets);
      // der Rest wird auf eine garantiert unbekannte Route umgeschrieben und
      // liefert so den Root-404 (app/not-found.tsx).
      afterFiles: [
        {
          source: "/:path(.*\\..*)",
          destination: "/__not-found/__not-found",
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
