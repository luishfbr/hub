import { auth } from "@/services/auth";
import { prisma } from "@/services/prisma";

export const GetUser = async () => {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    select: {
      role: true,
    },
  });

  return user;
};
