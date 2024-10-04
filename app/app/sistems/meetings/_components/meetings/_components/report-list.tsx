"use client";

import type { Meeting, UserToMeeting } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getMeetingById,
  getUsersOnMeeting,
  updateMeeting,
} from "../../../_actions/meetings-actions";
import { useEffect, useState } from "react";
import { DeleteUser } from "./delete-user";
import { SelectUsersAgain } from "./select-users-again";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { CalendarForUpdate } from "./calendar";

interface ReportListProps {
  meetingId: string;
  onUpdate: () => void;
}

interface ReportListForm {
  date: string;
  name: string;
}

export const ReportList = ({ meetingId, onUpdate }: ReportListProps) => {
  const { register, handleSubmit, reset } = useForm<ReportListForm>();
  const [meeting, setMeeting] = useState<Meeting>();
  const [usersOnMeeting, setUsersOnMeeting] = useState<UserToMeeting[]>([]);
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();

  const getMeeting = async () => {
    const meeting = await getMeetingById(meetingId);
    if (meeting) {
      setMeeting(meeting);
    }
  };

  const handleUpdate = (id: string) => {
    setUsersOnMeeting((prevUsers) =>
      prevUsers.filter((users) => users.id !== id)
    );
  };

  const getListUsersOnMeeting = async (id: string) => {
    const users = await getUsersOnMeeting(id);
    if (users) {
      setUsersOnMeeting(users);
    }
  };

  const onSubmit = async (data: ReportListForm) => {
    if (!data.name) {
      toast({
        title: "Preencha o nome da reunião...",
        variant: "destructive",
      });
      return;
    }

    const formattingDate = date?.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedDate = {
      ...data,
      id: meetingId as string,
      date: formattingDate || "",
    };

    if (!formattedDate.date) {
      toast({
        title: "Preencha a data da reunião...",
        variant: "destructive",
      });
    }

    const res = await updateMeeting(formattedDate);

    if (res === true) {
      toast({
        title: "Reunião atualizada com sucesso",
        description: "Verifique sua caixa de email...",
        variant: "success",
      });
      onUpdate();
      reset();
    } else {
      toast({
        title: "Ocorreu um erro ao atualizar a reunião",
        description: "Tente novamente...",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getMeeting();
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => getListUsersOnMeeting(meetingId)}
          variant={"link"}
          className="w-full"
        >
          {meeting?.name} - {meeting?.date}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Tudo sobre a reunião:{" "}
            <span className="text-muted-foreground font-bold">
              {meeting?.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Aqui você consegue ver todas as informações da reunião, bem como o
            relatório gerado pelo sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-2">
            <CalendarForUpdate onDateSelect={setDate} />
            <div className="flex flex-col gap-2">
              <Label className="pl-2">Nome da reunião</Label>
              <Input
                type="text"
                placeholder={`Atual: ${meeting?.name}`}
                {...register("name")}
                autoComplete="off"
              />
            </div>
          </div>
          <SelectUsersAgain
            meetingId={meetingId}
            onUpdate={getListUsersOnMeeting}
          />
          <ScrollArea>
            <div className="p-2 gap-2 flex flex-col">
              {usersOnMeeting.map((user, index) => (
                <div key={index} className="flex gap-2">
                  <Button variant={"link"} type={"button"} className="w-full">
                    {user.name}
                  </Button>
                  <DeleteUser id={user.id} onDelete={handleUpdate} />
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant={"default"} type="submit" className="w-full">
              Salvar alteranças
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
