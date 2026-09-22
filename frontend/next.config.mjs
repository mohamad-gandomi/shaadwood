/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Proxy API requests to NestJS backend seamlessly if requested
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://localhost:3000/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
