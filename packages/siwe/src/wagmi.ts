import { mainnet } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { cookieStorage, cookieToInitialState, createStorage } from 'wagmi';

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '';

export const networks = [mainnet];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

/** Restore the wallet connection on the server from the request's cookie header. */
export function getInitialState(cookie: string | null | undefined) {
  return cookieToInitialState(wagmiAdapter.wagmiConfig, cookie);
}
