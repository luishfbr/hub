import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteUserFromMeeting } from "../../../_actions/meetings-actions";
import { useToast } from "@/hooks/use-toast";

interface DeleteUserProps {
  id: string;
  onDelete: (id: string) => void;
}

export const DeleteUser = ({ id, onDelete }: DeleteUserProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    const res = await deleteUserFromMeeting(id);
    if (res === true) {
      toast({
        title: "Usuário excluído com sucesso",
        variant: "success",
      });
      onDelete(id);
    } else {
      toast({
        title: "Ocorreu um erro ao excluir o usuário",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <Trash className="w-4 h-4 hover:text-muted-foreground" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Realmente deseja excluir o usuário?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ao clicar em Confirmar, o usuário será excluído permanentemente.
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
