import 'server-only';

import { PrismaClient } from '@prisma/client';

const isDev = process.env.NODE_ENV === 'development';

const createPrismaClient = () =>
  new PrismaClient({
    log: isDev ? ['error', 'warn'] : ['error'],
  });

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Reuse one client across hot reloads in dev.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export * from '@prisma/client';
