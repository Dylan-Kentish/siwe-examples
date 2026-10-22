import React from 'react';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';

import { Web3Providers } from '@repo/siwe/providers';
import { getInitialState } from '@repo/siwe/wagmi';

import '@/styles/globals.css';
import { Header } from '@/components/header';
import { TwoFAProvider } from '@/components/providers/2fa';

import { getServerSession } from './api/auth/options';

const inter = Inter({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const appMetadata = {
  name: 'SIWE + Next Auth: 2FA',
  description: 'SIWE + Next Auth example with TOTP and passkeys',
  url: 'https://siwe-2fa-next-auth.vercel.app',
  icons: ['https://siwe-2fa-next-auth.vercel.app/siwe.png'],
};

// ====================

const RootLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
  const initialState = getInitialState(headers().get('cookie'));
  const session = await getServerSession();

  return (
    <html lang="en" className="dark min-h-screen">
      <body className={`${inter.variable} font-inter`}>
        {/* Stay on the page after wallet sign-in so the 2FA prompt can run. */}
        <Web3Providers
          metadata={appMetadata}
          siwe={{ redirect: false }}
          session={session}
          initialState={initialState}
        >
          <TwoFAProvider>
            <main>
              <Header />
              <div className="flex h-full w-full items-start justify-center p-5 pt-[15vh]">
                {children}
              </div>
            </main>
          </TwoFAProvider>
        </Web3Providers>
      </body>
    </html>
  );
};

// ====================

const metadata: Metadata = {
  title: 'SIWE | NextAuth',
  description: 'Simple example of NextAuth with SIWE',
  icons: {
    icon: './favicon.ico',
  },
};

export { RootLayout as default, metadata };
