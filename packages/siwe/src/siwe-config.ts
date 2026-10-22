'use client';

import { createSIWEConfig, formatMessage } from '@reown/appkit-siwe';
import { getCsrfToken, getSession, signIn, signOut } from 'next-auth/react';
import { mainnet } from 'viem/chains';

/** SIWE config for AppKit, backed by next-auth's `siwe` credentials provider. */
export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    uri: window.location.origin,
    domain: window.location.host,
    chains: [mainnet.id],
    statement: 'Sign In With Ethereum to prove you control this wallet.',
  }),
  createMessage: ({ address, ...args }) => formatMessage(args, address),
  getNonce: async () => {
    const nonce = await getCsrfToken();
    if (!nonce) {
      throw new Error('Failed to get nonce!');
    }

    return nonce;
  },
  getSession: async () => {
    const session = await getSession();
    if (!session) {
      throw new Error('Failed to get session!');
    }

    // Each app's next-auth types add `id` (wallet address) and `chainId` to the session user.
    const user = session.user as { id: string; chainId: number };

    return {
      address: user.id,
      chainId: user.chainId,
    };
  },
  verifyMessage: async ({ message, signature }) => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const callbackUrl = searchParams.get('callbackUrl') || `${path}?${searchParams}`;

    try {
      await signIn('siwe', {
        message,
        signature,
        callbackUrl,
      });

      return true;
    } catch {
      return false;
    }
  },
  signOut: async () => {
    try {
      // AppKit can call signOut while a signature is pending, before any session exists.
      const session = await getSession();
      if (session) {
        await signOut();
      }

      return true;
    } catch {
      return false;
    }
  },
});
