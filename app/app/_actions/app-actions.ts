"use server";

import { auth } from "@/services/auth";
import { prisma } from "@/services/prisma";

export const GetRoleById = async (id: string) => {
  const response = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      role: true,
    },
  });
  return response;
};

export const GetSectorsByUserId = async (id: string) => {
  const response = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      sectors: true,
    },
  });
  return response;
};

export const GetUserSession = async () => {
  const session = await auth();
  return session;
};

export const GetRoleAndSectorsByUserId = async (id: string) => {
  const res = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      role: true,
      sectors: true,
    },
  });
  return res;
};
