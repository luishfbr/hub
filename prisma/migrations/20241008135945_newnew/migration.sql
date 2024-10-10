/*
  Warnings:

  - You are about to drop the column `name` on the `Archives` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Archives` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Archives" DROP COLUMN "name",
DROP COLUMN "type";
