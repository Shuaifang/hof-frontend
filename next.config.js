const withNextIntl = require('next-intl/plugin')(
  './src/i18n.ts',
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd'],
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  
  async redirects() {
    return [
      {
        source: '/index/index',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

module.exports = withNextIntl(nextConfig);
