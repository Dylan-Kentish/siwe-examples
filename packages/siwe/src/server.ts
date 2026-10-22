import 'server-only';

import { getAddressFromMessage, getChainIdFromMessage, verifySignature } from '@reown/appkit-siwe';
import { parseSiweMessage, validateSiweMessage } from 'viem/siwe';

import { projectId } from './wagmi';

/** The `credentials` shape for next-auth's `siwe` Credentials provider. */
export const siweCredentials = {
  message: { label: 'Message', type: 'text', placeholder: '0x0' },
  signature: { label: 'Signature', type: 'text', placeholder: '0x0' },
  csrfToken: { label: 'CSRF Token', type: 'text', placeholder: '0x0' },
};

type SiweCredentials = Partial<Record<keyof typeof siweCredentials, string>>;
type RequestHeaders = Record<string, string | string[] | undefined> | undefined;

/**
 * Check a signed SIWE message from next-auth's `siwe` Credentials provider.
 *
 * The nonce must be this browser's CSRF token, which next-auth has already
 * checked against its cookie, and the domain must be this site. Together these
 * stop a signature captured elsewhere from being replayed.
 *
 * Returns the signer's address and numeric chain id, or null if anything fails.
 */
export async function verifySiweCredentials(
  credentials: SiweCredentials | undefined,
  headers: RequestHeaders
) {
  const message = credentials?.message;
  const signature = credentials?.signature;
  const nonce = credentials?.csrfToken;
  const host = headers?.host;
  const domain = Array.isArray(host) ? host[0] : host;

  if (!message || !signature || !nonce || !domain) return null;

  const parsed = parseSiweMessage(message);
  if (!validateSiweMessage({ message: parsed, domain, nonce })) return null;

  const address = getAddressFromMessage(message);
  const caipChainId = getChainIdFromMessage(message);

  const isValid = await verifySignature({
    address,
    message,
    signature,
    chainId: caipChainId,
    projectId,
  });

  if (!isValid) return null;

  return {
    address,
    chainId: Number(caipChainId.split(':')[1]),
  };
}
