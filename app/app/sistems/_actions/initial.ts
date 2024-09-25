"use server";

import { auth } from "@/services/auth";
import { prisma } from "@/services/prisma";

export const getName = async () => {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id as string,
    },
  });
  return user?.name;
};
