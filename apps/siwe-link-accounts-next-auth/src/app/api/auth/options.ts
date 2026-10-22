import 'server-only';

import { type NextAuthOptions, getServerSession as getServerSessionInternal } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import TwitterProvider from 'next-auth/providers/twitter';

import { siweCredentials, verifySiweCredentials } from '@repo/siwe/server';

import { env } from '@/env.mjs';
import { prisma } from '@/server/db';

import { SIWEAdapter } from './adapter';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutes
  },
  adapter: SIWEAdapter(),
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
            const { address, chainId } = verified;
            const dbUser = await prisma.user.upsert({
              where: {
                id: address,
              },
              update: {
                chainId: chainId,
              },
              create: {
                id: address,
                chainId: chainId,
              },
              select: {
                role: true,
              },
            });

            return {
              id: address,
              chainId: chainId,
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
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      version: '2.0',
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
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
  events: {
    // after an account has been linked to a user
    // store the name and image from the provider
    linkAccount: async ({ account, profile }) => {
      await prisma.account.update({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
        data: {
          name: profile.name,
          image: profile.image,
        },
      });
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
