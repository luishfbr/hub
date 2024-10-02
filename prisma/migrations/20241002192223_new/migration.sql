-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_meetingId_fkey";

-- CreateTable
CREATE TABLE "MeetingUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeetingUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MeetingUser" ADD CONSTRAINT "MeetingUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingUser" ADD CONSTRAINT "MeetingUser_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
