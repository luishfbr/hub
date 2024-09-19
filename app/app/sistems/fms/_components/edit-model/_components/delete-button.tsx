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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { deleteModel } from "../../../_actions/fms-actions";
import { useToast } from "@/hooks/use-toast";

export function DeleteButton({ modelId }: { modelId: string }) {
  const { toast } = useToast();

  const handleDelete = async () => {
    const response = await deleteModel(modelId);
    if (response) {
      toast({
        title: "Modelo deletado com sucesso",
        description: "O modelo foi deletado com sucesso",
        variant: "success",
      });
    } else {
      toast({
        title: "Erro ao deletar o modelo",
        description: "Ocorreu um erro ao deletar o modelo",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza que deseja deletar este modelo?</AlertDialogTitle>
          <AlertDialogDescription>
            Ao deletar o modelo, todos os dados associados a ele serão perdidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
