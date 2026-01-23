import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' https://kit.fontawesome.com https://ka-f.fontawesome.com; " +
              "connect-src 'self' https://bmuinasqpiqsakpbhueq.supabase.co https://ka-f.fontawesome.com; " +
              "img-src 'self' data: https:; " +
              "style-src 'self' 'unsafe-inline'; " +
              "font-src 'self' https://ka-f.fontawesome.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
