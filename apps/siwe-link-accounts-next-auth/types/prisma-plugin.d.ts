// The plugin ships without types; only its constructor is used in next.config.mjs.
declare module '@prisma/nextjs-monorepo-workaround-plugin' {
  export class PrismaPlugin {
    apply(compiler: unknown): void;
  }
}
