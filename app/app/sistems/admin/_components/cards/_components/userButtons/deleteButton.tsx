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
import { useToast } from "@/app/utils/ToastContext";

interface DeleteButtonProps {
    email: string;
    onDeleteSuccess: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
    email,
    onDeleteSuccess,
}) => {
    const { showToast } = useToast();
    const handleDelete = async () => {
        try {
            const response = await deleteUser(email);
            if (response === true) {
                onDeleteSuccess();
                showToast("Usuário excluído com sucesso!");
            }
        } catch (error) {
            showToast("Erro ao deletar usuário!");
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
                        Ao clicar em OK, você irá excluir o usuário permanentemente. Esta
                        ação não pode ser desfeita.
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