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
