"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import InputMask from "react-input-mask";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Field } from "@/app/types/types";
import {
  createNewFile,
  fieldsByFiletemplateId,
} from "../../../_actions/fms-actions";
import styles from "@/app/styles/main.module.css";

export const SelectedModelForm = ({ modelId }: { modelId: string }) => {
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Record<string, string>>();
  const router = useRouter();

  const loadFields = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedFields = await fieldsByFiletemplateId(modelId);
      if (fetchedFields) {
        setFields(
          fetchedFields.map((field) => ({
            ...field,
            value: "",
            commonId: "",
            type: field.fieldType,
          }))
        );
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar campos. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [modelId, toast]);

  useEffect(() => {
    loadFields();
  }, [loadFields]);

  const maskMap: Partial<Record<Field["type"], string>> = useMemo(
    () => ({
      cpf: "999.999.999-99",
      cnpj: "99.999.999/9999-99",
      datadeadmissao: "99/99/9999",
      data: "99/99/9999",
    }),
    []
  );

  const labelMap = useMemo(
    () => ({
      cpf: "CPF",
      cnpj: "CNPJ",
      datadeadmissao: "Data de Admissão",
      dataderecisao: "Data de Rescisão",
      data: "Data",
      nomecompleto: "Nome Completo",
      dia: "Dia",
      mes: "Mês",
      ano: "Ano",
      prateleira: "Prateleira",
      caixa: "Caixa",
      pasta: "Pasta",
    }),
    []
  );

  const renderInput = useCallback(
    (field: Field) => {
      const mask = field.type in maskMap ? maskMap[field.type] : undefined;
      const label = labelMap[field.type] || field.value || "Campo de Texto";

      return (
        <div className="mb-4">
          <Label className="pl-4" htmlFor={field.id}>
            {label}
          </Label>
          <Controller
            name={field.id}
            control={control}
            defaultValue=""
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field: { onChange, value } }) =>
              mask && field.type !== "dataderecisao" ? (
                <InputMask
                  className={styles.inputStyles}
                  id={field.id}
                  mask={mask}
                  value={value}
                  onChange={onChange}
                  placeholder={`Digite ${label.toLowerCase()}`}
                  autoComplete="off"
                />
              ) : (
                <Input
                  className={styles.inputStyles}
                  type={
                    ["dia", "mes", "ano"].includes(field.type)
                      ? "number"
                      : "text"
                  }
                  id={field.id}
                  placeholder={`Digite ${label.toLowerCase()}`}
                  autoComplete="off"
                  {...register(field.id, {
                    required: "Este campo é obrigatório",
                    ...(field.type === "dia" ? { min: 1, max: 31 } : {}),
                    ...(field.type === "mes" ? { min: 1, max: 12 } : {}),
                    ...(field.type === "ano"
                      ? { min: 1900, max: new Date().getFullYear() }
                      : {}),
                  })}
                />
              )
            }
          />
          {errors[field.id] && (
            <span className="text-red-500 text-xs">
              {errors[field.id]?.message}
            </span>
          )}
        </div>
      );
    },
    [control, errors, maskMap, labelMap, register]
  );

  const onSubmit: SubmitHandler<Record<string, string>> = async (data) => {
    setIsLoading(true);
    const formattedFields = fields.map((field) => ({
      fileTemplateId: modelId,
      fieldId: field.id,
      value: data[field.id],
    }));

    try {
      await createNewFile(formattedFields);
      toast({
        title: "Sucesso",
        description: "Arquivo criado com sucesso",
        variant: "success",
      });
      reset();
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar arquivo. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Progress className="w-full" />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field) => (
          <div key={field.id}>{renderInput(field)}</div>
        ))}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar"}
        </Button>
      </form>
    </div>
  );
};
