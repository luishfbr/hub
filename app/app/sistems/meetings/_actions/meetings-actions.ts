"use server";

import type { NewMeeting } from "@/app/types/types";
import { auth } from "@/services/auth";
import { prisma } from "@/services/prisma";

export const getUserId = async () => {
  const session = await auth();
  if (!session) {
    return null;
  } else {
    const id = session?.user?.id as string;

    const UserID = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true },
    });

    return UserID?.id;
  }
};

export const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: { name: true, id: true },
  });
  if (!users) {
    return [];
  }
  return users;
};

export const createNewMeeting = async (data: NewMeeting) => {
  const userIds = data.users.map((user) => user.id);

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: { id: true, name: true },
  });

  const creator = data.createdBy;

  const createMeeting = await prisma.meeting.create({
    data: {
      name: data.name,
      date: data.date,
      createdBy: creator,
      users: {
        connect: users,
      },
    },
  });

  if (createMeeting) {
    return true;
  } else {
    return false;
  }
};

export const getMeetings = async () => {
  const meetings = await prisma.meeting.findMany({
    select: { users: true, name: true, date: true, createdBy: true, id: true },
  });
  if (meetings) {
    return meetings;
  } else {
    return [];
  }
};

export const deleteMeeting = async (id: string) => {
  const meeting = await prisma.meeting.delete({
    where: { id: id },
  });
  if (meeting) {
    return true;
  } else {
    return false;
  }
};

export const getUsersOnMeeting = async (id: string) => {
  const users = await prisma.meeting.findUnique({
    where: { id: id },
    select: { users: true },
  });
  if (users) {
    return users.users;
  } else {
    return [];
  }
};

export const deleteUserFromMeeting = async (
  id: string,
  meetingId: string
) => {};
