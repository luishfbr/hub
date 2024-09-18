"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";

import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import { FieldType } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { Field, fieldTypes, FormDataProps, Sector } from "@/app/types/types";
import { SectorSelect } from "./_components/sector-select";
import { createNewModel, GetSectors } from "../../_actions/fms-actions";

const getIdFromInputType = (input: string): string => {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "");
};

export function Model() {
  const { toast } = useToast();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [disabledFields, setDisabledFields] = useState<Record<string, boolean>>(
    {}
  );

  const { register, handleSubmit, reset } = useForm<FormDataProps>();

  const addField = useCallback(
    (fieldValue: string, fieldType: keyof typeof FieldType) => {
      const newField: Field = {
        id: getIdFromInputType(fieldValue),
        value: fieldValue,
        type: fieldType,
      };
      setFields((prevFields) => [...prevFields, newField]);
      setDisabledFields((prev) => ({ ...prev, [fieldType]: true }));
    },
    []
  );

  const removeField = useCallback((fieldId: string, fieldType: string) => {
    setFields((prevFields) =>
      prevFields.filter((field) => field.id !== fieldId)
    );
    setDisabledFields((prev) => ({ ...prev, [fieldType]: false }));
  }, []);

  const onSubmit = useCallback(
    async (data: FormDataProps) => {
      if (!data.modelName || data.modelName.length <= 0) {
        return toast({
          title: "Erro",
          description: "Você deve inserir um nome para o modelo.",
          variant: "destructive",
        });
      }
      if (fields.length <= 0) {
        return toast({
          title: "Erro",
          description: "Você deve adicionar pelo menos um campo.",
          variant: "destructive",
        });
      }
      if (!selectedSector) {
        return toast({
          title: "Erro",
          description: "Você deve selecionar um setor.",
          variant: "destructive",
        });
      }

      const formData = {
        modelName: data.modelName,
        sectorId: selectedSector,
        fields: fields,
      };

      try {
        const newModel = await createNewModel(formData);
        if (newModel) {
          toast({
            title: "Sucesso",
            description: "Modelo criado com sucesso!",
            variant: "success",
          });
          resetForm();
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao criar modelo. Por favor, tente novamente.",
          variant: "destructive",
        });
        console.error("Error creating model:", error);
      }
    },
    [fields, selectedSector, toast, reset]
  );

  const resetForm = useCallback(() => {
    reset();
    setFields([]);
    setDisabledFields({});
    setSelectedSector(null);
  }, [reset]);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await GetSectors();
        if (response && response.sectors) {
          setSectors(response.sectors);
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar setores. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    };

    fetchSectors();
  }, [toast]);

  return (
    <div className="flex flex-col gap-6 max-h-[75vh] h-[80vh] justify-between overflow-y-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 items-center justify-center text-center h-full">
          <h1 className="text-2xl font-bold">Crie um novo modelo</h1>
          <p className="text-sm text-muted-foreground">
            Primeiro selecione o setor.
          </p>
          <div>
            <SectorSelect
              sectors={sectors}
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
            />
          </div>
          {selectedSector && (
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-col gap-6 items-center justify-center text-center">
                <Input
                  id="modelName"
                  {...register("modelName")}
                  className="text-center w-96"
                  placeholder="Qual será o nome do seu modelo?"
                  type="text"
                  required
                />
                <div className="grid sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-2 w-full">
                  {fieldTypes.map((fieldType) => (
                    <Button
                      key={fieldType.type}
                      type="button"
                      onClick={() => addField(fieldType.label, fieldType.type)}
                      disabled={disabledFields[fieldType.type]}
                    >
                      {fieldType.label}
                    </Button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>
        <div>
          {fields.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between text-sm bg-secondary h-10 px-4 py-2 rounded shadow-md"
                >
                  <span className="font-semibold">{field.value}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(field.id, field.type)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <Button type="submit" disabled={fields.length === 0}>
          Criar Modelo
        </Button>
      </div>
    </div>
  );
}
