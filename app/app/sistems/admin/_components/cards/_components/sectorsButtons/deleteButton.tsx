import { Button } from "@/components/ui/button";
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
import { deleteSector } from "../../_actions/users";
import { useToast } from "@/hooks/use-toast";

interface DeleteButtonProps {
  id: string;
  onSuccess: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  id,
  onSuccess,
}) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const response = await deleteSector(id);
      if (response === true) {
        onSuccess();
        toast({
          title: "Sucesso",
          description: "Setor excluído com sucesso!",
          variant: "success",
        });
      } else {
        toast({
          title: "Erro",
          description: "Falha ao excluir o setor.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir o setor.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full sm:w-40" variant={"destructive"}>
          Excluir Setor
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Ao clicar em OK, você irá excluir o setor permanentemente. Esta ação
            não pode ser desfeita.
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
