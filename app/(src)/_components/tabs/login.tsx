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
import { TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { LoginUser } from "@/types/types";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LoginSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const LoginTab = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: zodResolver(LoginSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: LoginUser) => {
    setIsSubmitting(true);
    console.log(data);
    toast({
      variant: "success",
      title: "Sucesso",
      description: "Login efetuado com sucesso!",
    });
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
    <TabsContent value="login">
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo de volta</CardTitle>
          <CardDescription>
            Insira suas credenciais para acessar os sistemas.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="username">Usuário</Label>
              <Input
                {...register("username")}
                type="text"
                placeholder="exemplo3178_00"
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Senha</Label>
              <Input {...register("password")} type="password" />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
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
