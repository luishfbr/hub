"use client"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Edit } from "lucide-react"
import { useForm } from "react-hook-form";
import { EditHeader } from "../../../_actions/fms-actions";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export interface newHeader {
    fieldLabel: string;
    id: string;
}

export function DialogEdit({ id, onEdit }: { id: string, onEdit: () => void }) {
    const { toast } = useToast();
    const { register, handleSubmit } = useForm<newHeader>();
    const onSubmit = async (data: newHeader) => {
        const response = await EditHeader(data);
        if (response) {
            toast({
                title: "Campo atualizado com sucesso",
                description: "O campo foi atualizado com sucesso",
                variant: "success",
            });
            onEdit()
        }
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <Edit className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <Input autoComplete="off" type="text" {...register("fieldLabel")} placeholder="Qual o novo nome do campo?" />
                    <input type="text" {...register("id")} value={id} hidden />
                    <Button type="submit">Salvar</Button>
                </form>
            </PopoverContent>
        </Popover>
    )
}
