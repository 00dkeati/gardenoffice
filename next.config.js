/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  async rewrites() {
    return [
      {
        source: '/garden-office/:path*',
        destination: '/search?type=garden-office&location=:path*',
      },
      {
        source: '/garden-office-pod/:path*',
        destination: '/search?type=garden-office-pod&location=:path*',
      },
      {
        source: '/garden-office-shed/:path*',
        destination: '/search?type=garden-office-shed&location=:path*',
      },
      {
        source: '/garden-office-uk/:path*',
        destination: '/search?type=garden-office-uk&location=:path*',
      },
      {
        source: '/small-garden-office/:path*',
        destination: '/search?type=small-garden-office&location=:path*',
      },
      {
        source: '/garden-office-for-sale/:path*',
        destination: '/search?type=garden-office-for-sale&location=:path*',
      },
      {
        source: '/garden-office-room/:path*',
        destination: '/search?type=garden-office-room&location=:path*',
      },
      {
        source: '/garden-office-sale/:path*',
        destination: '/search?type=garden-office-sale&location=:path*',
      },
      {
        source: '/garden-office-buildings/:path*',
        destination: '/search?type=garden-office-buildings&location=:path*',
      },
      {
        source: '/insulated-garden-office/:path*',
        destination: '/search?type=insulated-garden-office&location=:path*',
      },
      {
        source: '/shed-garden-office/:path*',
        destination: '/search?type=shed-garden-office&location=:path*',
      },
      {
        source: '/garden-office-and-shed/:path*',
        destination: '/search?type=garden-office-and-shed&location=:path*',
      },
      {
        source: '/home-garden-office/:path*',
        destination: '/search?type=home-garden-office&location=:path*',
      },
      {
        source: '/garden-office-pod-cheap/:path*',
        destination: '/search?type=garden-office-pod-cheap&location=:path*',
      },
      {
        source: '/bespoke-garden-office/:path*',
        destination: '/search?type=bespoke-garden-office&location=:path*',
      },
      {
        source: '/garden-office-rooms/:path*',
        destination: '/search?type=garden-office-rooms&location=:path*',
      },
      {
        source: '/garden-office-building/:path*',
        destination: '/search?type=garden-office-building&location=:path*',
      },
      {
        source: '/cheap-garden-office-pod/:path*',
        destination: '/search?type=cheap-garden-office-pod&location=:path*',
      },
      {
        source: '/garden-office-build/:path*',
        destination: '/search?type=garden-office-build&location=:path*',
      },
      {
        source: '/uk-garden-office/:path*',
        destination: '/search?type=uk-garden-office&location=:path*',
      },
      {
        source: '/garden-office-and-storage-shed/:path*',
        destination: '/search?type=garden-office-and-storage-shed&location=:path*',
      },
    ]
  },
}

module.exports = nextConfig


