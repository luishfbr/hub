"use server";

import { signIn } from "@/services/auth";

export const github = async () => {
  await signIn("github");
};
