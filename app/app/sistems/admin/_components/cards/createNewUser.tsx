"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { registerSchema } from "@/app/types/zod";
import { useToast } from "@/hooks/use-toast";
import { Register } from "@/app/(auth)/_actions/auth";

type RegisterFormData = z.infer<typeof registerSchema>;

interface CreateButtonProps {
  onCreateSuccess: () => void;
}

export const CreateNewUser: React.FC<CreateButtonProps> = ({
  onCreateSuccess,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await Register(data);
      if (response.status === "success") {
        reset();
        onCreateSuccess();
      }

      toast({
        title: response.title,
        description: response.message,
        variant: response.variant as
          | "destructive"
          | "success"
          | "default"
          | null
          | undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-auto mr-2">Criar novo usuário</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg p-4 sm:p-6">
        <DialogHeader></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                {...register("name")}
                type="text"
                required
                autoComplete="off"
                className="w-full"
              />
              {errors.name && (
                <p className="text-red-700 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                type="email"
                required
                autoComplete="off"
                className="w-full"
              />
              {errors.email && (
                <p className="text-red-700 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                {...register("password")}
                type="password"
                required
                className="w-full"
              />
              {errors.password && (
                <p className="text-red-700 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Digite Novamente</Label>
              <Input
                {...register("confirmPassword")}
                type="password"
                required
                className="w-full"
              />
              {errors.confirmPassword && (
                <p className="text-red-700 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting ? "Carregando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
