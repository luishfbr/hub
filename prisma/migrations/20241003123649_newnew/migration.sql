-- DropForeignKey
ALTER TABLE "MeetingUser" DROP CONSTRAINT "MeetingUser_meetingId_fkey";

-- AddForeignKey
ALTER TABLE "MeetingUser" ADD CONSTRAINT "MeetingUser_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
