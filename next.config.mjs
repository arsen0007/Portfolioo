/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Certifications now live on the Recognition page.
      {
        source: '/certifications',
        destination: '/recognition#certifications',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
