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
import { useToast } from "@/app/utils/ToastContext";

interface DeleteButtonProps {
    id: string;
    onSuccess: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
    id,
    onSuccess,
}) => {
    const { showToast } = useToast();

    const handleDelete = async () => {
        try {
            const response = await deleteSector(id);
            if (response === true) {
                onSuccess();
                showToast("Setor excluído com sucesso!");
            } else {
                showToast("Falha ao excluir o setor.");
            }
        } catch (error) {
            showToast("Erro ao excluir o setor.");
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