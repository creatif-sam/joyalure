import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bmuinasqpiqsakpbhueq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

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
              // FIX: Added wss: for real-time and ensured storage uploads aren't blocked
              "connect-src 'self' https://bmuinasqpiqsakpbhueq.supabase.co wss://bmuinasqpiqsakpbhueq.supabase.co https://ka-f.fontawesome.com; " +
              // FIX: Added 'blob:' to allow the editor's local image previews
              "img-src 'self' data: blob: https://bmuinasqpiqsakpbhueq.supabase.co https:; " +
              "style-src 'self' 'unsafe-inline'; " +
              "font-src 'self' https://ka-f.fontawesome.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;