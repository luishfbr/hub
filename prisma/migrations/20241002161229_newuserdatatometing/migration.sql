-- CreateTable
CREATE TABLE "UserToMeeting" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserToMeeting_pkey" PRIMARY KEY ("id")
);
