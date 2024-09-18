"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { updateRoleUser } from "../../_actions/users";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface ChangeRoleProps {
  email: string;
  onChangeSuccess: () => void;
}

interface UserFormData {
  role: string;
}

export const ChangeRole: React.FC<ChangeRoleProps> = ({
  email,
  onChangeSuccess,
}) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserFormData>({
    defaultValues: {
      role: "user",
    },
  });

  const [roleSelected, setRoleSelected] = useState<string>("user");

  const selectRole = (role: string) => {
    setRoleSelected(role);
    setValue("role", role);
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      await updateRoleUser(email, data);
      onChangeSuccess();
      toast({
        title: "Sucesso",
        description: "Troca de permissão realizada com sucesso!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar a permissão do usuário",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full sm:w-40">Editar Permissão</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full sm:w-[450px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar Usuário</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os dados do usuário abaixo:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button variant={"outline"} onClick={() => selectRole("ADMIN")}>
            Administrador
          </Button>
          <Button variant={"outline"} onClick={() => selectRole("USER")}>
            Usuário
          </Button>
          <Button variant={"outline"} onClick={() => selectRole("CREATOR")}>
            Criador
          </Button>
        </div>
        <div className="grid">
          <span className="text-center text-sm text-muted-foreground">
            Setor selecionado: {roleSelected}
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction type="submit">Salvar</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
