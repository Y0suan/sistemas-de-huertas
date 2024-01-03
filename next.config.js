/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withImages = require('next-images');

module.exports = withImages({
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com'],
  },
  ...nextConfig,
});
