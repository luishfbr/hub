"use server";

import { prisma } from "@/utils/prisma";

export const register = async (formData: FormData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const user = await prisma.user.create({
    data: {
      name: name as string,
      email: email as string,
      password: password as string,
    },
  });

  if (!user) {
    return { error: "User not created" };
  }

  return { success: "User created successfully" };
};
