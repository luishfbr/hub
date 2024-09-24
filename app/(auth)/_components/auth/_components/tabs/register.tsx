"use client";

import { RegisterForm } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/app/types/zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Register } from "@/app/(auth)/_actions/auth";

const registerInputs = [
  {
    id: "name",
    label: "Nome Completo",
    type: "text",
    placeholder: "Digite seu nome completo",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Digite seu email da cooperativa",
  },
  {
    id: "password",
    label: "Senha",
    type: "password",
    placeholder: "Digite sua senha",
  },
  {
    id: "confirmPassword",
    label: "Confirmar Senha",
    type: "password",
    placeholder: "Digite sua senha novamente",
  },
];

export default function RegisterTab() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      const user = await Register(data);
      if (user) {
        toast({
          variant: "success",
          title: "Usuário criado com sucesso!",
          description: "Você já pode fazer login no hub.",
        });
        reset();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: "Usuário já cadastrado, por favor, faça login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabsContent value="register">
      <Card>
        <CardHeader>
          <CardTitle>Registre-se!</CardTitle>
          <CardDescription>
            Seja muito bem-vindo à cooperativa! Preencha os campos abaixo para
            começar.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-2">
            {registerInputs.map((value, index) => (
              <div key={index} className="space-y-1">
                <Label htmlFor={value.id}>{value.label}</Label>
                <Input
                  id={value.id}
                  type={value.type}
                  {...register(value.id as keyof RegisterForm)}
                />
                {errors[value.id as keyof RegisterForm] && (
                  <p className="text-red-500 text-sm">
                    {errors[value.id as keyof RegisterForm]?.message}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
}
