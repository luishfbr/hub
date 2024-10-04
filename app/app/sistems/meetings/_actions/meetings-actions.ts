"use server";

import type {
  NewMeeting,
  UpdateMeeting,
  UserToMeeting,
} from "@/app/types/types";
import { auth } from "@/services/auth";
import { prisma } from "@/services/prisma";

const GetSession = async () => {
  const session = await auth();
  return session;
};

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

export const User = async () => {
  const session = await auth();
  const id = session?.user?.id as string;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return user;
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
    },
  });

  if (createMeeting) {
    const meetingId = createMeeting.id as string;

    await prisma.meetingUser.createMany({
      data: users.map((user) => ({
        meetingId: meetingId as string,
        userId: user.id as string,
        name: user.name as string,
      })),
    });
  }

  if (createMeeting) {
    return true;
  } else {
    return false;
  }
};

export const getMeetings = async () => {
  const meetings = await prisma.meeting.findMany({
    select: { name: true, date: true, createdBy: true, id: true },
  });
  if (meetings) {
    return meetings.map((meeting) => ({
      id: meeting.id,
      name: meeting.name,
      date: meeting.date,
      createdBy: meeting.createdBy,
    }));
  } else {
    return [];
  }
};

export const deleteMeeting = async (id: string) => {
  const meetingId = id as string;

  const res = await prisma.meeting.delete({
    where: { id: meetingId },
  });

  if (res) {
    return true;
  }
  return false;
};

export const getUsersOnMeeting = async (id: string) => {
  const meetingId = id as string;

  const users = await prisma.meetingUser.findMany({
    where: { meetingId: meetingId },
    select: { name: true, id: true },
  });

  if (users) {
    return users;
  } else {
    return [];
  }
};

export const deleteUserFromMeeting = async (userId: string) => {
  const res = await prisma.meetingUser.delete({
    where: {
      id: userId,
    },
  });

  if (res) {
    return true;
  }
  return false;
};

export const updateUsersOnMeeting = async (
  meetingId: string,
  users: UserToMeeting[]
) => {
  const meetingUsers = users.map((user) => ({
    meetingId: meetingId as string,
    userId: user.id as string,
    name: user.name as string,
  }));

  const res = await prisma.meetingUser.deleteMany({
    where: {
      meetingId: meetingId,
    },
  });

  if (res) {
    const res2 = await prisma.meetingUser.createMany({
      data: meetingUsers,
    });

    if (res2) {
      return true;
    }
  }
  return false;
};

export const getMeetingById = async (id: string) => {
  const meeting = await prisma.meeting.findUnique({
    where: { id: id },
    select: { name: true, date: true, createdBy: true, id: true },
  });
  if (meeting) {
    return meeting;
  } else {
    return null;
  }
};

export const updateMeeting = async (data: UpdateMeeting) => {
  const { id, name, date } = data;
  const res = await prisma.meeting.update({
    where: { id: id },
    data: { name: name, date: date },
  });

  if (res) {
    return true;
  } else {
    return false;
  }
};

export const MeetingsByUserId = async (id: string) => {
  const meetings = await prisma.meeting.findMany({
    where: { createdBy: id },
    select: { name: true, date: true, createdBy: true, id: true },
  });

  if (meetings) {
    return meetings;
  } else {
    return [];
  }
};

export const getAllInfo = async () => {
  try {
    const session = await GetSession();
    if (session) {
      const user = {
        id: session?.user?.id as string,
        name: session?.user?.name as string,
      };

      const meetings = await prisma.meeting.findMany({
        where: { createdBy: user?.id },
        select: { name: true, date: true, createdBy: true, id: true },
      });

      return {
        user,
        meetings: meetings || [],
      };
    }
    return { user: null, meetings: [] };
  } catch (error) {
    console.error("Erro ao buscar informações do usuário e reuniões", error);
    throw new Error("Falha ao carregar dados");
  }
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: { name: true, id: true },
  });

  if (user) {
    return user;
  } else {
    return null;
  }
};

export const GetCompleteUser = async () => {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { name: true, email: true, role: true, id: true, sectors: true },
  });
  console.log(user);
  return user;
};

export const getMeetingsByUserId = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: { name: true, id: true },
  });

  const meetings = await prisma.meeting.findMany({
    where: { createdBy: id },
    select: { name: true, date: true, createdBy: true, id: true },
  });

  const data = {
    user,
    meetings: meetings || [],
  };

  return data;
};
