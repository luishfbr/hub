"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NewSector } from "@/app/types/types";
import { useForm } from "react-hook-form";
import { CreateSector } from "./_actions/users";
import { useToast } from "@/hooks/use-toast";

interface CreateButtonProps {
  onCreateSuccess: () => void;
}

export const CreateNewSector: React.FC<CreateButtonProps> = ({
  onCreateSuccess,
}) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<NewSector>();

  const onSubmit = async (data: NewSector) => {
    const res = await CreateSector(data);
    if (res === true) {
      toast({
        title: "Sucesso",
        description: "Setor criado com sucesso!",
        variant: "success",
      });
      reset();
      onCreateSuccess();
    } else {
      toast({
        title: "Erro",
        description: "Tente novamente!",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="mr-2">Criar novo setor</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1>Insira o nome do novo setor</h1>
            <Input type="text" {...register("name")} />
            <Button type="submit">Registrar</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};
