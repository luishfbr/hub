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
import { deleteUser } from "../../_actions/users";
import { useToast } from "@/hooks/use-toast";

interface DeleteButtonProps {
  email: string;
  onDeleteSuccess: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  email,
  onDeleteSuccess,
}) => {
  const { toast } = useToast();
  const handleDelete = async () => {
    try {
      const response = await deleteUser(email);
      if (response === true) {
        onDeleteSuccess();
        toast({
          title: "Sucesso",
          description: "Usuário excluído com sucesso!",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar usuário!",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full sm:w-40" variant={"destructive"}>
          Excluir Usuário
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Ao clicar em CONTINUAR, o usuário será excluído permanentemente.
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
