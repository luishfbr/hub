/*
  Warnings:

  - You are about to drop the column `name` on the `UserToMeeting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UserToMeeting" DROP COLUMN "name";
