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
import { Trash } from "lucide-react";
import { deleteModel } from "../../../_actions/fms-actions";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export function DeleteButton({
  modelId,
  onDelete,
}: {
  modelId: string;
  onDelete: () => void;
}) {
  const { toast } = useToast();

  const handleDelete = useCallback(async () => {
    try {
      const response = await deleteModel(modelId);
      if (response) {
        toast({
          title: "Modelo deletado com sucesso",
          description: "O modelo foi deletado com sucesso",
          variant: "success",
        });
        onDelete();
      } else {
        throw new Error("Erro ao deletar o modelo");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar o modelo",
        variant: "destructive",
      });
    }
  }, [modelId, onDelete, toast]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você tem certeza que deseja deletar este modelo?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ao deletar o modelo, todos os dados associados a ele serão perdidos.
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
}
