/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async rewrites() {
    const adminUrl = process.env.ADMIN_URL || "http://localhost:3001";
    return [
      {
        source: "/admin/:path*",
        destination: `${adminUrl}/:path*`,
      },
      {
        source: "/admin-sw.js",
        destination: `${adminUrl}/sw.js`,
      },
    ];
  },
};

export default nextConfig;
