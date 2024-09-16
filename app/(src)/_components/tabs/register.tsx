"use client";

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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RegisterSchema } from "@/lib/zod";
import { RegisterUser } from "@/types/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const RegisterTab = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUser>({
    resolver: zodResolver(RegisterSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: RegisterUser) => {
    try {
      setIsSubmitting(true);

      const supabase = createClientComponentClient();
      const { username, password, name } = data;

      const { data, error } = await supabase.auth.signUp({
        email: username,
        password,
      });

      console.log(data);
      toast({
        variant: "success",
        title: "Sucesso",
        description: "Você foi registrado com sucesso!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao registrar, tente novamente.",
      });
    }
  };

  useEffect(() => {
    if (isSubmitting) {
      const timer = setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitting]);
  return (
    <TabsContent value="register">
      <Card>
        <CardHeader>
          <CardTitle>Seja muito bem-vindo!</CardTitle>
          <CardDescription>
            Para acessar os sistemas, é necessário que você se registre.
            Preencha os campos abaixo.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Nome Completo</Label>
              <Input required {...register("name")} type="text" />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Usuário</Label>
              <Input
                required
                {...register("username")}
                type="text"
                placeholder="exemplo3178_00"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <Input required {...register("password")} type="password" />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="passwordConfirm">Digite a senha novamente</Label>
              <Input
                required
                {...register("passwordConfirm")}
                type="password"
              />
              {errors.passwordConfirm && (
                <p className="text-red-500 text-sm">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processando..." : "Prosseguir"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
};
