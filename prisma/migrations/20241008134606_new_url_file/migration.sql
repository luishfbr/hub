/*
  Warnings:

  - Added the required column `meetingId` to the `Archives` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Archives" ADD COLUMN     "meetingId" TEXT NOT NULL,
ALTER COLUMN "data" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Archives" ADD CONSTRAINT "Archives_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
