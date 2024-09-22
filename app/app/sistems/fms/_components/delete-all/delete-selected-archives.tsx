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
import { useToast } from "@/hooks/use-toast";
import { deleteFile } from "../../_actions/fms-actions";

export function DeleteSelectedArchives({
  selectedFiles,
  onDelete,
}: {
  onDelete: () => void;
  selectedFiles: string[];
}) {
  const { toast } = useToast();
  const handleDeleteSelected = async () => {
    try {
      for (const fileId of selectedFiles) {
        await deleteFile(fileId);
      }
      toast({
        title: "Sucesso",
        description: "Arquivos deletados com sucesso",
        variant: "success",
      });
      onDelete();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar arquivos",
        variant: "destructive",
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Excluir Selecionados</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Excluir Arquivos Selecionados </AlertDialogTitle>
          <AlertDialogDescription>
            Ao clicar em "Continuar", você irá excluir todos os arquivos
            selecionados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteSelected()}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
