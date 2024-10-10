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

export const qrCodeSchema = z.object({
  ...loginSchema.shape,
  code: z.string().min(6, "O código deve ter 6 dígitos"),
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

export const DateFormSchema = z.object({
  dob: z.date({
    required_error: "Escolha uma data para prosseguir...",
  }),
});

export const MeetingFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  date: z.date({
    required_error: "Escolha uma data para prosseguir...",
  }),
  users: z.array(z.object({ name: z.string() })),
});

export const passwordSchemaReset = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
  .regex(/\d/, "A senha deve conter pelo menos um número")
  .regex(/[\W_]/, "A senha deve conter pelo menos um caractere especial");
