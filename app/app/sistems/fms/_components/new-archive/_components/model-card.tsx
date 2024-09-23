"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Field, FieldType, Option } from "@/app/types/types";
import { createNewFile, fieldsByFiletemplateId } from "../../../_actions/fms-actions";
import styles from "@/app/styles/main.module.css";

export const SelectedModelForm = ({ modelId }: { modelId: string }) => {
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<Record<string, string>>();
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
            type: field.fieldType as FieldType,
            options: field.options as Option[] | undefined,
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

  const maskMap: Partial<Record<FieldType, string>> = useMemo(
    () => ({
      date: "99/99/9999",
    }),
    []
  );

  const renderInput = useCallback(
    (field: Field) => {
      const mask = maskMap[field.type];
      const label = field.fieldLabel || "Campo de Texto";
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
            render={({ field: { onChange, value } }) => {
              switch (field.type) {
                case "date":
                  return (
                    <InputMask
                      className={styles.inputStyles}
                      id={field.id}
                      mask={mask || ""}
                      value={value}
                      onChange={onChange}
                      placeholder={`Digite ${label.toLowerCase()}`}
                      autoComplete="off"
                    />
                  );
                case "number":
                  return (
                    <Input
                      className={styles.inputStyles}
                      type="number"
                      id={field.id}
                      value={value}
                      onChange={onChange}
                      placeholder={`Digite ${label.toLowerCase()}`}
                      autoComplete="off"
                    />
                  );
                case "select":
                  return (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger className={styles.inputStyles}>
                        <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.id} value={option.value}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                default:
                  return (
                    <Input
                      className={styles.inputStyles}
                      type="text"
                      id={field.id}
                      placeholder={`Digite ${label.toLowerCase()}`}
                      autoComplete="off"
                      {...register(field.id, {
                        required: "Este campo é obrigatório",
                      })}
                    />
                  );
              }
            }}
          />
          {errors[field.id] && (
            <span className="text-red-500 text-xs">
              {errors[field.id]?.message}
            </span>
          )}
        </div>
      );
    },
    [control, errors, maskMap, register]
  );

  const onSubmit = async (data: Record<string, string>) => {
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
