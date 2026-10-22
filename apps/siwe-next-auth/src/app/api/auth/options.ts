import 'server-only';

import { type NextAuthOptions, getServerSession as getServerSessionInternal } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { siweCredentials, verifySiweCredentials } from '@repo/siwe/server';

import { prisma } from '@/server/db';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutes
  },
  providers: [
    Credentials({
      id: 'siwe',
      name: 'SIWE',
      credentials: siweCredentials,
      async authorize(credentials, req) {
        try {
          if (!credentials) throw new Error('No credentials');
          if (!req.headers) throw new Error('No headers');

          const verified = await verifySiweCredentials(credentials, req.headers);

          if (verified) {
            const { address, chainId: chain } = verified;
            const dbUser = await prisma.user.upsert({
              where: {
                id: address,
              },
              update: {
                chainId: chain,
              },
              create: {
                id: address,
                chainId: chain,
              },
              select: {
                role: true,
              },
            });

            return {
              id: address,
              chainId: chain,
              role: dbUser.role,
            };
          } else {
            return null;
          }
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // Persist the data to the token right after authentication
        token.id = user.id;
        token.chainId = user.chainId;
        token.role = user.role;
      } else {
        const dbUser = await prisma.user.findUniqueOrThrow({
          where: {
            id: token.id,
          },
          select: {
            chainId: true,
            role: true,
          },
        });

        token.chainId = dbUser.chainId;
        token.role = dbUser.role;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.chainId = token.chainId;
      session.iat = token.iat;
      session.exp = token.exp;
      return session;
    },
  },
  pages: {
    signIn: '/siwe',
  },
};

export async function getServerSession() {
  const session = await getServerSessionInternal(authOptions);

  return session;
}
