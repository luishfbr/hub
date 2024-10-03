/*
  Warnings:

  - The primary key for the `MeetingUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[meetingId]` on the table `MeetingUser` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `MeetingUser` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "MeetingUser" DROP CONSTRAINT "MeetingUser_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "MeetingUser_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingUser_meetingId_key" ON "MeetingUser"("meetingId");
