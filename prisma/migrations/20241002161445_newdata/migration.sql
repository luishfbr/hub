-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_meetingId_fkey";

-- AlterTable
ALTER TABLE "UserToMeeting" ADD COLUMN     "meetingId" TEXT;

-- AddForeignKey
ALTER TABLE "UserToMeeting" ADD CONSTRAINT "UserToMeeting_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;
