"use server";

import { RegisterForm } from "@/app/types/types";
import { signIn, signOut } from "@/services/auth";
import { prisma } from "@/services/prisma";
import { hash } from "bcrypt-ts";
import { AuthError } from "next-auth";

const saltRounds = 10;

export async function Register(data: RegisterForm) {
  const { name, email, password } = data;

  const hashedPassword = await hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  if (!user) {
    throw new Error("User not created");
  }

  return user;
}

export async function Login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Credenciais inválidas",
          };
        default:
          return {
            message: "Ocorreu um erro inesperado. Por favor, tente novamente.",
          };
      }
    }
    throw error;
  }
}

export async function Logout() {
  await signOut();
}
