-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL DEFAULT 1,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "currentChallenge" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "TOTP" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TOTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PassKey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "credentialID" BYTEA NOT NULL,
    "credentialPublicKey" BYTEA NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PassKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TOTP_secret_key" ON "TOTP"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "TOTP_userId_id_key" ON "TOTP"("userId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "PassKey_credentialID_key" ON "PassKey"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "PassKey_userId_id_key" ON "PassKey"("userId", "id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TOTP" ADD CONSTRAINT "TOTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassKey" ADD CONSTRAINT "PassKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

