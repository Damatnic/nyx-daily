import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Clearbit logos
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      // NASA APOD
      {
        protocol: 'https',
        hostname: 'apod.nasa.gov',
      },
      // Common news image CDNs
      {
        protocol: 'https',
        hostname: 'images.axios.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.vox-cdn.com',
      },
      {
        protocol: 'https',
        hostname: 'techcrunch.com',
      },
      {
        protocol: 'https',
        hostname: 'i.guim.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'media.wired.com',
      },
      {
        protocol: 'https',
        hostname: '*.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'static01.nyt.com',
      },
      {
        protocol: 'https',
        hostname: 'www.washingtonpost.com',
      },
      // Generic wildcard for other news domains
      {
        protocol: 'https',
        hostname: '**.com',
      },
    ],
  },
};

export default nextConfig;
