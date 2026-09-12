import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'www.citypng.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  async redirects() {
    const landingUrl =
      process.env.NEXT_PUBLIC_LANDING_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://sokojunction.com'
        : 'http://localhost:3000');
    return [
      {
        source: '/about',
        destination: `${landingUrl}/about`,
        permanent: false,
      },
      {
        source: '/mobile-app',
        destination: `${landingUrl}/mobile-app`,
        permanent: false,
      },
    ];
  },
}

export default bundleAnalyzer(nextConfig)