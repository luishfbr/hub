"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createSector } from "./_actions/users";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type FormData = {
  name: string;
};

interface CreateButtonProps {
  onCreateSuccess: () => void;
}

export const CreateNewSector: React.FC<CreateButtonProps> = ({
  onCreateSuccess,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm<FormData>();

  const nameValue = watch("name");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (!data.name) {
        toast({
          title: "Algo deu errado",
          description: "Refaça o processo, algum erro foi encontrado!",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);

      const createSectorResponse = await createSector(formData);

      if (createSectorResponse === true) {
        onCreateSuccess();
        reset();
        toast({
          title: "Sucesso",
          description: "Setor criado com sucesso!",
          variant: "success",
        });
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Erro",
        description: "Erro ao criar setor!",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"} className="w-full sm:w-auto">
          Criar novo setor
        </Button>
      </DialogTrigger>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="w-96">
          <DialogHeader>
            <DialogTitle>Crie um novo setor</DialogTitle>
            <DialogDescription>Insira o nome do novo setor.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-6">
            <Input
              type="text"
              required
              {...register("name")}
              placeholder="Qual o nome do setor?"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <DialogClose>
              <Button
                className="flex items-center justify-center"
                type="submit"
                disabled={isSubmitting || !isValid || !nameValue}
              >
                {isSubmitting ? "Criando..." : "Criar Setor"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
