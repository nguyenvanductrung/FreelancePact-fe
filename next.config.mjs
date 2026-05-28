/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow next/image to serve files from the public directory
    remotePatterns: [],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
