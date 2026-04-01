/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdf-parse uses some Node.js-only features
  experimental: { serverComponentsExternalPackages: ['pdf-parse'] },
};

export default nextConfig;
