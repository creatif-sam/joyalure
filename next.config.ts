import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // FIX: Added remotePatterns to allow Supabase images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bmuinasqpiqsakpbhueq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
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
              // Added Supabase to connect-src to prevent API blocks
              "connect-src 'self' https://bmuinasqpiqsakpbhueq.supabase.co https://ka-f.fontawesome.com; " +
              // img-src is already set to https: which is fine, but self and data are good to keep
              "img-src 'self' data: https://bmuinasqpiqsakpbhueq.supabase.co https:; " +
              "style-src 'self' 'unsafe-inline'; " +
              "font-src 'self' https://ka-f.fontawesome.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;