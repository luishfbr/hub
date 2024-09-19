"use server";

import { LoginForm, LoginWithCode, RegisterForm } from "@/app/types/types";
import { signIn, signOut } from "@/services/auth";
import { prisma } from "@/services/prisma";
import { compareSync, hash } from "bcrypt-ts";
import qrcode from "qrcode";
import { authenticator } from "otplib";
import { randomBytes } from "crypto";
import base32 from "hi-base32";
import { AuthError } from "next-auth";

const saltRounds = 10;

export async function Register(data: RegisterForm) {
  const { name, email, password } = data;

  const secretBuffer = randomBytes(20);
  const otpSecret = base32.encode(secretBuffer).replace(/=/g, "");
  const hashedPassword = await hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      otpSecret,
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
            title: "Credenciais inválidas",
            message: "Email ou senha incorretos.",
          };
        default:
          return {
            title: "Problemas com o servidor",
            message: "Ocorreu um erro inesperado. Por favor, tente novamente.",
          };
      }
    }
    throw error;
  }
}

export async function VerifyUser(values: LoginForm) {
  const { email, password } = values;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      title: "Email não encontrado",
      message: "Verifique o email digitado e tente novamente.",
      variant: "destructive",
    };
  }

  const isPasswordMatches = compareSync(password, user.password as string);

  if (!isPasswordMatches) {
    return {
      title: "Senha incorreta",
      message: "Verifique a senha digitada e tente novamente.",
      variant: "destructive",
    };
  }

  const id = user.id as string;

  const qrCodeUrl = await GenerateQrCode(id);
  return {
    qrCodeUrl,
    title: "Usuário encontrado",
    message: "Verifique o código QR e insira o código de verificação.",
    variant: "success",
  };
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

export async function VerifyQrCode(values: LoginWithCode) {
  const { email, password, code } = values;
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

export async function getUserFromDb(email: string, password: string) {
  try {
    const existedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existedUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (!existedUser.password) {
      return {
        success: false,
        message: "Password is required.",
      };
    }

    const isPasswordMatches = compareSync(password, existedUser.password);

    if (!isPasswordMatches) {
      return {
        success: false,
        message: "Password is incorrect.",
      };
    }

    return {
      success: true,
      data: existedUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
