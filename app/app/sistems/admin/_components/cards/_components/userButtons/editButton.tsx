"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/hooks/use-toast";
import { editPasswordSchema } from "@/app/types/zod";
import { updatePassword } from "../../_actions/users";

interface EditButtonProps {
  email: string;
}

type EditPasswordSchema = z.infer<typeof editPasswordSchema>;

export const EditButton: React.FC<EditButtonProps> = ({ email }) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditPasswordSchema>({
    resolver: zodResolver(editPasswordSchema),
  });

  const onSubmit: SubmitHandler<EditPasswordSchema> = async (data) => {
    try {
      const response = await updatePassword(email, data.password);
      if (response) {
        toast({
          title: "Sucesso",
          description: "Senha alterada com sucesso!",
          variant: "success",
        });
        reset();
      } else {
        toast({
          title: "Erro",
          description: "Falha ao alterar senha.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar senha.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full sm:w-40" variant={"edit"}>
          Trocar Senha
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full sm:w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Troque a senha do usuário.</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os dados abaixo:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <Label htmlFor="password">Senha</Label>
            <Input {...register("password")} type="password" required />
            {errors.password && (
              <p className="text-red-700 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="passwordAgain">Digite Novamente</Label>
            <Input {...register("confirmPassword")} type="password" required />
            {errors.confirmPassword && (
              <p className="text-red-700 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button type="submit">Salvar</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
