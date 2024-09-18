"use server";

import { prisma } from "@/services/prisma";
import { genSaltSync, hashSync } from "bcrypt-ts";

export const getUsers = async () => {
  const users = await prisma.user.findMany();

  return users.map((user) => ({
    name: user.name ?? "",
    role: user.role ?? "",
    email: user.email ?? "",
    otpEnabled: user.otpEnabled ?? false,
  }));
};

export const getSectors = async () => {
  const sectors = await prisma.sector.findMany();

  return sectors.map((sector) => ({
    name: sector.name ?? "",
    id: sector.id ?? "",
  }));
};

export const deleteUser = async (email: string) => {
  const response = await prisma.user.delete({
    where: { email },
  });
  return !!response;
};

export const deleteSector = async (id: string) => {
  const response = await prisma.sector.delete({
    where: { id },
  });
  return !!response;
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      name: true,
      role: true,
      email: true,
    },
  });
};

export const updateUser = async (email: string, data: any) => {
  await prisma.user.update({
    where: { email },
    data,
  });
};

export const createSector = async (FormData: FormData) => {
  try {
    const name = FormData.get("name") as string;

    const createSector = await prisma.sector.create({
      data: { name },
    });

    if (!createSector) {
      throw new Error("Erro ao criar setor");
    }
    return true;
  } catch (error) {
    console.error("Erro:", error);
    return false;
  }
};

export const updateRoleUser = async (email: string, data: any) => {
  await prisma.user.update({
    where: { email },
    data: { role: data.role },
  });
};

const salt = genSaltSync(10);

export const updatePassword = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const hashedPassword = hashSync(password, salt);

    const updatedPassword = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return !!updatedPassword;
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return false;
  }
};

export const getUsersOnSectorById = async (
  sectorId: string
): Promise<string[]> => {
  const users = await prisma.user.findMany({
    where: {
      sectors: {
        some: { id: sectorId },
      },
    },
    select: { name: true },
  });

  return users.map((user) => user.name || "");
};

export const includeUserToSectorById = async (id: string, sectorId: string) => {
  try {
    const getSector = await prisma.sector.findUnique({
      where: { id: sectorId },
      select: { id: true },
    });

    if (!getSector) {
      throw new Error("Erro ao encontrar setor");
    }

    const includeUser = await prisma.user.update({
      where: { id },
      data: {
        sectors: {
          connect: { id: getSector.id },
        },
      },
    });

    if (!includeUser) {
      throw new Error("Erro ao incluir usuário ao setor");
    }
    return true;
  } catch (error) {
    console.error("Erro ao incluir usuário ao setor:", error);
    return false;
  }
};

export const excludeUserToSectorById = async (id: string, sectorId: string) => {
  try {
    const getSector = await prisma.sector.findUnique({
      where: { id: sectorId },
      select: { id: true },
    });

    if (!getSector) {
      throw new Error("Erro ao encontrar setor");
    }

    const excludeUser = await prisma.user.update({
      where: { id },
      data: {
        sectors: {
          disconnect: { id: getSector.id },
        },
      },
      select: { id: true, name: true },
    });

    if (!excludeUser) {
      throw new Error("Erro ao excluir usuário do setor");
    }
    return true;
  } catch (error) {
    console.error("Erro ao excluir usuário do setor:", error);
    return false;
  }
};

export const getUsersAndVerifySector = async (sectorId: string) => {
  const users = await prisma.user.findMany({
    where: {
      sectors: {
        none: { id: sectorId },
      },
    },
  });
  return users.map((user) => ({ id: user.id, name: user.name }));
};

export const getUsersAlreadyHave = async (sectorId: string) => {
  const users = await prisma.user.findMany({
    where: {
      sectors: {
        some: { id: sectorId },
      },
    },
  });
  return users.map((user) => ({ id: user.id, name: user.name }));
};
