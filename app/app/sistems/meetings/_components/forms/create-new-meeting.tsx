"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { CheckboxUsers } from "./_components/checkbox-users";
import type { UserToMeeting } from "@/app/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { createNewMeeting } from "../../_actions/meetings-actions";

interface CreateNewMeetingFormProps {
  id: string;
  onUpdate: () => void;
}

export const CreateNewMeetingForm = ({
  id,
  onUpdate,
}: CreateNewMeetingFormProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [name, setName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<UserToMeeting[]>([]);

  const onSubmit = async () => {
    const data = {
      name: name,
      date: dateFormat || "",
      users: selectedUsers,
      createdBy: id || "",
    };

    if (!data.name) {
      toast({
        title: "O nome da reunião é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const res = await createNewMeeting(data);
    if (res === true) {
      toast({
        title: `Reunião: ${data.name} criada com sucesso!`,
        description: "Fique de olho no seu email...",
        variant: "success",
      });
      onUpdate();
    } else {
      toast({
        title: "Ocorreu um erro ao criar a reunião!",
        description: "Tente novamente...",
        variant: "destructive",
      });
    }
    setSelectedUsers([]);
    setName("");
  };

  const handleSelectUser = (data: UserToMeeting[]) => {
    setSelectedUsers(data);
  };

  const dateFormat = date?.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return (
    <Sheet >
      <SheetTrigger asChild>
        <Button>Crie uma nova reunião</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Painel de Criação de Reuniões</SheetTitle>
          <SheetDescription>
            Preencha todos os campos disponíveis para criar uma nova reunião.
          </SheetDescription>
        </SheetHeader>
        <form>
          <div className="flex flex-col items-center justify-center gap-6 my-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow"
              disabled={(date) =>
                date.getTime() < new Date().setHours(0, 0, 0, 0)
              }
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <Label>Dia selecionado:</Label>
              <span className="text-muted-foreground text-sm">{dateFormat}</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <Label>Nome da Reunião:</Label>
              <Input
                type="text"
                placeholder="Nome da Reunião"
                className="w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {name.length > 0 ? (
              <CheckboxUsers
                meetingName={name}
                onSelectUser={handleSelectUser}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 w-full">
                <span className="text-sm text-muted-foreground text-center">
                  Escreva o nome da reunião para que apareça os usuários.
                </span>
              </div>
            )}
            {selectedUsers.length > 0 && (
              <ScrollArea className="w-full xl:h-[25vh] lg:h-[20vh] md:h-[15vh] sm:h-[10vh] overflow-y-auto">
                <div className="flex flex-col gap-2 text-center">
                  {selectedUsers.map((user, index) => (
                    <div key={index}>
                      <span className="text-muted-foreground">
                        {user.name}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          <SheetFooter>
            <Button type="button" onClick={onSubmit}>
              Criar Reunião
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
