/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "picsum.photos",
      "unsplash.it",
    ],
  },
};

module.exports = nextConfig
