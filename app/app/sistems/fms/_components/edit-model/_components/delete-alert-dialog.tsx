"use client"

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
import { useToast } from "@/hooks/use-toast";
import { deleteHeader } from "../../../_actions/fms-actions";
import { Trash } from "lucide-react";

export function DeleteAlertDialog({ id, onDelete }: { id: string, onDelete: () => void }) {
    const { toast } = useToast();

    const handleDelete = async () => {
        const response = await deleteHeader(id);
        if (response) {
            toast({
                title: "Campo deletado com sucesso",
                description: "O campo foi deletado com sucesso",
                variant: "success",
            });
            onDelete();
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <Trash className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza que deseja deletar este campo?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ao deletar o campo, todos os dados associados a ele serão perdidos.
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
