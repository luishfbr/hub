"use server";

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
