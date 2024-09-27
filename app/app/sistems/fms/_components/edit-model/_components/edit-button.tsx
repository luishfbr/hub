"use client";

import { Model, FieldToEdit, FieldType } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  GetHeadersByFileTemplateId,
  GetModelsById,
  UpdateModel,
} from "../../../_actions/fms-actions";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DialogEdit } from "./dialog-edit";
import { DeleteAlertDialog } from "./delete-alert-dialog";

export default function EditButton({
  modelId,
  onUpdate,
}: {
  modelId: string;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const [model, setModel] = useState<Model | null>(null);
  const [headers, setHeaders] = useState<FieldToEdit[]>([]);
  const { register, handleSubmit, reset } = useForm<Model>();

  const fetchHeaders = useCallback(async () => {
    const headers = await GetHeadersByFileTemplateId(modelId);
    setHeaders(
      headers.map((h) => ({
        id: h.id,
        fieldLabel: h.fieldLabel,
        type: h.fieldType as FieldType,
      }))
    );
  }, [modelId]);

  useEffect(() => {
    const fetchModel = async () => {
      const response = await GetModelsById(modelId);
      if (response) {
        setModel(response);
        await fetchHeaders();
        reset(response);
      }
    };
    fetchModel();
  }, [modelId, reset, fetchHeaders]);

  const onSubmit = async (data: Model) => {
    const response = await UpdateModel(data);
    if (response) {
      toast({
        title: "Modelo atualizado com sucesso",
        description: "O modelo foi atualizado com sucesso",
        variant: "success",
      });
      onUpdate();
    } else {
      toast({
        title: "Erro ao atualizar o modelo",
        description: "Ocorreu um erro ao atualizar o modelo",
        variant: "destructive",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              Editar Modelo - {model?.modelName}
            </h4>
            <p className="text-sm text-muted-foreground">
              Aqui você consegue alterar totalmente o modelo.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-2 items-center justify-center w-96">
              <Input
                className="w-full"
                type="text"
                defaultValue={model?.modelName}
                placeholder={`Escolha um novo nome para o modelo: ${model?.modelName}`}
                {...register("modelName")}
                autoComplete="off"
              />
              <input type="text" {...register("id")} value={modelId} hidden />
              <Button type="submit">Salvar</Button>
            </div>
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-44">Campo</TableHead>
                <TableHead className="w-44">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {headers.map((header) => (
                <TableRow key={header.id}>
                  <TableCell>{header.fieldLabel}</TableCell>
                  <TableCell className="flex gap-2 items-center justify-center">
                    <DeleteAlertDialog
                      id={header.id}
                      onDelete={() => {
                        setHeaders(headers.filter((h) => h.id !== header.id));
                      }}
                    />
                    <DialogEdit id={header.id} onEdit={fetchHeaders} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PopoverContent>
    </Popover>
  );
}
