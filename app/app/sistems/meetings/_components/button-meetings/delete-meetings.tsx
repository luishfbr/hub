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
import { deleteMeeting } from "../../_actions/meetings-actions";
import { useToast } from "@/hooks/use-toast";

interface DeleteButtonMeetingsProps {
    id: string;
    onDelete: () => void;
}

export function DeleteButtonMeetings({ id, onDelete }: DeleteButtonMeetingsProps) {
    const { toast } = useToast()
    const handleDelete = async () => {
        const res = await deleteMeeting(id)
        if (res) {
            toast({
                title: "Exclusão realizada com sucesso",
                description: "A reunião foi excluída com sucesso",
                variant: "success",
            })
            onDelete();
        } else {
            toast({
                title: "Ocorreu um erro",
                description: "Não foi possível excluir a reunião",
                variant: "destructive",
            })
        }

    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size={"icon"}>
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Deseja realmente excluir a reunião?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ao excluir a reunião, você não poderá recuperá-la.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
