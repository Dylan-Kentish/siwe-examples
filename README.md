# SIWE examples

Sign-In with Ethereum examples for Next.js and NextAuth, using [Reown AppKit](https://reown.com/appkit).

| App | What it shows | Live |
|---|---|---|
| [`apps/siwe-next-auth`](apps/siwe-next-auth) | Sign in with a wallet, with a database user and roles | [siwe-next-auth.vercel.app](https://siwe-next-auth.vercel.app) |
| [`apps/siwe-link-accounts-next-auth`](apps/siwe-link-accounts-next-auth) | The same, plus linking OAuth accounts (Twitter) to the wallet user | [siwe-link-accounts-next-auth.vercel.app](https://siwe-link-accounts-next-auth.vercel.app) |
| [`apps/siwe-2fa-next-auth`](apps/siwe-2fa-next-auth) | The same, plus 2FA with TOTP and passkeys, and passkey-only sign-in | [siwe-2fa-next-auth.vercel.app](https://siwe-2fa-next-auth.vercel.app) |

## Shared packages

- **`@repo/siwe`**: AppKit + wagmi setup, the SIWE client config, and `verifySiweCredentials` for next-auth. That check covers the signature, the domain, and the nonce, which must equal the CSRF token so signed messages can't be replayed.
- **`@repo/db`**: the Prisma schema and client. All three apps share one Postgres database (Neon), so this is the only schema. Change it here and add a migration.
- **`@repo/ui`**: shadcn components used by more than one app.
- **`@repo/config`**: tsconfig, ESLint, Prettier, PostCSS and Tailwind presets.

## Development

```bash
pnpm install
cp apps/siwe-next-auth/.env.example apps/siwe-next-auth/.env.local   # fill in values
pnpm --filter siwe-next-auth dev
```

Or pull env vars from Vercel: `cd apps/<app> && vercel env pull .env.local`.

| Command | What it does |
|---|---|
| `pnpm build` / `pnpm lint` / `pnpm typecheck` | Run across every app and package |
| `pnpm db:migrate` | Apply Prisma migrations (`prisma migrate deploy`) |
| `pnpm --filter @repo/db db:migrate:dev` | Create a new migration from schema changes |
| `pnpm db:studio` | Open Prisma Studio |

## Dependency pins

`pnpm-workspace.yaml` pins `@wagmi/core`, `@wagmi/connectors` and `@coinbase/cdp-sdk`. AppKit's open-ended version ranges would otherwise pull in wagmi 3 packages, or a cdp-sdk release that breaks the Next build. Remove the pins when moving to wagmi 3.

## History

These apps used to be separate repos, now archived:
[siwe-next-auth](https://github.com/Dylan-Kentish/siwe-next-auth),
[siwe-link-accounts-next-auth](https://github.com/Dylan-Kentish/siwe-link-accounts-next-auth),
[siwe-2fa-next-auth](https://github.com/Dylan-Kentish/siwe-2fa-next-auth).
Their commit history is kept here under `apps/`.
