"use server";

import { LoginForm, RegisterForm } from "@/app/types/types";
import { signIn, signOut } from "@/services/auth";
import { prisma } from "@/services/prisma";
import { compareSync, hash } from "bcrypt-ts";
import { AuthError } from "next-auth";
import qrcode from "qrcode";
import { authenticator } from "otplib";

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

export async function LoginWithCredentials(data: LoginForm) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      message: "Usuário não encontrado",
    };
  }

  const comparePassword = compareSync(password, user.password as string);

  if (!comparePassword) {
    return {
      message: "Senha incorreta",
    };
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

export async function GenerateQrCode(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      otpSecret: true,
      email: true,
    },
  });

  const email = user?.email?.split("@")[0];
  const otpSecret = user?.otpSecret;
  const issuer = "FMS";

  const otpUrl = `otpauth://totp/${issuer}:${email}?secret=${otpSecret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;

  return await qrcode.toDataURL(otpUrl);
}

export async function VerifyQrCode(id: string, code: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return {
      message: "Usuário não encontrado",
    };
  }

  const verifyCode = authenticator.verify({
    token: code,
    secret: user.otpSecret as string,
  });

  if (!verifyCode) {
    return {
      message: "Código inválido",
    };
  }

  return {
    message: "Código verificado com sucesso",
    status: "success",
  };
}

export async function Logout() {
  await signOut();
}
