-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpSecret" TEXT;
