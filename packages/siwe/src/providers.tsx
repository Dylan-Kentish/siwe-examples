'use client';

import type { PropsWithChildren } from 'react';

import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type State, WagmiProvider } from 'wagmi';

import { siweConfig } from './siwe-config';
import { networks, projectId, wagmiAdapter } from './wagmi';

export type AppMetadata = {
  name: string;
  description: string;
  url: string;
  icons: string[];
};

const queryClient = new QueryClient();

let appKitCreated = false;

function ensureAppKit(metadata: AppMetadata) {
  if (appKitCreated) return;
  appKitCreated = true;

  createAppKit({
    siweConfig,
    adapters: [wagmiAdapter],
    networks: [networks[0]!, ...networks.slice(1)],
    metadata,
    projectId,
    features: {
      email: false,
      socials: [],
      onramp: false,
    },
  });
}

type Web3ProvidersProps = PropsWithChildren<{
  metadata: AppMetadata;
  session?: Session | null;
  initialState?: State;
}>;

/** next-auth session + react-query + wagmi + Reown AppKit (with SIWE). */
export function Web3Providers({ metadata, session, initialState, children }: Web3ProvidersProps) {
  ensureAppKit(metadata);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>
          <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
            {children}
          </WagmiProvider>
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </SessionProvider>
  );
}
