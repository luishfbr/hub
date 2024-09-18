import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .regex(/^(?=.*[a-z])/, "A senha deve conter pelo menos uma letra minúscula")
  .regex(/^(?=.*[A-Z])/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/^(?=.*\d)/, "A senha deve conter pelo menos um número")
  .regex(
    /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
    "A senha deve conter pelo menos um caractere especial"
  );

export const registerSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "A confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: passwordSchema,
});

export const editPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "A confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
