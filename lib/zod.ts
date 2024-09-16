import { object, string, z } from "zod";

const nameSchema = string()
  .min(3, "O nome deve ter pelo menos 3 caracteres")
  .max(255, "O nome não pode ter mais de 255 caracteres")
  .trim();

const usernameSchema = string()
  .min(3, "O nome de usuário deve ter pelo menos 3 caracteres")
  .max(255, "O nome de usuário não pode ter mais de 255 caracteres")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "O nome de usuário deve conter apenas letras, números e underscores"
  )
  .trim();

const passwordSchema = z
  .string({ required_error: "Senha obrigatória!" })
  .min(8, "Necessário ter no mínimo 8 caracteres")
  .regex(/[a-z]/, "Necessário ter pelo menos uma letra minúscula")
  .regex(/[A-Z]/, "Necessário ter pelo menos uma letra maiúscula")
  .regex(/[0-9]/, "Necessário ter pelo menos um número")
  .regex(/[\W_]/, "Necessário ter pelo menos um caractere especial");

export const RegisterSchema = object({
  name: nameSchema,
  username: usernameSchema,
  password: passwordSchema,
  passwordConfirm: passwordSchema,
}).refine((data) => data.password === data.passwordConfirm, {
  message: "As senhas não coincidem",
  path: ["passwordConfirm"],
});

export const LoginSchema = object({
  username: usernameSchema,
  password: passwordSchema,
});
