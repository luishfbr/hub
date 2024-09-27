"use client";

import { FieldType, FieldTypeOptions, NewFieldSigle, Option } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircleIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { CreateFieldSingle } from "../../../_actions/fms-actions";

export function AddNewFields({
    modelId,
    onAddField,
}: {
    modelId: string;
    onAddField: (field: NewFieldSigle) => void;
}) {
    const { toast } = useToast();
    const [newField, setNewField] = useState<NewFieldSigle>({
        fieldLabel: "",
        type: "text",
        id: "",
        value: "",
        options: [],
        fileTemplateId: modelId,
    });
    const [newOption, setNewOption] = useState<string>("");
    const { register, handleSubmit, reset } = useForm<NewFieldSigle>();

    const onSubmit = async (data: NewFieldSigle) => {
        const fieldData = {
            ...data,
            type: newField.type,
            options: newField.options,
            fileTemplateId: modelId,
        };
        const response = await CreateFieldSingle(fieldData);
        if (response) {
            toast({
                title: "Campo adicionado com sucesso",
                description: "O campo foi adicionado com sucesso",
                variant: "success",
            });
            onAddField(fieldData);
            reset();
            setNewField({
                fieldLabel: "",
                type: "text",
                id: "",
                value: "",
                options: [],
                fileTemplateId: modelId,
            });
        } else {
            toast({
                title: "Erro ao adicionar o campo",
                description: "Ocorreu um erro ao adicionar o campo",
                variant: "destructive",
            });
        }
    };

    const handleAddOption = () => {
        if (newOption) {
            const option: Option = { id: newOption, value: newOption };
            setNewField((prevField) => ({
                ...prevField,
                options: [...(prevField.options || []), option],
            }));
            setNewOption("");
        }
    };

    const handleDeleteOption = (id: string) => {
        setNewField((prevField) => ({
            ...prevField,
            options: prevField.options?.filter((option) => option.id !== id),
        }));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <PlusCircleIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
                <div className="flex flex-col gap-6">
                    <h1>Adicione um novo campo</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                        <Input
                            placeholder="Nome do campo"
                            type="text"
                            {...register("fieldLabel", { required: true })}
                        />
                        <Select
                            required
                            value={newField.type}
                            onValueChange={(value: FieldType) => setNewField({ ...newField, type: value })}
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Tipo do campo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {FieldTypeOptions.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                            {type.value}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {newField.type === "select" && (
                            <div className="flex flex-col gap-6 w-full">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <Input
                                        className="flex-1"
                                        type="text"
                                        placeholder="Adicionar opção"
                                        value={newOption}
                                        onChange={(e) => setNewOption(e.target.value)}
                                    />
                                    <Button
                                        variant="destructive"
                                        onClick={handleAddOption}
                                        disabled={!newOption}
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                    </Button>
                                </div>
                                {(newField.options?.length ?? 0) > 0 && (
                                    <ScrollArea className="w-full">
                                        <Table className="w-full">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Opção</TableHead>
                                                    <TableHead>Excluir</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {newField.options?.map((option) => (
                                                    <TableRow key={option.id}>
                                                        <TableCell>{option.value}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => handleDeleteOption(option.id)}
                                                            >
                                                                <TrashIcon className="w-5 h-5" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                )}
                            </div>
                        )}
                        <Button type="submit" variant="default">
                            Adicionar Campo
                        </Button>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    );
}
