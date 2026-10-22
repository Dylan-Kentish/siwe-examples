import 'server-only';

import { getAddressFromMessage, getChainIdFromMessage, verifySignature } from '@reown/appkit-siwe';

import { projectId } from './wagmi';

/** The `credentials` shape for next-auth's `siwe` Credentials provider. */
export const siweCredentials = {
  message: { label: 'Message', type: 'text', placeholder: '0x0' },
  signature: { label: 'Signature', type: 'text', placeholder: '0x0' },
  csrfToken: { label: 'CSRF Token', type: 'text', placeholder: '0x0' },
};

/**
 * Check a signed SIWE message.
 * Returns the signer's address and numeric chain id, or null if the signature is invalid.
 */
export async function verifySiweCredentials(message: string, signature: string) {
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
