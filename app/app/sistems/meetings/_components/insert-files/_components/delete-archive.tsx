"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { deleteArchive } from "../../../_actions/meetings-actions";
import { useToast } from "@/hooks/use-toast";

interface DeleteArchiveProps {
    onDelete: () => void;
    archiveId: string;
}

export function DeleteArchive({ archiveId, onDelete }: DeleteArchiveProps) {
    const { toast } = useToast();

    const handleDeleteArchive = async () => {
        const res = await deleteArchive(archiveId);
        if (res) {
            toast({
                title: "Arquivo deletado com sucesso!",
                variant: "success",
            })
            onDelete();
        } else {
            toast({
                title: "Ocorreu um erro ao deletar o arquivo!",
                description: "Tente novamente...",
                variant: "destructive",
            })
        };
    }

    return (
        <Button onClick={handleDeleteArchive} variant={"ghost"} size={"icon"} >
            <Trash />
        </Button>
    )
}
