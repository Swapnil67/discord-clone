/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        pathname: '**',
      },
    ],
  }
}

module.exports = nextConfig
