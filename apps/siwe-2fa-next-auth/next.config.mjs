import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

import './src/env.mjs';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  logging: { fetches: { fullUrl: true } },
  transpilePackages: ['@repo/db', '@repo/siwe', '@repo/ui'],
  experimental: {
    webpackBuildWorker: true,
  },
  webpack: (config, { isServer }) => {
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    // Copy Prisma's query engine into the server bundle. Needed because Prisma
    // lives in a workspace package (@repo/db): https://pris.ly/d/engine-not-found-nextjs
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};
export default config;
