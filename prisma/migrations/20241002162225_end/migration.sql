/*
  Warnings:

  - You are about to drop the `UserToMeeting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserToMeeting" DROP CONSTRAINT "UserToMeeting_meetingId_fkey";

-- DropTable
DROP TABLE "UserToMeeting";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;
