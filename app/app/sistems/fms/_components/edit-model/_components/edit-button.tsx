"use client";

import { Field, Model } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit } from "lucide-react";
import { useState, useEffect } from "react";
import {
  GetHeadersByFileTemplateId,
  GetModelsById,
  UpdateModel,
} from "../../../_actions/fms-actions";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { FieldType } from "@prisma/client";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FieldToEdit {
  id: string;
  fieldLabel: string;
  type: keyof typeof FieldType;
}

export default function EditButton({
  modelId,
  onUpdate,
}: {
  modelId: string;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const [model, setModel] = useState<Model>();
  const [headers, setHeaders] = useState<FieldToEdit[]>([]);
  const { register, handleSubmit } = useForm<Model>();

  useEffect(() => {
    const fetchModel = async () => {
      const response = await GetModelsById(modelId);
      if (response) {
        setModel(response);
        const headers = await GetHeadersByFileTemplateId(modelId);
        console.log(headers);
        setHeaders(
          headers.map((h) => ({ ...h, value: "", type: h.fieldType }))
        );
      }
    };
    fetchModel();
  }, [modelId]);

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
            <div className="flex gap-2">
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
                {headers.map((value) => (
                  <TableHead key={value.id}>{value.fieldLabel}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
        </div>
      </PopoverContent>
    </Popover>
  );
}
